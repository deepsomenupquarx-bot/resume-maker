import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Helper to check environment variables
const checkEnv = () => {
  const required = [
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('CRITICAL: Missing environment variables:', missing.join(', '));
  } else {
    console.log('Environment variables verified successfully.');
  }
  
  // Log presence (not values) of other keys
  const others = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'GEMINI_API_KEY', 'PRODUCTION_URL', 'LINKEDIN_REDIRECT_URI'];
  others.forEach(key => {
    console.log(`${key}: ${process.env[key] ? 'LOADED' : 'NOT FOUND'}`);
  });
};

checkEnv();

const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

// Dynamic URL resolution
const getProductionUrl = (req) => {
  if (process.env.PRODUCTION_URL) return process.env.PRODUCTION_URL;
  // Fallback for Vercel
  const host = req.get('host');
  const protocol = req.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
};

const getLinkedinRedirectUri = (req) => {
  if (process.env.LINKEDIN_REDIRECT_URI) return process.env.LINKEDIN_REDIRECT_URI;
  return `${getProductionUrl(req)}/auth/linkedin/callback`;
};

// ─── Health Check & Debug ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      LINKEDIN_CLIENT_ID: !!process.env.LINKEDIN_CLIENT_ID,
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      PRODUCTION_URL: process.env.PRODUCTION_URL || 'NOT_SET (using dynamic)',
    }
  });
});

// ─── LinkedIn OAuth ────────────────────────────────────────────────────────────

app.get('/api/linkedin/auth-url', (req, res) => {
  try {
    const redirectUri = getLinkedinRedirectUri(req);
    console.log('Generating LinkedIn Auth URL with Redirect URI:', redirectUri);
    
    const scope = 'openid profile email';
    const state = crypto.randomBytes(16).toString('hex');
    
    if (!process.env.LINKEDIN_CLIENT_ID) {
      console.error('LINKEDIN_CLIENT_ID is missing');
      return res.status(500).json({ error: 'LinkedIn Client ID is not configured on the server' });
    }

    const url = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    
    res.json({ url, state });
  } catch (error) {
    console.error('Error in /api/linkedin/auth-url:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.get('/auth/linkedin/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  const productionUrl = getProductionUrl(req);
  const redirectUri = getLinkedinRedirectUri(req);

  console.log('Received LinkedIn callback. Code present:', !!code);

  if (error) {
    console.error('LinkedIn Auth Error:', error, error_description);
    const msg = encodeURIComponent(error_description || error);
    return res.redirect(`${productionUrl}?linkedin_error=${msg}`);
  }

  if (!code) {
    return res.redirect(`${productionUrl}?linkedin_error=no_code_provided`);
  }

  try {
    console.log('Exchanging code for access token...');
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });
    
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return res.redirect(`${productionUrl}?linkedin_error=token_failed`);
    }

    console.log('Fetching user profile (OpenID)...');
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    console.log('Profile fetched successfully');

    // Prepare extended data structure
    // Since full profile data (experience/education) is restricted in standard API,
    // we use the available profile data and potentially use AI to structure it.
    
    const rawData = {
      fullName: `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
      email: profile.email || '',
      headline: profile.name || '', // LinkedIn often returns the headline in the name field for OpenID
      photo: profile.picture || '',
      location: profile.locale?.country || '',
      linkedinUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(profile.name)}`, // Fallback search URL
    };

    // ─── AI Enhancement ──────────────────────────────────────────────────
    // We'll use Gemini to "predict" or "structure" a professional summary 
    // and potentially dummy experience/education if we can't get it, 
    // but the goal is to map what we HAVE.
    
    let enhancedData = { ...rawData };
    
    try {
      const { GoogleGenAI } = await import("@google/genai");
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Convert this LinkedIn profile data into a professional resume format JSON. 
        Profile: ${JSON.stringify(rawData)}
        Return a JSON with: summary (ATS-friendly), experiences (array of {title, company, startDate, endDate, description}), education (array of {degree, school, startYear, endYear}), skills (array).
        If data is missing, use professional placeholders or leave empty. 
        Description should be in bullet points.
        Format strictly as JSON.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiData = JSON.parse(jsonMatch[0]);
          enhancedData = { ...rawData, ...aiData };
        }
      }
    } catch (aiErr) {
      console.error('Gemini enhancement failed, using raw data:', aiErr);
    }

    // ─── Supabase Storage ────────────────────────────────────────────────
    try {
      const { createClient } = await import('@supabase/supabase-js');
      if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
        await supabase.from('linkedin_imports').upsert({
          email: enhancedData.email,
          full_name: enhancedData.fullName,
          profile_data: enhancedData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });
        console.log('Stored in Supabase');
      }
    } catch (dbErr) {
      console.error('Supabase storage failed:', dbErr);
    }

    const encoded = encodeURIComponent(JSON.stringify(enhancedData));
    res.redirect(`${productionUrl}?linkedin_data=${encoded}`);
  } catch (err) {
    console.error('LinkedIn callback server error:', err);
    res.redirect(`${productionUrl}?linkedin_error=server_error&msg=${encodeURIComponent(err.message)}`);
  }
});


// ─── Razorpay ────────────────────────────────────────────────────────────

app.post('/api/create-order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const options = {
      amount: 500,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.json({ message: "Payment verified successfully", success: true });
    } else {
      return res.status(400).json({ message: "Invalid signature", success: false });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// ─── PDF Generation (Serverless Puppeteer) ─────────────────────────────

app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML content is required' });

    console.log('Launching browser for PDF generation...');
    
    // Configure chromium for serverless
    const executablePath = await chromium.executablePath();
    
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Set a timeout for loading content
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });

    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (browser) await browser.close();
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default app;

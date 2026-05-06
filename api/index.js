import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
// Redirect back to the frontend domain. On Vercel, this is usually passed via env or detected.
// For now, I'll use an environment variable for the production URL.
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'http://localhost:3000';
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || `${PRODUCTION_URL}/api/linkedin/callback`;

// ─── LinkedIn OAuth ────────────────────────────────────────────────────────────

app.get('/api/linkedin/auth-url', (req, res) => {
  const scope = 'openid profile email';
  const state = crypto.randomBytes(16).toString('hex');
  const url = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code` +
    `&client_id=${LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;
  res.json({ url, state });
});

app.get('/api/linkedin/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    const msg = encodeURIComponent(error_description || error);
    return res.redirect(`${PRODUCTION_URL}?linkedin_error=${msg}`);
  }

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.redirect(`${PRODUCTION_URL}?linkedin_error=token_failed`);
    }

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    const resumeData = {
      fullName: `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
      email: profile.email || '',
      headline: profile.name || '',
      photo: profile.picture || '',
      location: profile.locale?.country || '',
    };

    const encoded = encodeURIComponent(JSON.stringify(resumeData));
    res.redirect(`${PRODUCTION_URL}?linkedin_data=${encoded}`);
  } catch (err) {
    console.error('LinkedIn callback error:', err);
    res.redirect(`${PRODUCTION_URL}?linkedin_error=server_error`);
  }
});

// ─── Razorpay ────────────────────────────────────────────────────────────

app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: 500,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── PDF Generation (Serverless Puppeteer) ─────────────────────────────

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML content is required' });

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default app;

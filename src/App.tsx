import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar, Sidebar } from './components/Navigation';
import Landing from './components/Landing';
import ResumePreview from './components/ResumePreview';
import { ResumeData, Experience, Education, Project } from './types';
import { enhanceDescription, suggestSkills } from './services/gemini';
import { supabase } from './supabaseClient';
import { templates } from './data/templates';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import * as Templates from './components/templates/AllTemplates';
import { QRCodeSVG } from 'qrcode.react';
import LinkedInImport, { LinkedInProfileData } from './components/LinkedInImport';

// No mock data needed for production

import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Zap,
  Home,
  Info,
  ExternalLink,
  ChevronRight,
  Rocket,
  Download,
  GraduationCap,
  FolderKanban,
  Briefcase,
  ShieldCheck,
  FileUp,
  AlignLeft,
  CreditCard,
  Lock
} from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
};

export default function App() {
  const [view, setView] = useState<'landing' | 'templates' | 'builder' | 'success' | 'ai-import' | 'linkedin-import' | 'payment' | 'preview'>('landing');
  const [currentStep, setCurrentStep] = useState('info');
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [pendingMode, setPendingMode] = useState<'manual' | 'ai' | 'linkedin' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [linkedinError, setLinkedinError] = useState<string | undefined>(undefined);
  const [isProcessingLinkedIn, setIsProcessingLinkedIn] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedinData = params.get('linkedin_data');
    const linkedinImportId = params.get('linkedin_import_id');
    const error = params.get('linkedin_error');

    const loadLinkedInData = async () => {
      // 1. Check Magic Storage (LocalStorage) - Most Reliable
      const magicData = localStorage.getItem('linkedin_import_data');
      if (magicData) {
        try {
          setIsProcessingLinkedIn(true);
          const profile = JSON.parse(magicData);
          localStorage.removeItem('linkedin_import_data'); // Clean up
          setTimeout(() => {
            handleLinkedInData(profile);
            setIsProcessingLinkedIn(false);
          }, 1000);
          return;
        } catch (e) {
          console.error("Magic storage parse failed", e);
        }
      }

      // 2. Check Supabase ID (Legacy Fallback)
      if (linkedinImportId) {
        try {
          setIsProcessingLinkedIn(true);
          const { data: importRecord, error: dbError } = await supabase
            .from('linkedin_imports')
            .select('profile_data')
            .eq('id', linkedinImportId)
            .single();

          if (!dbError && importRecord?.profile_data) {
            handleLinkedInData(importRecord.profile_data);
          }
          setIsProcessingLinkedIn(false);
          window.history.replaceState({}, document.title, "/");
        } catch (e) {
          console.error("Failed to fetch LinkedIn import", e);
          setIsProcessingLinkedIn(false);
        }
      } 
      // 3. Check URL Data (URL Fallback - often truncated)
      else if (linkedinData) {
        try {
          setIsProcessingLinkedIn(true);
          const profile = JSON.parse(decodeURIComponent(linkedinData));
          setTimeout(() => {
            handleLinkedInData(profile);
            setIsProcessingLinkedIn(false);
            window.history.replaceState({}, document.title, "/");
          }, 1000);
        } catch (e) {
          console.error("Failed to parse LinkedIn data", e);
          setIsProcessingLinkedIn(false);
        }
      } 
      // 4. Handle Errors
      else if (error) {
        setLinkedinError(decodeURIComponent(error));
        setView('linkedin-import');
        window.history.replaceState({}, document.title, "/");
      }
    };

    loadLinkedInData();
  }, []);



  const handleLinkedInData = (profile: LinkedInProfileData) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: profile.fullName || prev.personalInfo.fullName,
        email: profile.email || prev.personalInfo.email,
        summary: profile.summary || profile.headline || prev.personalInfo.summary,
        location: profile.location || prev.personalInfo.location,
        linkedin: profile.linkedinUrl || prev.personalInfo.linkedin,
      },
      experiences: (profile.experiences || []).map((exp: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: !exp.endDate || exp.endDate.toLowerCase() === 'present',
        description: exp.description || '',
      })),
      education: (profile.education || []).map((edu: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        degree: edu.degree || '',
        school: edu.school || '',
        location: edu.location || '',
        startYear: edu.startYear || '',
        endYear: edu.endYear || '',
      })),
      skills: profile.skills || prev.skills,
    }));
    setView('builder');
    setCurrentStep('info');
  };

  const handleDownloadPDF = async () => {
    if (!isPaid) {
      setView('payment');
      return;
    }
    setIsDownloading(true);
    try {
      const element = document.getElementById('resume-preview-container');
      if (!element) {
        setIsDownloading(false);
        return;
      }
      
      const contentHtml = element.innerHTML;
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: white; }
              * { box-sizing: border-box; }
              .hidden { display: block !important; }
              /* Clean spacing and no fixed height */
              .w-\\[794px\\] {
                width: 794px !important;
                min-height: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 40px !important;
                box-shadow: none !important;
                border: none !important;
                transform: none !important;
              }
              section { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            <div id="resume-preview-container">
              ${contentHtml}
            </div>
          </body>
        </html>
      `;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml })
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Server PDF generation failed", error);
      alert("Failed to generate PDF. Make sure the backend server is running.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!isPaid) {
      setView('payment');
      return;
    }
    setIsDownloading(true);
    try {
      // Helper for bullet points from a string with newlines/bullets
      const createBullets = (text: string) => {
        if (!text) return [];
        return text.split('\n')
          .filter(t => t.trim())
          .map(line => {
            const cleanLine = line.replace(/^•\s*/, '').trim();
            return new Paragraph({
              text: cleanLine,
              bullet: { level: 0 },
              spacing: { after: 100 },
              style: "Normal"
            });
          });
      };

      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              basedOn: "Normal",
              next: "Normal",
              run: { size: 22, font: "Arial" } // 11pt
            }
          ]
        },
        sections: [{
          properties: {},
          children: [
            // HEADER
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: data.personalInfo.fullName || "Resume", bold: true, size: 48, font: "Arial" }), // 24pt
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ 
                  text: [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(" | "), 
                  size: 20, // 10pt
                  font: "Arial" 
                }),
              ],
              spacing: { after: 300 }
            }),

            // SUMMARY
            ...(data.personalInfo.summary ? [
              new Paragraph({
                children: [new TextRun({ text: "SUMMARY", bold: true, size: 28, font: "Arial" })], // 14pt
                spacing: { before: 300, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }),
              new Paragraph({
                text: data.personalInfo.summary,
                style: "Normal",
                spacing: { before: 100, after: 200 }
              })
            ] : []),

            // EXPERIENCE
            ...(data.experiences.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 28, font: "Arial" })], // 14pt
                spacing: { before: 300, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }),
              ...data.experiences.map(e => [
                new Paragraph({
                  spacing: { before: 100, after: 50 },
                  children: [
                    new TextRun({ text: e.title, bold: true, size: 24, font: "Arial" }), // 12pt
                    new TextRun({ text: ` — ${e.company}`, size: 24, font: "Arial" }),
                  ]
                }),
                new Paragraph({
                  spacing: { after: 100 },
                  children: [
                    new TextRun({ text: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`, italics: true, size: 20, font: "Arial" }) // 10pt
                  ]
                }),
                ...createBullets(e.description || ""),
                new Paragraph({ text: "", spacing: { after: 100 } })
              ]).flat()
            ] : []),

            // EDUCATION
            ...(data.education.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "EDUCATION", bold: true, size: 28, font: "Arial" })], // 14pt
                spacing: { before: 300, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }),
              ...data.education.map(e => [
                new Paragraph({
                  spacing: { before: 100, after: 50 },
                  children: [
                    new TextRun({ text: e.degree, bold: true, size: 24, font: "Arial" }), // 12pt
                  ]
                }),
                new Paragraph({
                  spacing: { after: 100 },
                  children: [
                    new TextRun({ text: `${e.school} | ${e.startYear} - ${e.endYear}`, size: 22, font: "Arial" }) // 11pt
                  ]
                })
              ]).flat()
            ] : []),

            // SKILLS
            ...(data.skills.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "SKILLS", bold: true, size: 28, font: "Arial" })], // 14pt
                spacing: { before: 300, after: 100 },
                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.skills.join(" • "), size: 22, font: "Arial" })
                ],
                spacing: { before: 100 }
              })
            ] : []),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.personalInfo.fullName || "Resume"}.docx`);
    } catch (error) {
      console.error("DOCX generation failed", error);
      alert("Failed to generate DOCX");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: result, error } = await supabase
      .from('resumes')
      .insert([
        {
          name: data.personalInfo.fullName,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          location: data.personalInfo.location
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      console.log("Error:", error);
      alert("Error saving data: " + error.message);
    } else {
      console.log("Success:", result);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setView('success');
      }, 2000);
    }
  };

  const handleStart = (mode: 'manual' | 'ai' | 'linkedin') => {
    setPendingMode(mode);
    setView('templates');
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Frontend key
        amount: order.amount,
        currency: order.currency,
        name: "Premium Resume Builder",
        description: "Unlock Premium Resume Downloads",
        image: "https://your-logo-url.com/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setIsPaid(true);
            setView('success');
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: data.personalInfo.fullName,
          email: data.personalInfo.email,
          contact: data.personalInfo.phone,
        },
        theme: {
          color: "#3525cd",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Check your internet connection.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    localStorage.setItem('selectedTemplate', id);
    window.history.pushState({}, '', '/preview');
    setView('preview');
  };

  const handleAIProcess = () => {
    setIsProcessingAI(true);
    // Simulate AI extraction and tailoring
    setTimeout(() => {
      setIsProcessingAI(false);
      setView('builder');
      setCurrentStep('summary'); // Goal is to go to review
    }, 2000);
  };

  const calculateProgress = () => {
    let score = 0;
    if (data.personalInfo.fullName) score += 20;
    if (data.experiences.length > 0) score += 20;
    if (data.education.length > 0) score += 20;
    if (data.skills.length > 0) score += 20;
    if (data.projects.length > 0) score += 20;
    return score;
  };

  const handleEnhanceExperience = async (id: string) => {
    setIsEnhancing(true);
    const exp = data.experiences.find(e => e.id === id);
    if (exp) {
      const enhanced = await enhanceDescription(exp.description);
      setData(prev => ({
        ...prev,
        experiences: prev.experiences.map(e => e.id === id ? { ...e, description: enhanced } : e)
      }));
      
      const suggested = await suggestSkills(enhanced);
      if (suggested.length > 0) {
        setData(prev => ({
          ...prev,
          skills: Array.from(new Set([...prev.skills, ...suggested]))
        }));
      }
    }
    setIsEnhancing(false);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      degree: '',
      school: '',
      location: '',
      startYear: '',
      endYear: '',
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      technologies: [],
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const handleEnhanceSummary = async () => {
    setIsEnhancing(true);
    if (data.personalInfo.summary) {
      const enhanced = await enhanceDescription(data.personalInfo.summary);
      setData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: enhanced }
      }));
    }
    setIsEnhancing(false);
  };

  if (isProcessingLinkedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-10 h-10 text-primary" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Syncing LinkedIn Profile</h2>
          <p className="text-slate-400 max-w-sm">Our AI is structuring your professional history and optimizing it for ATS compatibility...</p>
          
          <div className="mt-12 flex gap-2">
             {[0, 1, 2].map(i => (
               <motion.div 
                 key={i}
                 className="w-2 h-2 bg-primary rounded-full"
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
               />
             ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'templates') {
    const categories = ['Core', 'Advanced', 'Premium'] as const;

    const getTemplateComponent = (id: string) => {
      switch(id) {
        case 'modern': return Templates.ModernProfessionalTemplate;
        case 'minimal': return Templates.MinimalTemplate;
        case 'executive': return Templates.ExecutiveTemplate;
        case 'creative': return Templates.CreativeTemplate;
        case 'simple': return Templates.SimpleTemplate;
        case 'ats': return Templates.ATSOptimizedTemplate;
        case 'timeline': return Templates.TimelineTemplate;
        case 'skills': return Templates.SkillsBasedTemplate;
        case 'tech': return Templates.TechTemplate;
        case 'startup': return Templates.StartupTemplate;
        case 'elegant': return Templates.ElegantTemplate;
        case 'bold': return Templates.BoldHeaderTemplate;
        case 'compact': return Templates.CompactTemplate;
        case 'photo': return Templates.PhotoTemplate;
        case 'hybrid': return Templates.HybridTemplate;
        default: return Templates.ModernProfessionalTemplate;
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
        <Topbar onHome={() => setView('landing')} />
        <div className="max-w-7xl w-full px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Choose Your Template</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Select a blueprint that fits your industry. You can always change this later.</p>
          </motion.div>

          <div className="space-y-20">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-2">{category} Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {templates.filter(t => t.category === category).map((tpl) => {
                    const TemplateComp = getTemplateComponent(tpl.id);
                    return (
                      <motion.div
                        key={tpl.id}
                        whileHover={{ y: -5 }}
                        className="group flex flex-col items-center"
                      >
                        <div className="w-full aspect-[1/1.414] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/50">
                          {/* Mini Preview rendering real component scaled down */}
                          <div className="absolute top-0 left-0 origin-top-left pointer-events-none" style={{ transform: 'scale(0.3)', width: '333.33%', height: '333.33%' }}>
                            {/* Render empty state instead of DUMMY_DATA for privacy/cleanliness */}
                            <TemplateComp data={INITIAL_DATA} />
                          </div>
                          
                          {/* Hover Overlay - Like Resume.io */}
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <button 
                              onClick={() => handleSelectTemplate(tpl.id)}
                              className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                            >
                              Use this template
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                          <h3 className="font-bold text-slate-900">{tpl.name}</h3>
                          <p className="text-sm text-slate-500 mt-1 max-w-[250px]">{tpl.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'preview') {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Topbar onHome={() => {
          window.history.pushState({}, '', '/');
          setView('landing');
        }} />
        <div className="flex-1 flex flex-col items-center p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-4xl w-full flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Template Preview</h1>
              <p className="text-slate-500">You selected: {templates.find(t => t.id === selectedTemplate)?.name}</p>
            </div>
            <button 
              onClick={() => {
                 window.history.pushState({}, '', '/');
                 if (pendingMode === 'ai') {
                   setView('ai-import');
                 } else if (pendingMode === 'linkedin') {
                   setView('linkedin-import');
                 } else {
                   setView('builder');
                 }
              }}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              Continue to Builder <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full max-w-4xl border border-slate-200 shadow-xl rounded-2xl overflow-hidden scale-[0.9] origin-top bg-slate-100">
             <ResumePreview data={data} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'ai-import') {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
        <Topbar onHome={() => setView('landing')} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white p-12 rounded-[40px] shadow-paper border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">AI Optimization</h1>
              <p className="text-secondary text-sm">Tailor your profile for a specific role.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileUp className="w-4 h-4" />
                  Your Current Resume
                </label>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">PDF, DOCX supported</span>
              </div>
              <div className="h-44 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold">Upload Resume File</p>
                <p className="text-[10px] opacity-60">or drag and drop here</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                Target Job Description
              </label>
              <textarea 
                className="w-full px-6 py-5 bg-slate-50 rounded-[2rem] border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm leading-relaxed min-h-[160px] shadow-subtle"
                placeholder="Paste the job description here to optimize for ATS keywords..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="pt-4 flex gap-4">
               <button 
                onClick={() => setView('landing')}
                className="flex-1 h-16 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAIProcess}
                disabled={isProcessingAI}
                className="flex-[2] h-16 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessingAI ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" fill="currentColor" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" fill="currentColor" />
                    Optimize with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Left Side: Preview */}
          <div className="bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Sparkles className="w-6 h-6 text-primary-container" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">Unlock Your<br/>Professional Career</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">Join thousands of professionals who used our AI-powered templates to land their dream jobs at top-tier companies.</p>
              
              <ul className="space-y-4">
                {[
                  "Pixel-perfect PDF & DOCX export",
                  "ATS-optimized professional layouts",
                  "AI-enhanced content & suggestions",
                  "Unlimited edits & re-downloads"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {data.personalInfo.fullName?.charAt(0) || 'R'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Resume Preview</p>
                    <p className="text-sm font-black">{data.personalInfo.fullName || 'Professional Resume'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Payment */}
          <div className="p-12 flex flex-col justify-center">
            <div className="text-center mb-10">
              <span className="px-4 py-1.5 bg-indigo-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block mb-4">Premium Access</span>
              <h1 className="text-4xl font-black text-slate-900 mb-2">₹5.00</h1>
              <p className="text-slate-400 text-sm font-medium">One-time payment • Lifetime access</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full h-16 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                {paymentLoading ? (
                  <><Sparkles className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <>Unlock Premium Resume <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              
              <button 
                onClick={() => setView('success')}
                className="w-full h-16 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                Not now
              </button>
            </div>

            <div className="mt-10 border-t border-slate-100 pt-8 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Secure Checkout Powered by Razorpay</p>
              <div className="flex justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <CreditCard className="w-6 h-6" />
                 <ShieldCheck className="w-6 h-6" />
                 <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center print:p-0 print:bg-white print:block">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[32px] shadow-paper border border-slate-100 print:hidden"
        >
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Resume Ready!</h1>
          <p className="text-secondary mb-10 leading-relaxed">Your professional ATS-optimized resume has been generated and is ready for download.</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleDownloadPDF}
              className="w-full h-14 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95"
            >
              <Download className="w-5 h-5" /> Download PDF
            </button>
            <button 
              onClick={handleDownloadDOCX}
              disabled={isDownloading}
              className="w-full h-14 bg-[#4f46e5] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-75"
            >
              {isDownloading ? (
                <><Sparkles className="w-5 h-5 animate-spin" /> Preparing DOCX...</>
              ) : (
                <><Download className="w-5 h-5" /> Download DOCX</>
              )}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setView('builder')}
                className="h-14 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                Back to Editor
              </button>
              <button 
                onClick={() => setView('landing')}
                className="h-14 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
            <button 
              onClick={() => {
                setData(INITIAL_DATA);
                setView('landing');
              }}
              className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors pt-4"
            >
              Start a new resume
            </button>
          </div>
        </motion.div>
        
        <div className="mt-12 flex gap-8 print:hidden">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              SECURE DOWNLOAD
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <CheckCircle2 className="w-4 h-4" />
              ATS VERIFIED
           </div>
        </div>

        {/* Print Container for PDF generation */}
        <div id="resume-preview-container" className="hidden print:block w-[210mm] min-h-auto bg-[#ffffff] m-0 p-0 text-left">
          <ResumePreview data={data} selectedTemplate={selectedTemplate} />
        </div>
      </div>
    );
  }

  if (view === 'linkedin-import') {
    return (
      <LinkedInImport 
        onBack={() => setView('landing')} 
        onDataFetched={handleLinkedInData}
        errorMessage={linkedinError}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface">
      {(view === 'landing' || view === 'builder') && (
        <Topbar onHome={() => setView('landing')} />
      )}
      
      <div className={`flex flex-1 ${view !== 'success' ? 'pt-16' : ''} overflow-hidden`}>
        {view === 'landing' && (
           <Landing onStart={handleStart} />
        )}

        {view === 'builder' && (
          <>
            <Sidebar 
              currentStep={currentStep} 
              onStepChange={setCurrentStep} 
              progress={calculateProgress()} 
            />

            <main className="flex-1 flex overflow-hidden">
              {/* Form Pane */}
              <div className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar bg-white">
                <div className="max-w-2xl mx-auto space-y-12">
                  <AnimatePresence mode="wait">
                    {currentStep === 'info' && (
                  <motion.section
                    key="step-info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10">
                      <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Personal Information</h2>
                      <p className="text-secondary">Start with your basic details to set a professional foundation.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle"
                            placeholder="e.g. Jonathan H. Sterling"
                            value={data.personalInfo.fullName}
                            onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, fullName: e.target.value } }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle"
                              placeholder="j.sterling@design.com"
                              value={data.personalInfo.email}
                              onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle"
                              placeholder="+1 (555) 902-3481"
                              value={data.personalInfo.phone}
                              onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))}
                            />
                          </div>
                        </div>

                         <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Location</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle"
                            placeholder="San Francisco, CA"
                            value={data.personalInfo.location}
                            onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-slate-700">Professional Summary</label>
                            <button 
                              onClick={handleEnhanceSummary}
                              disabled={isEnhancing}
                              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-primary text-[10px] font-bold rounded-full group hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                            >
                              <Sparkles className={`w-3 h-3 transition-transform group-hover:scale-110 ${isEnhancing ? 'animate-spin' : ''}`} fill="currentColor" />
                              {isEnhancing ? 'ENHANCING...' : 'AI ASSIST'}
                            </button>
                          </div>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle min-h-[120px] resize-none"
                            placeholder="Briefly describe your career goals and key achievements..."
                            value={data.personalInfo.summary}
                            onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, summary: e.target.value } }))}
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                        <div className="p-2 bg-white rounded-lg h-fit shadow-sm">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-900 mb-1 leading-none uppercase tracking-widest">Growth Analytics</p>
                          <p className="text-xs text-indigo-700 leading-relaxed">Resumes with a LinkedIn profile see <span className="font-bold underline">85% higher</span> interview rates in tech sectors.</p>
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-bold text-primary flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              ADD LINKEDIN
                            </button>
                            <button className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-bold text-primary flex items-center gap-1">
                              <Plus className="w-3 h-3" />
                              ADD PORTFOLIO
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {currentStep === 'experience' && (
                  <motion.section
                    key="step-experience"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10 flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Work Experience</h2>
                        <p className="text-secondary">Showcase your professional journey and quantified impact.</p>
                      </div>
                      <button 
                        onClick={addExperience}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>

                    <div className="space-y-8">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-bottom-4 duration-500">
                          <button 
                            onClick={() => setData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== exp.id) }))}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Senior Product Designer"
                                value={exp.title}
                                onChange={(e) => setData(prev => ({ ...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? { ...ex, title: e.target.value } : ex) }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. TechFlow Solutions"
                                value={exp.company}
                                onChange={(e) => setData(prev => ({ ...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? { ...ex, company: e.target.value } : ex) }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                              <button 
                                onClick={() => handleEnhanceExperience(exp.id)}
                                disabled={isEnhancing}
                                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-primary text-white text-[10px] font-bold rounded-full disabled:opacity-50"
                              >
                                <Sparkles className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} fill="currentColor" />
                                {isEnhancing ? 'ENHANCING...' : 'AI ENHANCE'}
                              </button>
                            </div>
                            <textarea 
                              className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary min-h-[160px] text-sm leading-relaxed"
                              placeholder="Describe your role and impact. Try using strong action verbs..."
                              value={exp.description}
                              onChange={(e) => setData(prev => ({ ...prev, experiences: prev.experiences.map(ex => ex.id === exp.id ? { ...ex, description: e.target.value } : ex) }))}
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                               <span className="text-[10px] italic text-slate-400">Pro tip: Quantify results like "Increased revenue by 20%"</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {data.experiences.length === 0 && (
                        <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-4">
                          <Briefcase className="w-12 h-12 opacity-20" />
                          <p className="font-semibold uppercase text-xs tracking-widest">No work experience added yet</p>
                          <button 
                            onClick={addExperience}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            Click to add your first role
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {currentStep === 'education' && (
                  <motion.section
                    key="step-education"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10 flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Education</h2>
                        <p className="text-secondary">List your academic background and credentials.</p>
                      </div>
                      <button 
                        onClick={addEducation}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>

                    <div className="space-y-8">
                      {data.education.map((edu) => (
                        <div key={edu.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                          <button 
                            onClick={() => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Degree / Field of Study</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. B.S. in Computer Science"
                                value={edu.degree}
                                onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed) }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">School / University</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. Stanford University"
                                value={edu.school}
                                onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, school: e.target.value } : ed) }))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-6">
                             <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Palo Alto, CA"
                                value={edu.location}
                                onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, location: e.target.value } : ed) }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Year</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="2018"
                                value={edu.startYear}
                                onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, startYear: e.target.value } : ed) }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Year</label>
                              <input 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                placeholder="2022"
                                value={edu.endYear}
                                onChange={(e) => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, endYear: e.target.value } : ed) }))}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {data.education.length === 0 && (
                        <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-4">
                          <GraduationCap className="w-12 h-12 opacity-20" />
                          <p className="font-semibold uppercase text-xs tracking-widest">No education added yet</p>
                          <button 
                            onClick={addEducation}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            Click to add degree
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {currentStep === 'skills' && (
                  <motion.section
                    key="step-skills"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10">
                      <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Expertise & Skills</h2>
                      <p className="text-secondary">Our AI suggests skills based on your professional experience.</p>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                         <label className="text-sm font-semibold text-slate-700">Add Skills Manually</label>
                         <div className="flex gap-2">
                           <input 
                             type="text" 
                             className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary shadow-subtle"
                             placeholder="e.g. React, Product Strategy, Figma"
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                 const val = (e.target as HTMLInputElement).value;
                                 if (val) {
                                   setData(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, val])) }));
                                   (e.target as HTMLInputElement).value = '';
                                 }
                               }
                             }}
                           />
                         </div>
                       </div>

                       <div className="p-8 bg-surface-container-low rounded-3xl border border-surface-container-high relative overflow-hidden">
                          <div className="flex items-center gap-2 mb-6">
                            <Zap className="w-5 h-5 text-primary fill-primary" />
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest leading-none">Suggested for you</h3>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                             {['Leadership', 'Agile', 'User Research', 'Python', 'SQL', 'Data Analysis', 'Project Management'].map((s) => (
                               <button 
                                 key={s}
                                 onClick={() => setData(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, s])) }))}
                                 className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-2 active:scale-95"
                               >
                                 {s}
                                 <Plus className="w-3 h-3" />
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Skills</label>
                          <div className="flex flex-wrap gap-3">
                            {data.skills.map((skill, index) => (
                              <div key={index} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 animate-in zoom-in duration-300">
                                {skill}
                                <button 
                                  onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))}
                                  className="hover:bg-white/20 rounded p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  </motion.section>
                )}

                {currentStep === 'projects' && (
                   <motion.section
                    key="step-projects"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10 flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Key Projects</h2>
                        <p className="text-secondary">Highlight specific work that demonstrates your expertise.</p>
                      </div>
                      <button 
                        onClick={addProject}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                        Add Project
                      </button>
                    </div>

                    <div className="space-y-8">
                      {data.projects.map((proj) => (
                        <div key={proj.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                          <button 
                            onClick={() => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }))}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Name</label>
                                <input 
                                  className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="e.g. Open Source CLI Tool"
                                  value={proj.name}
                                  onChange={(e) => setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === proj.id ? { ...p, name: e.target.value } : p) }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technologies Used</label>
                                <input 
                                  className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="e.g. Go, Docker, AWS"
                                  value={proj.technologies.join(', ')}
                                  onChange={(e) => setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === proj.id ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()) } : p) }))}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                              <textarea 
                                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary min-h-[120px] text-sm leading-relaxed"
                                placeholder="Describe the problem, your solution, and the tech stack..."
                                value={proj.description}
                                onChange={(e) => setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p) }))}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {data.projects.length === 0 && (
                        <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-4">
                          <FolderKanban className="w-12 h-12 opacity-20" />
                          <p className="font-semibold uppercase text-xs tracking-widest">No projects added yet</p>
                          <button 
                            onClick={addProject}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            Click to showcase a project
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {currentStep === 'summary' && (
                  <motion.section
                    key="step-summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="mb-10 text-center">
                      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" fill="currentColor" />
                      </div>
                      <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Review Your Resume</h2>
                      <p className="text-secondary max-w-md mx-auto">Great job! Your resume is looking strong. Review the live preview on the right and finish whenever you're ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4 items-center text-center">
                          <Zap className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                          <div>
                            <h3 className="font-bold text-slate-900">ATS Strength Score</h3>
                            <p className="text-xs text-slate-500">Your score is 85/100</p>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                             <div className="bg-indigo-600 h-full w-[85%]"></div>
                          </div>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4 items-center text-center">
                          <Sparkles className="w-8 h-8 text-primary fill-primary" />
                          <div>
                            <h3 className="font-bold text-slate-900">AI Suggested Title</h3>
                            <p className="text-xs text-slate-500">Senior Product Designer</p>
                          </div>
                          <button className="text-xs font-bold text-primary hover:underline">Apply change</button>
                       </div>
                    </div>

                    <div className="mt-12 p-8 bg-indigo-600 rounded-3xl text-white shadow-xl relative overflow-hidden text-center">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                      <h3 className="text-xl font-bold mb-4">You're almost there!</h3>
                      <p className="text-sm opacity-80 mb-8 max-w-sm mx-auto">Finalize your draft and download the professional PDF version to start applying today.</p>
                      <form onSubmit={handleSubmit}>
                        <button 
                          type="submit"
                          disabled={isSubmitting || submitSuccess}
                          className={`px-12 py-4 font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-90 ${submitSuccess ? 'bg-green-500 text-white' : 'bg-white text-primary'}`}
                        >
                          {isSubmitting && <Sparkles className="w-5 h-5 animate-spin" />}
                          {submitSuccess ? 'Successfully Added to Database! 🎉' : 'Finalize & Export'}
                        </button>
                      </form>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="pt-12 flex justify-between items-center border-t border-slate-100">
                <button 
                   onClick={() => {
                     const idx = steps.findIndex(s => s.id === currentStep);
                     if (idx > 0) setCurrentStep(steps[idx-1].id);
                   }}
                   className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button 
                   onClick={() => {
                     const idx = steps.findIndex(s => s.id === currentStep);
                     if (idx < steps.length - 1) setCurrentStep(steps[idx+1].id);
                     else setView('success');
                   }}
                   className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  {currentStep === 'summary' ? 'Review & Generate' : 'Next Step'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Pane */}
          <section className="hidden xl:flex w-[600px] bg-slate-100 items-start justify-center p-12 overflow-y-auto custom-scrollbar border-l border-slate-200">
            <div className="top-0 sticky">
              <div className="mb-6 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <span>ATS Optimization: 85%</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" fill="currentColor" />
                  Live Preview Draft
                </span>
              </div>
              <div className="scale-[0.8] origin-top">
                <ResumePreview data={data} />
              </div>
            </div>
          </section>
        </main>
      </>
    )}
  </div>
</div>
  );
}

const steps = [
  { id: 'info', name: 'Personal Info' },
  { id: 'experience', name: 'Experience' },
  { id: 'education', name: 'Education' },
  { id: 'skills', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'summary', name: 'Summary' },
];

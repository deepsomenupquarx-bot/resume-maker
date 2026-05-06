import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Rocket, 
  Linkedin, 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Star,
  Zap,
  ShieldCheck,
  Layout as LayoutIcon,
  Cpu,
  Workflow,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LandingProps {
  onStart: (mode: 'manual' | 'ai' | 'linkedin') => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen pt-16 h-full max-h-screen overflow-y-auto">
      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6 border border-primary/20"
        >
          <Star className="w-3 h-3 text-primary" fill="currentColor" />
          <span className="text-primary text-[10px] font-bold uppercase tracking-wider">AI-Powered precision</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-on-surface mb-6 max-w-3xl leading-[1.1] tracking-tight"
        >
          Build Job-Winning Resumes with <span className="text-primary">Intelligence</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-secondary mb-10 max-w-xl leading-relaxed"
        >
          Create ATS-optimized resumes from your data, job description, or LinkedIn profile in minutes.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {/* Path 1: Manual */}
          <button 
            onClick={() => onStart('manual')}
            className="group p-8 bg-white border border-slate-200 rounded-[32px] text-left hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Build from Scratch</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">Manually input your details step-by-step for full control over every section.</p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Path 2: AI Import */}
          <button 
            onClick={() => onStart('ai')}
            className="group p-8 bg-slate-900 border border-slate-800 rounded-[32px] text-left hover:shadow-xl transition-all duration-300 relative overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
               <Sparkles className="w-6 h-6" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Optimization</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">Upload your old resume and a job description to tailor your profile automatically.</p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              Start with AI <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Path 3: LinkedIn */}
          <button 
            onClick={() => onStart('linkedin')}
            className="group p-8 bg-white border border-slate-200 rounded-[32px] text-left hover:border-[#0A66C2]/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Linkedin className="w-16 h-16" />
            </div>
            <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-2xl flex items-center justify-center text-[#0A66C2] mb-6 group-hover:scale-110 transition-transform">
              <Linkedin className="w-6 h-6" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Import LinkedIn</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">Sync your professional profile directly to generate a verified industry resume.</p>
            <div className="flex items-center gap-2 text-[#0A66C2] font-bold text-sm">
              Connect Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="mt-16 w-full max-w-4xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 h-1/4 bottom-0 top-auto"></div>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <img 
              referrerPolicy="no-referrer"
              className="w-full rounded-2xl shadow-PAPER border border-white/40 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
              alt="Premium office desk"
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/40 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
               <Zap className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Our users work at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
             <span className="text-2xl font-black text-slate-800">GOOGLE</span>
             <span className="text-2xl font-black text-slate-800">AMAZON</span>
             <span className="text-2xl font-black text-slate-800">META</span>
             <span className="text-2xl font-black text-slate-800">APPLE</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Precision Tools for Success</h2>
          <p className="text-secondary">Engineered to get you past the initial screen.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl flex flex-col gap-5 border border-slate-100 shadow-SUBTLE hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
              <LayoutIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">ATS-Friendly Templates</h3>
            <p className="text-secondary leading-relaxed text-sm">Expertly crafted designs that pass through every scanner, ensuring your profile gets noticed by recruiters.</p>
          </div>

          <div className="bg-primary text-on-primary p-8 rounded-3xl flex flex-col gap-5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">AI-Powered Bullets</h3>
            <p className="text-white/80 leading-relaxed text-sm">Generate impactful descriptions for your experience using state-of-the-art career analysis algorithms.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl flex flex-col gap-5 border border-slate-100 shadow-SUBTLE hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">Real-time Scoring</h3>
            <p className="text-secondary leading-relaxed text-sm">Get instant feedback on your resume's strength relative to specific job descriptions as you type.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20">
        <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.15),transparent)]"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10 leading-tight">Ready to accelerate your career?</h2>
          <p className="mb-10 text-slate-400 text-lg relative z-10">Join 50,000+ professionals who landed their dream roles using ResumeElite.</p>
          <button 
            onClick={onStart}
            className="w-full sm:w-auto bg-primary text-white font-bold px-12 py-5 rounded-2xl shadow-xl active:scale-95 transition-all hover:brightness-110 relative z-10"
          >
            Start Building For Free
          </button>
        </div>
      </section>
    </div>
  );
}

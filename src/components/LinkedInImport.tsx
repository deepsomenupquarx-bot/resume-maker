import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Linkedin, ShieldCheck, Sparkles, ArrowRight, CheckCircle2,
  Users, Zap, Lock, AlertCircle, X, RefreshCw
} from 'lucide-react';

interface LinkedInImportProps {
  onBack: () => void;
  onDataFetched: (data: LinkedInProfileData) => void;
  errorMessage?: string;
}

export interface LinkedInProfileData {
  fullName: string;
  email: string;
  headline: string;
  photo: string;
  location: string;
}

type Status = 'idle' | 'connecting' | 'error';

const STEPS = [
  'Authenticating with LinkedIn...',
  'Fetching your profile data...',
  'Mapping to resume format...',
  'AI-optimizing content...',
];

export default function LinkedInImport({ onBack, onDataFetched, errorMessage }: LinkedInImportProps) {
  const [status, setStatus] = useState<Status>(errorMessage ? 'error' : 'idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(errorMessage || '');

  const handleConnect = async () => {
    setStatus('connecting');
    setLoadingStep(0);
    setError('');

    try {
      // Step through loading animation while waiting for OAuth redirect
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < STEPS.length - 1) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 800);

      const res = await fetch('/api/linkedin/auth-url');
      if (!res.ok) throw new Error('Could not connect to server');
      const { url } = await res.json();
      // Redirect to LinkedIn — callback will return us to the app
      window.location.href = url;
    } catch (err: any) {
      setStatus('error');
      setError('Could not reach the server. Make sure the backend is running.');
    }
  };

  const benefits = [
    'Auto-fill name, email & headline',
    'AI-polished professional summary',
    'ATS-optimized bullet points',
    'Instantly ready resume in seconds',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f2e] to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">

        {/* ── Left Panel: LinkedIn branding ── */}
        <div className="relative bg-[#0A66C2] p-12 text-white flex flex-col justify-between overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5  rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Linkedin className="w-7 h-7 text-[#0A66C2]" fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Powered by</p>
                <p className="text-xl font-black">LinkedIn</p>
              </div>
            </div>

            <h2 className="text-3xl font-black leading-tight mb-4">
              Import Your Profile<br />in One Click
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-10">
              Connect your LinkedIn account to instantly pull your professional data and generate a stunning ATS-friendly resume.
            </p>

            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-white/80 shrink-0" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Trust badges */}
          <div className="relative z-10 mt-12 flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-6 h-6 text-white shrink-0" />
            <p className="text-xs text-white/80 leading-snug">
              We only read your public profile. We <strong>never</strong> post, message, or modify your LinkedIn account.
            </p>
          </div>
        </div>

        {/* ── Right Panel: Action area ── */}
        <div className="bg-white p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* ── IDLE state ── */}
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <span className="px-3 py-1 bg-[#0A66C2]/10 text-[#0A66C2] text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block mb-6">
                  Secure Connection
                </span>
                <h1 className="text-3xl font-black text-slate-900 mb-3 leading-tight">
                  Connect Your<br />LinkedIn Profile
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-10">
                  You'll be redirected to LinkedIn to authorize access. We only request read-only permissions.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: Lock,  text: 'Read-only access — we never write to your account' },
                    { icon: Users, text: 'Used only to pre-fill your resume data' },
                    { icon: Zap,   text: 'One-time authorization, no recurring permissions' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <Icon className="w-4 h-4 text-[#0A66C2] mt-0.5 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full h-14 bg-[#0A66C2] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#004182] active:scale-95 transition-all shadow-xl shadow-[#0A66C2]/30 mb-4"
                >
                  <Linkedin className="w-5 h-5" fill="currentColor" />
                  Continue with LinkedIn
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onBack}
                  className="w-full h-12 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
                >
                  ← Go back
                </button>
              </motion.div>
            )}

            {/* ── CONNECTING / LOADING state ── */}
            {status === 'connecting' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                {/* Animated LinkedIn spinner */}
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-[#0A66C2]/20" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-t-[#0A66C2] border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Linkedin className="w-10 h-10 text-[#0A66C2]" fill="currentColor" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3">Connecting to LinkedIn</h2>
                <p className="text-slate-400 text-sm mb-8">Please complete the login in the browser tab that opened.</p>

                {/* Step indicators */}
                <div className="w-full space-y-3">
                  {STEPS.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: i <= loadingStep ? 1 : 0.3 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      {i < loadingStep ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : i === loadingStep ? (
                        <motion.div
                          className="w-5 h-5 rounded-full border-2 border-[#0A66C2] border-t-transparent shrink-0"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                      )}
                      <span className={i <= loadingStep ? 'text-slate-700 font-medium' : 'text-slate-300'}>
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ERROR state ── */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3">Connection Failed</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-2 max-w-xs">
                  {error || 'Something went wrong during LinkedIn authentication.'}
                </p>
                <p className="text-slate-300 text-xs mb-8">
                  This may be because you denied access, or the server is unavailable.
                </p>

                <button
                  onClick={() => { setStatus('idle'); setError(''); }}
                  className="w-full h-14 bg-[#0A66C2] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#004182] active:scale-95 transition-all shadow-lg mb-3"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
                <button
                  onClick={onBack}
                  className="w-full h-12 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
                >
                  ← Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

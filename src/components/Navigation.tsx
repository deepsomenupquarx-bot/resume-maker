import React from 'react';
import { 
  Home,
  User, 
  Library, 
  Map as MapIcon, 
  Briefcase, 
  GraduationCap, 
  BrainCircuit, 
  FolderKanban, 
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  progress: number;
}

interface TopbarProps {
  onHome: () => void;
}

const steps = [
  { id: 'info', name: 'Personal Info', icon: User },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: BrainCircuit },
  { id: 'projects', name: 'Projects', icon: FolderKanban },
  { id: 'summary', name: 'Summary', icon: FileText },
];

export function Sidebar({ currentStep, onStepChange, progress }: SidebarProps) {
  return (
    <aside className="w-64 flex flex-col h-full bg-slate-50 border-r border-slate-200">
      <div className="p-6 mb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Resume Builder</h2>
        <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-primary"
          />
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{progress}% Complete</p>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-primary shadow-SUBTLE ring-1 ring-slate-200 translate-x-1' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              {step.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 mt-auto">
        <div className="mb-6 p-4 bg-indigo-600 rounded-[1.25rem] text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
          <p className="text-xs font-bold mb-1 relative z-10">Upgrade to Pro</p>
          <p className="text-[10px] opacity-80 leading-tight mb-3 relative z-10">Unlock AI writing and premium templates.</p>
          <button className="w-full py-2 bg-white text-primary rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors relative z-10">
            Go Pro
          </button>
        </div>
        
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ onHome }: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-8">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 group"
        >
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <span>ResumeElite</span>
        </button>
        <nav className="hidden lg:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">Dashboard</a>
          <a href="#" className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-5 translate-y-[2px]">Templates</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">My Resumes</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <button className="hidden sm:block px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform hover:brightness-110">
          Export PDF
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-indigo-50">
           <img 
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User profile" 
          />
        </div>
      </div>
    </header>
  );
}

export interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
  category: 'Core' | 'Advanced' | 'Premium';
}

export const templates: Template[] = [
  { id: 'modern', name: 'Modern Professional', description: 'Clean, professional, and high-impact.', color: 'bg-indigo-600', category: 'Core' },
  { id: 'minimal', name: 'Minimal', description: 'Focuses strictly on content and hierarchy.', color: 'bg-slate-900', category: 'Core' },
  { id: 'executive', name: 'Executive', description: 'Strong, authoritative serif typography.', color: 'bg-emerald-700', category: 'Core' },
  { id: 'creative', name: 'Creative', description: 'Bold and unique for design roles.', color: 'bg-rose-500', category: 'Core' },
  { id: 'simple', name: 'Simple', description: 'Classic and straightforward format.', color: 'bg-blue-500', category: 'Core' },
  
  { id: 'ats', name: 'ATS Optimized', description: 'Built strictly to pass Applicant Tracking Systems.', color: 'bg-cyan-600', category: 'Advanced' },
  { id: 'timeline', name: 'Timeline', description: 'Visualizes your experience chronologically.', color: 'bg-purple-600', category: 'Advanced' },
  { id: 'skills', name: 'Skills Based', description: 'Highlights what you can do over where you worked.', color: 'bg-orange-500', category: 'Advanced' },
  { id: 'tech', name: 'Tech', description: 'Geared towards software engineering and IT.', color: 'bg-teal-500', category: 'Advanced' },
  { id: 'startup', name: 'Startup', description: 'Dynamic layout for fast-paced environments.', color: 'bg-yellow-500', category: 'Advanced' },
  
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated design with premium aesthetics.', color: 'bg-fuchsia-600', category: 'Premium' },
  { id: 'bold', name: 'Bold Header', description: 'Makes a strong first impression immediately.', color: 'bg-red-600', category: 'Premium' },
  { id: 'compact', name: 'Compact', description: 'Fits maximum information on a single page.', color: 'bg-lime-600', category: 'Premium' },
  { id: 'photo', name: 'Photo Profile', description: 'Includes a space for your professional headshot.', color: 'bg-pink-500', category: 'Premium' },
  { id: 'hybrid', name: 'Hybrid', description: 'The best of all templates combined.', color: 'bg-violet-600', category: 'Premium' },
];

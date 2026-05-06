import React from 'react';
import { ResumeData } from '../types';
import * as Templates from './templates/AllTemplates';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  selectedTemplate?: string;
}

export default function ResumePreview({ data, scale = 1, selectedTemplate = 'modern' }: ResumePreviewProps) {
  const TemplateComponent = (() => {
    switch(selectedTemplate) {
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
  })();

  return (
    <div style={{ transform: scale !== 1 ? `scale(${scale})` : 'none', transformOrigin: 'top center', transition: 'all 0.3s ease' }} className="w-full flex justify-center pb-12 print:!transform-none print:pb-0 print:block print:w-[794px] print:m-0">
      <div className="w-[794px] h-auto bg-[#ffffff] shadow-lg overflow-hidden border border-[#f1f5f9] print:shadow-none print:border-none">
        <TemplateComponent data={data} />
      </div>
    </div>
  );
}

import React from 'react';
import { ResumeData } from '../../types';

export const ModernProfessionalTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-sans text-[#1e293b]">
    <header className="border-b-2 border-[#4f46e5] pb-4 mb-6">
      <h1 className="text-4xl font-bold text-[#0f172a]">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-sm mt-2 text-[#475569] flex gap-4">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </p>
    </header>
    {data.personalInfo.summary && <p className="text-sm mb-6">{data.personalInfo.summary}</p>}
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h2 className="text-lg font-bold text-[#4f46e5] border-b border-[#e2e8f0] mb-4 uppercase tracking-wider">Experience</h2>
        {data.experiences.map(e => (
          <div key={e.id} className="mb-4">
            <h3 className="font-bold">{e.title}</h3>
            <p className="text-sm text-[#475569]">{e.company} | {e.startDate} - {e.current ? 'Present' : e.endDate}</p>
            <p className="text-xs mt-2 whitespace-pre-wrap">{e.description}</p>
          </div>
        ))}
        <h2 className="text-lg font-bold text-[#4f46e5] border-b border-[#e2e8f0] mt-6 mb-4 uppercase tracking-wider">Projects</h2>
        {data.projects.map(p => (
          <div key={p.id} className="mb-4">
            <h3 className="font-bold">{p.name} <span className="text-xs text-[#64748b] font-normal">({p.technologies.join(', ')})</span></h3>
            <p className="text-xs mt-1 whitespace-pre-wrap">{p.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#4f46e5] border-b border-[#e2e8f0] mb-4 uppercase tracking-wider">Education</h2>
        {data.education.map(e => (
          <div key={e.id} className="mb-4">
            <h3 className="font-bold text-sm">{e.degree}</h3>
            <p className="text-xs text-[#475569]">{e.school}</p>
            <p className="text-xs text-[#64748b]">{e.startYear} - {e.endYear}</p>
          </div>
        ))}
        <h2 className="text-lg font-bold text-[#4f46e5] border-b border-[#e2e8f0] mt-6 mb-4 uppercase tracking-wider">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s, i) => <span key={i} className="text-xs bg-[#f1f5f9] px-2 py-1 rounded">{s}</span>)}
        </div>
      </div>
    </div>
  </div>
);

export const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-12 font-mono text-xs text-[#000000]">
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold uppercase tracking-widest">{data.personalInfo.fullName || 'Name'}</h1>
      <p className="mt-2 space-x-4">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </p>
    </div>
    {data.personalInfo.summary && <p className="mb-8 leading-relaxed">{data.personalInfo.summary}</p>}
    <div className="space-y-6">
      <div>
        <h2 className="uppercase font-bold border-b border-[#000000] mb-3">Experience</h2>
        {data.experiences.map(e => (
          <div key={e.id} className="mb-4 flex gap-4">
            <div className="w-1/4 shrink-0">{e.startDate} - {e.current ? 'Present' : e.endDate}</div>
            <div>
              <div className="font-bold">{e.title} at {e.company}</div>
              <p className="mt-1 whitespace-pre-wrap">{e.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="uppercase font-bold border-b border-[#000000] mb-3">Education</h2>
        {data.education.map(e => (
          <div key={e.id} className="mb-2 flex gap-4">
            <div className="w-1/4 shrink-0">{e.startYear} - {e.endYear}</div>
            <div><span className="font-bold">{e.degree}</span>, {e.school}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="uppercase font-bold border-b border-[#000000] mb-3">Skills</h2>
        <p>{data.skills.join(' • ')}</p>
      </div>
    </div>
  </div>
);

export const ExecutiveTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-serif text-[#0f172a]">
    <h1 className="text-5xl font-black mb-2 text-[#065f46]">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
    <p className="text-sm border-y border-[#065f46] py-2 mb-6 flex justify-between">
      <span>{data.personalInfo.email}</span>
      <span>{data.personalInfo.phone}</span>
      <span>{data.personalInfo.location}</span>
    </p>
    {data.personalInfo.summary && <p className="mb-6 italic">{data.personalInfo.summary}</p>}
    
    <h2 className="text-xl font-bold text-[#065f46] mb-4 border-b-2 border-[#d1fae5]">Professional Experience</h2>
    {data.experiences.map(e => (
      <div key={e.id} className="mb-6">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-lg">{e.title}</h3>
          <span className="text-sm font-semibold">{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
        </div>
        <div className="text-[#047857] font-medium mb-2">{e.company}</div>
        <p className="text-sm whitespace-pre-wrap">{e.description}</p>
      </div>
    ))}

    <div className="grid grid-cols-2 gap-8 mt-6">
      <div>
        <h2 className="text-xl font-bold text-[#065f46] mb-4 border-b-2 border-[#d1fae5]">Education</h2>
        {data.education.map(e => (
          <div key={e.id} className="mb-4">
            <h3 className="font-bold">{e.degree}</h3>
            <p className="text-sm">{e.school}</p>
            <p className="text-xs text-[#64748b]">{e.startYear} - {e.endYear}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#065f46] mb-4 border-b-2 border-[#d1fae5]">Core Competencies</h2>
        <ul className="list-disc pl-5 text-sm grid grid-cols-2 gap-x-4">
          {data.skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

export const CreativeTemplate = ({ data }: { data: ResumeData }) => (
  <div className="flex h-auto bg-[#fff1f2] text-[#1e293b] font-sans">
    <div className="w-1/3 bg-[#f43f5e] text-[#ffffff] p-8">
      <h1 className="text-4xl font-black mb-6">{data.personalInfo.fullName || 'Name'}</h1>
      <div className="space-y-2 mb-8 text-sm opacity-90">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
      <h2 className="text-xl font-bold border-b border-[#fda4af] pb-2 mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s, i) => <span key={i} className="bg-[#e11d48] px-2 py-1 text-xs rounded">{s}</span>)}
      </div>
      <h2 className="text-xl font-bold border-b border-[#fda4af] pb-2 mt-8 mb-4">Education</h2>
      {data.education.map(e => (
        <div key={e.id} className="mb-4 text-sm">
          <p className="font-bold">{e.degree}</p>
          <p className="opacity-90">{e.school}</p>
          <p className="opacity-75 text-xs">{e.startYear} - {e.endYear}</p>
        </div>
      ))}
    </div>
    <div className="w-2/3 p-8 bg-[#ffffff]">
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#f43f5e] mb-2">Profile</h2>
          <p className="text-sm">{data.personalInfo.summary}</p>
        </div>
      )}
      <h2 className="text-2xl font-bold text-[#f43f5e] mb-4">Experience</h2>
      <div className="space-y-6">
        {data.experiences.map(e => (
          <div key={e.id} className="relative pl-4 border-l-2 border-[#fecdd3]">
            <div className="absolute w-3 h-3 bg-[#f43f5e] rounded-full -left-[7px] top-1"></div>
            <h3 className="font-bold text-lg">{e.title}</h3>
            <p className="text-sm text-[#e11d48] font-medium">{e.company} | {e.startDate} - {e.current ? 'Present' : e.endDate}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SimpleTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-serif text-[#000000]">
    <div className="text-center mb-6 border-b-2 border-[#000000] pb-4">
      <h1 className="text-3xl font-bold mb-2 uppercase">{data.personalInfo.fullName || 'Full Name'}</h1>
      <p className="text-sm">{[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}</p>
    </div>
    {data.personalInfo.summary && <p className="text-sm mb-6">{data.personalInfo.summary}</p>}
    
    <h2 className="text-lg font-bold border-b border-[#000000] uppercase mb-3">Work Experience</h2>
    {data.experiences.map(e => (
      <div key={e.id} className="mb-4">
        <div className="flex justify-between">
          <span className="font-bold">{e.title}, {e.company}</span>
          <span className="text-sm">{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
        </div>
        <p className="text-sm mt-1 whitespace-pre-wrap">{e.description}</p>
      </div>
    ))}

    <h2 className="text-lg font-bold border-b border-[#000000] uppercase mb-3 mt-6">Education</h2>
    {data.education.map(e => (
      <div key={e.id} className="mb-2 flex justify-between">
        <span><span className="font-bold">{e.degree}</span>, {e.school}</span>
        <span className="text-sm">{e.startYear} - {e.endYear}</span>
      </div>
    ))}

    <h2 className="text-lg font-bold border-b border-[#000000] uppercase mb-3 mt-6">Skills</h2>
    <p className="text-sm">{data.skills.join(', ')}</p>
  </div>
);

export const ATSOptimizedTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-sans text-[#000000]">
    <h1 className="text-2xl font-bold uppercase">{data.personalInfo.fullName || 'NAME'}</h1>
    <p className="text-sm mb-4">{data.personalInfo.email} - {data.personalInfo.phone} - {data.personalInfo.location}</p>
    
    <h2 className="text-sm font-bold uppercase border-b border-[#000000] mb-2">Summary</h2>
    <p className="text-sm mb-4 whitespace-pre-wrap">{data.personalInfo.summary}</p>
    
    <h2 className="text-sm font-bold uppercase border-b border-[#000000] mb-2">Experience</h2>
    {data.experiences.map(e => (
      <div key={e.id} className="mb-4">
        <p className="text-sm font-bold">{e.title} - {e.company}</p>
        <p className="text-sm">{e.startDate} to {e.current ? 'Present' : e.endDate}</p>
        <p className="text-sm whitespace-pre-wrap mt-1">{e.description}</p>
      </div>
    ))}

    <h2 className="text-sm font-bold uppercase border-b border-[#000000] mb-2">Education</h2>
    {data.education.map(e => (
      <div key={e.id} className="mb-2">
        <p className="text-sm font-bold">{e.degree}</p>
        <p className="text-sm">{e.school} ({e.startYear} - {e.endYear})</p>
      </div>
    ))}

    <h2 className="text-sm font-bold uppercase border-b border-[#000000] mb-2">Skills</h2>
    <p className="text-sm">{data.skills.join(', ')}</p>
  </div>
);

export const TimelineTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 bg-[#f8fafc] font-sans text-[#1e293b]">
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-[#7e22ce]">{data.personalInfo.fullName || 'Name'}</h1>
      <div className="flex gap-4 text-sm text-[#64748b] mt-2">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
      <p className="mt-4 text-sm">{data.personalInfo.summary}</p>
    </div>
    
    <div className="flex gap-8">
      <div className="w-2/3 border-l-2 border-[#e9d5ff] pl-6 space-y-6">
        <h2 className="text-xl font-bold text-[#7e22ce] -ml-10 bg-[#f8fafc] py-1">Experience</h2>
        {data.experiences.map(e => (
          <div key={e.id} className="relative">
            <div className="absolute w-4 h-4 bg-[#a855f7] rounded-full -left-[33px] top-1 border-4 border-[#f8fafc]"></div>
            <h3 className="font-bold text-lg">{e.title}</h3>
            <p className="text-sm text-[#9333ea]">{e.company} | {e.startDate} - {e.current ? 'Present' : e.endDate}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap">{e.description}</p>
          </div>
        ))}
      </div>
      <div className="w-1/3 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#7e22ce] mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-[#ffffff] border border-[#f3e8ff] text-[#7e22ce] rounded-full text-xs">{s}</span>)}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#7e22ce] mb-4">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-3 bg-[#ffffff] p-3 rounded-xl border border-[#faf5ff]">
              <h3 className="font-bold text-sm">{e.degree}</h3>
              <p className="text-xs text-[#64748b]">{e.school}</p>
              <p className="text-xs text-[#94a3b8]">{e.startYear} - {e.endYear}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SkillsBasedTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-sans">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-black text-[#0f172a]">{data.personalInfo.fullName}</h1>
      <p className="text-[#ea580c] font-bold mt-2">{data.personalInfo.email} • {data.personalInfo.phone}</p>
      <p className="text-sm mt-4 max-w-2xl mx-auto">{data.personalInfo.summary}</p>
    </div>
    
    <h2 className="text-2xl font-bold text-center mb-6">Core Competencies</h2>
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {data.skills.map((s, i) => <span key={i} className="bg-[#ffedd5] text-[#9a3412] px-4 py-2 rounded-lg font-bold text-sm">{s}</span>)}
    </div>

    <div className="grid grid-cols-2 gap-10">
      <div>
        <h2 className="text-xl font-bold border-b-2 border-[#f1f5f9] pb-2 mb-4">Experience Highlights</h2>
        {data.experiences.map(e => (
          <div key={e.id} className="mb-4">
            <h3 className="font-bold">{e.title} <span className="text-[#94a3b8] font-normal">at {e.company}</span></h3>
            <p className="text-xs text-[#64748b] mb-1">{e.startDate} - {e.endDate || 'Present'}</p>
            <p className="text-sm">{e.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold border-b-2 border-[#f1f5f9] pb-2 mb-4">Projects & Education</h2>
        {data.projects.map(p => (
          <div key={p.id} className="mb-4">
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-sm">{p.description}</p>
          </div>
        ))}
        {data.education.map(e => (
          <div key={e.id} className="mt-4 pt-4 border-t border-[#f1f5f9]">
            <h3 className="font-bold">{e.degree}</h3>
            <p className="text-sm text-[#475569]">{e.school}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TechTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-mono bg-[#0f172a] text-[#cbd5e1] h-auto">
    <header className="mb-8 border-b border-[#14b8a6] pb-4">
      <h1 className="text-4xl text-[#2dd4bf] font-bold">&gt; {data.personalInfo.fullName}_</h1>
      <div className="flex gap-4 mt-2 text-sm">
        <span>email: "{data.personalInfo.email}"</span>
        <span>tel: "{data.personalInfo.phone}"</span>
      </div>
    </header>
    
    <div className="mb-6">
      <h2 className="text-[#14b8a6] text-xl mb-2"># summary</h2>
      <p className="text-sm">{data.personalInfo.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-[#14b8a6] text-xl mb-2"># skills</h2>
      <p className="text-sm text-[#fde047]">[{data.skills.map(s => `"${s}"`).join(', ')}]</p>
    </div>

    <div className="mb-6">
      <h2 className="text-[#14b8a6] text-xl mb-2"># experience</h2>
      {data.experiences.map(e => (
        <div key={e.id} className="mb-4 pl-4 border-l border-[#334155]">
          <h3 className="text-[#ffffff] font-bold">{e.title} @ {e.company}</h3>
          <p className="text-xs text-[#64748b]">{e.startDate} - {e.current ? 'Present' : e.endDate}</p>
          <p className="text-sm mt-1 whitespace-pre-wrap">{e.description}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-[#14b8a6] text-xl mb-2"># education</h2>
      {data.education.map(e => (
        <div key={e.id} className="mb-2">
          <span className="text-[#ffffff]">{e.degree}</span> from {e.school} <span className="text-[#64748b]">({e.startYear}-{e.endYear})</span>
        </div>
      ))}
    </div>
  </div>
);

export const StartupTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-sans text-[#1e293b]">
    <div className="flex items-center justify-between border-b-4 border-[#facc15] pb-6 mb-8">
      <div>
        <h1 className="text-5xl font-black tracking-tighter">{data.personalInfo.fullName}</h1>
        <p className="text-lg text-[#64748b] mt-1">{data.personalInfo.location}</p>
      </div>
      <div className="text-right text-sm font-bold bg-[#fefce8] p-4 rounded-xl">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4 space-y-8">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-[#94a3b8] mb-3">About</h2>
          <p className="text-sm leading-relaxed">{data.personalInfo.summary}</p>
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-[#94a3b8] mb-3">Skills</h2>
          <div className="flex flex-col gap-2 text-sm font-bold">
            {data.skills.map((s, i) => <div key={i} className="bg-[#f1f5f9] py-1 px-3 rounded">{s}</div>)}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-[#94a3b8] mb-3">Edu</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-2 text-sm">
              <p className="font-bold">{e.degree}</p>
              <p className="text-[#64748b]">{e.school}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 space-y-6">
        <h2 className="text-lg font-black uppercase tracking-widest text-[#94a3b8] mb-3">Experience</h2>
        {data.experiences.map(e => (
          <div key={e.id} className="p-6 bg-[#ffffff] border border-[#e2e8f0] rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-black text-xl">{e.title}</h3>
                <p className="text-[#ca8a04] font-bold">{e.company}</p>
              </div>
              <span className="text-xs font-bold text-[#94a3b8] bg-[#f1f5f9] px-2 py-1 rounded">{e.startDate} - {e.current ? 'Now' : e.endDate}</span>
            </div>
            <p className="text-sm mt-3 whitespace-pre-wrap text-[#475569]">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ElegantTemplate = ({ data }: { data: ResumeData }) => (
  <div className="flex h-auto font-serif bg-[#fdf4ff]">
    <div className="w-1/3 p-10 bg-[#ffffff] border-r border-[#fae8ff]">
      <div className="w-24 h-24 bg-[#fae8ff] rounded-full mb-6 mx-auto flex items-center justify-center text-3xl text-[#a21caf] font-bold italic">
        {data.personalInfo.fullName?.charAt(0) || 'R'}
      </div>
      <h2 className="text-center font-bold text-xl text-[#1e293b] mb-6">{data.personalInfo.fullName}</h2>
      <div className="space-y-4 text-sm text-center text-[#475569] mb-10">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
      <h3 className="font-bold text-[#86198f] mb-3 text-center uppercase tracking-widest text-xs">Expertise</h3>
      <div className="space-y-2 text-center text-sm text-[#334155]">
        {data.skills.map((s, i) => <p key={i}>{s}</p>)}
      </div>
    </div>
    <div className="w-2/3 p-10 text-[#1e293b]">
      {data.personalInfo.summary && (
        <div className="mb-10">
          <h3 className="font-bold text-[#86198f] mb-3 uppercase tracking-widest text-xs">Profile</h3>
          <p className="text-sm leading-relaxed italic">{data.personalInfo.summary}</p>
        </div>
      )}
      <div className="mb-10">
        <h3 className="font-bold text-[#86198f] mb-6 uppercase tracking-widest text-xs">Professional Experience</h3>
        {data.experiences.map(e => (
          <div key={e.id} className="mb-6">
            <h4 className="font-bold text-lg">{e.title}</h4>
            <div className="flex justify-between text-sm italic text-[#c026d3] mb-2">
              <span>{e.company}</span>
              <span>{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{e.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-bold text-[#86198f] mb-4 uppercase tracking-widest text-xs">Education</h3>
        {data.education.map(e => (
          <div key={e.id} className="mb-4">
            <h4 className="font-bold">{e.degree}</h4>
            <p className="text-sm text-[#475569]">{e.school} <span className="italic text-xs">({e.startYear}-{e.endYear})</span></p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BoldHeaderTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans">
    <div className="bg-[#dc2626] text-[#ffffff] p-12 text-center">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
      <p className="text-[#fecaca] text-sm">{data.personalInfo.location} • {data.personalInfo.phone} • {data.personalInfo.email}</p>
      {data.personalInfo.summary && <p className="mt-6 max-w-2xl mx-auto font-medium">{data.personalInfo.summary}</p>}
    </div>
    <div className="p-12 text-[#1e293b]">
      <h2 className="text-2xl font-black text-[#dc2626] mb-6 uppercase border-b-4 border-[#f1f5f9] pb-2">Experience</h2>
      <div className="grid grid-cols-1 gap-8">
        {data.experiences.map(e => (
          <div key={e.id}>
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-bold">{e.title}</h3>
              <span className="bg-[#f1f5f9] text-[#475569] px-2 py-1 text-xs font-bold rounded">{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
            </div>
            <p className="text-[#dc2626] font-bold mb-2">{e.company}</p>
            <p className="text-sm whitespace-pre-wrap">{e.description}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-12 mt-10 border-t-4 border-[#f1f5f9] pt-8">
        <div>
          <h2 className="text-2xl font-black text-[#dc2626] mb-6 uppercase">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-4">
              <h3 className="font-bold text-lg">{e.degree}</h3>
              <p className="text-[#475569]">{e.school}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#dc2626] mb-6 uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => <span key={i} className="border border-[#fecaca] text-[#b91c1c] px-3 py-1 rounded-full text-sm font-bold">{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CompactTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-6 font-sans text-xs leading-tight text-[#0f172a]">
    <div className="flex justify-between items-end border-b-2 border-[#65a30d] pb-2 mb-4">
      <h1 className="text-2xl font-bold">{data.personalInfo.fullName}</h1>
      <div className="text-right">
        <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
    </div>
    {data.personalInfo.summary && <p className="mb-4 text-justify">{data.personalInfo.summary}</p>}
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div>
          <h2 className="font-bold text-[#4d7c0f] uppercase mb-2 border-b border-[#e2e8f0]">Experience</h2>
          {data.experiences.map(e => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{e.title}, {e.company}</span>
                <span>{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
              </div>
              <p className="whitespace-pre-wrap mt-1">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="font-bold text-[#4d7c0f] uppercase mb-2 border-b border-[#e2e8f0]">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-2">
              <p className="font-bold">{e.degree}</p>
              <p>{e.school} ({e.endYear})</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-bold text-[#4d7c0f] uppercase mb-2 border-b border-[#e2e8f0]">Skills</h2>
          <p>{data.skills.join(', ')}</p>
        </div>
        <div>
          <h2 className="font-bold text-[#4d7c0f] uppercase mb-2 border-b border-[#e2e8f0]">Projects</h2>
          {data.projects.map(p => (
            <div key={p.id} className="mb-2">
              <p className="font-bold">{p.name}</p>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PhotoTemplate = ({ data }: { data: ResumeData }) => (
  <div className="p-10 font-sans text-[#1e293b]">
    <div className="flex items-center gap-8 mb-8 bg-[#fdf2f8] p-8 rounded-3xl">
      <div className="w-32 h-32 bg-[#fbcfe8] rounded-full border-4 border-[#ffffff] shadow-lg overflow-hidden flex items-center justify-center">
        <span className="text-4xl text-[#ec4899] font-bold">{data.personalInfo.fullName?.charAt(0)}</span>
      </div>
      <div>
        <h1 className="text-4xl font-black text-[#0f172a] mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-[#db2777] font-bold mb-2">{data.experiences[0]?.title || 'Professional'}</p>
        <p className="text-sm text-[#64748b]">{data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4 flex items-center gap-2"><span className="w-8 h-1 bg-[#ec4899] rounded"></span> Experience</h2>
        <div className="space-y-6">
          {data.experiences.map(e => (
            <div key={e.id}>
              <h3 className="font-bold text-lg">{e.title}</h3>
              <p className="text-sm text-[#db2777] font-bold mb-2">{e.company} | {e.startDate} - {e.current ? 'Present' : e.endDate}</p>
              <p className="text-sm text-[#475569] whitespace-pre-wrap">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-4 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-4 border-b-2 border-[#fce7f3] pb-2">About Me</h2>
          <p className="text-sm text-[#475569]">{data.personalInfo.summary}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-4 border-b-2 border-[#fce7f3] pb-2">Skills</h2>
          <ul className="list-disc pl-4 text-sm text-[#475569] space-y-1">
            {data.skills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-4 border-b-2 border-[#fce7f3] pb-2">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-3">
              <h3 className="font-bold text-sm">{e.degree}</h3>
              <p className="text-xs text-[#64748b]">{e.school}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const HybridTemplate = ({ data }: { data: ResumeData }) => (
  <div className="font-sans bg-[#ffffff] text-[#1e293b]">
    <div className="bg-[#4c1d95] text-[#ffffff] p-10 flex justify-between items-center">
      <div className="w-2/3">
        <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-[#c4b5fd] mb-4 leading-relaxed">{data.personalInfo.summary}</p>
      </div>
      <div className="w-1/3 text-right text-sm space-y-2 border-l border-[#6d28d9] pl-6">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
    </div>
    
    <div className="p-10 flex gap-10">
      <div className="w-1/3 space-y-8">
        <div className="bg-[#f5f3ff] p-6 rounded-2xl">
          <h2 className="font-bold text-[#4c1d95] uppercase tracking-widest text-sm mb-4">Core Skills</h2>
          <div className="flex flex-col gap-2 text-sm">
            {data.skills.map((s, i) => <span key={i} className="bg-[#ffffff] border border-[#ede9fe] px-3 py-2 rounded-lg font-medium">{s}</span>)}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-[#4c1d95] uppercase tracking-widest text-sm mb-4 border-b-2 border-[#ede9fe] pb-2">Education</h2>
          {data.education.map(e => (
            <div key={e.id} className="mb-4">
              <p className="font-bold text-sm">{e.degree}</p>
              <p className="text-xs text-[#64748b]">{e.school}</p>
              <p className="text-xs text-[#7c3aed] font-bold">{e.startYear}-{e.endYear}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-2/3 space-y-8">
        <div>
          <h2 className="font-bold text-[#4c1d95] uppercase tracking-widest text-sm mb-6 border-b-2 border-[#ede9fe] pb-2">Professional Experience</h2>
          <div className="space-y-6">
            {data.experiences.map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{e.title}</h3>
                  <span className="text-xs font-bold text-[#7c3aed] bg-[#f5f3ff] px-2 py-1 rounded">{e.startDate} - {e.current ? 'Present' : e.endDate}</span>
                </div>
                <p className="text-sm font-bold text-[#64748b] mb-2">{e.company}</p>
                <p className="text-sm whitespace-pre-wrap text-[#475569]">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

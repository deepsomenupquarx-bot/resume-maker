import fs from 'fs';

const file = 'src/components/templates/AllTemplates.tsx';
let content = fs.readFileSync(file, 'utf8');

const colors = {
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',
  'indigo-600': '#4f46e5',
  'emerald-800': '#065f46',
  'emerald-700': '#047857',
  'emerald-100': '#d1fae5',
  'rose-50': '#fff1f2',
  'rose-200': '#fecdd3',
  'rose-300': '#fda4af',
  'rose-500': '#f43f5e',
  'rose-600': '#e11d48',
  'purple-50': '#faf5ff',
  'purple-100': '#f3e8ff',
  'purple-200': '#e9d5ff',
  'purple-500': '#a855f7',
  'purple-600': '#9333ea',
  'purple-700': '#7e22ce',
  'orange-100': '#ffedd5',
  'orange-600': '#ea580c',
  'orange-800': '#9a3412',
  'teal-400': '#2dd4bf',
  'teal-500': '#14b8a6',
  'yellow-50': '#fefce8',
  'yellow-300': '#fde047',
  'yellow-400': '#facc15',
  'yellow-600': '#ca8a04',
  'fuchsia-50': '#fdf4ff',
  'fuchsia-100': '#fae8ff',
  'fuchsia-600': '#c026d3',
  'fuchsia-700': '#a21caf',
  'fuchsia-800': '#86198f',
  'red-200': '#fecaca',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'lime-600': '#65a30d',
  'lime-700': '#4d7c0f',
  'pink-50': '#fdf2f8',
  'pink-100': '#fce7f3',
  'pink-200': '#fbcfe8',
  'pink-500': '#ec4899',
  'pink-600': '#db2777',
  'violet-50': '#f5f3ff',
  'violet-100': '#ede9fe',
  'violet-300': '#c4b5fd',
  'violet-600': '#7c3aed',
  'violet-700': '#6d28d9',
  'violet-900': '#4c1d95',
  'black': '#000000',
  'white': '#ffffff'
};

const sortedColors = Object.entries(colors).sort((a, b) => b[0].length - a[0].length);

for (const [name, hex] of sortedColors) {
  const regex = new RegExp(`(text|bg|border)-${name}`, 'g');
  content = content.replace(regex, `$1-[${hex}]`);
}

fs.writeFileSync(file, content);
console.log('Colors replaced successfully!');

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  body {
    @apply bg-[#FAF6EE] text-stone-800 selection:bg-amber-100 selection:text-amber-950 antialiased;
    background-image: 
      radial-gradient(at 0% 0%, rgba(251, 146, 60, 0.12) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(254, 240, 138, 0.14) 0px, transparent 50%),
      radial-gradient(at 50% 30%, rgba(249, 115, 22, 0.02) 0px, transparent 60%),
      radial-gradient(rgba(139, 92, 26, 0.02) 1px, transparent 0);
    background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px;
    background-attachment: fixed;
  }
}

/* Polished Markdown Styles for decision output */
.markdown-body {
  @apply text-base leading-relaxed text-stone-800 font-sans;
}

.markdown-body h1 { 
  @apply text-3xl font-extrabold tracking-tight mb-6 mt-8 text-stone-900 border-b border-stone-200/70 pb-2 font-sans; 
}
.markdown-body h2 { 
  @apply text-xl font-bold tracking-tight mb-4 mt-6 text-stone-900 flex items-center gap-2; 
}
.markdown-body h3 { 
  @apply text-sm font-bold tracking-wide mb-2 mt-4 text-amber-800 uppercase; 
}
.markdown-body ul { 
  @apply list-none pl-0 mb-6 space-y-2; 
}
.markdown-body ul li {
  @apply relative pl-6 py-0.5 transition-colors duration-150 text-stone-700;
}
.markdown-body ul li::before {
  content: "•";
  @apply absolute left-1 text-amber-600 font-bold text-lg leading-none top-[4px];
}
.markdown-body ol { 
  @apply list-decimal pl-5 mb-6 space-y-2 text-stone-700; 
}
.markdown-body li { 
  @apply text-stone-700; 
}
.markdown-body p { 
  @apply mb-5 text-stone-700 leading-relaxed; 
}
.markdown-body table { 
  @apply w-full border-collapse mb-8 text-sm text-left shadow-xs rounded-xl overflow-hidden border border-stone-200/60; 
}
.markdown-body th { 
  @apply bg-stone-50 text-stone-900 p-3.5 font-bold text-[13px] uppercase tracking-wider border-b border-stone-200; 
}
.markdown-body td { 
  @apply border-b border-stone-100 p-3.5 bg-white/45 text-stone-700 leading-normal; 
}
.markdown-body tr:last-child td {
  @apply border-b-0;
}
.markdown-body blockquote { 
  @apply border-l-4 border-amber-500 bg-amber-50/35 px-5 py-4.5 rounded-r-xl text-stone-800 mb-6 font-sans text-[15px] leading-relaxed shadow-xs; 
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-amber-100 rounded-full hover:bg-amber-200 transition-colors;
}

/* Cozy eye-safe nature dark mode styles (Sage forest dark mode) */
html.dark body {
  @apply bg-[#0C110E] text-[#DFE5E2] selection:bg-emerald-900/60 selection:text-emerald-100;
  background-image: 
    radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(52, 211, 153, 0.04) 0px, transparent 50%),
    radial-gradient(at 50% 30%, rgba(5, 150, 105, 0.02) 0px, transparent 75%),
    radial-gradient(rgba(147, 197, 253, 0.01) 1px, transparent 0);
  background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px;
}

html.dark .markdown-body {
  @apply text-[#D1DDD6];
}
html.dark .markdown-body h1 {
  @apply text-emerald-100 border-b border-stone-800/80;
}
html.dark .markdown-body h2 {
  @apply text-emerald-50;
}
html.dark .markdown-body h3 {
  @apply text-emerald-300;
}
html.dark .markdown-body ol {
  @apply text-stone-300;
}
html.dark .markdown-body li {
  @apply text-[#C4D1C9];
}
html.dark .markdown-body ul li {
  @apply text-[#C4D1C9];
}
html.dark .markdown-body ul li::before {
  @apply text-emerald-400;
}
html.dark .markdown-body p {
  @apply text-stone-300;
}
html.dark .markdown-body table {
  @apply border-stone-800/70;
}
html.dark .markdown-body th {
  @apply bg-[#121A16]/90 text-emerald-300/90 border-b border-[#1A2520];
}
html.dark .markdown-body td {
  @apply border-b border-[#1A2520]/60 bg-[#101614]/80 text-[#C1CDC5];
}
html.dark .markdown-body blockquote {
  @apply border-l-4 border-emerald-500 bg-emerald-950/20 text-[#C1CDC5];
}
html.dark ::-webkit-scrollbar-thumb {
  @apply bg-[#1B2521] hover:bg-[#25352E];
}

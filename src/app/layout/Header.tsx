import { ShieldAlert } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group transition-all">
          <svg className="w-9 h-9 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="headerFolderBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e3a8a" />
              </linearGradient>
              <linearGradient id="headerFolderFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e40af" />
                <stop offset="50%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
              <linearGradient id="headerKeyholeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0f7fa" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="headerArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0ea5e9" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#14b8a6" />
              </linearGradient>
            </defs>
            <path d="M25,28 C25,24.68 27.68,22 31,22 H48 L56,32 H89 C92.31,32 95,34.68 95,38 V82 C95,85.31 92.31,88 89,88 H31 C27.68,88 25,85.31 25,82 Z" fill="url(#headerFolderBackGrad)" />
            <path d="M25,38 C25,34.68 27.68,32 31,32 H89 C92.31,32 95,34.68 95,38 V82 C95,85.31 92.31,88 89,88 H31 C27.68,88 25,85.31 25,82 Z" fill="url(#headerFolderFrontGrad)" />
            <circle cx="60" cy="54" r="8" fill="url(#headerKeyholeGrad)" />
            <path d="M56.5,59.5 L63.5,59.5 L66.5,72 C66.5,73.1 65.6,74 64.5,74 H55.5 C54.4,74 53.5,73.1 53.5,72 Z" fill="url(#headerKeyholeGrad)" />
            <path d="M21,78 C25,93 48,103 70,93 C77,89 84,83 89,75 L80,73 L99,65 L103,85 L94,82 C89,90 82,96 73,100 C48,110 23,99 21,78 Z" fill="url(#headerArrowGrad)" />
          </svg>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Evrak<span className="text-[#06b6d4]">Fix</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Ana Sayfa
          </a>
          <a href="/tools" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Tüm Araçlar
          </a>
          <a href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Hakkında
          </a>
          <a href="mailto:evrakfix@gmail.com?subject=EvrakFix%20Geri%20Bildirim" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Geri Bildirim
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500">
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              %100 Güvenli & Yerel
            </span>
          </div>

          {/* Mobile navigation trigger or simple links */}
          <div className="flex md:hidden items-center gap-3">
            <a href="/tools" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Araçlar
            </a>
            <a href="/about" className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              Hakkında
            </a>
            <a href="mailto:evrakfix@gmail.com?subject=EvrakFix%20Geri%20Bildirim" className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              Geri Bildirim
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

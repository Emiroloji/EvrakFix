import { ShieldAlert, FileCheck } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group transition-all">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/10 group-hover:scale-105 transition-transform duration-200">
            <FileCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Evrak<span className="text-blue-600">Fix</span>
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
          </div>
        </div>
      </div>
    </header>
  );
};

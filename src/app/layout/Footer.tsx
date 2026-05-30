import { Shield, FileCheck } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600/10 text-blue-600">
            <FileCheck className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-800">
            Evrak<span className="text-blue-600">Fix</span>
          </span>
          <span className="text-xs text-slate-400">
            © {currentYear} Tüm hakları saklıdır.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
            <Shield className="h-3.5 w-3.5" />
            <span>Dosyalarınız sunucuya gönderilmez. İşlem tarayıcınızda yapılır.</span>
          </div>
          <a href="#/about" className="hover:text-blue-600 transition-colors">
            Nasıl Çalışır?
          </a>
        </div>
      </div>
    </footer>
  );
};

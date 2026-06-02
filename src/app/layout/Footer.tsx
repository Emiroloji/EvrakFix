import { Shield } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="footerFolderBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e3a8a" />
              </linearGradient>
              <linearGradient id="footerFolderFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e40af" />
                <stop offset="50%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
              <linearGradient id="footerKeyholeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0f7fa" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="footerArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0ea5e9" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#14b8a6" />
              </linearGradient>
            </defs>
            <path d="M25,28 C25,24.68 27.68,22 31,22 H48 L56,32 H89 C92.31,32 95,34.68 95,38 V82 C95,85.31 92.31,88 89,88 H31 C27.68,88 25,85.31 25,82 Z" fill="url(#footerFolderBackGrad)" />
            <path d="M25,38 C25,34.68 27.68,32 31,32 H89 C92.31,32 95,34.68 95,38 V82 C95,85.31 92.31,88 89,88 H31 C27.68,88 25,85.31 25,82 Z" fill="url(#footerFolderFrontGrad)" />
            <circle cx="60" cy="54" r="8" fill="url(#footerKeyholeGrad)" />
            <path d="M56.5,59.5 L63.5,59.5 L66.5,72 C66.5,73.1 65.6,74 64.5,74 H55.5 C54.4,74 53.5,73.1 53.5,72 Z" fill="url(#footerKeyholeGrad)" />
            <path d="M21,78 C25,93 48,103 70,93 C77,89 84,83 89,75 L80,73 L99,65 L103,85 L94,82 C89,90 82,96 73,100 C48,110 23,99 21,78 Z" fill="url(#footerArrowGrad)" />
          </svg>
          <span className="text-sm font-semibold tracking-tight text-slate-800">
            Evrak<span className="text-[#06b6d4]">Fix</span>
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
          <a href="/about" className="hover:text-blue-600 transition-colors">
            Nasıl Çalışır?
          </a>
          <a href="/about#terms" className="hover:text-blue-600 transition-colors">
            Kullanım Şartları
          </a>
          <a href="mailto:evrakfix@gmail.com?subject=EvrakFix%20Geri%20Bildirim" className="hover:text-blue-600 transition-colors">
            Geri Bildirim Gönder
          </a>
        </div>
      </div>
    </footer>
  );
};

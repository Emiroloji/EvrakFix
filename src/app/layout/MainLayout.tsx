import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SecurityModal } from '../../components/ui/SecurityModal';
import { DownloadCloud, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSecurityOpen, setIsSecurityOpen] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = React.useState(true);

  React.useEffect(() => {
    const handleOpenSecurity = () => setIsSecurityOpen(true);
    window.addEventListener('open-security-modal', handleOpenSecurity);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    return () => {
      window.removeEventListener('open-security-modal', handleOpenSecurity);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Header />
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col">
        {children}
      </main>
      <Footer />

      {/* Security Modal Component */}
      <SecurityModal isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />

      {/* Floating PWA Install Banner */}
      {deferredPrompt && showInstallBanner && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-40 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-5 flex flex-col gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-600/20">
                <DownloadCloud className="h-5.5 w-5.5 animate-bounce" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold">EvrakFix'i Uygulama Olarak Kurun</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Dosya sınırlarını aşmadan, internetsiz ve daha hızlı bir deneyim için hemen kurun.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="w-1/2 text-center text-slate-400 hover:text-white text-xs font-bold py-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Daha Sonra
            </button>
            <button
              onClick={handleInstall}
              className="w-1/2 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl shadow-md shadow-blue-600/10 transition-all cursor-pointer"
            >
              Şimdi Kur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

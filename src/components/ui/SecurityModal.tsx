import React from 'react';
import { X, ShieldCheck, Lock, Cpu, WifiOff, Database } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal = ({ isOpen, onClose }: SecurityModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-250 z-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Veri Güvenliği</span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800">Dosyalarınız Nasıl Güvende?</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 text-sm text-slate-600">
          <p className="leading-relaxed text-slate-550 font-normal">
            EvrakFix, geleneksel PDF araçlarının aksine, verilerinizi asla kendi web sunucularına aktarmaz veya depolamaz. Güvenlik felsefemizin temel taşları şunlardır:
          </p>

          <div className="grid grid-cols-1 gap-4.5">
            {/* Rule 1 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/70">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-blue-600 border border-slate-100/70 shadow-sm shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">%100 Cihaz Tabanlı (Client-Side) İşleme</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Dosyalarınız sürükleyip bıraktığınız anda doğrudan bilgisayarınızın veya telefonunuzun kendi işlemci gücüyle (RAM bellek alanı) işlenir. Sunucularımız sadece uygulamanın görsel kodlarını size gönderir.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/70">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-blue-600 border border-slate-100/70 shadow-sm shrink-0">
                <WifiOff className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Çevrimdışı (Offline) Çalışabilirlik</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  PWA (Progressive Web App) altyapımız sayesinde sayfa bir kez yüklendikten sonra internet bağlantınızı tamamen kesseniz bile tüm araçları uçak modunda dahi kesintisiz kullanabilirsiniz.
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/70">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-blue-600 border border-slate-100/70 shadow-sm shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Veri Kayıt ve İzleme Yoktur</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Sistemimizde bir veri tabanı, bulut depolama veya üyelik sistemi yoktur. Dilekçe oluştururken doldurduğunuz T.C. Kimlik, İsim, Adres gibi kişisel verileriniz tarayıcınız kapandığı anda yok olur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50 pt-5 shrink-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <Lock className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Gizliliğiniz Cihazınızda Garantidedir</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/10 hover:shadow-lg transition-all cursor-pointer text-center"
          >
            Anladım, Teşekkürler
          </button>
        </div>
      </div>
    </div>
  );
};

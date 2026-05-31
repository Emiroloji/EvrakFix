import { Button } from '../components/ui/Button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { navigateTo } from '../lib/utils/navigation';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 px-4 max-w-md mx-auto">
      <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 mb-6 border border-blue-100 shadow-sm animate-bounce">
        <FileQuestion className="h-12 w-12 stroke-[1.5]" />
      </div>
      
      <span className="text-sm font-extrabold text-blue-600 tracking-wider uppercase mb-2">404 - Sayfa Bulunamadı</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
        Aradığınız Yol Kaybolmuş
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        Ulaşmaya çalıştığınız araç veya sayfa mevcut değil ya da adresi değişmiş olabilir. Lütfen ana sayfaya dönerek araç listemizi kontrol edin.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Geri Dön
        </Button>
        <Button
          variant="primary"
          onClick={() => navigateTo('/')}
          leftIcon={<Home className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Ana Sayfaya Git
        </Button>
      </div>
    </div>
  );
};

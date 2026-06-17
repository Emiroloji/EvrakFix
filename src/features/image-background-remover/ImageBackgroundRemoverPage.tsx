import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Shield, Scissors, RefreshCw, Download, Sliders, AlertCircle } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { removeBackground, type BackgroundRemoverOptions } from './imageBackgroundRemover.service';
import { openSecurityModal } from '../../lib/utils/security';

export const ImageBackgroundRemoverPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = React.useState(false);

  // Settings
  const [tolerance, setTolerance] = React.useState<number>(15);
  const [boostContrast, setBoostContrast] = React.useState<boolean>(true);

  // Canvases
  const srcCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const tgtCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Load file and draw to source canvas
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type.startsWith('image/')) {
      setFile(selected);
      setError(null);
      setHasProcessed(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = srcCanvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              // Trigger background removal immediately with current settings
              processImage();
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(selected);
    } else {
      setError('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WebP).');
    }
  };

  const processImage = () => {
    const src = srcCanvasRef.current;
    const tgt = tgtCanvasRef.current;
    if (!src || !tgt) return;

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const options: BackgroundRemoverOptions = {
          tolerance,
          boostContrast
        };
        removeBackground(src, tgt, options);
        setHasProcessed(true);
        setError(null);
      } catch (err: any) {
        console.error('Background removal error:', err);
        setError('Arka plan temizlenirken bir hata oluştu.');
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  };

  // Re-run image processing when settings change
  React.useEffect(() => {
    if (file) {
      processImage();
    }
  }, [tolerance, boostContrast]);

  const handleDownload = () => {
    const tgt = tgtCanvasRef.current;
    if (!tgt || !file) return;

    const url = tgt.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${nameWithoutExt}_transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClear = () => {
    setFile(null);
    setHasProcessed(false);
    setError(null);
  };

  const steps = [
    {
      title: 'İmza veya Kaşe Görseli Yükleyin',
      description: 'Arka planını silmek istediğiniz el yazısı imza fotoğrafını, dijital kaşeyi veya şirket logosunu yükleyin.'
    },
    {
      title: 'Tolerans ve Kontrastı Ayarlayın',
      description: 'Tolerans çubuğuyla beyaz rengin silinme genişliğini belirleyin. Kontrast artırma ile yazı ve mürekkep rengini koyulaştırın.'
    },
    {
      title: 'Şeffaf PNG Olarak İndirin',
      description: 'Arka planı tamamen temizlenen şeffaf (transparent) imzanızı PNG olarak anında cihazınıza kaydedin.'
    }
  ];

  const faqs = [
    {
      question: 'Arka plan temizleme aracı nasıl çalışıyor?',
      answer: 'Araç, resimdeki tüm piksellerin renk tonlarını analiz eder. Saf beyaz ve beyaza yakın ( Euclidean distance formülü ile hesaplanan tolerans sınırı içindeki) piksellerin alfa (şeffaflık) değerlerini sıfırlayarak şeffaf PNG çıktısı üretir.'
    },
    {
      question: 'İmzam veya şirket logom güvende mi?',
      answer: 'Tamamen güvende. Görüntü pikselleri 100% cihazınızdaki web tarayıcısında işlenir. İnternete gönderilmez, bir sunucuda depolanmaz veya kaydedilmez. İnternet bağlantınızı kesip de kullanabilirsiniz.'
    },
    {
      question: 'Kontrastı Artır seçeneği ne işe yarar?',
      answer: 'Özellikle telefon kamerasıyla çekilen imza fotoğraflarında kağıdın gölgesinden dolayı mürekkep soluk görünebilir. Bu seçenek, koyu renkleri (mürekkep) daha net siyah yapıp beyazı şeffaflaştırarak imzanın resmi belgelere eklendiğinde canlı durmasını sağlar.'
    },
    {
      question: 'Hangi resim formatlarını yükleyebilirim?',
      answer: 'PNG, JPG, JPEG, WebP ve BMP gibi yaygın tüm görsel formatlarını yükleyebilirsiniz. Çıktı şeffaflığı desteklemek için her zaman PNG formatında kaydedilir.'
    }
  ];

  const seoDescription = `Fotoğraflarınızdaki, imzalarınızdaki ve kurumsal logolarınızdaki beyaz veya gri arka planları tarayıcı düzeyinde silerek şeffaf PNG döküman görselleri elde edin. Cihaz tabanlı, hızlı ve ücretsiz arka plan temizleyici.`;

  const exampleUsage = `Beyaz bir kağıda mavi kalemle imza attınız ve telefonunuzla fotoğrafını çektiniz. Fotoğrafta kağıt hafif gri veya gölgeli çıktı. Bu araca fotoğrafı yükleyip toleransı hafifçe artırdığınızda, kağıt tamamen temizlenir ve geriye sadece temiz mavi mürekkep çizgileri kalır. Bu şeffaf imza PNG'sini EvrakFix İmza Ekle aracıyla dilediğiniz PDF belgenize yerleştirebilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Resim Arka Planı Temizleyici</span>
        </h1>
        <p className="text-slate-500 text-sm">
          İmza, kaşe veya logo görsellerinizdeki beyaz arka planı kaldırıp şeffaf PNG'ye dönüştürün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Resim işleme tamamen cihazınızda yapılır. Görselleriniz hiçbir sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {error && (
        <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
          {error}
        </Alert>
      )}

      {/* Hidden source canvas for pixel parsing */}
      <canvas ref={srcCanvasRef} className="hidden" style={{ display: 'none' }} />

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Upload & Settings */}
        <Card className="p-6 md:p-8 lg:col-span-6 flex flex-col gap-6">
          {!file ? (
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              multiple={false}
              title="İmza veya logo görselini buraya sürükleyin"
              description="İşlem yerel olarak tarayıcınızda yapılır, sunucuya yüklenmez."
            />
          ) : (
            <div className="flex flex-col gap-5">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-sm truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {((file.size || 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                >
                  Kaldır
                </button>
              </div>

              {/* Adjustments */}
              <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-blue-600" />
                  <span>Temizleme Ayarları</span>
                </span>

                {/* Tolerance slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-650">
                    <span>Hassasiyet (Beyaz Toleransı)</span>
                    <span className="text-blue-600">%{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value) || 15)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-[10px] text-slate-400">
                    * Tolerans arttıkça beyaza yakın olan koyu gri gölgeler de silinir. Çok artarsa imza çizgileri de şeffaflaşabilir.
                  </span>
                </div>

                {/* Contrast check */}
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer pt-2 border-t border-slate-200/50">
                  <input
                    type="checkbox"
                    checked={boostContrast}
                    onChange={(e) => setBoostContrast(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>İmza Kontrastını Güçlendir (Mürekkebi keskinleştirir)</span>
                </label>
              </div>
            </div>
          )}
        </Card>

        {/* Right pane: Transparent PNG Preview & Download */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {file && (
            <Card className="p-6 md:p-8 flex flex-col gap-5 text-center items-center justify-center min-h-[300px]">
              <span className="text-xs font-bold text-slate-500 self-start">Şeffaf Önizleme (PNG)</span>

              {/* Checkerboard background wrapper for transparency testing */}
              <div 
                className="relative max-w-full max-h-[250px] border border-slate-200 rounded-2xl overflow-auto p-4 flex items-center justify-center"
                style={{
                  backgroundImage: 'radial-gradient(#e2e8f0 20%, transparent 20%), radial-gradient(#e2e8f0 20%, transparent 20%)',
                  backgroundPosition: '0 0, 8px 8px',
                  backgroundSize: '16px 16px',
                  backgroundColor: '#f8fafc'
                }}
              >
                <canvas 
                  ref={tgtCanvasRef} 
                  className={`max-w-full object-contain ${isProcessing ? 'opacity-40' : ''}`}
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              {hasProcessed && !isProcessing && (
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center justify-center gap-2 cursor-pointer w-full py-2.5 shadow-md shadow-emerald-500/10"
                >
                  <Download className="h-4 w-4" />
                  Şeffaf PNG Olarak İndir
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      <ToolSEOInfo
        toolName="Resim Arka Planı Temizleyici"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

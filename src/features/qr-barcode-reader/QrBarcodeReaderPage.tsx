import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Shield, Scan, Camera, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import jsQR from 'jsqr';
import { openSecurityModal } from '../../lib/utils/security';

// BarcodeDetector typescript declaration fallback
declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

export const QrBarcodeReaderPage = () => {
  const [decodedResult, setDecodedResult] = React.useState<{ format: string; rawValue: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  // Camera scanning states
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animationFrameId = React.useRef<number | null>(null);

  // File selected handler
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type.startsWith('image/')) {
      setError(null);
      setDecodedResult(null);
      stopCamera();
      
      const img = new Image();
      img.src = URL.createObjectURL(selected);
      img.onload = () => {
        scanImageElement(img);
        URL.revokeObjectURL(img.src);
      };
    } else {
      setError('Lütfen geçerli bir görsel dosyası yükleyin (PNG, JPG, WebP).');
    }
  };

  // Decode QR/Barcode from static image element
  const scanImageElement = async (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Görsel işlenirken teknik bir hata oluştu.');
      return;
    }

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 1. Try QR code first via jsQR
    const qrResult = jsQR(imgData.data, imgData.width, imgData.height);
    if (qrResult) {
      setDecodedResult({ format: 'QR Kod', rawValue: qrResult.data });
      return;
    }

    // 2. Try BarcodeDetector if supported in browser
    if (window.BarcodeDetector) {
      try {
        const formats = ['ean_13', 'code_128', 'qr_code', 'upc_a', 'code_39'];
        const detector = new window.BarcodeDetector({ formats });
        const barcodes = await detector.detect(canvas);
        if (barcodes && barcodes.length > 0) {
          const matchedFormat = barcodes[0].format.toUpperCase().replace('_', '-');
          setDecodedResult({ format: `${matchedFormat} Barkod`, rawValue: barcodes[0].rawValue });
          return;
        }
      } catch (err) {
        console.error('BarcodeDetector error:', err);
      }
    }

    setError('Görselde okunabilir bir QR Kod veya standart barkod bulunamadı.');
  };

  // Live Camera Scan Loop
  const startCamera = async () => {
    setError(null);
    setDecodedResult(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        animationFrameId.current = requestAnimationFrame(scanCameraFrame);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError('Kameranıza erişilemedi. Lütfen kamera izinlerini kontrol edip tekrar deneyin veya resim yükleme seçeneğini kullanın.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Run periodic frame analysis
  const scanCameraFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.paused || video.ended || !isCameraActive) {
      if (isCameraActive) {
        animationFrameId.current = requestAnimationFrame(scanCameraFrame);
      }
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (video.videoWidth > 0) {
      canvas.width = 480;
      canvas.height = (video.videoHeight / video.videoWidth) * 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // jsQR Check
      const qrResult = jsQR(imgData.data, imgData.width, imgData.height);
      if (qrResult) {
        setDecodedResult({ format: 'QR Kod', rawValue: qrResult.data });
        stopCamera();
        return;
      }

      // BarcodeDetector Check
      if (window.BarcodeDetector) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['ean_13', 'code_128', 'qr_code'] });
          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0) {
            const matchedFormat = barcodes[0].format.toUpperCase().replace('_', '-');
            setDecodedResult({ format: `${matchedFormat} Barkod`, rawValue: barcodes[0].rawValue });
            stopCamera();
            return;
          }
        } catch (e) {
          // ignore detector error in loop
        }
      }
    }

    // Loop
    animationFrameId.current = requestAnimationFrame(scanCameraFrame);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCopy = () => {
    if (!decodedResult) return;
    navigator.clipboard.writeText(decodedResult.rawValue);
    alert('İçerik kopyalandı.');
  };

  const handleClear = () => {
    setDecodedResult(null);
    setError(null);
    stopCamera();
  };

  const isUrl = (str: string) => {
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const steps = [
    {
      title: 'Kamera veya Görsel Seçin',
      description: 'Kamerayı Başlat seçeneğiyle live tarama yapın veya galeri/cihazdan barkod görselinizi seçin.'
    },
    {
      title: 'Okuma İşlemini Bekleyin',
      description: 'Koda odaklandığınızda sistem görüntüyü tarayıcınızda otomatik analiz eder ve deşifre eder.'
    },
    {
      title: 'Sonuçları Alın',
      description: 'Kodun türünü, içeriğini görebilir; kopyalayabilir veya bağlantı ise tek tıkla açabilirsiniz.'
    }
  ];

  const faqs = [
    {
      question: 'QR Kod & Barkod Okuyucu güvenli mi?',
      answer: 'Tamamen güvenlidir. Kamera görüntüsü veya yüklediğiniz görsel hiçbir sunucuya yüklenmez. Deşifre algoritmaları 100% yerel olarak tarayıcınızda çalışır, kişisel gizliliğinizi korur.'
    },
    {
      question: 'Hangi barkod formatları destekleniyor?',
      answer: 'Tüm QR kodları (jsQR ile) standart olarak çözümlenir. Ek olarak, modern tarayıcı desteği olan cihazlarda perakende barkodları (EAN-13, EAN-8, UPC-A, CODE-128, CODE-39) deşifre edilebilir.'
    },
    {
      question: 'Kamera iznini iptal edersem ne olur?',
      answer: 'Kamera iznini vermediğiniz durumlarda, barkodun fotoğrafını çekerek dosya yükleme (Dropzone) paneline sürükleyip bırakarak da barkod okuma işlemini sorunsuzca gerçekleştirebilirsiniz.'
    },
    {
      question: 'İnternet bağlantım olmadan çalışır mı?',
      answer: 'Evet, EvrakFix tamamen PWA yapısıyla çalıştığı için internet bağlantısı kesikken de cihaz kamerasını kullanarak QR ve barkodları okumaya devam edebilirsiniz.'
    }
  ];

  const seoDescription = `Yüklediğiniz fotoğraflardaki veya cihaz kamerasıyla canlı okuttuğunuz QR kod ve standart perakende barkodlarını tarayıcı düzeyinde çözün. Tamamen yerel, hızlı ve ücretsiz QR okuyucu.`;

  const exampleUsage = `Bir ürünün arkasındaki barkodu veya bir afişteki QR kodu okutmak istiyorsunuz. Akıllı telefonunuzda bu sayfayı açıp 'Kamerayı Başlat' dedikten sonra kamerayı koda yaklaştırdığınızda, sistem anında deşifre edip içeriği kopyalama veya web sitesine doğrudan gitme butonu sunar.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>QR Kod & Barkod Okuyucu</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Fotoğraf yükleyerek veya cihazınızın kamerasını canlı kullanarak QR kodları ve ticari barkodları saniyeler içinde çözün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Kamera görüntüleriniz veya fotoğraflarınız internete gönderilmez. İşlemler cihazınızda çalışır.</span>
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

      {/* Main interface card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Scanner Screen / Dropzone */}
        <Card className="p-6 md:p-8 lg:col-span-7 flex flex-col gap-5">
          {!decodedResult && (
            <div className="flex flex-col gap-4">
              {!isCameraActive ? (
                <>
                  <Dropzone
                    onFilesSelected={handleFilesSelected}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    multiple={false}
                    title="QR veya Barkod görselini buraya sürükleyin"
                    description="Görsel yerel olarak çözümlenir, sunucuya yüklenmez."
                  />
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">— VEYA —</span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 font-bold flex items-center justify-center gap-2 cursor-pointer w-full py-3"
                  >
                    <Camera className="h-5 w-5" />
                    Cihaz Kamerasını Başlat
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Camera view */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-900 shadow-inner flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Target focus box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-blue-400 rounded-2xl animate-pulse flex items-center justify-center bg-blue-500/5">
                        <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Kodu Buraya Odaklayın</span>
                      </div>
                    </div>
                  </div>
                  {/* Hidden processing canvas */}
                  <canvas ref={canvasRef} className="hidden" style={{ display: 'none' }} />
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                    className="border-slate-200 text-slate-600 font-bold cursor-pointer w-full"
                  >
                    Kamerayı Kapat
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Decoded success card */}
          {decodedResult && (
            <div className="flex flex-col gap-5 border-emerald-100 bg-emerald-50/10 p-5 rounded-2xl border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {decodedResult.format} Çözüldü
                </span>
                <button
                  onClick={handleClear}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 underline cursor-pointer"
                >
                  Yeni Tarama Başlat
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 font-bold">Okunan İçerik:</span>
                <span className="font-mono text-sm text-slate-800 break-all select-all font-semibold">
                  {decodedResult.rawValue}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="w-full border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  Kopyala
                </Button>
                
                {isUrl(decodedResult.rawValue) && (
                  <a
                    href={decodedResult.rawValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      className="w-full bg-blue-600 hover:bg-blue-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Bağlantıyı Aç
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Right Side Info Box */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-4 text-slate-800">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scan className="h-5 w-5 text-blue-600" />
              <span>Desteklenen Formatlar</span>
            </h3>
            <ul className="text-xs space-y-2.5 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>QR Kod:</strong> Web sitesi adresleri, rehber kartları, WiFi şifreleri, düz metinler.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>EAN-13 & EAN-8:</strong> Süpermarket ve ticari ürün barkodları.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span><strong>CODE-128 & CODE-39:</strong> Kargo takip barkodları ve resmi belgelerdeki barkodlar.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <ToolSEOInfo
        toolName="QR Kod & Barkod Okuyucu"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

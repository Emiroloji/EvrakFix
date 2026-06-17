import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Shield, ArrowRightLeft, BookOpen, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { splitBookletPdf, type SplitOptions } from './pdfBookletSplitter.service';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfBookletSplitterPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState<{ current: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [outputBlob, setOutputBlob] = React.useState<Blob | null>(null);

  // File selected handler
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(selected);
      setError(null);
      setOutputBlob(null);
      setProgress(null);
    } else {
      setError('Lütfen geçerli bir PDF dosyası yükleyin.');
    }
  };

  const [onlyLandscape, setOnlyLandscape] = React.useState<boolean>(true);

  // Split booklet action
  const handleSplit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(null);
    
    try {
      const options: SplitOptions = {
        onlyLandscape,
        splitDirection: 'vertical'
      };

      const result = await splitBookletPdf(file, options, (current, total) => {
        setProgress({ current, total });
      });

      setOutputBlob(result);
    } catch (err: any) {
      console.error('Booklet splitting error:', err);
      setError(err.message || 'PDF dosyası bölünürken beklenmedik bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${nameWithoutExt}_split.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setOutputBlob(null);
    setProgress(null);
  };

  const steps = [
    {
      title: 'Kitapçık PDF’inizi Yükleyin',
      description: 'İki sayfası yan yana taranmış veya tasarlanmış yatay (landscape) PDF dosyanızı sürükleyip bırakarak yükleyin.'
    },
    {
      title: 'Bölme Ayarlarını Seçin',
      description: 'Sadece yatay sayfaların mı bölüneceğini belirleyin (dikey olanlar olduğu gibi korunur).'
    },
    {
      title: 'Ortadan Bölüp İndirin',
      description: 'Uygula butonuna basarak sayfaları ortadan iki dikey sayfaya ayırın ve yeni PDF\'inizi anında cihazınıza kaydedin.'
    }
  ];

  const faqs = [
    {
      question: 'İkiye katlanmış PDF bölücü nasıl çalışır?',
      answer: 'Araç, yatay tasarlanmış sayfaları tam ortasından dikey bir çizgiyle ikiye keser. Sol yarıyı birinci dikey sayfa, sağ yarıyı ikinci dikey sayfa olarak sırasıyla yeni PDF dökümanına ekler.'
    },
    {
      question: 'Sayfa kalitesi veya yazılar bozulur mu?',
      answer: 'Hayır. EvrakFix, sayfaları resme dönüştürmez (rasterize etmez). pdf-lib kütüphanesini kullanarak orijinal vektör katmanlarını ve yazı fontlarını doğrudan kopyalar. Böylece PDF içerisindeki yazılar seçilebilir ve aratılabilir kalmaya devam eder.'
    },
    {
      question: 'Dikey (portrait) sayfalar da bölünür mü?',
      answer: 'Varsayılan olarak "Yalnızca Yatay Sayfaları Böl" seçeneği aktiftir. Bu sayede belgenizdeki dikey kapaklar veya normal sayfalar bölünmeden korunur, sadece yan yana duran yatay sayfalar bölünür. İsterseniz bu seçeneği kapatabilirsiniz.'
    },
    {
      question: 'Dosyamın boyutu çok büyük, sunucuya yüklenmesi uzun sürer mi?',
      answer: 'Dosyalarınız hiçbir sunucuya yüklenmez. Tüm işlem 100% yerel olarak tarayıcınızda yapıldığı için, internet yükleme/indirme hızından bağımsız olarak saniyeler içinde tamamlanır.'
    }
  ];

  const seoDescription = `İkiye katlanmış kitapçıkları veya yan yana taranmış yatay sayfaları PDF kalitesini ve seçilebilir yazı katmanını bozmadan ortadan iki dikey sayfaya ayırın. Tamamen yerel tarayıcı tabanlı kitapçık ayırıcı.`;

  const exampleUsage = `Bir tarayıcıdan kitapçık modunda yan yana iki sayfa gelecek şekilde A4 yatay taranmış 50 sayfalık bir ders notunuz var. Bu notu tabletinizde veya telefonunuzda rahat okuyabilmek için tek sayfa dikey moda getirmek istiyorsunuz. Dosyanızı bu araca yükleyip "Sayfaları Böl" butonuna bastığınızda, 50 sayfalık yatay belgeniz saniyeler içinde 100 sayfalık tekli dikey PDF haline getirilir ve indirilmeye hazır olur.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>İkiye Katlanmış PDF Sayfalarını Ayırıcı (Booklet Splitter)</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Yan yana duran çift sayfalı yatay PDF dökümanlarını kalitesini bozmadan ortadan iki adet dikey sayfaya bölün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>PDF işlemleri tamamen tarayıcınızda gerçekleştirilir. Belgeniz hiçbir sunucuya gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!file ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Kitapçık PDF dosyasını buraya sürükleyin veya seçin"
            description="Dosya yerel tarayıcınızda işlenecek, sunucuya yüklenmeyecektir."
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {((file.size || 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                Kaldır
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
                {error}
              </Alert>
            )}

            {/* Config panel */}
            {!outputBlob && !isProcessing && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ayarlar</span>
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyLandscape}
                    onChange={(e) => setOnlyLandscape(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Yalnızca Yatay (Landscape) Sayfaları Böl (Önerilen - dikey sayfaları korur)</span>
                </label>
              </div>
            )}

            {/* Progress / Loading */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500 text-sm">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="font-bold">Kitapçık sayfaları bölünüyor...</span>
                {progress && (
                  <span className="text-xs text-slate-400">
                    Sayfa {progress.current} / {progress.total} işleniyor
                  </span>
                )}
              </div>
            )}

            {/* Output & Success */}
            {outputBlob && (
              <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600" />}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <span className="text-sm font-semibold">PDF sayfaları başarıyla ikiye bölündü!</span>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center gap-1.5 cursor-pointer"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                    Bölünmüş PDF'i İndir
                  </Button>
                </div>
              </Alert>
            )}

            {/* Action buttons */}
            {!isProcessing && !outputBlob && (
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <Button
                  variant="outline"
                  className="font-bold border-slate-200 hover:bg-slate-50 cursor-pointer"
                  onClick={handleClear}
                >
                  İptal
                </Button>
                <Button
                  variant="primary"
                  className="font-bold bg-blue-600 hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
                  onClick={handleSplit}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Sayfaları Ortadan Böl
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF Kitapçık Sayfa Ayırıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

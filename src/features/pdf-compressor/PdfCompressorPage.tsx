import * as React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { compressPdf } from './pdfCompressor.service';
import type { CompressionLevel } from './types';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, RefreshCw, AlertCircle, Download, FileDown, Info } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

// Configure the pdfjs-dist worker location globally for this component
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfCompressorPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState({ current: 0, total: 0 });
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadedBlob, setDownloadedBlob] = React.useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = React.useState<number | null>(null);

  // Form states
  const [level, setLevel] = React.useState<CompressionLevel>('medium');

  // File selection handler
  const handleFileSelected = React.useCallback((selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);
    setCompressedSize(null);
    setProgress({ current: 0, total: 0 });

    if (selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const validation = validatePdfFile(selectedFile);

    if (!validation.isValid) {
      setError(validation.error || 'Dosya geçersiz.');
      return;
    }

    setFile(selectedFile);
  }, []);

  // Process PDF Compression Action
  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProgress({ current: 0, total: 0 });

    try {
      const compressedBlob = await compressPdf(file, { level }, (current, total) => {
        setProgress({ current, total });
      });
      
      setDownloadedBlob(compressedBlob);
      setCompressedSize(compressedBlob.size);
      setSuccess(true);
      
      // Auto download
      downloadBlob(compressedBlob, 'evrakfix-sıkıstırılmıs.pdf');
    } catch (err: any) {
      console.error('PDF compression error:', err);
      setError(err.message || 'PDF sıkıştırılırken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download again if auto-download failed or was closed
  const handleDownloadAgain = () => {
    if (!downloadedBlob) return;
    downloadBlob(downloadedBlob, 'evrakfix-sıkıstırılmıs.pdf');
  };

  // Reset workspace
  const handleClear = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);
    setCompressedSize(null);
    setProgress({ current: 0, total: 0 });
    setIsProcessing(false);
  };

  // Calculate compression savings percentage
  const getSavingsPercentage = () => {
    if (!file || !compressedSize) return 0;
    const diff = file.size - compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / file.size) * 100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Sıkıştırıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF dökümanlarınızın boyutunu cihazınızda kalitesini bozmadan güvenle küçültün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosyalarınız tamamen yerel tarayıcınızda işlenir. Sunucularımıza hiçbir veri gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!file ? (
          /* Dropzone */
          <Dropzone
            onFilesSelected={handleFileSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Sıkıştırmak istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Maksimum 50 MB, tüm sıkıştırma işlemleri tamamen tarayıcınızda yerel olarak yapılır."
          />
        ) : (
          /* Editor Panel */
          <div className="flex flex-col gap-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FileDown className="h-6 w-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    Orijinal Boyut: {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Kaldır
              </button>
            </div>

            {/* Warning Info */}
            <Alert variant="info" icon={<Info className="h-5 w-5 text-blue-600" />}>
              <span className="text-xs sm:text-sm">
                <strong>Önemli Bilgilendirme:</strong> Bu araç, PDF sayfalarını tarayıcınızda görsellere dönüştürerek sıkıştırır. Bu işlem dosya boyutunu büyük oranda düşürürken, PDF içindeki metinlerin seçilmesi veya kopyalanması özelliğini devre dışı bırakabilir.
              </span>
            </Alert>

            {/* Error Message */}
            {error && (
              <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
                {error}
              </Alert>
            )}

            {/* Success Panel */}
            {success && downloadedBlob && compressedSize && (
              <Alert variant="success" icon={<Download className="h-5 w-5" />}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-800 text-sm">
                      PDF Başarıyla Sıkıştırıldı!
                    </span>
                    <span className="text-xs text-emerald-650">
                      Sıkıştırılmış Boyut: {formatFileSize(compressedSize)}{' '}
                      {getSavingsPercentage() > 0 && `(🚀 %${getSavingsPercentage()} Tasarruf sağlandı)`}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-600/10 cursor-pointer self-start sm:self-center"
                    onClick={handleDownloadAgain}
                  >
                    Tekrar İndir
                  </Button>
                </div>
              </Alert>
            )}

            {/* Progress Bar */}
            {isProcessing && progress.total > 0 && (
              <div className="flex flex-col gap-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>Sayfalar İşleniyor</span>
                  <span>{progress.current} / {progress.total} Sayfa</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-blue-600 font-medium">
                  Lütfen sekmesini kapatmayın. İşlem cihazınızın performansına bağlı olarak birkaç saniye sürebilir.
                </span>
              </div>
            )}

            {/* Options Panel */}
            <div className="flex flex-col gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/60">
              <label className="text-sm font-bold text-slate-700">Sıkıştırma Seviyesi</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setLevel('low')}
                  disabled={isProcessing}
                  className={`flex flex-col gap-1.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    level === 'low'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-sm">Düşük Sıkıştırma</span>
                  <span className={`text-[11px] ${level === 'low' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Yüksek kaliteyi korur, dosya boyutunu hafifçe küçültür.
                  </span>
                </button>

                <button
                  onClick={() => setLevel('medium')}
                  disabled={isProcessing}
                  className={`flex flex-col gap-1.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    level === 'medium'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-sm">Orta Sıkıştırma</span>
                  <span className={`text-[11px] ${level === 'medium' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Optimum kalite ve boyut dengesi sunar (Önerilen).
                  </span>
                </button>

                <button
                  onClick={() => setLevel('high')}
                  disabled={isProcessing}
                  className={`flex flex-col gap-1.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    level === 'high'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-sm">Yüksek Sıkıştırma</span>
                  <span className={`text-[11px] ${level === 'high' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Maksimum dosya boyutu tasarrufu sağlar, kaliteyi düşürür.
                  </span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5 gap-4">
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isProcessing}
                className="font-bold border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
              >
                Yeni Dosya Yükle
              </Button>
              <Button
                variant="primary"
                onClick={handleCompress}
                disabled={isProcessing}
                className="font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/15 cursor-pointer min-w-44"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sıkıştırılıyor...
                  </span>
                ) : (
                  'PDF\'i Sıkıştır'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="PDF Sıkıştırma"
        description="PDF Sıkıştırıcı (PDF Compressor) aracımız, büyük boyutlu PDF belgelerinizin boyutunu tarayıcınızda yerel (client-side) olarak küçültmenizi sağlar. Belgelerinizin kalitesini ve boyutunu dilediğiniz gibi ayarlayarak paylaşım, e-posta gönderimi veya arşivleme işlemlerinizi kolaylaştırın. Dosyalarınız hiçbir uzak internet sunucusuna gönderilmez, verileriniz tamamen sizin cihazınızda güvende kalır.

■ PDF Sıkıştırma Nedir?
PDF sıkıştırma, PDF belgesi içerisinde yer alan yüksek çözünürlüklü görsellerin kalitesini ve boyutunu optimize ederek PDF dosyasının toplam disk ebatını (KB veya MB cinsinden) küçültme işlemidir. Bu işlem belgelerin internet üzerinden daha hızlı aktarılmasını sağlar.

■ PDF Dosyası Nasıl Sıkıştırılır?
EvrakFix PDF Sıkıştırıcı'ya sıkıştırmak istediğiniz PDF belgesini sürükleyip bırakın. Sıkıştırma kalitesi seviyesini seçin. Ardından 'PDF'i Sıkıştır' butonuna tıklayarak işlemi başlatın. Sıkıştırılmış PDF belgeniz saniyeler içinde otomatik olarak indirilecektir.

■ PDF Sıkıştırma Kalitesi ve Boyut Farkları Nelerdir?
Aracımız üç farklı sıkıştırma seviyesi sunar:
- Düşük Sıkıştırma (Yüksek Kalite): Görsellerin netliğini korur, boyutu makul miktarda düşürür.
- Orta Sıkıştırma (Orta Kalite): En iyi kalite/boyut dengesini sunar (Önerilir).
- Yüksek Sıkıştırma (Düşük Kalite): Görsel kalitesinden ödün vererek maksimum dosya küçültme oranı sağlar.

■ Sıkıştırma İşlemi Sonrasında Metin Seçilebilir mi?
PDF Sıkıştırıcı aracımız, sayfaları yüksek performanslı Canvas motoru üzerinde görsele dönüştürerek sıkıştırma uygular. Bu nedenle, sıkıştırılmış PDF dökümanı içindeki yazıların kopyalanması, seçilmesi veya metin araması yapılması özelliği devre dışı kalabilir. Arama yapılabilir PDF kopyasına ihtiyacınız varsa orijinal dosyayı saklamanızı tavsiye ederiz.

■ PDF Sıkıştırma Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya aktarılmaz, kaydedilmez ve üçüncü taraflarla paylaşılmaz. Tüm süreç doğrudan sizin bilgisayarınızda veya telefonunuzda gerçekleştirilir.

■ Mobil Cihazdan PDF Sıkıştırma Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu tasarımı sayesinde Android veya iPhone/iPad cihazlarınızın tarayıcıları üzerinden ek bir program indirmeden PDF belgelerinizi saniyeler içinde kolayca sıkıştırabilirsiniz.

■ EvrakFix ile PDF Sıkıştırmanın Avantajları
EvrakFix ile üyelik, limit veya hiçbir ücret olmadan tamamen ücretsiz PDF sıkıştırabilirsiniz. İşlemler yerel gerçekleştiği için internet hızınızdan bağımsız olarak anında tamamlanır ve verileriniz hiçbir zaman cihazınızdan dışarı çıkmaz."
        exampleUsage="E-posta ekinde göndermek istediğiniz 15 MB boyutundaki taranmış bir sözleşme PDF dosyasını, kalitesini kaybetmeden Orta Sıkıştırma modu ile 2 MB'ın altına düşürerek kolayca e-postanıza ekleyebilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Sıkıştırmak istediğiniz PDF dosyasını sürükleyip bırakarak veya cihazınızdan seçerek yükleyin."
          },
          {
            title: "Sıkıştırma Seviyesi Seçin",
            description: "İhtiyacınıza en uygun olan Düşük, Orta veya Yüksek sıkıştırma seviyelerinden birini belirleyin."
          },
          {
            title: "Sıkıştırın ve İndirin",
            description: "'PDF'i Sıkıştır' butonuna tıklayarak işlemi başlatın; sıkıştırılmış dökümanınız anında bilgisayarınıza insin."
          }
        ]}
        faqs={[
          {
            question: "PDF dosyam sıkıştırılırken sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir."
          },
          {
            question: "PDF sıkıştırma işlemi sonrasında belgemin kalitesi bozulur mu?",
            description: "Seçtiğiniz sıkıştırma seviyesine göre kalite değişir. 'Düşük Sıkıştırma (Yüksek Kalite)' modu görsellerin netliğini korur. 'Yüksek Sıkıştırma' modu ise boyutu maksimum düzeyde düşürür ancak görsel netliğini azaltabilir."
          },
          {
            question: "PDF sıkıştırıldıktan sonra içindeki yazılar seçilebilir mi?",
            description: "PDF Sıkıştırıcı aracımız, sayfaları görsele dönüştürerek sıkıştırır. Bu sebeple işlem sonrasında PDF içindeki metinlerin seçilmesi veya kopyalanması devre dışı kalabilir."
          },
          {
            question: "Çok büyük boyutlu PDF'leri sıkıştırabilir miyim?",
            description: "Evet. Ancak çok sayfalı ve yüksek boyutlu PDF dökümanlarında sıkıştırma hızı doğrudan cihazınızın donanım performansına (RAM ve işlemci) bağlıdır."
          },
          {
            question: "İşlem sonrasında sıkıştırılmış PDF'i hemen indirebilir miyim?",
            description: "Evet. Sıkıştırma işlemi tamamlandığı anda yeni PDF belgeniz otomatik olarak bilgisayarınıza veya telefonunuza indirilir."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default PdfCompressorPage;

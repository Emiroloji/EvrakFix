import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { convertPdfToGrayscale } from './pdfToGrayscale.service';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { downloadBlob } from '../../lib/files/downloadFile';
import { Shield, AlertCircle, Download, FileText, Printer, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfToGrayscalePage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);

  const [tonerSaver, setTonerSaver] = React.useState(true);
  const [contrastBoost, setContrastBoost] = React.useState(true);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];

    const validation = validatePdfFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || 'Geçersiz PDF dosyası.');
      return;
    }

    setFile(selectedFile);
    setResultBlob(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setResultBlob(null);

    try {
      const blob = await convertPdfToGrayscale(
        file,
        { tonerSaver, contrastBoost },
        (current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      );
      setResultBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'PDF dönüştürülürken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    downloadBlob(resultBlob, `${file.name.split('.')[0]}-siyah-beyaz.pdf`);
  };

  const handleClear = () => {
    setFile(null);
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          PDF Yazıcı Dostu Yapıcı
        </h1>
        <p className="text-slate-500 text-sm">
          Renkli PDF belgelerinizi siyah-beyaza çevirin, gri arka planları temizleyerek yazıcı kartuşundan tasarruf edin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm işlemler tarayıcınızda yerel olarak yapılır. Dosyalarınız hiçbir uzak sunucuya aktarılmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Workspace */}
      <Card className="p-6 md:p-8">
        {!file && !isProcessing ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Siyah-beyaz yapmak istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Dosya tamamen tarayıcınızda işlenir, sunucuya yüklenmez."
          />
        ) : isProcessing ? (
          /* Processing loader */
          <div className="flex flex-col items-center justify-center p-12 gap-4 text-slate-500 text-sm">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-slate-800">PDF Siyah-Beyaz Yapılıyor...</span>
              <span>Sayfa işleniyor: %{progress}</span>
            </div>
            <div className="w-64 bg-slate-150 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Process Workspace */
          <div className="flex flex-col gap-6">
            {/* File header */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file?.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {file && formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                Kaldır
              </button>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              {/* Option 1: Toner Saver */}
              <label className="flex items-start gap-3.5 cursor-pointer group">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={tonerSaver}
                    onChange={(e) => setTonerSaver(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Toner Tasarrufu (Arka Planları Sil)
                  </span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-0.5">
                    Sayfalardaki açık gri arka plan gölgelerini ve renkli zemin boyalarını tamamen beyaza çevirir. Kartuş tüketimini ciddi oranda azaltır.
                  </span>
                </div>
              </label>

              {/* Option 2: Contrast Boost */}
              <label className="flex items-start gap-3.5 cursor-pointer group">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={contrastBoost}
                    onChange={(e) => setContrastBoost(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Yazı Kontrastını Artır
                  </span>
                  <span className="text-[10px] text-slate-400 leading-normal mt-0.5">
                    Renklerin kaybolmasıyla soluklaşabilecek olan gri ve koyu renkli yazıları koyulaştırıp daha net ve okunabilir kılar.
                  </span>
                </div>
              </label>
            </div>

            {/* Trigger actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {!resultBlob ? (
                <Button
                  variant="primary"
                  onClick={handleProcess}
                  className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  PDF'i Yazıcı Dostu Yap (Siyah-Beyaz)
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                    className="w-full sm:flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Siyah-Beyaz PDF'i İndir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="w-full sm:w-auto font-bold border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer h-11 px-6"
                  >
                    Yeni Dosya
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="mt-4">
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          </div>
        )}
      </Card>

      {/* SEO Info */}
      <ToolSEOInfo
        toolName="PDF Yazıcı Dostu Yapıcı"
        description="EvrakFix PDF Yazıcı Dostu Yapıcı (Grayscale & Toner Saver) aracımız, renkli dökümanlarınızı, ders notlarınızı veya kitap taramalarınızı siyah-beyaza çevirmenizi sağlar. Akıllı arka plan temizleme (Toner Saver) teknolojisi sayesinde sayfadaki gereksiz renkli zemin dolgularını ve koyu sayfa gölgelerini tespit ederek beyaza çevirir; yazıcı kartuşundan ve tonerden yüksek oranda tasarruf etmenizi sağlar. Tamamen tarayıcıda çalışan gizlilik odaklı mimarisiyle dökümanlarınız hiçbir şekilde internet sunucularına aktarılmadan tamamen kendi cihazınızda işlenir.

■ PDF Yazıcı Dostu Yapıcı Nedir?
Renkli dökümanların yazıcıdan çıktı alınırken çok fazla kartuş tüketmesini önlemek amacıyla sayfaları gri tonlamaya çeviren ve toner tasarrufu sağlamak için hafif gölgeli kağıt arka planlarını tamamen beyaz yapan akıllı bir dönüşüm aracıdır.

■ PDF Siyah-Beyaz Nasıl Yapılır?
EvrakFix yazıcı dostu sayfasına PDF dosyanızı yükleyin. 'Toner Tasarrufu' ve 'Yazı Kontrastını Artır' seçeneklerini aktif hale getirip 'Yazıcı Dostu Yap' butonuna tıklayın. Sayfalarınız saniyeler içinde analiz edilerek gri tonlara çevrilir ve arka planları temizlenmiş PDF belgesi indirilmeye hazır hale gelir.

■ Toner Tasarrufu Filtresi Ne Avantaj Sağlar?
Birçok taranmış dökümanda sayfaların arkasında gri veya kirli sarı bir renk tonu kalır. Yazıcı bu kısımları da basmaya çalışarak çok fazla mürekkep harcar. Toner Tasarrufu filtresi, bu kirli tonları dijital olarak algılar ve beyaza yuvarlayarak yazıcınızın sadece asıl metin ve çizgileri basmasını sağlar.

■ Dönüşüm İşlemi Güvenli mi?
Evet. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde (RAM) işlenir. Dosyalarınız tamamen güvendedir."
        exampleUsage="Okul sınavları veya resmi başvurular için çıktı almanız gereken renkli bir PDF belgesini, yazıcı kartuşunu idareli kullanmak ve yazıları daha okunabilir kılmak için hızlıca siyah-beyaz ve temiz arka planlı hale getirebilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Siyah-beyaz yapmak veya kartuş tasarrufu uygulamak istediğiniz renkli PDF dosyasını yükleyin."
          },
          {
            title: "Tasarruf Seçeneklerini Ayarlayın",
            description: "Toner Tasarrufu (arka plan silme) ve Yazı Kontrastını Artırma kutucuklarını ihtiyacınıza göre işaretleyin."
          },
          {
            title: "Dönüştürün ve İndirin",
            description: "'Yazıcı Dostu Yap' butonuna basarak işlemi başlatın, tamamlandığında siyah-beyaz PDF'inizi anında indirin."
          }
        ]}
        faqs={[
          {
            question: "Belgelerim ve metinlerim sunucuya gönderiliyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Belgeleriniz hiçbir uzak internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcısında işlenir."
          },
          {
            question: "Renkli PDF’i siyah-beyaza çevirince dosya kalitesi düşer mi?",
            description: "Hayır. Yüksek kaliteli piksel render algoritmalarımız sayesinde orijinal PDF sayfa çözünürlüğü korunur, sadece renk kanalları optimize edilerek gri tonlamaya çevrilir."
          },
          {
            question: "Tasarruflu modda yazılar kaybolur mu?",
            description: "Hayır. 'Yazı Kontrastını Artır' seçeneği aktif olduğunda, renklerin griye dönmesiyle soluklaşabilecek olan açık renkli yazılar koyulaştırılarak okunurluğu artırılır."
          },
          {
            question: "Çok sayfalı büyük kitaplarda işlem süresi ne kadardır?",
            description: "Çözümleme işlemi sayfa sayısına ve sayfa çözünürlüğüne bağlı olarak değişir. İşlemler tarayıcıda yapıldığı için süre doğrudan cihazınızın RAM ve işlemci donanım gücüne bağlıdır."
          },
          {
            question: "Bu hizmet için herhangi bir ücret ödenmesi gerekir mi?",
            description: "Hayır. EvrakFix bünyesindeki tüm araçlar gibi PDF Yazıcı Dostu Yapıcı da tamamen ücretsizdir ve kullanım limiti bulunmamaktadır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default PdfToGrayscalePage;

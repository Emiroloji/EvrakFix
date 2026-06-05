import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Loading } from '../../components/ui/Loading';
import { cleanPdfMetadata } from './pdfMetadataCleaner.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, RefreshCw, AlertCircle, Trash2, Download, EyeOff } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfMetadataCleanerPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadedBlob, setDownloadedBlob] = React.useState<Blob | null>(null);

  // File selection
  const handleFileSelected = React.useCallback((selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);

    if (selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const validation = validatePdfFile(selectedFile);

    if (!validation.isValid) {
      setError(validation.error || 'Dosya geçersiz.');
      return;
    }

    setFile(selectedFile);
  }, []);

  // Clean metadata action
  const handleCleanMetadata = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const cleanedBlob = await cleanPdfMetadata(file);
      setDownloadedBlob(cleanedBlob);
      setSuccess(true);
      // Auto download
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      downloadBlob(cleanedBlob, `evrakfix-metadata-temizlenmis-${originalName}.pdf`);
    } catch (err: any) {
      console.error('Metadata clean error:', err);
      setError(err.message || 'Metadata temizlenirken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download blob again if needed
  const handleDownloadAgain = () => {
    if (!file || !downloadedBlob) return;
    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadBlob(downloadedBlob, `evrakfix-metadata-temizlenmis-${originalName}.pdf`);
  };

  // Reset workspace
  const handleClear = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);
    setIsLoading(false);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Metadata Temizleyici</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF dosyanızdaki başlık, yazar, oluşturucu ve tarih gibi belge bilgilerini cihazınızda güvenle temizleyin.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosyalarınız tamamen tarayıcınızda işlenir. Sunucularımıza hiçbir veri gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Workspace Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loading size="lg" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Dosya analiz ediliyor...</p>
          </div>
        ) : !file ? (
          /* Dropzone */
          <Dropzone
            onFilesSelected={handleFileSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Metadata bilgilerini temizlemek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Tek bir PDF dökümanı yükleyebilirsiniz. Maksimum dosya boyutu limit: 50MB."
          />
        ) : (
          /* Editor Workspace */
          <div className="flex flex-col gap-6">
            {/* Active Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktif Belge</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-800 font-bold break-all">{file.name}</span>
                  <span className="text-xs font-medium text-slate-400 shrink-0">({formatFileSize(file.size)})</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isProcessing}
                className="self-start sm:self-auto h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-semibold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Başka Dosya Seç</span>
              </Button>
            </div>

            {/* Privacy note */}
            <div className="p-4 bg-slate-55/40 border border-slate-100 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <EyeOff className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-800">Gizlilik Bildirimi</span>
                <span className="text-xs text-slate-500 leading-relaxed">
                  Bu işlem PDF belgenizin yazar adı, PDF oluşturucu yazılım bilgisi, oluşturulma/değiştirilme tarihi ve gizli XMP XML meta verilerini tamamen temizler. Belgenizin görsel içeriğinde, sayfalarında veya metinlerinde hiçbir değişiklik yapılmaz.
                </span>
              </div>
            </div>

            {/* Errors */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Success */}
            {success && (
              <Alert variant="success" title="İşlem Başarılı" icon={<FileCheckIcon className="h-4 w-4" />}>
                Belge bilgileri ve tüm metadata başarıyla temizlendi. İndirme işlemi otomatik başlatıldı. Eğer indirme başlamadıysa aşağıdaki butonu kullanabilirsiniz.
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
              {!success ? (
                <Button
                  size="lg"
                  onClick={handleCleanMetadata}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 group transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Metadata Temizleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Metadata Temizle</span>
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleClear}
                    className="h-11 px-5 rounded-xl border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
                  >
                    Yeni PDF Yükle
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleDownloadAgain}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Temizlenmiş PDF'i İndir</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF Metadata Temizleyici"
        description="PDF Metadata Temizleyici aracımız, PDF belgelerinizin arka planında saklanan ve gizliliğinizi riske atabilecek kimlik bilgilerini sıfırlamanızı sağlar. Yüklediğiniz PDF'in içeriğine dokunmadan; yazar ismi, oluşturma tarihi, düzenleme tarihi, kullanılan yazılım lisans bilgileri ve gömülü XML tabanlı XMP meta verileri tarayıcınızda yerel olarak temizlenir. Hiçbir belgeniz sunucularımıza gitmez, gizliliğiniz tamamen güvence altındadır."
        exampleUsage="Devlet kurumuna veya dış müşterinize göndereceğiniz bir PDF dökümanında, hazırlayan kişinin adı, bilgisayar kullanıcı adı veya hazırlama tarihi gibi gizli bilgileri kaldırmak için kullanabilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Metadata bilgilerini silmek istediğiniz PDF belgesini sürükleyip bırakarak veya cihazınızdan seçerek yükleyin."
          },
          {
            title: "Metadata Temizle Butonuna Tıklayın",
            description: "'Metadata Temizle' butonuna basarak dosya bilgilerini, yazar adını, tarihleri ve XMP etiketlerini sıfırlayın."
          },
          {
            title: "Temizlenmiş PDF'i İndirin",
            description: "İşlem bittiğinde temizlenmiş yeni PDF dökümanınızı güvenle bilgisayarınıza veya telefonunuza indirin."
          }
        ]}
        faqs={[
          {
            question: "PDF metadata nedir?",
            description: "PDF metadata; belgenin başlığı, yazarı, konusu, anahtar kelimeleri, oluşturulduğu tarih, son değiştirilme tarihi ve belgeyi oluşturan yazılım gibi arka planda saklanan tanımlayıcı yasal ve teknik bilgilerdir."
          },
          {
            question: "PDF dosyam sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir."
          },
          {
            question: "Hangi metadata bilgileri temizlenir?",
            description: "Belgenizin başlığı (Title), yazarı (Author), konusu (Subject), anahtar kelimeleri (Keywords), oluşturucu yazılımı (Creator/Producer) ile oluşturma ve son düzenleme tarihleri tamamen nötr değerlerle sıfırlanır."
          },
          {
            question: "PDF içeriği silinir mi?",
            description: "Kesinlikle hayır. Bu işlem yalnızca PDF dosyasının arka planında saklanan kimlik ve tarih verilerini temizler. PDF içindeki sayfalar, resimler, metinler veya formlar hiçbir şekilde silinmez ya da bozulmaz."
          },
          {
            question: "Temizlenmiş PDF dosyasını hemen indirebilir miyim?",
            description: "Evet. 'Metadata Temizle' butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar. Çok yüksek sayfalı dökümanlarda işlem süresi cihazınızın donanım performansına bağlı olarak birkaç saniye sürebilir."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

// Internal icon helper
const FileCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

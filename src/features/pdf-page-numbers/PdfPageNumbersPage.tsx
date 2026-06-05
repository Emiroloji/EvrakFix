import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Loading } from '../../components/ui/Loading';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { addPageNumbersToPdf } from './pdfPageNumbers.service';
import type { PageNumberFormat, PageNumberPosition } from './types';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, RefreshCw, AlertCircle, Download, Hash, Sliders } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfPageNumbersPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadedBlob, setDownloadedBlob] = React.useState<Blob | null>(null);

  // Form states
  const [format, setFormat] = React.useState<PageNumberFormat>('number');
  const [position, setPosition] = React.useState<PageNumberPosition>('bottom-center');
  const [fontSize, setFontSize] = React.useState<number>(10);
  const [startFrom, setStartFrom] = React.useState<number>(1);

  // File selection handler
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

  // Process PDF Action
  const handleAddPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const numberedBlob = await addPageNumbersToPdf(file, {
        format,
        position,
        fontSize: Number(fontSize) || 10,
        startFrom: Number(startFrom) || 1
      });
      
      setDownloadedBlob(numberedBlob);
      setSuccess(true);
      
      // Auto download
      downloadBlob(numberedBlob, 'evrakfix-sayfa-numarali.pdf');
    } catch (err: any) {
      console.error('Page numbering error:', err);
      setError(err.message || 'Sayfa numarası eklenirken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download again if auto-download failed or was closed
  const handleDownloadAgain = () => {
    if (!downloadedBlob) return;
    downloadBlob(downloadedBlob, 'evrakfix-sayfa-numarali.pdf');
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

  // Dropdown options
  const formatOptions = [
    { value: 'number', label: '1, 2, 3 (Yalnızca Numara)' },
    { value: 'page-number', label: 'Sayfa 1, Sayfa 2 (Metinli Numara)' },
    { value: 'number-total', label: '1 / 10, 2 / 10 (Toplam Sayfa ile)' },
    { value: 'page-number-total', label: 'Sayfa 1 / 10 (Metinli ve Toplamlı)' }
  ];

  const positionOptions = [
    { value: 'bottom-center', label: 'Alt Orta' },
    { value: 'bottom-right', label: 'Alt Sağ' },
    { value: 'bottom-left', label: 'Alt Sol' },
    { value: 'top-center', label: 'Üst Orta' },
    { value: 'top-right', label: 'Üst Sağ' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Sayfa Numarası Ekle</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF dosyanıza cihazınızda güvenle sayfa numarası ekleyin ve numaralandırılmış PDF olarak indirin.
        </p>
      </div>

      {/* Security Alert */}
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

      {/* Main Card */}
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
            title="Sayfa numarası eklemek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Tek bir PDF dökümanı yükleyebilirsiniz. Maksimum dosya boyutu limit: 50MB."
          />
        ) : (
          /* Editor View */
          <div className="flex flex-col gap-6">
            {/* Active Document Info */}
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

            {/* Options configuration */}
            {!success && (
              <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-5">
                <div className="flex items-center gap-2 text-slate-850 font-bold text-sm border-b border-slate-100 pb-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Numaralandırma Ayarları</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Format Selection */}
                  <Select
                    label="Format Seçimi"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as PageNumberFormat)}
                    options={formatOptions}
                  />

                  {/* Position Selection */}
                  <Select
                    label="Sayfa Numarası Konumu"
                    value={position}
                    onChange={(e) => setPosition(e.target.value as PageNumberPosition)}
                    options={positionOptions}
                  />

                  {/* Font Size */}
                  <Input
                    label="Yazı Boyutu (pt)"
                    type="number"
                    min="6"
                    max="36"
                    value={fontSize}
                    onChange={(e) => setFontSize(Math.max(6, Math.min(36, Number(e.target.value) || 6)))}
                  />

                  {/* Start From */}
                  <Input
                    label="Başlangıç Sayfası"
                    type="number"
                    min="1"
                    value={startFrom}
                    onChange={(e) => setStartFrom(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
              </div>
            )}

            {/* Errors */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Success */}
            {success && (
              <Alert variant="success" title="İşlem Başarılı" icon={<FileCheckIcon className="h-4 w-4" />}>
                Sayfa numaraları PDF dökümanına başarıyla eklendi. İndirme işlemi otomatik başlatıldı. Eğer indirme başlamadıysa aşağıdaki butonu kullanabilirsiniz.
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
              {!success ? (
                <Button
                  size="lg"
                  onClick={handleAddPageNumbers}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 group transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sayfa Numaraları Ekleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Hash className="w-4 h-4" />
                      <span>Sayfa Numarası Ekle</span>
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
                    <span>PDF'i İndir</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* SEO & FAQs Panel */}
      <ToolSEOInfo
        toolName="PDF Sayfa Numarası Ekle"
        description="PDF Sayfa Numarası Ekle aracımız, dökümanlarınızın okuma ve arşivleme düzenini kolaylaştırmak için sayfa numaraları eklemenizi sağlar. Tamamen tarayıcınızda ve yerel olarak çalışan bu modül sayesinde, PDF dökümanınız sunucuya yüklenmeden saniyeler içinde numaralandırılır. Yazı boyutu, başlangıç sayfası, biçim ve konum (alt/üst, sağ/sol/orta) ayarlarını kişiselleştirerek profesyonel çıktılar elde edebilirsiniz."
        exampleUsage="Tez çalışmaları, resmi raporlar, sözleşmeler veya çok sayfalı sunumlar gibi düzenli ve sıralı olması gereken PDF belgelerinizde sayfa takibini kolaylaştırmak amacıyla kullanabilirsiniz."
        steps={[
          {
            title: "PDF Dökümanını Yükleyin",
            description: "Sayfa numarası eklemek istediğiniz PDF dosyasını sürükleyip bırakarak veya cihazınızdan seçerek yükleme alanına aktarın."
          },
          {
            title: "Numaralandırma Ayarlarını Yapın",
            description: "Sayfa numarası formatını (örneğin 'Sayfa 1 / 10'), konumunu (örneğin 'Alt Orta'), yazı boyutunu ve başlangıç numarasını kontrol paneli üzerinden belirleyin."
          },
          {
            title: "Sayfa Numarası Ekle Butonuna Basın",
            description: "'Sayfa Numarası Ekle' butonuna basarak numaralandırılmış yeni PDF dosyanızı anında cihazınıza indirin."
          }
        ]}
        faqs={[
          {
            question: "PDF dosyam sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz PDF dosyaları internetteki hiçbir sunucuya gönderilmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak işlenir."
          },
          {
            question: "Sayfa numarasını istediğim konuma ekleyebilir miyim?",
            description: "Evet. Sayfa numaralarını alt sol, alt orta, alt sağ, üst orta veya üst sağ olmak üzere 5 farklı konuma hizalayarak ekleyebilirsiniz."
          },
          {
            question: "Sayfa numarası formatını değiştirebilir miyim?",
            description: "Evet. Format ayarlarında yalnızca numara (1, 2...), metin içeren numara (Sayfa 1, Sayfa 2...), toplam sayfa sayısı ile birlikte (1 / 10...) veya hem metin hem toplam sayfa sayısı içeren (Sayfa 1 / 10...) formatları serbestçe seçebilirsiniz."
          },
          {
            question: "Başlangıç sayfa numarasını değiştirebilir miyim?",
            description: "Evet. Başlangıç numarası ayarını kullanarak belgenizin sayfa numaralandırmasını 1 yerine dilediğiniz herhangi bir sayıdan (örneğin 5 veya 100) başlatabilirsiniz."
          },
          {
            question: "Numaralandırılmış PDF dosyasını hemen indirebilir miyim?",
            description: "Evet. Sayfa numarası ekle butonuna tıkladığınızda işlem cihazınızda saniyeler içinde tamamlanır ve numaralı PDF belgeniz otomatik olarak bilgisayarınıza veya telefonunuza indirilir."
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

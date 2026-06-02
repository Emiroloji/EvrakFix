import * as React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import JSZip from 'jszip';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Loading } from '../../components/ui/Loading';
import { PdfToImageOptionsPanel } from './components/PdfToImageOptions';
import { PdfImagePageGrid } from './components/PdfImagePageGrid';
import { renderPdfPageToImage, renderSelectedPdfPagesToImages } from './pdfToImage.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import type { PdfToImageOptions } from './types';
import { Shield, RefreshCw, AlertCircle, CheckSquare, Square, FileArchive } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

// Configure the pdfjs-dist worker location
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfToImagePage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [numPages, setNumPages] = React.useState<number>(0);
  const [selectedPages, setSelectedPages] = React.useState<number[]>([]);
  const [options, setOptions] = React.useState<PdfToImageOptions>({
    format: 'png',
    quality: 'high',
    scale: 2,
  });
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingProgress, setProcessingProgress] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // File loading and validation
  const handleFileSelected = React.useCallback(async (selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);
    setSelectedPages([]);

    if (selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const validation = validatePdfFile(selectedFile);

    if (!validation.isValid) {
      setError(validation.error || 'Dosya geçersiz.');
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const count = doc.numPages;

      if (count === 0) {
        throw new Error('PDF dökümanı boş veya geçersiz.');
      }

      setFile(selectedFile);
      setPdfDoc(doc);
      setNumPages(count);
      // Select all pages by default
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));
    } catch (err: any) {
      console.error('PDF loading error:', err);
      setError(err.message || 'PDF dökümanı yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Page selection toggle
  const handleToggleSelect = React.useCallback((pageNumber: number) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageNumber)) {
        return prev.filter((p) => p !== pageNumber);
      } else {
        return [...prev, pageNumber].sort((a, b) => a - b);
      }
    });
  }, []);

  // Select all pages
  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  };

  // Deselect all pages
  const handleDeselectAll = () => {
    setSelectedPages([]);
  };

  // Download individual page image
  const handleDownloadSingle = React.useCallback(async (pageNumber: number) => {
    if (!file) return;
    setError(null);

    try {
      const imgBlob = await renderPdfPageToImage(file, pageNumber, options);
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const ext = options.format === 'jpg' ? 'jpg' : 'png';
      downloadBlob(imgBlob, `evrakfix-${originalName}-sayfa-${pageNumber}.${ext}`);
    } catch (err: any) {
      console.error(`Single page ${pageNumber} download error:`, err);
      setError(err.message || `Sayfa ${pageNumber} indirilirken hata oluştu.`);
    }
  }, [file, options]);

  // Batch download selected pages packed inside a ZIP file
  const handleDownloadZip = async () => {
    if (!file || selectedPages.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProcessingProgress('Görseller hazırlanıyor...');

    try {
      const zip = new JSZip();
      
      // Render pages sequentially to avoid parallel memory peaks
      const results = await renderSelectedPdfPagesToImages(file, selectedPages, options);

      setProcessingProgress('ZIP arşivi oluşturuluyor...');
      
      for (const result of results) {
        zip.file(result.fileName, result.blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      downloadBlob(zipBlob, `evrakfix-${originalName}-gorseller.zip`);
      setSuccess(true);
    } catch (err: any) {
      console.error('ZIP compilation error:', err);
      setError(err.message || 'ZIP dosyası oluşturulurken beklenmedik bir hata oluştu.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
    }
  };

  // Clear workspace
  const handleClear = () => {
    setFile(null);
    setPdfDoc(null);
    setNumPages(0);
    setSelectedPages([]);
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    setIsProcessing(false);
    setProcessingProgress('');
  };

  const hasSelected = selectedPages.length > 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF'i Görsele Çevir</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgenizin sayfalarını yüksek kalitede PNG veya JPG resim formatına dönüştürüp tek tek veya toplu ZIP olarak indirin.
        </p>
      </div>

      {/* Security notice */}
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

      {/* Workspace Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loading size="lg" />
            <p className="mt-4 text-sm font-semibold text-slate-600">PDF yükleniyor ve sayfalar hazırlanıyor...</p>
            <p className="text-xs text-slate-400 mt-1">Bu işlem dosyanızın boyutuna göre birkaç saniye sürebilir.</p>
          </div>
        ) : !file ? (
          /* File selection dropzone */
          <Dropzone
            onFilesSelected={handleFileSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Dönüştürmek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Tek bir PDF dökümanı yükleyebilirsiniz. Maksimum dosya boyutu limit: 50MB."
          />
        ) : (
          /* Workspace */
          <div className="flex flex-col gap-6">
            {/* Document Header info */}
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

            {/* Conversion Options */}
            <PdfToImageOptionsPanel options={options} onChange={setOptions} />

            {/* Error banner */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Success info banner */}
            {success && (
              <Alert variant="success" title="Dönüştürme Başarılı" icon={<FileCheckIcon className="h-4 w-4" />}>
                Seçilen sayfalar başarıyla görsele çevrildi ve indirme işlemi başlatıldı.
              </Alert>
            )}

            {/* Toolbar for bulk selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{numPages} Toplam Sayfa</span>
                <span className="border-l border-slate-200 pl-4 font-semibold text-blue-600">{selectedPages.length} Seçili</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={isProcessing}
                  className="h-8 px-2.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tümünü Seç</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDeselectAll}
                  disabled={isProcessing}
                  className="h-8 px-2.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold"
                >
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span>Seçimi Kaldır</span>
                </Button>
              </div>
            </div>

            {/* Pages preview grid */}
            <div className="bg-slate-50/30 border border-slate-100/80 rounded-2xl p-4 md:p-6 min-h-[300px]">
              <PdfImagePageGrid
                pdfDoc={pdfDoc}
                numPages={numPages}
                selectedPages={selectedPages}
                onToggleSelect={handleToggleSelect}
                onDownloadSingle={handleDownloadSingle}
              />
            </div>

            {/* Bottom aggregate action (ZIP) */}
            <div className="flex items-center justify-end border-t border-slate-100 pt-4 mt-2">
              <Button
                size="lg"
                onClick={handleDownloadZip}
                disabled={isProcessing || !hasSelected}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 group transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{processingProgress}</span>
                  </>
                ) : (
                  <>
                    <FileArchive className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    <span>Seçili Sayfaları ZIP İndir</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF'i Görsele Çevir"
        description="PDF'i Görsele Çevir aracımız; PDF belgelerinizdeki sayfaları yüksek kaliteli bağımsız resim dosyalarına (PNG veya JPG) dönüştürmenizi sağlar. İster belirli sayfaları tek tek seçin, isterseniz tüm sayfaları tek tıkla yüksek çözünürlüklü görsellere dönüştürerek ZIP arşivi halinde toplu indirin. Kalite (Düşük/Orta/Yüksek) ve çözünürlük ölçeklerini (1x, 2x, 3x) dilediğiniz gibi belirleyebilirsiniz. Tüm görselleştirme işlemleri tamamen tarayıcınızın render motoruyla yerel olarak gerçekleştirilir."
        exampleUsage="Sunumunuza eklemek istediğiniz 50 sayfalık bir rapor PDF'inin sadece 12. sayfasını yüksek kaliteli bir JPG resmi haline getirerek doğrudan sunum slaytınıza sürükleyebilirsiniz."
        steps={[
          {
            title: "PDF Dökümanını Yükleyin",
            description: "Sayfalarını resme dönüştürmek istediğiniz tek PDF dökümanını sürükleyip bırakarak veya seçerek yükleyin."
          },
          {
            title: "Format ve Çözünürlüğü Belirleyin",
            description: "Çıktı formatını (PNG / JPG), görsel kalitesini ve netlik ölçeğini (1x, 2x, 3x ultra çözünürlük) kontrol panelinden ayarlayın."
          },
          {
            title: "Görsel Olarak İndirin",
            description: "Dönüştürmek istediğiniz sayfaları işaretleyin. Tekil olarak 'Görsel Al' ile veya seçilenleri topluca ZIP paketi şeklinde indirin."
          }
        ]}
        faqs={[
          {
            question: "PNG ile JPG arasında ne fark vardır ve hangisini seçmeliyim?",
            description: "PNG formatı kayıpsız sıkıştırma sunar; şablonlar, logolar veya metin ağırlıklı dökümanlar için mükemmel netlik sağlar. JPG ise dosya boyutunu küçültür ve fotoğraf içeren taranmış renkli dökümanlar için daha uygundur."
          },
          {
            question: "Çözünürlük ölçeği (scale) ne anlama gelir?",
            description: "Ölçeklendirme katsayısı, oluşturulacak görselin piksel çözünürlüğünü katlar. 1x standart çözünürlük sağlarken, 2x ve 3x ölçekler çok daha net, pikselleşmeyen, sunum veya baskıya uygun ultra yüksek çözünürlüklü görseller üretir."
          },
          {
            question: "Büyük PDF'lerde tarayıcının kilitlenme veya çökme riski var mıdır?",
            description: "Hayır. EvrakFix bünyesindeki dönüşüm algoritması sayfaları paralel değil, ardışık (sıralı) işler. Bu akıllı bellek yönetimi (sequential processing) sayesinde bellek tepe değerleri kontrol altında tutulur ve yüksek boyutlu PDF'ler bile kilitlenme olmadan başarıyla tamamlanır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

// Internal icon proxy helper for the Alert component
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

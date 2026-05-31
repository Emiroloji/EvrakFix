import * as React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Loading } from '../../components/ui/Loading';
import { PdfOrganizerToolbar } from './components/PdfOrganizerToolbar';
import { PdfPageGrid } from './components/PdfPageGrid';
import { createOrganizedPdf } from './pdfOrganizer.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import type { OrganizedPdfPage } from './types';
import { Shield, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';

// Configure the pdfjs-dist worker location
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfOrganizerPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [pages, setPages] = React.useState<OrganizedPdfPage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Load and read PDF document
  const handleFileSelected = React.useCallback(async (selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);

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
      
      // Load using pdfjs-dist for rendering thumbnails
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = doc.numPages;

      if (numPages === 0) {
        throw new Error('PDF dökümanı boş veya geçersiz.');
      }

      // Initialize OrganizedPdfPage array
      const initialPages: OrganizedPdfPage[] = Array.from({ length: numPages }, (_, index) => ({
        id: `page-${index}-${Math.random().toString(36).substring(2, 9)}`,
        originalPageIndex: index,
        currentOrder: index,
        rotation: 0,
        isDeleted: false,
      }));

      setFile(selectedFile);
      setPdfDoc(doc);
      setPages(initialPages);
    } catch (err: any) {
      console.error('PDF yükleme hatası:', err);
      setError(err.message || 'PDF dökümanı yüklenirken bir hata oluştu. Lütfen dosyanın şifreli veya bozuk olmadığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle page rotation by +90 degrees
  const handleRotate = React.useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === id) {
          const nextRotation = ((page.rotation + 90) % 360) as (0 | 90 | 180 | 270);
          return { ...page, rotation: nextRotation };
        }
        return page;
      })
    );
  }, []);

  // Toggle page isDeleted state
  const handleToggleDelete = React.useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === id) {
          return { ...page, isDeleted: !page.isDeleted };
        }
        return page;
      })
    );
  }, []);

  // Move page to the left (earlier in sequence)
  const handleMoveLeft = React.useCallback((id: string) => {
    setPages((prev) => {
      // Find active pages sorted by currentOrder
      const activePages = [...prev]
        .filter((p) => !p.isDeleted)
        .sort((a, b) => a.currentOrder - b.currentOrder);

      const index = activePages.findIndex((p) => p.id === id);
      if (index <= 0) return prev;

      const currentPage = activePages[index];
      const prevPage = activePages[index - 1];

      // Swap the currentOrder of these two pages in the state array
      return prev.map((page) => {
        if (page.id === currentPage.id) {
          return { ...page, currentOrder: prevPage.currentOrder };
        }
        if (page.id === prevPage.id) {
          return { ...page, currentOrder: currentPage.currentOrder };
        }
        return page;
      });
    });
  }, []);

  // Move page to the right (later in sequence)
  const handleMoveRight = React.useCallback((id: string) => {
    setPages((prev) => {
      // Find active pages sorted by currentOrder
      const activePages = [...prev]
        .filter((p) => !p.isDeleted)
        .sort((a, b) => a.currentOrder - b.currentOrder);

      const index = activePages.findIndex((p) => p.id === id);
      if (index < 0 || index >= activePages.length - 1) return prev;

      const currentPage = activePages[index];
      const nextPage = activePages[index + 1];

      // Swap the currentOrder of these two pages in the state array
      return prev.map((page) => {
        if (page.id === currentPage.id) {
          return { ...page, currentOrder: nextPage.currentOrder };
        }
        if (page.id === nextPage.id) {
          return { ...page, currentOrder: currentPage.currentOrder };
        }
        return page;
      });
    });
  }, []);

  // Bulk action: reset all changes to original
  const handleResetAll = React.useCallback(() => {
    if (!file) return;
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        currentOrder: page.originalPageIndex,
        rotation: 0,
        isDeleted: false,
      }))
    );
  }, [file]);

  // Bulk action: restore all deleted pages
  const handleRestoreAllDeleted = React.useCallback(() => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        isDeleted: false,
      }))
    );
  }, []);

  // Bulk action: rotate all active pages 90 degrees
  const handleRotateAll = React.useCallback(() => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.isDeleted) return page;
        const nextRotation = ((page.rotation + 90) % 360) as (0 | 90 | 180 | 270);
        return { ...page, rotation: nextRotation };
      })
    );
  }, []);

  // Download the edited PDF
  const handleDownload = async () => {
    if (!file || pages.length === 0) return;

    const activeCount = pages.filter((p) => !p.isDeleted).length;
    if (activeCount === 0) {
      setError('En az bir aktif sayfa kalmalıdır. Tüm sayfaları silerseniz PDF oluşturamazsınız.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const editedBlob = await createOrganizedPdf(file, pages);
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      downloadBlob(editedBlob, `evrakfix-duzenlenmis-${originalName}.pdf`);
      setSuccess(true);
    } catch (err: any) {
      console.error('PDF compile error:', err);
      setError(err.message || 'Düzenlenmiş PDF oluşturulurken hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear/Reset entire view
  const handleClear = () => {
    setFile(null);
    setPdfDoc(null);
    setPages([]);
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    setIsProcessing(false);
  };

  const hasActivePages = pages.some((p) => !p.isDeleted);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Sayfa Düzenleyici</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgenizin sayfalarını yeniden sıralayın, döndürün veya istemediklerinizi silerek yeni bir PDF elde edin.
        </p>
      </div>

      {/* Security Banner */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600" />}>
        Dosyalarınız tamamen tarayıcınızda işlenir. Sunucularımıza hiçbir veri gönderilmez.
      </Alert>

      {/* Main Workspace Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loading size="lg" />
            <p className="mt-4 text-sm font-semibold text-slate-600">PDF yükleniyor ve sayfalar analiz ediliyor...</p>
            <p className="text-xs text-slate-400 mt-1">Bu işlem dosyanızın boyutuna göre birkaç saniye sürebilir.</p>
          </div>
        ) : !file ? (
          /* File selection dropzone */
          <Dropzone
            onFilesSelected={handleFileSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Düzeltmek istediğiniz PDF dosyasını buraya bırakın veya seçin"
            description="Tek bir PDF dökümanı yükleyebilirsiniz. Maksimum dosya boyutu limit: 50MB."
          />
        ) : (
          /* Editor Workspace */
          <div className="flex flex-col gap-6">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktif Belge</span>
                <span className="text-slate-800 font-bold break-all">{file.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="self-start sm:self-auto h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-semibold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Başka Dosya Seç</span>
              </Button>
            </div>

            {/* Error alerts */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Success info banner */}
            {success && (
              <Alert variant="success" title="İşlem Başarılı" icon={<FileCheckIcon className="h-4 w-4" />}>
                Döküman başarıyla düzenlendi ve indirme işlemi başlatıldı. Yeni bir işlem yapmak için sayfaları tekrar düzenleyebilir veya yeni dosya seçebilirsiniz.
              </Alert>
            )}

            {/* Toolbar */}
            <PdfOrganizerToolbar
              pages={pages}
              onResetAll={handleResetAll}
              onRestoreAllDeleted={handleRestoreAllDeleted}
              onRotateAll={handleRotateAll}
            />

            {/* Pages list grid */}
            <div className="bg-slate-50/30 border border-slate-100/80 rounded-2xl p-4 md:p-6 min-h-[300px]">
              <PdfPageGrid
                pages={pages}
                pdfDoc={pdfDoc}
                onRotate={handleRotate}
                onToggleDelete={handleToggleDelete}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              />
            </div>

            {/* Bottom Compile Action */}
            <div className="flex items-center justify-end border-t border-slate-100 pt-4 mt-2">
              <Button
                size="lg"
                onClick={handleDownload}
                disabled={isProcessing || !hasActivePages}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 group transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>PDF Üretiliyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    <span>Düzenlenmiş PDF'i İndir</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF Sayfa Düzenleyici"
        description="PDF Sayfa Düzenleme modülümüz, PDF belgelerinizin sayfa yapısını görsel bir panel üzerinden dilediğiniz gibi şekillendirmenizi sağlar. Yüklediğiniz PDF dosyasının tüm sayfalarını küçük resim önizlemeleri (thumbnails) halinde görebilir, gereksiz sayfaları silebilir, sayfaları 90 derece açılarla döndürebilir ve sayfaların sırasını sürüklemeye gerek kalmadan yön butonlarıyla değiştirebilirsiniz. Tamamen yerel çalışan (client-side) sistemimiz sayesinde gizli dosyalarınızın gizliliği tam güvence altındadır."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Sayfa düzenlemesi yapmak istediğiniz tek PDF dökümanını sürükleyip bırakarak veya seçerek yükleyin."
          },
          {
            title: "Sayfaları Yönetin (Sil, Döndür, Taşı)",
            description: "Görsel ızgarada sayfaları yön butonlarıyla sola/sağa taşıyın, 90° döndürün veya istemediğiniz sayfaları anında silin."
          },
          {
            title: "Değişiklikleri Kaydedip İndirin",
            description: "İşlem bittiğinde 'Düzenlenmiş PDF'i İndir' butonuna tıklayarak yeni dökümanınızı saniyeler içinde bilgisayarınıza kaydedin."
          }
        ]}
        faqs={[
          {
            question: "Bir sayfayı yanlışlıkla silersem geri getirebilir miyim?",
            description: "Evet! Sayfa üzerinde yer alan 'Geri Al' butonuna veya üst menüdeki 'Silinenleri Kurtar' butonuna tıklayarak sildiğiniz sayfaları dilediğiniz zaman kurtarabilirsiniz."
          },
          {
            question: "Sayfa döndürme işlemi kalıcı mıdır?",
            description: "Evet. Döndürdüğünüz sayfalar (90°, 180°, 270°), belgenin orijinal metadata katmanına işlenir ve dökümanı indirdiğinizde tüm PDF okuyucularda döndürülmüş haliyle görüntülenir."
          },
          {
            question: "Dosyalarım üzerinde yapılan işlemler sunucuya gönderilir mi?",
            description: "Kesinlikle hayır. EvrakFix sunucusuz çalışan bağımsız bir frontend aracıdır. PDF yükleme, görsel önizleme oluşturma ve kopyalama işlemleri tarayıcınızın kendi bellek ortamında gerçekleştirilir."
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

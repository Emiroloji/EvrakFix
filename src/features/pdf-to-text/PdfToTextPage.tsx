import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { extractTextFromPdf } from './pdfToText.service';
import type { PageTextResult } from './pdfToText.service';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, AlertCircle, Download, FileText, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfToTextPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const [extractedPages, setExtractedPages] = React.useState<PageTextResult[]>([]);
  const [format, setFormat] = React.useState<'txt' | 'markdown'>('txt');
  const [copied, setCopied] = React.useState(false);

  // Trigger PDF text extraction
  React.useEffect(() => {
    if (!file) return;

    const processPdf = async () => {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      setExtractedPages([]);

      try {
        const pages = await extractTextFromPdf(file, (current, total) => {
          setProgress(Math.round((current / total) * 100));
        });

        const hasText = pages.some((p) => p.text.trim().length > 0);
        if (!hasText) {
          throw new Error(
            'Bu PDF dosyasından okunabilir metin çıkarılamadı. Dosya sadece resimlerden oluşuyor (taranmış) olabilir veya şifrelenmiş olabilir.'
          );
        }

        setExtractedPages(pages);
      } catch (err: any) {
        console.error('PDF text extraction error:', err);
        setError(err.message || 'Metin ayıklanırken beklenmeyen bir hata oluştu.');
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    };

    processPdf();
  }, [file]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];

    const validation = validatePdfFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || 'Geçersiz PDF dosyası.');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const getCombinedText = React.useMemo(() => {
    if (extractedPages.length === 0) return '';

    if (format === 'markdown') {
      return extractedPages
        .map((p) => `## Sayfa ${p.pageNumber}\n\n${p.text}`)
        .join('\n\n---\n\n');
    }

    return extractedPages
      .map((p) => `--- Sayfa ${p.pageNumber} ---\n${p.text}`)
      .join('\n\n');
  }, [extractedPages, format]);

  const handleCopy = async () => {
    const text = getCombinedText;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadTextFile = () => {
    const text = getCombinedText;
    if (!text) return;

    const extension = format === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${file?.name.split('.')[0] || 'belge'}.${extension}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setExtractedPages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          PDF’ten Metin Çıkarıcı
        </h1>
        <p className="text-slate-500 text-sm">
          Readable PDF dosyalarınızın içindeki metinleri saniyeler içinde ayıklayın, kopyalayın veya TXT/Markdown olarak indirin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Metin ayıklama işlemi tamamen tarayıcınızda yapılır. PDF dosyalarınız ve içindeki veriler hiçbir sunucuya gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Container */}
      <Card className="p-6 md:p-8">
        {!file && !isProcessing ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="İçindeki metinleri çıkarmak istediğiniz PDF belgesini buraya sürükleyin veya seçin"
            description="Dosya tamamen tarayıcınızda işlenir, sunucuya yüklenmez."
          />
        ) : isProcessing ? (
          /* Extraction Loader */
          <div className="flex flex-col items-center justify-center p-12 gap-4 text-slate-500 text-sm">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-slate-800">PDF Çözümleniyor...</span>
              <span>Metinler ayıklanıyor: %{progress}</span>
            </div>
            <div className="w-64 bg-slate-150 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Results workspace */
          <div className="flex flex-col gap-6">
            {/* File header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file?.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {file && formatFileSize(file.size)} • {extractedPages.length} Sayfa
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all self-end sm:self-auto cursor-pointer"
              >
                Yeni Dosya Yükle
              </button>
            </div>

            {/* Actions and Content Box */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings column */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Dışa Aktarma Formatı
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFormat('txt')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      format === 'txt'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-650'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    Düz Metin (.txt)
                  </button>
                  <button
                    onClick={() => setFormat('markdown')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      format === 'markdown'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-650'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    Markdown (.md)
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    variant="primary"
                    onClick={downloadTextFile}
                    className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-10 flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    Dosya Olarak İndir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="w-full font-bold border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer h-10 flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Tümünü Kopyala
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Text viewer column */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600">Ayıklanan Metin Önizlemesi</label>
                <textarea
                  readOnly
                  value={getCombinedText}
                  className="w-full h-[350px] p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs leading-relaxed text-slate-700 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4">
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          </div>
        )}
      </Card>

      {/* SEO Content */}
      <ToolSEOInfo
        toolName="PDF’ten Metin Çıkarıcı"
        description="EvrakFix PDF’ten Metin Çıkarıcı (PDF to Text / Markdown) aracımız, bilgisayarınızda veya mobil cihazınızda bulunan seçilebilir metin katmanına sahip PDF dökümanlarındaki tüm yazıları saniyeler içinde düz metne dönüştürür. PDF dosyalarından elinizle yazı kopyalamanın zor olduğu durumlarda, tüm sayfaların metinlerini tek seferde ayıklar. Sunucusuz (client-side) çalışan gizlilik odaklı mimarisi sayesinde, sözleşmeleriniz veya özel dökümanlarınız hiçbir şekilde internet sunucularına aktarılmaz, verileriniz tamamen cihazınızda kalır.

■ PDF’ten Metin Çıkarma Nedir?
PDF'ten metin çıkarma (PDF text extraction), bir PDF dökümanı içerisindeki sayısal yazı katmanlarını okuyarak yazı tipi, görsel ve biçimlendirmelerden arındırılmış yalın düz metin (plain text) üretme işlemidir.

■ PDF Dosyasındaki Yazılar Nasıl Kopyalanır?
EvrakFix PDF Metin Ayıklayıcı'ya dosyanızı yükleyin. Sistem, PDF'teki tüm yazıları tarayıcıda çözümler ve sayfa sayfa ayırarak önizleme kutusuna yansıtır. 'Tümünü Kopyala' butonuna tıklayarak hafızaya alabilir ya da bilgisayarınıza TXT veya Markdown olarak kaydedebilirsiniz.

■ Hangi PDF Dosyalarından Metin Çıkarılabilir?
Yalnızca dijital ortamda üretilmiş (Word'den PDF'e çevrilmiş, e-kitaplar vb.) veya OCR işlemi uygulanarak metin katmanı kazandırılmış PDF belgelerinden metin çıkarılabilir. Tarayıcıdan doğrudan resim olarak aktarılmış, seçilemeyen yazılar içeren PDF'ler için 'Resimden Metin Okuma (OCR)' aracımızı kullanmanız gerekir.

■ Metin Ayıklama İşlemi Güvenli mi?
Evet, son derece güvenlidir. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışmaktadır. PDF dökümanınız hiçbir uzak sunucuya yüklenmez, doğrudan cihazınızın RAM belleğinde işlenir. Gizlilik taahhüdümüz kapsamında verileriniz tamamen sizde kalır."
        exampleUsage="Uzun bir PDF raporundan veya ders notlarından sadece yazılı kısımları ayıklamak, bunları ödevinize/dosyanıza aktarmak ya da Markdown dosyası olarak arşivlemek için PDF dosyasını yükleyip saniyeler içinde çıktı alabilirsiniz."
        steps={[
          {
            title: "PDF Dosyasını Yükleyin",
            description: "Metnini kopyalamak istediğiniz seçilebilir yazı katmanına sahip PDF belgesini sürükleyip bırakarak yükleyin."
          },
          {
            title: "Formatı Belirleyin",
            description: "Dışa aktarma formatını düz metin (.txt) veya yapılandırılmış Markdown (.md) olarak belirleyin."
          },
          {
            title: "Kopyalayın veya İndirin",
            description: "Dönüşüm tamamlandığında 'Tümünü Kopyala' tuşuyla kopyalayın ya da dosya olarak cihazınıza indirin."
          }
        ]}
        faqs={[
          {
            question: "Belgelerim ve metinlerim sunucuya kaydediliyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dosyası ve ayıklanan yazılar hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcısında işlenir."
          },
          {
            question: "Taranmış resimli PDF’lerden yazı çıkarabilir miyim?",
            description: "Bu araç sadece seçilebilir yazı katmanı olan dijital PDF'ler içindir. Fotoğraf olarak taranmış PDF'ler için lütfen ana menüdeki 'Resimden Metin Okuma (OCR)' aracımızı tercih edin."
          },
          {
            question: "Markdown (.md) formatında dışa aktarmak ne avantaj sağlar?",
            description: "Markdown formatı, sayfa başlıklarını ve sayfa sınırlarını temiz bir yapısal formatta (`## Sayfa 1` ve `---`) saklar, bu sayede not alma uygulamalarında veya dökümantasyon sistemlerinde doğrudan kullanılabilir."
          },
          {
            question: "Dosya boyutu veya sayfa sayısı sınırı var mı?",
            description: "Hayır, herhangi bir sınır yoktur. Ancak yüzlerce sayfalık çok büyük PDF dosyalarında çözümleme hızı doğrudan tarayıcınızın ve cihazınızın donanım performansına bağlı olarak değişir."
          },
          {
            question: "Türkçe karakterler bozulmadan çıkar mı?",
            description: "Evet. pdfjs parser motoru UTF-8 karakter kodlamasıyla çalışır. Türkçe karakterler (ş, ı, ğ, ç, ö, ü) ve özel semboller tamamen orijinal haliyle korunarak ayıklanır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default PdfToTextPage;

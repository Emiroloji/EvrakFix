import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { parseXmlInvoice } from './xmlInvoiceParser.service';
import { Shield, AlertCircle, FileText, Printer, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const XmlInvoiceViewerPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [htmlContent, setHtmlContent] = React.useState<string | null>(null);

  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Parse XML when file is loaded
  React.useEffect(() => {
    if (!file) return;

    const readAndParse = async () => {
      setIsProcessing(true);
      setError(null);
      setHtmlContent(null);

      try {
        const text = await file.text();
        const html = await parseXmlInvoice(text);
        setHtmlContent(html);
      } catch (err: any) {
        console.error('Invoice parsing error:', err);
        setError(err.message || 'XML fatura dosyası çözümlenirken bir hata oluştu. Dosyanın UBL-TR standardına uygun olduğundan emin olun.');
      } finally {
        setIsProcessing(false);
      }
    };

    readAndParse();
  }, [file]);

  // Inject HTML into iframe safely
  React.useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent]);

  // File selection handler
  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];
    if (selectedFile.name.toLowerCase().endsWith('.xml') || selectedFile.type === 'text/xml' || selectedFile.type === 'application/xml') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Lütfen yalnızca .xml uzantılı fatura dosyası yükleyin.');
    }
  };

  // Trigger print action of the iframe
  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.focus();
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setHtmlContent(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>XML E-Fatura Görselleştirici</span>
        </h1>
        <p className="text-slate-500 text-sm">
          XML formatındaki e-Fatura, e-Arşiv veya e-İrsaliye dosyalarınızı cihazınızda açın, görüntüleyin ve yazdırın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Faturalarınız tamamen yerel tarayıcınızda çözümlenir. XML verileriniz hiçbir sunucuya yüklenmez ve kaydedilmez.</span>
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
            onFilesSelected={handleFilesSelected}
            accept={{ 'text/xml': ['.xml'], 'application/xml': ['.xml'] }}
            multiple={false}
            title="Görüntülemek istediğiniz e-Fatura XML dosyasını buraya sürükleyin veya seçin"
            description="Dosya tamamen tarayıcınızda işlenir, sunucuya yüklenmez."
          />
        ) : (
          /* Viewer Panel */
          <div className="flex flex-col gap-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {((file.size || 0) / 1024).toFixed(1)} KB
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

            {/* Error Message */}
            {error && (
              <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
                {error}
              </Alert>
            )}

            {/* Processing loader */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500 text-sm">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                <span>XML Fatura çözümleniyor...</span>
              </div>
            )}

            {/* Invoice iframe preview */}
            {htmlContent && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500">
                    Fatura Başarıyla Yüklendi
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-100 text-slate-650 font-bold flex items-center gap-1.5 cursor-pointer"
                      onClick={handlePrint}
                    >
                      <Printer className="h-4 w-4" />
                      Yazdır / PDF Kaydet
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700 font-bold flex items-center gap-1.5 cursor-pointer"
                      onClick={handleClear}
                    >
                      Yeni Dosya
                    </Button>
                  </div>
                </div>

                {/* Isolated Preview Frame */}
                <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-inner overflow-hidden min-h-[600px] flex">
                  <iframe
                    ref={iframeRef}
                    title="Invoice Preview"
                    className="w-full flex-1 min-h-[600px] border-none"
                    sandbox="allow-same-origin allow-modals allow-popups"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="XML E-Fatura Görselleştirici"
        description="EvrakFix XML E-Fatura / E-Arşiv Görselleştirici aracımız, Gelir İdaresi Başkanlığı (GİB) standartlarındaki e-fatura, e-arşiv veya e-irsaliye XML dosyalarını herhangi bir programa gerek olmadan anında görüntülemenizi sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz e-fatura dosyaları hiçbir uzak sunucuya aktarılmaz, ticari ve finansal gizliliğiniz tamamen korunur.

■ XML Fatura Görselleştirici Nedir?
XML fatura görselleştirici; mali yazılımlardan veya entegratör firmalardan indirilen, içerisinde ürün, miktar, KDV ve fiyat bilgisi barındıran ancak kod formatında olduğu için doğrudan okunamayan XML fatura verilerini, XML içindeki stil şablonunu (XSLT) kullanarak resmi fatura görünümüne dönüştüren pratik bir araçtır.

■ XML Fatura Nasıl Görüntülenir?
EvrakFix XML Fatura Görselleştirici'ye bilgisayarınızdaki veya telefonunuzdaki .xml fatura dosyasını sürükleyip bırakın. Sistem, fatura XML'ini çözümler ve resmi e-fatura şablonunu saniyeler içinde ekrana yansıtır.

■ Fatura PDF Olarak Nasıl Kaydedilir?
Fatura görüntülendikten sonra üst menüde yer alan 'Yazdır / PDF Kaydet' butonuna tıklayarak açılan tarayıcı yazdırma ekranında 'PDF olarak kaydet' seçeneğini seçip faturayı bilgisayarınıza PDF olarak indirebilirsiniz.

■ XML Fatura Görselleştirici Güvenli mi?
Evet. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz fatura XML dosyası, şirket unvanları, vergi numaraları, adresler veya fatura tutarları gibi hassas bilgiler hiçbir internet sunucusuna gönderilmez, izlenmez ve kaydedilmez. Tüm dönüşüm süreci doğrudan kendi cihazınızın tarayıcısında gerçekleşir.

■ Mobil Cihazdan XML Fatura Açılabilir mi?
Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletlerinizden faturanızı anında seçip görüntüleyebilir, e-posta ile gelen XML faturaları ek program kurmadan okuyabilirsiniz.

■ EvrakFix XML Görselleştiricinin Avantajları
EvrakFix ile üyelik, kota veya ücret olmadan tamamen ücretsiz XML fatura görüntüleme yapabilirsiniz. İnternet hızınızdan bağımsız olarak anında açılır, verileriniz tamamen cihazınızda güvende kalır ve resmi şablonu koruyarak çıktı almanızı sağlar."
        exampleUsage="Entegratör firmanızdan veya e-posta ekinden indirdiğiniz XML fatura dosyasının içeriğini hızlıca incelemek, yazıcıdan çıktı almak veya PDF olarak arşivlemek için dosyayı sürükleyip bırakarak anında resmi formatta görüntüleyebilirsiniz."
        steps={[
          {
            title: "Fatura XML Dosyasını Yükleyin",
            description: "Görüntülemek istediğiniz .xml uzantılı e-Fatura veya e-Arşiv dosyasını sürükleyip bırakarak yükleyin."
          },
          {
            title: "Faturayı İnceleyin",
            description: "Sistem XML içindeki XSLT şablonunu parse ederek faturayı resmi görünümünde tarayıcınızda açacaktır."
          },
          {
            title: "Yazdırın veya PDF Kaydedin",
            description: "'Yazdır / PDF Kaydet' butonuna tıklayarak faturanın yazıcı çıktısını alabilir ya da PDF olarak kaydedebilirsiniz."
          }
        ]}
        faqs={[
          {
            question: "XML fatura dosyalarım veya verilerim sunucuya yükleniyor mu?",
            description: "Kesinlikle hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Faturalarınız hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak işlenir."
          },
          {
            question: "Tüm entegratörlerin fatura şablonları destekleniyor mu?",
            description: "Evet. UBL-TR standardına uygun olarak hazırlanan ve içerisinde XSLT stil dosyası barındıran tüm e-fatura XML dosyaları özgün şablonlarıyla görüntülenir."
          },
          {
            question: "Fatura XML dosyasında stil şablonu (XSLT) yoksa ne olur?",
            description: "Eğer faturada gömülü bir XSLT şablonu bulunmuyorsa, EvrakFix sizin için otomatik olarak temiz ve standart bir e-fatura şablonu uygulayarak fatura bilgilerini anlaşılır bir şekilde ekrana yansıtır."
          },
          {
            question: "XML faturaları PDF olarak indirebilir miyim?",
            description: "Evet. 'Yazdır / PDF Kaydet' seçeneğini kullanarak tarayıcınızın kendi yazdırma penceresindeki 'PDF Olarak Kaydet' özelliğinden yararlanarak PDF çıktısı oluşturabilirsiniz."
          },
          {
            question: "Bu araç ücretli midir veya limit var mıdır?",
            description: "Hayır. EvrakFix XML Görselleştirici tamamen ücretsizdir ve herhangi bir dosya yükleme sınırı veya kota bulunmamaktadır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default XmlInvoiceViewerPage;

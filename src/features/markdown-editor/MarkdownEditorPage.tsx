import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { 
  Shield, Download, Edit3, Trash2, 
  Heading1, Heading2, Bold, Italic, List, Quote, Code, Table, Minus, Printer
} from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { parseMarkdownToHtml, generateMarkdownPdf } from './markdownParser.service';
import { openSecurityModal } from '../../lib/utils/security';

const sampleMarkdown = `# Belge Başlığı (H1)

## Alt Başlık (H2)
Bu editör ile **Markdown** formatında yazılar yazabilir, anlık önizlemesini görebilir ve tek tıkla PDF olarak indirebilirsiniz.

### Özellikler (H3)
- **100% Yerel Çalışma:** Tüm işlemler cihazınızda çalışır, sunucu kullanılmaz.
- **Güvenli:** Bilgileriniz tarayıcınızda kalır, gizliliğiniz korunur.
- **Hızlı:** Saniyeler içinde PDF oluşturup kaydedebilirsiniz.

> Bu bir alıntı (blockquote) kutusudur. Önemli uyarılar, notlar ve hukuki sorumluluk reddi metinleri için oldukça uygundur.

---

| Özellik | EvrakFix | Standart Araçlar |
| --- | --- | --- |
| Sunucusuz İşlem | Evet | Hayır |
| İnternetsiz Çalışma | Evet | Hayır |
| Sınırsız / Ücretsiz | Evet | Hayır |

\`\`\`javascript
// JavaScript kod blokları da desteklenir
function selamla() {
  console.log("EvrakFix V3.0'a hoş geldiniz!");
}
\`\`\`
`;

export const MarkdownEditorPage = () => {
  const [markdown, setMarkdown] = React.useState<string>(sampleMarkdown);
  const [htmlPreview, setHtmlPreview] = React.useState<string>('');
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Update HTML preview on markdown changes
  React.useEffect(() => {
    setHtmlPreview(parseMarkdownToHtml(markdown));
  }, [markdown]);

  // Insert markdown tag at cursor
  const insertTag = (tag: string, placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selection = text.substring(start, end) || placeholder;
    const replacement = tag.replace('$', selection);

    setMarkdown(text.substring(0, start) + replacement + text.substring(end));

    // Refocus & select inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.indexOf('$'), start + tag.indexOf('$') + selection.length);
    }, 50);
  };

  // Direct PDF generation (pdf-lib)
  const handleExportPdf = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await generateMarkdownPdf(markdown);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'evrakfix_belge.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setError('PDF dosyası üretilirken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Styled printing using a hidden iframe
  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const printableHtml = `
      <html>
        <head>
          <title>Markdown Belgesi</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #334155;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 { color: #0f172a; }
            h1 { font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            h2 { font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            h3 { font-size: 16px; }
            hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
            ul, ol { margin-left: 24px; padding-left: 0; }
            li { margin-bottom: 6px; }
            pre { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-family: monospace; overflow-x: auto; }
            blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; font-style: italic; color: #64748b; margin: 16px 0; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
          </style>
        </head>
        <body>
          ${htmlPreview}
        </body>
      </html>
    `;

    doc.open();
    doc.write(printableHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 100);
  };

  const steps = [
    {
      title: 'İçeriğinizi Yazın',
      description: 'Sol taraftaki editöre Markdown formatında dökümanınızı yazın. Hazır butonlar ile kalın, italik, liste veya tablo ekleyebilirsiniz.'
    },
    {
      title: 'Önizlemeyi İnceleyin',
      description: 'Sağ taraftaki canlı önizleme panelinde belgenizin bittiğinde nasıl görüneceğini gerçek zamanlı olarak takip edin.'
    },
    {
      title: 'PDF Olarak Kaydedin',
      description: 'Cihazda PDF Oluştur butonuyla doğrudan PDF indirebilir veya Yazdır seçeneğiyle tarayıcı yazıcınız üzerinden PDF kaydedebilirsiniz.'
    }
  ];

  const faqs = [
    {
      question: 'Markdown nedir ve döküman yazmak için neden idealdir?',
      answer: 'Markdown, düz metin biçimlendirme dilidir. Fare kullanmadan sadece klavyeden başlık (#), liste (-), kalın (**yazı**) gibi sembollerle hızlıca şık ve standartlara uygun kurumsal yazılar yazmanızı sağlar.'
    },
    {
      question: 'Yazılarım veya dökümanlarım bir yere gönderiliyor mu?',
      answer: 'Kesinlikle hayır. EvrakFix üzerindeki diğer araçlar gibi bu editör de 100% yerel olarak çalışır. Yazdığınız hiçbir şey internete sızmaz, sunucuya aktarılmaz, yerel tarayıcınızda işlenir.'
    },
    {
      question: 'Hangi biçimlendirmeler destekleniyor?',
      answer: 'H1, H2 ve H3 başlıkları, kalın/italik/üzeri çizili metinler, harici linkler, madde işaretli ve numaralı listeler, kod blokları, yatay ayraçlar ve alıntılar desteklenmektedir.'
    },
    {
      question: 'Yazdır / Farklı Kaydet seçeneğinin farkı nedir?',
      answer: 'Bu seçenek, belgenizin CSS font tasarımlarını ve tablolarını tam olarak yansıtabilmek için tarayıcınızın kendi yazdırma motorunu kullanır. Çıkan pencereden hedef yazıcıyı "PDF Olarak Kaydet" seçerek harika tasarımlı PDF\'ler elde edebilirsiniz.'
    }
  ];

  const seoDescription = `Tarayıcı tabanlı Markdown editörü ile düz metin formatında dökümanlarınızı yazın, anlık olarak HTML önizleyin ve cihazınızda güvenle PDF formatına dönüştürüp indirin. Sunucu yüklemesi olmadan gizliliğinizi koruyun.`;

  const exampleUsage = `Bir ürün kullanım kılavuzu veya serbest sözleşme taslağı yazmanız gerekiyor. Sol panele başlıkları ve maddeleri yazarsınız. Sağ panelde çıktıyı anlık takip edersiniz. Yazdırma simgesine tıklayıp tarayıcının sistem penceresinden 'PDF Olarak Kaydet' diyerek, kurumsal stilde A4 PDF kılavuzunuzu 5 saniyede oluşturup indirebilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Markdown Editör & PDF Dönüştürücü</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Markdown kodları ile profesyonel dökümanlar yazın, canlı önizleyin ve cihazınızda PDF formatına dönüştürün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Metinleriniz ve döküman içeriğiniz tamamen yerel tarayıcınızda işlenir. İnternete gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {error && (
        <Alert variant="error" icon={<Trash2 className="h-5 w-5" />}>
          {error}
        </Alert>
      )}

      {/* Main card - Toolbar + Editor/Preview Workspace */}
      <Card className="flex flex-col border-slate-100 bg-white shadow-sm overflow-hidden min-h-[500px]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3.5 bg-slate-50 border-b border-slate-100">
          <button 
            type="button" 
            title="Başlık 1" 
            onClick={() => insertTag('# $', 'Başlık 1')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="Başlık 2" 
            onClick={() => insertTag('## $', 'Başlık 2')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button 
            type="button" 
            title="Kalın" 
            onClick={() => insertTag('**$**', 'kalın yazı')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="İtalik" 
            onClick={() => insertTag('*$*', 'italik yazı')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button 
            type="button" 
            title="Liste" 
            onClick={() => insertTag('- $', 'Madde')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="Alıntı" 
            onClick={() => insertTag('> $', 'Alıntı metni')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="Kod Bloğu" 
            onClick={() => insertTag('```\n$\n```', 'kod')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Code className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="Tablo" 
            onClick={() => insertTag('| Başlık 1 | Başlık 2 |\n| --- | --- |\n| $ | Hücre |')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Table className="h-4 w-4" />
          </button>
          <button 
            type="button" 
            title="Ayraç" 
            onClick={() => insertTag('\n---\n$')} 
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-650 transition cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-slate-200 mx-1" />
          
          <button 
            type="button" 
            title="Örnek Doldur" 
            onClick={() => setMarkdown(sampleMarkdown)} 
            className="px-2 py-1 rounded-lg hover:bg-slate-200 text-blue-650 font-bold text-xs transition cursor-pointer"
          >
            Örnek Şablon
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => { if(confirm('Tüm yazıyı silmek istediğinize emin misiniz?')) setMarkdown(''); }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
              title="Temizle"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="border-slate-200 text-slate-650 text-xs font-bold flex items-center gap-1 cursor-pointer py-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Yazdır / Farklı Kaydet
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={isExporting || !markdown.trim()}
              onClick={handleExportPdf}
              className="bg-blue-600 hover:bg-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer py-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Cihazda PDF Yap
            </Button>
          </div>
        </div>

        {/* Split View Editor & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 flex-1">
          {/* Left - Text Editor Area */}
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Markdown biçimlendirmeli yazılarınızı buraya yazın..."
            className="w-full h-[380px] md:h-[450px] p-5 font-mono text-slate-800 text-xs sm:text-sm resize-none focus:outline-none bg-slate-50/20"
          />

          {/* Right - HTML Live Preview Panel */}
          <div className="p-5 overflow-y-auto h-[380px] md:h-[450px] bg-white text-slate-800">
            {markdown.trim() === '' ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 font-light">
                <Edit3 className="h-8 w-8 text-slate-350" />
                <span className="text-xs">Yazmaya başladığınızda döküman önizlemesi burada görünecektir.</span>
              </div>
            ) : (
              <div 
                className="prose prose-sm prose-slate max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Hidden printing iframe */}
      <iframe ref={iframeRef} className="hidden" style={{ display: 'none' }} />

      <ToolSEOInfo
        toolName="Markdown Editör & PDF Dönüştürücü"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

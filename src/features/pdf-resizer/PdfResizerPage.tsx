import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { resizePdf } from './pdfResizer.service';
import type { PageSizePreset } from './pdfResizer.service';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { downloadBlob } from '../../lib/files/downloadFile';
import { Shield, AlertCircle, Download, FileText, Maximize2, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfResizerPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);

  const [preset, setPreset] = React.useState<PageSizePreset>('A4');
  const [margin, setMargin] = React.useState(20); // default margin of 20 points

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
      const blob = await resizePdf(
        file,
        { preset, margin },
        (current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      );
      setResultBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'PDF yeniden boyutlandırılırken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    downloadBlob(resultBlob, `${file.name.split('.')[0]}-${preset.toLowerCase()}.pdf`);
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
          PDF Sayfa Boyutu & Kenar Payı Düzenleyici
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgelerinizi A4, Letter veya A3 gibi standart boyutlara yeniden ölçeklendirin, özel kenar boşlukları ekleyin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Boyut düzenleme işlemi tamamen tarayıcınızda yapılır. Dosyalarınız hiçbir uzak sunucuya aktarılmaz.</span>
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
            title="Yeniden boyutlandırmak istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Dosya tamamen tarayıcınızda işlenir, sunucuya yüklenmez."
          />
        ) : isProcessing ? (
          /* Processing Loader */
          <div className="flex flex-col items-center justify-center p-12 gap-4 text-slate-500 text-sm">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-slate-800">PDF Yeniden Boyutlandırılıyor...</span>
              <span>Sayfa düzenleniyor: %{progress}</span>
            </div>
            <div className="w-64 bg-slate-150 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Settings workspace */
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
              {/* Option 1: Preset */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600">Hedef Sayfa Boyutu</label>
                <Select
                  value={preset}
                  onChange={(e: any) => setPreset(e.target.value as PageSizePreset)}
                  options={[
                    { value: 'A4', label: 'A4 Boyutu (595 x 841 pt)' },
                    { value: 'Letter', label: 'Letter Boyutu (612 x 792 pt)' },
                    { value: 'A3', label: 'A3 Boyutu (841 x 1190 pt)' },
                    { value: 'A5', label: 'A5 Boyutu (419 x 595 pt)' },
                  ]}
                />
              </div>

              {/* Option 2: Margin Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Kenar Boşluğu (Margin)</span>
                  <span className="text-blue-650">{margin} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[10px] text-slate-400">
                  Dökümanın kenarlardan alacağı güvenlik payını ayarlayın.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {!resultBlob ? (
                <Button
                  variant="primary"
                  onClick={handleProcess}
                  className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  Belgeyi Yeniden Boyutlandır
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                    className="w-full sm:flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Düzenlenmiş PDF'i İndir
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

        {/* Error message */}
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
        toolName="PDF Sayfa Boyutu & Kenar Payı Düzenleyici"
        description="EvrakFix PDF Sayfa Boyutu & Kenar Payı Düzenleyici (PDF Resizer), PDF dökümanlarınızın sayfa boyutlarını standart A4, A3, A5 veya Letter formatlarına dönüştürmenizi sağlar. Sayfa kenarlarındaki yazıları korumak veya çıktı alırken zımbalama payı bırakmak için özel kenar boşlukları (margins) ekleyebilirsiniz. En büyük avantajı, sayfaları resme dönüştürmeden doğrudan vektör düzeyinde ölçeklemesidir; böylece yazılarınızın netliği bozulmaz ve arama seçilebilirliği aynen korunur.

■ PDF Resizer Nedir?
PDF resizer, dökümanın sayfa alanlarını (MediaBox/CropBox) ölçeklendirerek sayfaları A4 veya Letter gibi standart yazıcı boyutlarına uyumlu hale getiren ve kenar boşluklarını milimetrik olarak ayarlayan gelişmiş bir düzenleyicidir.

■ Sayfa Boyutları Nasıl A4 Yapılır?
PDF dosyanızı yükleyin. Hedef sayfa boyutu listesinden 'A4 Boyutu' seçeneğini işaretleyin. Kayma olmaması için kenar boşluğunu (örneğin 20 pt) ayarlayıp 'Boyutlandır' butonuna basın. Vektör kalitesinde derlenen yeni PDF belgeniz saniyeler içinde inecektir.

■ Vektörel Ölçeklendirme Nedir?
Geleneksel araçlar sayfayı resme çevirip büyüttüğü için metin kalitesi bulanıklaşır ve yazıların seçilmesi/kopyalanması engellenir. EvrakFix ise sayfa katmanlarını doğrudan PDF kod yapısı içinde embed ederek yeniden çizer; bu sayede döküman orijinalliğini ve metin seçilebilirliğini korur.

■ Boyut Değiştirme Güvenli mi?
Evet. EvrakFix sunucusuz (client-side) çalışır. İşlediğiniz PDF belgeleri veya sözleşmeler internetteki uzak sunuculara yüklenmez, doğrudan kendi bilgisayarınızın tarayıcısında işlenir. Gizliliğiniz tarayıcı düzeyinde koruma altındadır."
        exampleUsage="Letter formatında hazırlanmış yabancı bir raporu veya faturayı, ülkemizdeki standart yazıcılarla tam uyumlu olması için A4 boyutuna ölçekleyebilir ve zımbalama payı için kenarlardan boşluk ekleyebilirsiniz."
        steps={[
          {
            title: "PDF Dosyasını Yükleyin",
            description: "Boyutunu ve kenar paylarını değiştirmek istediğiniz PDF dökümanını sürükleyip bırakarak yükleyin."
          },
          {
            title: "Boyut ve Boşluk Seçin",
            description: "Dönüştürmek istediğiniz hedef boyutu (A4, A3, Letter vb.) seçin ve kenar payı sürgüsünü ayarlayın."
          },
          {
            title: "İşleyin ve İndirin",
            description: "'Belgeyi Yeniden Boyutlandır' butonuna tıklayarak işlemi başlatın, tamamlandığında PDF'inizi anında indirin."
          }
        ]}
        faqs={[
          {
            question: "Belgelerim ve verilerim sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dosyası hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak işlenir."
          },
          {
            question: "Boyutlandırma sonrasında PDF’teki yazılar kopyalanabilir kalır mı?",
            description: "Evet. Sayfalar resme dönüştürülmez. Orijinal vektörel yapı korunduğu için PDF içerisindeki metin arama ve metin kopyalama özellikleri aynen aktif kalır."
          },
          {
            question: "Kenar boşluğu eklemek ne işe yarar?",
            description: "Özellikle kitapçık basımlarında, ciltleme veya zımbalama yapıldığında sayfa kenarındaki metinlerin kaybolmaması için kenar marjı eklemek kritik öneme sahiptir."
          },
          {
            question: "Yatay (Landscape) sayfalar dikey (Portrait) olur mu?",
            description: "Seçtiğiniz preset boyuta göre sayfalar otomatik ölçeklenir ve ortalanır. Geniş sayfaların bozulmaması için orijinal en/boy oranını koruyarak yeni sayfa sınırlarına sığdırılır."
          },
          {
            question: "Bu araç ücretli midir veya limit var mıdır?",
            description: "Hayır. PDF Resizer tamamen ücretsizdir ve herhangi bir dosya yükleme sınırı veya kota bulunmamaktadır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default PdfResizerPage;

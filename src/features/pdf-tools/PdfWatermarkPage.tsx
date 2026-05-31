import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { addTextToPdf, addWatermarkToPdf, type TextOptions, type WatermarkOptions } from './pdfTools.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { formatDate } from '../../lib/utils/formatDate';
import { PDFDocument } from 'pdf-lib';
import { Shield, FileCheck, RefreshCw, Download, AlertCircle, FileText, Layers, Type, Calendar } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';

export const PdfWatermarkPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [mode, setMode] = React.useState<'watermark' | 'text'>('watermark');
  const [text, setText] = React.useState('');
  
  // Custom states
  const [textOptions, setTextOptions] = React.useState<TextOptions>({
    position: 'bottom-right',
    fontSize: 12,
  });

  const [watermarkOptions, setWatermarkOptions] = React.useState<WatermarkOptions>({
    opacity: 0.2,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);

  // Load and read PDF document
  const handleFileSelected = async (selectedFiles: File[]) => {
    setError(null);
    setResultBlob(null);
    setTotalPages(0);

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
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();

      if (count === 0) {
        throw new Error('PDF dökümanı boş.');
      }

      setFile(selectedFile);
      setTotalPages(count);
    } catch (err: any) {
      setError(err.message || 'PDF dökümanı okunurken hata oluştu.');
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset text buttons
  const applyPreset = (preset: 'date' | 'name' | 'approved') => {
    if (preset === 'date') {
      setText(formatDate(new Date()));
    } else if (preset === 'name') {
      setText('Ad Soyad: _________________');
    } else if (preset === 'approved') {
      setText('ONAYLANDI');
    }
  };

  // Reset page
  const handleClear = () => {
    setFile(null);
    setTotalPages(0);
    setText('');
    setMode('watermark');
    setTextOptions({
      position: 'bottom-right',
      fontSize: 12,
    });
    setWatermarkOptions({
      opacity: 0.2,
    });
    setError(null);
    setResultBlob(null);
    setIsLoading(false);
  };

  // Execute processing
  const handleApply = async () => {
    if (!file) {
      setError('Lütfen önce geçerli bir PDF dosyası yükleyin.');
      return;
    }
    if (!text.trim()) {
      setError('Lütfen eklenecek metni yazın.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let blob: Blob;
      if (mode === 'watermark') {
        blob = await addWatermarkToPdf(file, text, watermarkOptions);
      } else {
        blob = await addTextToPdf(file, text, textOptions);
      }
      setResultBlob(blob);
    } catch (err: any) {
      setError(err.message || 'İşlem sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download resulting PDF
  const handleDownload = () => {
    if (resultBlob && file) {
      const suffix = mode === 'watermark' ? 'filigranli' : 'metinli';
      downloadBlob(resultBlob, `evrakfix-${suffix}-${file.name}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Filigran / Metin Ekle</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgenizin tüm sayfalarına çapraz filigran ekleyin veya ilk sayfasının istediğiniz köşesine tarih/metin yazın.
        </p>
      </div>

      {/* Security notice */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600" />}>
        Dosyalarınız tamamen tarayıcınızda işlenir. Hiçbir sunucuya veri aktarılmaz.
      </Alert>

      {/* Workspace card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!resultBlob && (
          <>
            {/* Step 1: File dropzone */}
            {!file && (
              <Dropzone
                onFilesSelected={handleFileSelected}
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="İşlem yapmak istediğiniz PDF dökümanını buraya sürükleyin veya seçin"
                description="Tek dosya kabul edilir. Maksimum dosya boyutu limit: 50MB."
              />
            )}

            {/* Error handling */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Step 2: Config panel */}
            {file && totalPages > 0 && (
              <div className="flex flex-col gap-6">
                {/* File summary banner */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <FileText className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate pr-2">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        {formatFileSize(file.size)} • Toplam {totalPages} Sayfa
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleClear} className="font-semibold text-xs h-9 px-3.5">
                    Değiştir
                  </Button>
                </div>

                {/* Mode tabs */}
                <div className="flex border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setMode('watermark'); setResultBlob(null); setError(null); }}
                    className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                      mode === 'watermark'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Çapraz Filigran Ekle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('text'); setResultBlob(null); setError(null); }}
                    className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition-all ${
                      mode === 'text'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Type className="h-4 w-4" />
                    <span>Tarih / Metin Ekle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left: Input Text Field */}
                  <div className="flex flex-col gap-5">
                    <Input
                      label={mode === 'watermark' ? 'Filigran Metni' : 'Eklenecek Metin'}
                      placeholder={mode === 'watermark' ? 'Örn: GİZLİ, TASLAK' : 'Örn: İsim, tarih yazın...'}
                      value={text}
                      onChange={(e) => { setText(e.target.value); setError(null); }}
                    />

                    {/* Presets only for text mode */}
                    {mode === 'text' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Hazır Şablonlar</span>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('date')}
                            leftIcon={<Calendar className="h-3.5 w-3.5 text-slate-500" />}
                            className="text-xs h-8 px-3 rounded-lg"
                          >
                            Bugünün Tarihi
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('name')}
                            className="text-xs h-8 px-3 rounded-lg"
                          >
                            Ad Soyad Alanı
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPreset('approved')}
                            className="text-xs h-8 px-3 rounded-lg"
                          >
                            "Onaylandı"
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Layout Config parameters */}
                  <div className="flex flex-col gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                      Düzen Seçenekleri
                    </h3>

                    {/* Mode specific parameters */}
                    {mode === 'watermark' ? (
                      <>
                        <Select
                          label="Opaklık Derecesi"
                          value={watermarkOptions.opacity}
                          onChange={(e) => setWatermarkOptions({ opacity: parseFloat(e.target.value) })}
                          options={[
                            { value: '0.1', label: 'Çok Hafif (%10)' },
                            { value: '0.2', label: 'Hafif (%20 - Önerilen)' },
                            { value: '0.3', label: 'Belirgin (%30)' },
                            { value: '0.4', label: 'Koyu (%40)' },
                          ]}
                        />
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Filigran belgenizin **tüm sayfalarına** 45 derece açıyla çapraz olarak uygulanacaktır.
                        </p>
                      </>
                    ) : (
                      <>
                        <Select
                          label="Konum"
                          value={textOptions.position}
                          onChange={(e) => setTextOptions((prev) => ({ ...prev, position: e.target.value as any }))}
                          options={[
                            { value: 'top-left', label: 'Sol Üst Köşe' },
                            { value: 'top-right', label: 'Sağ Üst Köşe' },
                            { value: 'bottom-left', label: 'Sol Alt Köşe' },
                            { value: 'bottom-right', label: 'Sağ Alt Köşe' },
                          ]}
                        />

                        <Select
                          label="Font Boyutu"
                          value={textOptions.fontSize}
                          onChange={(e) => setTextOptions((prev) => ({ ...prev, fontSize: parseInt(e.target.value, 10) }))}
                          options={[
                            { value: '10', label: 'Küçük (10pt)' },
                            { value: '12', label: 'Standart (12pt)' },
                            { value: '14', label: 'Orta (14pt)' },
                            { value: '16', label: 'Büyük (16pt)' },
                          ]}
                        />
                        
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Metin dökümanın sadece **ilk sayfasında** seçilen konuma yerleştirilecektir.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Execute bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                  <div className="text-center sm:text-left">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase block">Uygulanacak İşlem</span>
                    <span className="text-sm font-extrabold text-slate-700">
                      {mode === 'watermark' ? 'Tüm Sayfalara Çapraz Filigran' : `İlk Sayfaya Yazı (${textOptions.position === 'top-right' ? 'Sağ Üst' : textOptions.position === 'bottom-right' ? 'Sağ Alt' : textOptions.position === 'top-left' ? 'Sol Üst' : 'Sol Alt'})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto font-semibold">
                      İptal Et
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleApply}
                      isLoading={isLoading}
                      disabled={!text.trim()}
                      className="w-full sm:w-auto font-semibold shadow-md shadow-blue-600/10"
                    >
                      Metni Uygula
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Success screen */}
        {resultBlob && file && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileCheck className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">İşlem Başarılı</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Metin/Filigran PDF'e Eklendi!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                "{file.name}" dökümanı başarıyla güncellendi ve indirmeniz için hazır.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni İşlem Yap
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                leftIcon={<Download className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-blue-600/15"
              >
                Sonucu İndir
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF Filigran ve Metin Ekleme"
        description="PDF Filigran aracımız, telif haklarınızı korumak ve belgelerinize kurumsal kimlik kazandırmak için ideal bir çözümdür. Dökümanlarınızın tüm sayfalarına 45 derece eğik açıyla büyük, yarı saydam çapraz filigranlar basabilir veya ilk sayfada dilediğiniz köşeye (Sol Üst, Sağ Üst vb.) tarih, isim, onay veya kaşe gibi özel metinler yerleştirebilirsiniz. Tamamen tarayıcınızda ve yerel belleğinizde derlenen bu sistemde, verileriniz asla sunucularımıza gitmez."
        steps={[
          {
            title: "PDF Dökümanını Yükleyin",
            description: "Filigran basmak veya tarih/metin eklemek istediğiniz PDF dökümanını sürükleyip bırakarak sisteme yükleyin."
          },
          {
            title: "Filigran / Metin Ayarlarını Girin",
            description: "İster tüm sayfalara 'KOPYA' veya 'TASLAK' gibi çapraz filigranlar yazın, ister tek bir köşeye özel tarih ve metin ekleyin."
          },
          {
            title: "Filigranı Basıp İndirin",
            description: "Filigran opaklığı (saydamlığı) ve metin boyutunu belirledikten sonra 'Filigran Ekle' diyerek anında yeni PDF dosyanızı indirin."
          }
        ]}
        faqs={[
          {
            question: "Filigran PDF belgesinin tüm sayfalarına otomatik uygulanır mı?",
            description: "Evet. 'Çapraz Filigran Ekle' modunu kullandığınızda yazdığınız filigran metni PDF belgenizdeki tüm sayfalara otomatik olarak 45 derece eğimle ve orantılı boyutta uygulanır. 'Tarih / Metin Ekle' modu ise sadece dökümanın ilk sayfasına uygulanır."
          },
          {
            question: "Hızlı doldurma butonları ne işe yarar?",
            description: "Tarih ve Metin modunda yer alan 'Bugünün Tarihi', 'Ad Soyad' veya 'Onaylandı' gibi hızlı şablon butonları, el yazısıyla uğraşmadan tek tıkla girdiyi doldurmanızı ve zamandan tasarruf etmenizi sağlar."
          },
          {
            question: "Eklenen filigranlar dökümanın okunmasını engeller mi?",
            description: "Hayır. Filigran opaklığı (transparency) ve yazı boyutları tamamen ayarlanabilirdir. Varsayılan olarak yarı şeffaf basıldığı için alttaki yazıların okunurluğunu kesinlikle bozmaz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default PdfWatermarkPage;

import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { applyScanFilters } from './documentScanner.service';
import type { ScanOptions } from './documentScanner.service';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob } from '../../lib/files/downloadFile';
import { Shield, AlertCircle, FileText, RotateCw, Image as ImageIcon } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const DocumentScannerPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [mode, setMode] = React.useState<ScanOptions['mode']>('magic');
  const [brightness, setBrightness] = React.useState(0);
  const [contrast, setContrast] = React.useState(15);
  const [threshold, setThreshold] = React.useState(128);
  const [rotation, setRotation] = React.useState<number>(0); // 0, 90, 180, 270

  const sourceImageRef = React.useRef<HTMLImageElement | null>(null);
  const sourceCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const targetCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Load image when file is selected
  React.useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setRotation(0);
        setBrightness(0);
        setContrast(15);
        setThreshold(128);
        setMode('magic');
      }
    };
    reader.readAsDataURL(file);
  }, [file]);

  // Redraw when image, rotation, or filter changes
  React.useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      sourceImageRef.current = img;
      renderImageAndApplyFilters();
    };
  }, [imageSrc, rotation, mode, brightness, contrast, threshold]);

  const renderImageAndApplyFilters = () => {
    const img = sourceImageRef.current;
    if (!img) return;

    const srcCanvas = sourceCanvasRef.current || document.createElement('canvas');
    sourceCanvasRef.current = srcCanvas;
    const tgtCanvas = targetCanvasRef.current;
    if (!tgtCanvas) return;

    const srcCtx = srcCanvas.getContext('2d');
    if (!srcCtx) return;

    // Handle rotation on the source canvas
    const isRotated90or270 = rotation === 90 || rotation === 270;
    const width = isRotated90or270 ? img.height : img.width;
    const height = isRotated90or270 ? img.width : img.height;

    srcCanvas.width = width;
    srcCanvas.height = height;

    srcCtx.clearRect(0, 0, width, height);
    srcCtx.save();

    // Translate to center to rotate
    srcCtx.translate(width / 2, height / 2);
    srcCtx.rotate((rotation * Math.PI) / 180);
    srcCtx.drawImage(img, -img.width / 2, -img.height / 2);
    srcCtx.restore();

    // Apply scanning filters to target canvas
    applyScanFilters(srcCanvas, tgtCanvas, {
      mode,
      brightness,
      contrast,
      threshold,
    });
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Lütfen yalnızca geçerli bir resim dosyası (.jpg, .png, .jpeg, .webp) yükleyin.');
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const downloadImage = () => {
    const canvas = targetCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `tarama-${file?.name.split('.')[0] || 'belge'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadPdf = async () => {
    const canvas = targetCanvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      // Standard A4 dimensions in points
      const a4Width = 595.28;
      const a4Height = 841.89;

      const page = pdfDoc.addPage([a4Width, a4Height]);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const img = await pdfDoc.embedJpg(bytes);
      
      // Calculate scaling to fit A4 page preserving aspect ratio
      const scaleX = a4Width / canvas.width;
      const scaleY = a4Height / canvas.height;
      const scale = Math.min(scaleX, scaleY);

      const drawWidth = canvas.width * scale;
      const drawHeight = canvas.height * scale;

      // Center on page
      const x = (a4Width - drawWidth) / 2;
      const y = (a4Height - drawHeight) / 2;

      page.drawImage(img, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `tarama-${file?.name.split('.')[0] || 'belge'}.pdf`);
    } catch (err: any) {
      console.error(err);
      setError('PDF belgesi oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setImageSrc(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Belge Tarayıcı
        </h1>
        <p className="text-slate-500 text-sm">
          Telefonunuzla çektiğiniz evrak fotoğraflarını netleştirin, gölgelerinden arındırın ve PDF/Resim formatında kaydedin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Görselleriniz tamamen yerel tarayıcınızda işlenir. Resim verileriniz hiçbir sunucuya yüklenmez ve kaydedilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Grid */}
      <Card className="p-6 md:p-8">
        {!file ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
            multiple={false}
            title="Tarayacağınız evrak fotoğrafını buraya sürükleyin veya seçin"
            description="Dosya tamamen tarayıcınızda işlenir, sunucuya yüklenmez."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Column: Workspace Preview */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 truncate max-w-xs">{file.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRotate}
                    className="border-slate-200 hover:bg-slate-100 text-slate-650 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Döndür
                  </Button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  >
                    Kaldır
                  </button>
                </div>
              </div>

              {/* Target Canvas Container */}
              <div className="bg-slate-900 rounded-2xl flex items-center justify-center p-4 border border-slate-800 shadow-inner overflow-auto min-h-[350px] max-h-[500px]">
                <canvas
                  ref={targetCanvasRef}
                  className="max-w-full h-auto object-contain rounded shadow-lg"
                />
              </div>
            </div>

            {/* Right Column: Settings Panel */}
            <div className="flex flex-col gap-6 justify-between">
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Tarama Ayarları
                </h3>

                {/* Filter Mode Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Tarama Filtresi</label>
                  <Select
                    value={mode}
                    onChange={(e: any) => setMode(e.target.value)}
                    options={[
                      { value: 'magic', label: 'Sihirli Renk (Magic Scan)' },
                      { value: 'original', label: 'Orijinal (Filtresiz)' },
                      { value: 'grayscale', label: 'Gri Tonlama (Grayscale)' },
                      { value: 'mono', label: 'Siyah-Beyaz Tarama (Mono)' },
                    ]}
                  />
                </div>

                {/* Brightness slider */}
                {mode !== 'mono' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Parlaklık</span>
                      <span className="text-blue-650">{brightness > 0 ? `+${brightness}` : brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                {/* Contrast slider */}
                {mode !== 'mono' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Kontrast</span>
                      <span className="text-blue-650">{contrast > 0 ? `+${contrast}` : contrast}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                {/* Threshold slider for Mono */}
                {mode === 'mono' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Eşik Değeri (Netlik)</span>
                      <span className="text-blue-650">{threshold}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-[10px] text-slate-400">
                      Yazıların kalınlığını ve temizliğini bu sürgüyle ayarlayın.
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  onClick={downloadPdf}
                  disabled={isProcessing}
                  className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF Olarak İndir (A4)
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadImage}
                  disabled={isProcessing}
                  className="w-full font-bold border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer h-11 flex items-center justify-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Görsel Olarak İndir (PNG)
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Error message */}
      {error && (
        <div className="mt-4">
          <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
            {error}
          </Alert>
        </div>
      )}

      {/* SEO Content Section */}
      <ToolSEOInfo
        toolName="Belge Tarayıcı"
        description="EvrakFix Belge Tarayıcı (Scan & Contrast Filter) aracımız, akıllı telefonunuzun kamerasıyla çektiğiniz veya bilgisayarınızda bulunan evrak resimlerini tarayıp netleştirmenizi sağlar. Çekimden kaynaklı oluşan sayfa kenarı gölgelerini temizler, kağıt rengini beyazlaştırır ve siyah yazıları belirginleştirir. Tamamen yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz kişisel evrak, makbuz, kimlik fotokopisi veya sınav kağıdı resimleri hiçbir sunucuya yüklenmez ve gizliliğiniz korunur.

■ Belge Tarayıcı Nedir?
Belge tarayıcı, mobil kameralarla çekilen belgelerin gölgeli, eğik veya yetersiz ışıklı resimlerini analiz ederek resmi bir ofis tarayıcısından (flatbed scanner) taranmış gibi düz, beyaz arka planlı ve yüksek kontrastlı bir PDF/resim dökümanına dönüştüren araçtır.

■ Evrak Fotoğrafları Nasıl Netleştirilir?
Evrak resminizi seçin. 'Sihirli Renk' (Magic Scan) filtresini seçtiğinizde sistem otomatik olarak koyu gölgeleri beyazlaştırır ve yazıları koyulaştırır. İsteğinize göre döndürerek yönünü düzeltin. Sonrasında PDF olarak kaydedip çıktıya hazır hale getirin.

■ PDF veya PNG İndirme Seçenekleri Nedir?
- PDF Olarak İndir: Resmi yazışmalar veya e-devlet yüklemeleri için dökümanı standart A4 boyutuna hizalayarak yüksek kaliteli bir PDF haline getirir.
- Görsel Olarak İndir: Resmi doğrudan temizlenmiş ve yönü düzeltilmiş bir PNG dosyası olarak kaydeder.

■ Belge Tarayıcı Güvenli mi?
Evet. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Görselleriniz veya kimlik fotokopileriniz internet üzerinden hiçbir uzak sunucuya aktarılmaz, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın tarayıcı belleğinde gerçekleşir."
        exampleUsage="Telefonunuzun kamerasıyla çektiğiniz bir kira sözleşmesinin veya gider makbuzunun fotoğrafını yükleyerek gölgeleri temizleyebilir, yönünü döndürebilir ve A4 boyutunda resmi bir PDF dökümanı olarak kaydedip e-posta ile gönderebilirsiniz."
        steps={[
          {
            title: "Fotoğrafı Yükleyin",
            description: "Tarayıp netleştirmek istediğiniz evrak fotoğrafını (JPG, PNG, WebP) sürükleyip bırakarak yükleyin."
          },
          {
            title: "Filtre ve Ayarları Düzenleyin",
            description: "Sihirli Renk veya Siyah-Beyaz modlarından birini seçip parlaklık, kontrast veya yön açısını ayarlayın."
          },
          {
            title: "PDF veya PNG Olarak İndirin",
            description: "Ayarlar bittiğinde 'PDF Olarak İndir' butonuna tıklayarak taranmış resmi dökümanınızı anında indirin."
          }
        ]}
        faqs={[
          {
            question: "Evrak fotoğraflarım veya belgelerim sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Resimleriniz hiçbir sunucuya aktarılmadan doğrudan cihazınızın tarayıcısında işlenir."
          },
          {
            question: "Sihirli Renk (Magic Scan) filtresi ne işe yarar?",
            description: "Sihirli renk filtresi, evrak resmindeki kağıt dokusu gölgelerini ve sarı oda ışığı lekelerini beyazlaştırırken, mürekkep yazılarının ve renkli logoların kalitesini artırarak yazıcı dostu bir çıktı sunar."
          },
          {
            question: "Yamuk çekilen fotoğrafların yönünü düzeltebilir miyim?",
            description: "Evet. 'Döndür' butonu yardımıyla ters veya yan taranmış evrak resimlerinizi saat yönünde 90 derecelik açılarla çevirip düzeltebilirsiniz."
          },
          {
            question: "Tarama sonrası dosya boyutu çok büyük olur mu?",
            description: "Hayır. Araç, resmi PDF'e aktarırken JPEG sıkıştırma standartlarını kullanarak dosya boyutunu e-posta eki veya e-devlet yükleme sınırlarına uygun şekilde optimize eder."
          },
          {
            question: "Bu aracı mobil cihazlarda kullanabilir miyim?",
            description: "Evet. Mobil tarayıcılarla tam uyumludur. Akıllı telefonunuzdan girdiğinizde doğrudan kameranızı açıp anlık evrak fotoğrafı çekerek tarayabilirsiniz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default DocumentScannerPage;

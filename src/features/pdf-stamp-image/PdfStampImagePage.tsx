import * as React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { addStampToPdf } from './pdfStamp.service';
import type { StampOptions } from './types';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, RefreshCw, AlertCircle, Download, FileText, Image as ImageIcon, Award } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfStampImagePage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadedBlob, setDownloadedBlob] = React.useState<Blob | null>(null);

  // PDF Preview States
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  // Stamp Customization States
  const [stampSource, setStampSource] = React.useState<'preset' | 'upload'>('preset');
  
  // Preset States
  const [presetText, setPresetText] = React.useState('ASLI GİBİDİR');
  const [presetColor, setPresetColor] = React.useState('#dc2626'); // red-600
  
  // Upload States
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);

  // Positioning States (percentages 0-100)
  const [xPercent, setXPercent] = React.useState(70);
  const [yPercent, setYPercent] = React.useState(10);
  const [stampWidth, setStampWidth] = React.useState(150);
  const [stampHeight, setStampHeight] = React.useState(50);
  const [opacity, setOpacity] = React.useState(0.85);
  const [rotation, setRotation] = React.useState(0);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Load PDF for visual preview using pdfjs-dist
  React.useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPageIndex(0);
      } catch (err) {
        console.error('Failed to load PDF document for preview:', err);
        setError('Belge önizlemesi yüklenirken bir hata oluştu.');
      }
    };
    loadPdf();
  }, [file]);

  // Render current page to canvas preview
  React.useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPageIndex + 1);
        const viewport = page.getViewport({ scale: 1.0 });
        
        if (isCancelled) return;
        
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Draw a visual indicator/bounding box of the stamp position on canvas preview
          drawStampIndicator(canvas, context);
        }
      } catch (err) {
        console.error('Render page error:', err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPageIndex, xPercent, yPercent, stampWidth, stampHeight, rotation, opacity, stampSource, presetText, presetColor, uploadedImage]);

  // Helper to draw stamp preview directly on the canvas preview
  const drawStampIndicator = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // PDF coordinates start bottom-left, canvas is top-left
    const w = stampWidth;
    const h = stampHeight;
    const pxX = (xPercent / 100) * canvas.width;
    const pxY = canvas.height - ((yPercent / 100) * canvas.height) - h; // invert Y

    ctx.save();
    
    // Transform coordinates for rotation if any
    ctx.translate(pxX + w / 2, pxY + h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity;

    // Draw preview bounding box
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    
    // Draw Kaşe placeholder text/image preview
    ctx.fillStyle = stampSource === 'preset' ? presetColor : '#2563eb';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stampSource === 'preset' ? presetText : 'Özel Resim Kaşesi', 0, 0);

    ctx.restore();
  };

  // Click on canvas preview to position the stamp
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Translate click pixels to percentages
    const pctX = (clickX / rect.width) * 100;
    // PDF origin is bottom-left: subtract click Y from height. 
    // Subtract half height of stamp in percentage so click represents stamp center
    const pctY = ((rect.height - clickY) / rect.height) * 100;

    // Clamp values (0 to 100)
    setXPercent(Math.max(0, Math.min(100, Math.round(pctX))));
    setYPercent(Math.max(0, Math.min(100, Math.round(pctY))));
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isImg = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
      if (!isImg) {
        setError('Lütfen yalnızca PNG veya JPG formatında resim dosyası seçin.');
        return;
      }
      setUploadedImage(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate the official double-border office Kaşe on canvas in-memory
  const generatePresetKaşeBlob = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw border
      ctx.strokeStyle = presetColor;
      ctx.lineWidth = 5;
      ctx.strokeRect(10, 10, 280, 80);
      
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, 268, 68);
      
      // Text
      ctx.fillStyle = presetColor;
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(presetText, 150, 50);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
  };

  // Execute embedding
  const handleApplyStamp = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      let imageBlob: Blob | File | null = null;
      if (stampSource === 'preset') {
        imageBlob = await generatePresetKaşeBlob();
      } else {
        imageBlob = uploadedImage;
      }

      if (!imageBlob) {
        throw new Error('Lütfen kaşe basılacak resmi yükleyin.');
      }

      const options: StampOptions = {
        pageIndex: currentPageIndex,
        x: xPercent,
        y: yPercent,
        width: stampWidth,
        height: stampHeight,
        opacity,
        rotation
      };

      const processedBlob = await addStampToPdf(file, imageBlob, options);
      setDownloadedBlob(processedBlob);
      setSuccess(true);
      
      // Auto download
      downloadBlob(processedBlob, 'evrakfix-kaseli.pdf');
    } catch (err: any) {
      console.error('Stamp application error:', err);
      setError(err.message || 'Kaşe eklenirken hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PDF file selection
  const handlePdfSelected = (selectedFiles: File[]) => {
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
  };

  const handleClear = () => {
    setFile(null);
    setPdfDoc(null);
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);
    setUploadedImage(null);
    setImagePreviewUrl(null);
    setXPercent(70);
    setYPercent(10);
  };

  // Dropdown list for pages
  const pageOptions = Array.from({ length: numPages }).map((_, idx) => ({
    value: String(idx),
    label: `${idx + 1}. Sayfa`
  }));

  const presetOptions = [
    { value: 'ASLI GİBİDİR', label: 'ASLI GİBİDİR' },
    { value: 'ONAYLANDI', label: 'ONAYLANDI' },
    { value: 'İPTAL EDİLDİ', label: 'İPTAL EDİLDİ' },
    { value: 'GİZLİDİR', label: 'GİZLİDİR' },
    { value: 'ÖDENDİ', label: 'ÖDENDİ' },
    { value: 'KOPYADIR', label: 'KOPYADIR' }
  ];

  const colorOptions = [
    { value: '#dc2626', label: 'Kırmızı Kaşe' },
    { value: '#2563eb', label: 'Mavi Kaşe' },
    { value: '#16a34a', label: 'Yeşil Kaşe' },
    { value: '#0f172a', label: 'Siyah Kaşe' }
  ];

  const rotationOptions = [
    { value: '0', label: '0 Derece' },
    { value: '15', label: '15 Derece (Eğik)' },
    { value: '30', label: '30 Derece' },
    { value: '90', label: '90 Derece' },
    { value: '180', label: '180 Derece' },
    { value: '270', label: '270 Derece' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF’e Kaşe & Resim Ekle</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF dökümanlarınıza kurumsal kaşe basabilir veya el yazısı imzanızın resmini (PNG/JPG) yükleyerek yerleştirebilirsiniz.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm işlemler tarayıcınızda yerel olarak gerçekleşir. PDF belgeniz ve yüklediğiniz resimler hiçbir sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Editor Frame */}
      <Card className="p-6 md:p-8">
        {!file ? (
          /* Dropzone */
          <Dropzone
            onFilesSelected={handlePdfSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Kaşe veya resim eklemek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Maksimum 50 MB, tüm işlemler tarayıcınızda yerel olarak yapılır."
          />
        ) : (
          /* Editor Grid Panel */
          <div className="flex flex-col gap-6">
            {/* Header info */}
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
                    {formatFileSize(file.size)}
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

            {/* Success Message */}
            {success && downloadedBlob && (
              <Alert variant="success" icon={<Download className="h-5 w-5" />}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-800 text-sm">
                      Kaşe Başarıyla Eklendi!
                    </span>
                    <span className="text-xs text-emerald-650">
                      Yeni PDF belgeniz otomatik olarak indirildi.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-600/10 cursor-pointer self-start sm:self-center"
                    onClick={() => downloadBlob(downloadedBlob, 'evrakfix-kaseli.pdf')}
                  >
                    Tekrar İndir
                  </Button>
                </div>
              </Alert>
            )}

            {/* Workspace Area: Left Editor controls, Right Preview Canvas */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Controls Column */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Stamp Source tabs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kaşe Kaynağı</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStampSource('preset')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        stampSource === 'preset'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      <Award className="h-4 w-4" />
                      Resmi Hazır Kaşe
                    </button>
                    <button
                      onClick={() => setStampSource('upload')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        stampSource === 'upload'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Görsel / İmza Yükle
                    </button>
                  </div>
                </div>

                {/* Preset configuration panel */}
                {stampSource === 'preset' ? (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">Kaşe Metni</label>
                      <Select
                        value={presetText}
                        onChange={(e) => setPresetText(e.target.value)}
                        options={presetOptions}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">Kaşe Rengi</label>
                      <Select
                        value={presetColor}
                        onChange={(e) => setPresetColor(e.target.value)}
                        options={colorOptions}
                      />
                    </div>
                  </div>
                ) : (
                  /* Upload Custom Image configurations */
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-700">Görsel Dosyası (PNG/JPG)</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-350 rounded-xl bg-white cursor-pointer hover:bg-slate-50/50 transition-colors">
                        <ImageIcon className="h-6 w-6 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-600">Görsel Seçin</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {imagePreviewUrl && (
                        <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white p-1 flex items-center justify-center shrink-0">
                          <img src={imagePreviewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-450">
                      Şeffaf (transparent) el yazısı imzalar için PNG formatı tavsiye edilir.
                    </span>
                  </div>
                )}

                {/* Sizing & Positioning Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Page Select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Uygulanacak Sayfa</label>
                    <Select
                      value={String(currentPageIndex)}
                      onChange={(e) => setCurrentPageIndex(Number(e.target.value))}
                      options={pageOptions}
                    />
                  </div>

                  {/* Rotation Select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Kaşe Açısı (Döndürme)</label>
                    <Select
                      value={String(rotation)}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      options={rotationOptions}
                    />
                  </div>
                </div>

                {/* Dimensions and Opacity Sliders */}
                <div className="flex flex-col gap-4 bg-slate-50/40 p-4 rounded-2xl border border-slate-100/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Genişlik (Genişlik)</span>
                        <span>{stampWidth} pt</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="300"
                        value={stampWidth}
                        onChange={(e) => setStampWidth(Number(e.target.value))}
                        className="w-full cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none accent-blue-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Yükseklik (Boyut)</span>
                        <span>{stampHeight} pt</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={stampHeight}
                        onChange={(e) => setStampHeight(Number(e.target.value))}
                        className="w-full cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Opaklık (Saydamlık)</span>
                        <span>{Math.round(opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none accent-blue-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Konum Koordinat</span>
                        <span>X: {xPercent}% Y: {yPercent}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Önizleme üzerinde tıklayarak da konumu hassas belirleyebilirsiniz.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trigger button */}
                <div className="border-t border-slate-100 pt-5 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleApplyStamp}
                    disabled={isProcessing || (stampSource === 'upload' && !uploadedImage)}
                    className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-2 min-w-48 h-11"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Kaşe Ekleniyor...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Belgeyi Kaşele ve İndir
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Preview Column */}
              <div className="w-full lg:w-[400px] flex flex-col items-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 min-h-[400px]">
                <span className="text-xs font-bold text-slate-500 mb-4 self-start lg:self-center uppercase tracking-wider">
                  Canlı Konum Önizleme
                </span>
                
                {/* Canvas Container */}
                <div className="w-full bg-slate-50 rounded-2xl border border-slate-100 p-2 flex items-center justify-center relative shadow-inner overflow-hidden min-h-[350px]">
                  <canvas 
                    ref={canvasRef} 
                    onClick={handleCanvasClick}
                    className="max-w-full max-h-[450px] shadow-md rounded-lg cursor-crosshair border border-slate-200/55 bg-white" 
                  />
                </div>
                
                <span className="text-[10px] text-slate-400 mt-3 text-center">
                  Yukarıdaki sayfa önizleme alanında <strong>tıklayarak</strong> kaşeyi veya imzayı yerleştireceğiniz bölgeyi görsel olarak seçebilirsiniz.
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="PDF’e Kaşe & Resim Ekle"
        description="EvrakFix PDF’e Kaşe & Resim Ekle (PDF Stamp / Image Embedder) aracımız, resmi ve kurumsal evraklarınıza, faturalarınıza veya sözleşmelerinize el yazısı imzanızın görselini ya da 'ASLI GİBİDİR', 'ONAYLANDI' kaşelerini eklemenizi sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, PDF belgeleriniz ve yüklediğiniz şirket kaşeleri hiçbir uzak internet sunucusuna gönderilmez, gizliliğiniz tamamen korunur.

■ PDF’e Kaşe Ekleme Nedir?
PDF'e kaşe ekleme, bir PDF belgesinin istenilen bir sayfasına, belgenin orijinal içeriğine ve metin katmanına zarar vermeden, yarı saydam veya opak bir şekilde grafik tabanlı kurumsal kaşe veya logo yerleştirme işlemidir.

■ PDF Dosyasına İmza veya Resim Nasıl Eklenir?
EvrakFix Kaşe Ekleme aracına belgenizi yükleyin. 'Görsel / İmza Yükle' sekmesinden el yazısı imza resminizi (PNG/JPG) seçin. Sayfa önizleme ekranı üzerinde imzanın yer almasını istediğiniz köşeye tıklayarak veya parametrelerden boyut, yön ve saydamlık ayarlarını yaparak yerleştirin. 'Belgeyi Kaşele' butonuna tıklayarak saniyeler içinde yeni belgenizi indirin.

■ Resmi Hazır Kaşe Presets Nedir?
Dışarıdan bir kaşe resmi yüklemek zorunda kalmamanız için EvrakFix içerisinde popüler resmi kaşe şablonları barındırır. 'ASLI GİBİDİR', 'ONAYLANDI', 'İPTAL EDİLDİ', 'GİZLİDİR', 'ÖDENDİ' yazılı kaşeleri kırmızı, mavi veya yeşil renk seçenekleriyle tarayıcınızda dinamik olarak çizip dökümana basabilirsiniz.

■ PDF Kaşe Ekleme İşlemi Güvenli mi?
Evet. EvrakFix tamamen yerel (client-side) çalışır. İşlediğiniz PDF dosyaları veya yüklediğiniz imzalı resimler internet üzerinden hiçbir sunucuya yüklenmez, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın RAM belleğinde tamamlanır.

■ Mobil Cihazdan PDF Kaşelenebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android işletim sistemli telefon veya tabletlerinizden ek uygulama indirmeden tarayıcınız üzerinden PDF belgelerinize anında imza veya kaşe basabilir, PDF çıktısını alabilirsiniz.

■ EvrakFix ile PDF Kaşelemenin Avantajları
EvrakFix ile üyelik, limit veya ücret olmadan tamamen ücretsiz kaşeleme ve resim ekleme işlemleri yapabilirsiniz. Sunucu yüklemesi olmadığı için internet hızından bağımsız olarak anında sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır."
        exampleUsage="Şirket içi onay süreçlerinde veya kiralık sözleşmelerinde taranmış el yazısı imzanızın PNG resmini dökümanın son sayfasına yerleştirebilir, ya da banka dekontlarının üzerine 'ÖDENDİ' kaşesini kırmızı renkte basarak arşivleyebilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Kaşe veya resim yerleştirmek istediğiniz PDF dökümanını sürükleyip bırakarak yükleyin."
          },
          {
            title: "Kaşe Tipi ve Konum Seçin",
            description: "İster hazır kaşe (ASLI GİBİDİR vb.) seçin, ister imza resminizi yükleyin. Önizleme canvas'ında yerleştirmek istediğiniz noktaya tıklayın."
          },
          {
            title: "İşleyin ve İndirin",
            description: "Boyut ve saydamlık ayarlarını yaptıktan sonra 'Belgeyi Kaşele ve İndir' butonuna basarak indirin."
          }
        ]}
        faqs={[
          {
            question: "Yüklediğim PDF veya kaşe resimlerim sunucuya gidiyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dökümanlarınız ve kaşe/imza resimleriniz hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir."
          },
          {
            question: "Şeffaf imza eklemek için hangi formatı kullanmalıyım?",
            description: "Arka planı transparan (şeffaf) olan el yazısı imzalarınızı belgenin üzerine yerleştirmek için en iyi sonucu PNG formatındaki resim dosyaları verir."
          },
          {
            question: "Kaşenin açısını eğik (açılı) yapabilir miyim?",
            description: "Evet. Açı seçenekleri üzerinden kaşenizi 15 derece veya 30 derece eğerek daha gerçekçi bir ıslak kaşe görünümü elde edebilirsiniz."
          },
          {
            question: "Belgede sadece ilk veya son sayfaya mı ekleyebilirim?",
            description: "Hayır. Belgenizin sayfa sayısı kaç olursa olsun, sayfa seçici menüsü üzerinden istediğiniz sayfa numarasını seçerek kaşeyi o sayfaya basabilirsiniz."
          },
          {
            question: "Kaşeli PDF dosyasını hemen indirebilir miyim?",
            description: "Evet. 'Belgeyi Kaşele ve İndir' butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default PdfStampImagePage;

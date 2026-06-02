import * as React from 'react';
import JSZip from 'jszip';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { ImageCompressorOptionsPanel } from './components/ImageCompressorOptions';
import { ImagePreviewGrid, type SqueezedItem } from './components/ImagePreviewGrid';
import { compressImageFile } from './imageCompressor.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { formatFileSize } from '../../lib/files/fileSize';
import type { ImageCompressorOptions } from './types';
import { Shield, AlertCircle, FileArchive, Play, Sliders, Trash2 } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const ImageCompressorPage = () => {
  const [items, setItems] = React.useState<SqueezedItem[]>([]);
  const [options, setOptions] = React.useState<ImageCompressorOptions>({
    quality: 'medium',
    outputFormat: 'original',
    resizeMode: 'original',
  });

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingProgress, setProcessingProgress] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Validate uploaded image files
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    
    const hasValidMime = validMimes.includes(file.type);
    const hasValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidMime && !hasValidExt) {
      return {
        isValid: false,
        error: `"${file.name}" desteklenmeyen bir görsel biçimi. Yalnızca JPG, PNG ve WebP yükleyebilirsiniz.`
      };
    }

    // Cap individual files at 40MB to protect browser main thread
    if (file.size > 40 * 1024 * 1024) {
      return {
        isValid: false,
        error: `"${file.name}" boyutu çok büyük (40MB üstü). Mobil tarayıcılar kilitlenebilir.`
      };
    }

    return { isValid: true };
  };

  // Handle file selection from Dropzone
  const handleFilesSelected = (selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);

    const validItems: SqueezedItem[] = [];
    let validationError: string | null = null;

    for (const file of selectedFiles) {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        validItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          result: null,
        });
      } else {
        validationError = validation.error || 'Dosya geçersiz.';
      }
    }

    if (validationError) {
      setError(validationError);
    }

    if (validItems.length > 0) {
      setItems((prev) => [...prev, ...validItems]);
    }
  };

  // Remove individual file card and clean up its memory reference
  const handleRemoveItem = React.useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find(item => item.id === id);
      if (target?.result?.previewUrl) {
        URL.revokeObjectURL(target.result.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  // Download individual compressed image
  const handleDownloadItem = React.useCallback((id: string) => {
    const target = items.find(item => item.id === id);
    if (target?.result) {
      downloadBlob(target.result.outputBlob, target.result.outputFileName);
    }
  }, [items]);

  // Clean up all memory resources and reset state
  const handleClearAll = React.useCallback(() => {
    items.forEach(item => {
      if (item.result?.previewUrl) {
        URL.revokeObjectURL(item.result.previewUrl);
      }
    });
    setItems([]);
    setError(null);
    setSuccess(false);
    setIsProcessing(false);
    setProcessingProgress('');
  }, [items]);

  // Squeeze all pending uploaded images sequentially
  const handleCompressAll = async () => {
    if (items.length === 0) return;

    // Validate custom width bounds if custom mode is selected
    if (options.resizeMode === 'custom') {
      if (!options.customWidth || options.customWidth < 100 || options.customWidth > 5000) {
        setError('Lütfen 100px ile 5000px arasında geçerli bir özel genişlik girin.');
        return;
      }
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedItems = [...items];
      
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        setProcessingProgress(`Sıkıştırılıyor (${i + 1}/${updatedItems.length}) - ${item.file.name}`);

        // If it already had a preview URL, revoke it to release RAM
        if (item.result?.previewUrl) {
          URL.revokeObjectURL(item.result.previewUrl);
        }

        const result = await compressImageFile(item.file, options);
        updatedItems[i] = {
          ...item,
          result,
        };
        
        // Update state progressively so UI updates as files finish
        setItems([...updatedItems]);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Batch compression failed:', err);
      setError(err.message || 'Görseller sıkıştırılırken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
    }
  };

  // ZIP and download all compressed images
  const handleDownloadZip = async () => {
    const compressedItems = items.filter(item => item.result !== null);
    if (compressedItems.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProcessingProgress('ZIP arşivi oluşturuluyor...');

    try {
      const zip = new JSZip();

      compressedItems.forEach((item) => {
        if (item.result) {
          zip.file(item.result.outputFileName, item.result.outputBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, 'evrakfix-gorseller.zip');
    } catch (err: any) {
      console.error('ZIP creation failed:', err);
      setError(err.message || 'ZIP dosyası oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
    }
  };

  // Clean up object URLs on component unmount
  React.useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item.result?.previewUrl) {
          URL.revokeObjectURL(item.result.previewUrl);
        }
      });
    };
  }, []);

  const totalFiles = items.length;
  const compressedCount = items.filter(i => i.result !== null).length;
  
  // Calculate average savings stats
  const totalOriginalSize = items.reduce((acc, i) => acc + i.file.size, 0);
  const totalCompressedSize = items.reduce((acc, i) => acc + (i.result ? i.result.compressedSize : i.file.size), 0);
  const overallSavingsPercent = totalOriginalSize > 0 
    ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Görsel Sıkıştırıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          JPG, PNG ve WebP görsellerinizi kaliteden ödün vermeden tarayıcınızda sıkıştırın, boyutlandırın ve dönüştürün.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Görselleriniz tamamen tarayıcınızda işlenir. Sunucularımıza hiçbir veri gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main workspace Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {totalFiles === 0 ? (
          /* Dropzone image uploader */
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
            multiple={true}
            title="Sıkıştırmak istediğiniz görselleri buraya sürükleyin veya seçin"
            description="Birden fazla JPG, PNG veya WebP görseli yükleyebilirsiniz. Maksimum dosya limiti: 40MB."
          />
        ) : (
          /* Editor Workspace */
          <div className="flex flex-col gap-6">
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktif Liste</span>
                <span className="text-slate-800 font-bold">
                  {totalFiles} Görsel Yüklendi ({formatFileSize(totalOriginalSize)})
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isProcessing}
                className="self-start sm:self-auto h-9 px-4 rounded-lg border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-600 flex items-center gap-1.5 font-semibold text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Listeyi Temizle</span>
              </Button>
            </div>

            {/* Compressor Options */}
            <ImageCompressorOptionsPanel options={options} onChange={setOptions} />

            {/* Error alerts */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Success alert */}
            {success && (
              <Alert variant="success" title="Sıkıştırma Tamamlandı" icon={<Sliders className="h-4 w-4" />}>
                Tüm görseller başarıyla işlendi! Görsellerinizi tek tek veya ZIP arşivi olarak indirebilirsiniz. 
                {overallSavingsPercent > 0 && (
                  <span className="font-bold ml-1 text-emerald-800">
                    Toplamda {overallSavingsPercent}% daha az yer kaplıyorlar!
                  </span>
                )}
              </Alert>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">{compressedCount}</span> / {totalFiles} Sıkıştırıldı
                </div>
                {compressedCount > 0 && (
                  <div className="border-l border-slate-200 pl-4">
                    Ortalama Tasarruf:{' '}
                    <span className="font-bold text-emerald-600">-{overallSavingsPercent}%</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCompressAll}
                  disabled={isProcessing || totalFiles === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  {isProcessing && processingProgress.startsWith('Sıkıştırılıyor') ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{compressedCount > 0 ? 'Yeniden Sıkıştır' : 'Tümünü Sıkıştır'}</span>
                    </>
                  )}
                </Button>

                {compressedCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadZip}
                    disabled={isProcessing}
                    className="h-9 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {isProcessing && processingProgress.startsWith('ZIP') ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>ZIP Hazırlanıyor...</span>
                      </>
                    ) : (
                      <>
                        <FileArchive className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tümünü ZIP İndir</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Grid preview area */}
            <div className="bg-slate-50/30 border border-slate-100/80 rounded-2xl p-4 md:p-6 min-h-[250px]">
              <ImagePreviewGrid
                items={items}
                onRemoveItem={handleRemoveItem}
                onDownloadItem={handleDownloadItem}
              />
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="Görsel Sıkıştırıcı ve Format Dönüştürücü"
        description="Görsel Sıkıştırıcı ve Dönüştürücü modülümüz, web sitenizin yüklenme hızını artırmak veya cihazınızda depolama alanı kazanmak için görsellerinizi optimize etmenizi sağlar. JPG, PNG ve WebP formatındaki görsellerin kalitesini kaybetmeden boyutunu düşürebilir, oransal olarak yeniden boyutlandırabilir ve formatlarını birbirine dönüştürebilirsiniz. Sıralı sıkıştırma motorumuz sayesinde onlarca görseli tarayıcınız kilitlenmeden topluca işleyebilir ve ZIP paketi olarak tek tıkla indirebilirsiniz."
        exampleUsage="Web sitenizin daha hızlı yüklenmesi veya e-posta ekinde kolayca gönderilmesi için 5 MB boyutundaki büyük JPG veya PNG ürün görsellerini kalitesini bozmadan WebP formatına çevirebilir ve boyutunu 200 KB'ın altına düşürebilirsiniz."
        steps={[
          {
            title: "Görsellerinizi Yükleyin",
            description: "Sıkıştırmak, boyutlandırmak veya dönüştürmek istediğiniz JPG, PNG, WebP resimlerini sürükleyip bırakın."
          },
          {
            title: "Kalite, Boyut ve Format Seçin",
            description: "Sıkıştırma seviyesini (Düşük/Orta/Yüksek), yeniden boyutlandırma piksel genişliğini ve dönüştürülecek çıktı formatını seçin."
          },
          {
            title: "Sıkıştırıp Toplu İndirin",
            description: "'Tümünü Sıkıştır' butonuna tıklayarak işlemi başlatın. Tamamlanan resimleri tek tek veya ZIP arşivi halinde topluca indirin."
          }
        ]}
        faqs={[
          {
            question: "Görseller sıkıştırıldığında kalite kaybı çok olur mu?",
            description: "Hayır. Akıllı canvas sıkıştırma katsayılarımız (medium = 0.70, high = 0.90) insan gözünün fark edemeyeceği detayları ayıklayarak görsel kalitesini korur ve dosya boyutunu %70'e varan oranlarda azaltır."
          },
          {
            question: "Özel piksel değerine göre yeniden boyutlandırma nasıl çalışır?",
            description: "Genişlik alanına girdiğiniz piksel değerine (örn: 1200px) göre görselin en-boy oranı (aspect ratio) korunarak oransal olarak boyutu küçültülür. Görsel zaten bu değerden küçükse kalitenin bozulmaması için orijinal boyutu korunur."
          },
          {
            question: "Görsellerimin güvenliği nasıl sağlanıyor?",
            description: "EvrakFix %100 yerel (client-side) çalışmaktadır. Görselleriniz bulut sunucularına gönderilmez, sunucumuz yoktur. İşlemler tarayıcınızın kendi bellek ortamında gerçekleştirilir ve asla internete sızmaz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

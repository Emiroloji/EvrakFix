import * as React from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { GeneratorType, BarcodeFormat } from './types';
import { downloadBlob } from '../../lib/files/downloadFile';
import { Shield, AlertCircle, Download, QrCode, Barcode, Palette } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const QrBarcodeGeneratorPage = () => {
  // Main states
  const [type, setType] = React.useState<GeneratorType>('qr');
  const [value, setValue] = React.useState('https://www.evrakfix.com');
  const [error, setError] = React.useState<string | null>(null);

  // Customization states
  const [qrSize, setQrSize] = React.useState<number>(256);
  const [barcodeFormat, setBarcodeFormat] = React.useState<BarcodeFormat>('CODE128');
  const [color, setColor] = React.useState('#000000');
  const [backgroundColor, setBackgroundColor] = React.useState('#ffffff');

  // Preview element refs
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  // Generate / Render Code
  React.useEffect(() => {
    setError(null);
    if (!value.trim()) {
      return;
    }

    try {
      if (type === 'qr') {
        if (canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, value, {
            width: qrSize,
            margin: 2,
            color: {
              dark: color,
              light: backgroundColor
            }
          }, (err) => {
            if (err) {
              console.error('QR render error:', err);
              setError('QR kod üretilirken bir hata oluştu. Veri boyutu seçilen boyut için çok büyük olabilir.');
            }
          });
        }
      } else {
        if (svgRef.current) {
          // Validation helper for barcode formats
          validateBarcodeValue(value, barcodeFormat);

          JsBarcode(svgRef.current, value, {
            format: barcodeFormat,
            lineColor: color,
            background: backgroundColor,
            width: 2,
            height: 80,
            displayValue: true,
            fontSize: 14,
            margin: 10
          });
        }
      }
    } catch (err: any) {
      console.error('Barcode/QR render error:', err);
      setError(err.message || 'Kod üretilemedi. Girdiğiniz verinin seçilen format kurallarına uygun olduğundan emin olun.');
    }
  }, [type, value, qrSize, barcodeFormat, color, backgroundColor]);

  // Helper to validate barcode value rules
  const validateBarcodeValue = (val: string, format: BarcodeFormat) => {
    if (format === 'EAN13') {
      if (!/^\d{12,13}$/.test(val)) {
        throw new Error('EAN-13 sadece 12 veya 13 haneli rakamları kabul eder.');
      }
    } else if (format === 'EAN8') {
      if (!/^\d{7,8}$/.test(val)) {
        throw new Error('EAN-8 sadece 7 veya 8 haneli rakamları kabul eder.');
      }
    } else if (format === 'UPC') {
      if (!/^\d{11,12}$/.test(val)) {
        throw new Error('UPC sadece 11 veya 12 haneli rakamları kabul eder.');
      }
    }
  };

  // Download code as PNG
  const handleDownloadPng = () => {
    if (!value.trim()) return;

    try {
      if (type === 'qr' && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        downloadDataUrl(dataUrl, 'evrakfix-qr.png');
      } else {
        // For barcodes in SVG, render them to canvas first to download as PNG
        if (svgRef.current) {
          const svgString = new XMLSerializer().serializeToString(svgRef.current);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const URL = window.URL || window.webkitURL || window;
          const blobURL = URL.createObjectURL(svgBlob);
          
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            if (context) {
              context.fillStyle = backgroundColor;
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.drawImage(image, 0, 0);
              const pngDataUrl = canvas.toDataURL('image/png');
              downloadDataUrl(pngDataUrl, 'evrakfix-barkod.png');
            }
            URL.revokeObjectURL(blobURL);
          };
          image.src = blobURL;
        }
      }
    } catch (err) {
      console.error('PNG download error:', err);
      setError('PNG görseli indirilirken bir hata oluştu.');
    }
  };

  // Download code as SVG
  const handleDownloadSvg = async () => {
    if (!value.trim()) return;

    try {
      if (type === 'qr') {
        const svgString = await QRCode.toString(value, {
          type: 'svg',
          width: qrSize,
          margin: 2,
          color: {
            dark: color,
            light: backgroundColor
          }
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        downloadBlob(blob, 'evrakfix-qr.svg');
      } else {
        if (svgRef.current) {
          const svgString = new XMLSerializer().serializeToString(svgRef.current);
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          downloadBlob(blob, 'evrakfix-barkod.svg');
        }
      }
    } catch (err) {
      console.error('SVG download error:', err);
      setError('SVG dosyası oluşturulurken bir hata oluştu.');
    }
  };

  const downloadDataUrl = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Options lists
  const qrSizeOptions = [
    { value: '128', label: 'Küçük (128x128)' },
    { value: '256', label: 'Orta (256x256)' },
    { value: '384', label: 'Büyük (384x384)' },
    { value: '512', label: 'Ekstra Büyük (512x512)' }
  ];

  const barcodeFormatOptions = [
    { value: 'CODE128', label: 'CODE-128 (Genel / Alfanumerik)' },
    { value: 'EAN13', label: 'EAN-13 (Avrupa Standart Ürün - 13 Rakam)' },
    { value: 'EAN8', label: 'EAN-8 (Küçük Ürün - 8 Rakam)' },
    { value: 'UPC', label: 'UPC (Kuzey Amerika Standart - 12 Rakam)' },
    { value: 'CODE39', label: 'CODE-39 (Endüstriyel)' },
    { value: 'ITF', label: 'ITF (Koli / Lojistik)' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>QR Kod & Barkod Oluşturucu</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Ücretsiz ve güvenli şekilde kendi QR kodlarınızı ve barkodlarınızı tarayıcınızda oluşturup SVG veya PNG olarak indirin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Oluşturduğunuz kodlar tamamen tarayıcınızda çizilir. Girdiğiniz veriler hiçbir sunucuya aktarılmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Grid Card */}
      <Card className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Control Panel */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Kod Tipi</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setType('qr'); setValue('https://www.evrakfix.com'); setError(null); }}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  type === 'qr'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <QrCode className="h-4 w-4" />
                QR Kod Üret
              </button>
              <button
                onClick={() => { setType('barcode'); setValue('123456789012'); setError(null); }}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  type === 'barcode'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Barcode className="h-4 w-4" />
                Barkod Üret
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              {type === 'qr' ? 'İçerik (Metin veya URL)' : 'Barkod Verisi'}
            </label>
            <Input
              type="text"
              placeholder={type === 'qr' ? 'Web sitesi linki veya metin yazın...' : 'Sayı veya alfanumerik değer girin...'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
            <span className="text-[10px] text-slate-400">
              {type === 'qr' 
                ? 'QR kodlar herhangi bir karakter sınırlaması olmadan metin veya URL barındırabilir.'
                : 'EAN ve UPC formatları sadece belirli rakam uzunluklarını (7-13 hane) kabul eder.'}
            </span>
          </div>

          {/* Conditional parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === 'qr' ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Çözünürlük Boyutu</label>
                <Select
                  value={String(qrSize)}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  options={qrSizeOptions}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Barkod Formatı</label>
                <Select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value as BarcodeFormat)}
                  options={barcodeFormatOptions}
                />
              </div>
            )}

            {/* Colors */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-slate-500" />
                <span>Renk Özelleştirme</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-[10px] text-slate-450 font-medium">Çizgi/Kod</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0 bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-[10px] text-slate-450 font-medium">Arka Plan</span>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              <span className="text-xs">{error}</span>
            </Alert>
          )}
        </div>

        {/* Right Preview Panel */}
        <div className="w-full lg:w-[320px] flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 min-h-[300px]">
          <span className="text-xs font-bold text-slate-500 mb-4 self-start lg:self-center uppercase tracking-wider">
            Canlı Önizleme
          </span>
          
          {/* Code Container */}
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-6 min-h-[220px] w-full relative">
            {!value.trim() ? (
              <span className="text-xs text-slate-400 italic text-center">Önizleme için içerik girin</span>
            ) : type === 'qr' ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[200px] shadow-sm rounded-lg" />
            ) : (
              <div className="max-w-full overflow-x-auto p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                <svg ref={svgRef} className="max-h-[120px] mx-auto" />
              </div>
            )}
          </div>

          {/* Download triggers */}
          <div className="flex gap-3 mt-6 w-full">
            <Button
              variant="outline"
              onClick={handleDownloadSvg}
              disabled={!value.trim() || !!error}
              className="flex-1 font-bold border-slate-200 hover:bg-slate-50 text-slate-650 cursor-pointer flex justify-center gap-1.5 h-11 rounded-xl disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              SVG İndir
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadPng}
              disabled={!value.trim() || !!error}
              className="flex-1 font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10 cursor-pointer flex justify-center gap-1.5 h-11 rounded-xl disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              PNG İndir
            </Button>
          </div>
        </div>
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="QR Kod ve Barkod Oluşturma"
        description="QR Kod & Barkod Oluşturucu (QR & Barcode Generator) aracımız, kendi web siteleriniz, kartvizitleriniz, envanter takibiniz veya ürün etiketleriniz için tamamen ücretsiz şekilde kod üretmenizi sağlar. Çevrimdışı (offline) ve cihaz tabanlı (client-side) çalışan yapısı sayesinde girdiğiniz şifreler, telefon numaraları, gizli mesajlar veya linkler asla uzak internet sunucularına aktarılmaz.

■ QR Kod ve Barkod Nedir?
QR Kod (Quick Response), iki boyutlu (2D) veri matrisi biçiminde olan ve yüksek hacimli alfanümerik metinleri, web sitesi linklerini (URL) ve iletişim kartlarını saklayabilen bir koddur. Barkod ise tek boyutlu (1D) dikey çizgiler dizisi şeklinde olan ve genellikle lojistik, kargo ve süpermarket ürün kodlamaları gibi sadece sayısal/alfabetik kısa dizgileri tutan bir veri formatıdır.

■ QR Kod Nasıl Oluşturulur?
EvrakFix QR Kod Oluşturucu'ya linkinizi veya metninizi girin. Çözünürlük boyutunu ve şık bir görünüm için çizgi/arka plan renklerinizi belirleyin. 'PNG İndir' veya 'SVG İndir' butonlarından dilediğinize tıklayarak anında kaydedin.

■ Barkod Nasıl Oluşturulur?
Barkod sekmesine geçiş yapın. Gerekli ürün veya takip kodunu yazın. Lojistik ve perakende standartlarına uygun (CODE-128, EAN-13, UPC, CODE-39) formatlardan birini seçin. Barkodunuz anında çizilecek ve indirilmeye hazır hale gelecektir.

■ Hangi Barkod Formatları Desteklenmektedir?
Uygulamamız en çok kullanılan 6 barkod tipini destekler:
- CODE128: Alfanümerik (harf ve rakam) veri saklayan standart barkod.
- EAN-13: Dünya genelinde süpermarket ürünlerinde kullanılan 13 haneli sayısal barkod.
- EAN-8: Küçük ebatlı ambalajlar için 8 haneli sayısal barkod.
- UPC: Kuzey Amerika perakende standardı 12 haneli barkod.
- CODE-39: Savunma ve sanayi standartlarında kullanılan basit alfanümerik barkod.
- ITF: Koli ve lojistik palet takibinde kullanılan barkod.

■ EvrakFix QR ve Barkod Oluşturucu Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı çalışan sunucusuz (client-side) bir sistemdir. Girdiğiniz veritabanı değerleri, kişisel detaylar, özel URL adresleri veya barkod numaraları hiçbir internet sunucusuna gönderilmez, izlenmez ve kaydedilmez. Kodların çizimi doğrudan cihazınızın kendi işlemcisiyle tarayıcı pencerenizde tamamlanır.

■ Mobil Cihazlardan QR ve Barkod Üretilebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android yüklü cihazlarınızdan kameranızla okutmak üzere hızlıca QR kod üretebilir, SVG veya PNG formatlarında anında telefonunuza kaydedip kullanabilirsiniz."
        exampleUsage="Kendi web siteniz için özel bir QR kod oluşturup renklerini kurumsal kimliğinize göre ayarlayabilir, ya da e-ticaret sitenizde sattığınız ürünlerin paketleri için CODE128 formatında kargo/ürün takip barkodu hazırlayabilirsiniz."
        steps={[
          {
            title: "Kod Tipini Belirleyin",
            description: "Oluşturmak istediğiniz kod formatını (QR Kod veya Barkod sekmesini) seçin."
          },
          {
            title: "Veri ve Özelleştirme Girin",
            description: "İlgili metni/numarayı yazın. Boyut, format tipi ve çizgi/arka plan renklerinizi dilediğiniz gibi seçin."
          },
          {
            title: "Format Seçip İndirin",
            description: "Çözünürlük kaybı istemiyorsanız SVG, genel kullanım için PNG butonuna tıklayarak dosyanızı anında indirin."
          }
        ]}
        faqs={[
          {
            question: "Girdiğim bilgiler (link, numara, metin) sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Girdiğiniz tüm içerikler doğrudan cihazınızın tarayıcısında Canvas veya SVG'ye çizilir, uzak internet sunucularına aktarılmaz."
          },
          {
            question: "QR kod ve barkod arasındaki fark nedir?",
            description: "QR kodlar (2D) kare matris biçiminde olup çok yüksek veri saklayabilir ve linkler/uzun metinler için idealdir. Barkodlar ise dikey çizgiler (1D) halinde olup lojistik ve ürün etiketlerinde kullanılan kısa sayı dizilerini tutar."
          },
          {
            question: "Barkod oluştururken neden hata alıyorum?",
            description: "Seçtiğiniz barkod formatının katı kuralları olabilir. Örneğin EAN-13 sadece 12 veya 13 haneli rakamları kabul ederken harf girilmesine izin vermez. Verinizi format kurallarına göre düzenlemeniz gerekir."
          },
          {
            question: "Oluşturduğum kodları hangi formatlarda indirebilirim?",
            description: "Ölçeklenebilir vektör standardı olan SVG formatında veya klasik dijital resim standardı olan PNG formatında tamamen ücretsiz olarak indirebilirsiniz."
          },
          {
            question: "Hazırlanan QR kodlar kalıcı mıdır, süresi dolar mı?",
            description: "Evet. Oluşturulan QR kodlar doğrudan girdiğiniz veriyi barındıran statik kodlardır. Arada herhangi bir yönlendirme servisi olmadığı için asla süreleri dolmaz ve kalıcı olarak çalışırlar."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default QrBarcodeGeneratorPage;

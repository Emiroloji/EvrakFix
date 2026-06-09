import * as React from 'react';
import Tesseract from 'tesseract.js';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { Shield, RefreshCw, AlertCircle, Copy, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const ImageOcrPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [progressStatus, setProgressStatus] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [ocrText, setOcrText] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [lang, setLang] = React.useState('tur');

  // OCR Processing
  const handleOcrProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setProgressStatus('OCR Motoru Hazırlanıyor...');
    setOcrText('');

    try {
      const result = await Tesseract.recognize(
        file,
        lang,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
              setProgressStatus(`Metinler Çözümleniyor: %${Math.round(m.progress * 100)}`);
            } else {
              // translate some status names for better user experience
              const statusTranslations: { [key: string]: string } = {
                'loading tesseract core': 'OCR Çekirdeği Yükleniyor...',
                'initializing tesseract': 'Dil Paketleri Hazırlanıyor...',
                'loading language traineddata': 'Türkçe/İngilizce Dil Verileri İndiriliyor...',
                'initializing api': 'API Kuruluyor...',
                'recognizing text': 'Metinler Çözümleniyor...'
              };
              setProgressStatus(statusTranslations[m.status] || m.status);
            }
          }
        }
      );

      if (result && result.data && result.data.text) {
        setOcrText(result.data.text);
      } else {
        throw new Error('Metin tespit edilemedi.');
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setError(err.message || 'Resim taranırken bir hata oluştu. Dil paketlerinin yüklenebilmesi için internet bağlantınızın olduğundan ve resmin net göründüğünden emin olun.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle image file selection
  const handleFilesSelected = (selectedFiles: File[]) => {
    setError(null);
    setOcrText('');
    setCopied(false);

    if (selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];
    
    const isImg = selectedFile.type.startsWith('image/') || 
                  selectedFile.name.toLowerCase().endsWith('.png') || 
                  selectedFile.name.toLowerCase().endsWith('.jpg') || 
                  selectedFile.name.toLowerCase().endsWith('.jpeg');
                  
    if (!isImg) {
      setError('Lütfen yalnızca geçerli bir görsel dosyası (.png, .jpg, .jpeg) yükleyin.');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Copy to clipboard helper
  const handleCopy = () => {
    if (!ocrText) return;
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFile(null);
    setImagePreviewUrl(null);
    setError(null);
    setOcrText('');
    setProgress(0);
    setProgressStatus('');
  };

  const languageOptions = [
    { value: 'tur', label: 'Türkçe' },
    { value: 'eng', label: 'İngilizce (English)' },
    { value: 'tur+eng', label: 'Türkçe + İngilizce' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Resimden Metin Okuma (OCR)</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Görsellerinizdeki veya taranmış evrak fotoğraflarınızdaki metinleri cihazınızda yapay zeka ile okuyun ve kopyalayın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Metin tanıma (OCR) işlemi tamamen yerel olarak tarayıcınızda yapılır. Görselleriniz ve okunan metinler hiçbir sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Grid Editor */}
      <Card className="p-6 md:p-8 flex flex-col gap-6">
        {!file ? (
          /* Dropzone */
          <Dropzone
            onFilesSelected={handleFilesSelected}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
            multiple={false}
            title="Metnini okumak istediğiniz resmi buraya sürükleyin veya seçin"
            description="Maksimum 10 MB. Evrak fotoğrafları, makbuzlar veya ekran görüntüleri için uygundur."
          />
        ) : (
          /* Editor panel */
          <div className="flex flex-col gap-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <ImageIcon className="h-6 w-6" />
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

            {/* Config & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/60">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Görsel Metin Dili</label>
                <Select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  options={languageOptions}
                  disabled={isProcessing}
                />
                <span className="text-[10px] text-slate-400">
                  En iyi sonuç için görseldeki metinlerin yazıldığı ana dili seçmeniz önerilir.
                </span>
              </div>

              <div className="flex items-end">
                <Button
                  variant="primary"
                  onClick={handleOcrProcess}
                  disabled={isProcessing}
                  className="w-full font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-2 h-11"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Metin Okunuyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Resimdeki Metinleri Oku
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress indicators */}
            {isProcessing && (
              <div className="flex flex-col gap-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>{progressStatus}</span>
                  {progress > 0 && <span>%{progress}</span>}
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-blue-600 font-medium">
                  Dil verileri ilk taramada indirilebilir, bu sebeple işlem süresi internet hızınıza göre birkaç saniye sürebilir.
                </span>
              </div>
            )}

            {/* Workspace Area: Left Image Preview, Right Text Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image preview */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yüklenen Görsel</span>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center min-h-[200px] max-h-[350px] overflow-hidden">
                  {imagePreviewUrl && (
                    <img 
                      src={imagePreviewUrl} 
                      alt="Uploaded Evrak Preview" 
                      className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm"
                    />
                  )}
                </div>
              </div>

              {/* Text Output */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Okunan Metin</span>
                  {ocrText && (
                    <button 
                      onClick={handleCopy}
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        copied ? 'text-emerald-600' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Metni Kopyala
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <textarea
                  readOnly
                  value={ocrText}
                  placeholder="Okunan metinler buraya gelecektir. Lütfen yukarıdaki 'Resimdeki Metinleri Oku' butonuna tıklayın."
                  className="w-full h-[200px] md:h-full min-h-[200px] p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 bg-slate-50/20 focus:outline-none focus:border-blue-600 font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="Resimden Metin Okuma (OCR)"
        description="EvrakFix Resimden Metin Okuma (OCR) aracımız, görsellerinizin, taranmış resmi evraklarınızın, fiş ve fatura fotoğraflarınızın içindeki metinleri yapay zeka yardımıyla otomatik olarak kopyalanabilir düz metne dönüştürür. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz belgeler veya fotoğraflar hiçbir uzak sunucuya yüklenmez, kişisel ve kurumsal gizliliğiniz tamamen korunur.

■ Resimden Metin Okuma (OCR) Nedir?
OCR (Optical Character Recognition - Optik Karakter Tanıma), resim dosyalarının, taranmış belgelerin veya ekran görüntülerinin içerisindeki yazılı harfleri ve sayıları analiz ederek bilgisayarda düzenlenebilir ve kopyalanabilir metin formatına çeviren gelişmiş bir yapay zeka teknolojisidir.

■ Görseldeki Yazı Nasıl Kopyalanır?
EvrakFix OCR aracına metnini almak istediğiniz resmi sürükleyip bırakın. Çözümleme dilini (Türkçe/İngilizce) seçin ve 'Metinleri Oku' butonuna tıklayın. Saniyeler içinde görseldeki tüm yazılar sağ kutuda belirecektir; 'Metni Kopyala' butonuna tıklayarak bilgisayarınıza veya telefonunuza kaydedebilirsiniz.

■ OCR Metin Okuma Güvenli mi?
Evet, tamamen güvenlidir. EvrakFix yerel (client-side) tesseract motorunu kullanır. İşlediğiniz resim dosyaları uzak internet sunucularına aktarılmaz, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Süreç tamamen kendi bilgisayarınızda veya telefonunuzda (tarayıcı RAM belleğinde) sonlanır.

■ Mobil Cihazdan Resim Metne Çevrilebilir mi?
Evet. EvrakFix responsive mobil uyumludur. Akıllı telefon veya tabletinizin kamerasıyla anlık olarak çektiğiniz bir belgenin, kitap sayfasının veya fişin fotoğrafını tarayıcınız üzerinden ek bir uygulama kurmadan doğrudan metne dönüştürebilirsiniz.

■ EvrakFix OCR Aracının Avantajları
Üyelik gerekmez, limitsiz ve tamamen ücretsizdir. İşlemler yerel olarak yapıldığı için sunucu bekleme süresi yoktur ve gizlilik seviyesini en üst düzeyde (cihazınızda) tutar."
        exampleUsage="Kitaptaki uzun bir paragrafı elinizle bilgisayara yazmak yerine telefonunuzla fotoğrafını çekip aracımıza yükleyerek saniyeler içinde kopyalanabilir metin haline getirebilir, ya da size gönderilen taranmış sözleşme resmindeki maddeleri kolayca yazıya aktarabilirsiniz."
        steps={[
          {
            title: "Resmi veya Ekran Görüntüsünü Yükleyin",
            description: "İçindeki metni okumak istediğiniz JPG, JPEG veya PNG formatındaki resmi sürükleyip bırakarak yükleyin."
          },
          {
            title: "Dil Seçimini Yapın",
            description: "En doğru sonuç için resimdeki yazının diliyle uyumlu dil seçeneğini (Türkçe veya İngilizce) seçin."
          },
          {
            title: "Tara ve Metni Kopyala",
            description: "'Resimdeki Metinleri Oku' butonuna tıklayın, analiz tamamlandığında üretilen metni tek tıkla kopyalayın."
          }
        ]}
        faqs={[
          {
            question: "Yüklediğim resimler veya belgeler sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Resimleriniz hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak çözümlenir."
          },
          {
            question: "Hangi resim formatları destekleniyor?",
            description: "JPG, JPEG ve PNG formatındaki tüm popüler resim ve ekran görüntüsü (screenshot) dosyalarını yükleyerek tarayabilirsiniz."
          },
          {
            question: "OCR işleminin doğruluk oranı nedir?",
            description: "Doğruluk oranı doğrudan görselin netliğine, yazı tipine, ışık kalitesine ve çözünürlüğüne bağlıdır. İyi ışıkta çekilmiş, net ve bilgisayar yazısı içeren görsellerde doğruluk oranı %98'e kadar ulaşır."
          },
          {
            question: "İlk tarama neden diğerlerine göre biraz daha uzun sürüyor?",
            description: "İlk kullanımda tarayıcınızın OCR motorunu ve dil verilerini yerel olarak yüklemesi gerekir. Bu yükleme işlemi internet hızınıza bağlı olarak birkaç saniye sürebilir. Sonraki taramalar önbellekten yüklendiği için çok daha hızlı tamamlanır."
          },
          {
            question: "El yazısı metinleri okuyabilir miyim?",
            description: "OCR motorumuz el yazısı metinleri de okumayı dener; ancak el yazısının kişiye özel eğimleri ve düzensizlikleri nedeniyle doğruluk oranı bilgisayar (font) yazısına göre daha düşük olmaktadır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default ImageOcrPage;

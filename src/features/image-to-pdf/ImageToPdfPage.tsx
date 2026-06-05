import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { ImagePreviewList } from './components/ImagePreviewList';
import { imagesToPdf, type ImageToPdfOptions } from './imageToPdf.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, FileCheck, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const ImageToPdfPage = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = React.useState<Blob | null>(null);

  // Layout options state
  const [options, setOptions] = React.useState<ImageToPdfOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'small',
  });

  // Handle selected image files
  const handleFilesSelected = (selectedFiles: File[]) => {
    setError(null);
    setPdfBlob(null);

    const validImages: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of selectedFiles) {
      const isValidType = allowedTypes.includes(file.type) || 
                          file.name.endsWith('.jpg') || 
                          file.name.endsWith('.jpeg') || 
                          file.name.endsWith('.png') || 
                          file.name.endsWith('.webp');
      
      if (isValidType) {
        if (file.size <= 25 * 1024 * 1024) { // 25MB individual limit
          validImages.push(file);
        } else {
          setError(`"${file.name}" çok büyük. Maksimum dosya boyutu 25MB olmalıdır.`);
        }
      } else {
        setError(`"${file.name}" geçersiz format. Lütfen sadece JPG, PNG veya WebP yükleyin.`);
      }
    }

    if (validImages.length > 0) {
      setFiles((prev) => [...prev, ...validImages]);
    }
  };

  // Remove image from preview list
  const handleRemoveFile = (index: number) => {
    setError(null);
    setPdfBlob(null);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Change ordering of images
  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    setError(null);
    setPdfBlob(null);

    setFiles((prev) => {
      const nextList = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[targetIndex];
        nextList[targetIndex] = temp;
      }

      return nextList;
    });
  };

  // Clear all states
  const handleClear = () => {
    setFiles([]);
    setOptions({
      pageSize: 'a4',
      orientation: 'portrait',
      margin: 'small',
    });
    setError(null);
    setPdfBlob(null);
    setIsLoading(false);
  };

  // Sum of all selected file sizes
  const totalSize = React.useMemo(() => {
    return files.reduce((acc, file) => acc + file.size, 0);
  }, [files]);

  // Execute conversion of images to PDF
  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Lütfen önce en az bir görsel dosya yükleyin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultBlob = await imagesToPdf(files, options);
      setPdfBlob(resultBlob);
    } catch (err: any) {
      setError(err.message || 'Görseller PDF\'e çevrilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download converted PDF
  const handleDownload = () => {
    if (pdfBlob) {
      downloadBlob(pdfBlob, 'evrakfix-gorsel-pdf.pdf');
    }
  };

  const handleOptionChange = (field: keyof ImageToPdfOptions, value: string) => {
    setPdfBlob(null);
    setError(null);
    setOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Görseli PDF'e Çevir</span>
        </h1>
        <p className="text-slate-500 text-sm">
          JPG, PNG veya WebP görsellerinizi yükleyin, sırasını ve sayfa düzenini belirleyerek tek tıkla PDF yapın.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosyalarınız tamamen tarayıcınızda dönüştürülür. Sunucumuza yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!pdfBlob && (
          <>
            {/* Dropzone input */}
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }}
              multiple={true}
              title="Görsellerinizi sürükleyin veya seçin"
              description="JPG, PNG, WebP desteklenir. Maksimum dosya boyutu limit: 25MB."
            />

            {/* Error logs */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Config & List */}
            {files.length > 0 && (
              <div className="flex flex-col gap-6 mt-2">
                {/* Configuration inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4.5 rounded-2xl bg-slate-50 border border-slate-100/50">
                  <Select
                    label="Sayfa Boyutu"
                    value={options.pageSize}
                    onChange={(e) => handleOptionChange('pageSize', e.target.value)}
                    options={[
                      { value: 'a4', label: 'A4 Boyutu' },
                      { value: 'image', label: 'Görsel Boyutuna Göre' },
                    ]}
                  />

                  <Select
                    label="Yönlendirme"
                    value={options.orientation}
                    onChange={(e) => handleOptionChange('orientation', e.target.value)}
                    disabled={options.pageSize === 'image'}
                    options={[
                      { value: 'portrait', label: 'Dikey (Portrait)' },
                      { value: 'landscape', label: 'Yatay (Landscape)' },
                    ]}
                    helperText={options.pageSize === 'image' ? 'Orijinal boyutta devre dışıdır' : undefined}
                  />

                  <Select
                    label="Kenar Boşluğu"
                    value={options.margin}
                    onChange={(e) => handleOptionChange('margin', e.target.value)}
                    options={[
                      { value: 'none', label: 'Yok (0 px)' },
                      { value: 'small', label: 'Küçük (15 px)' },
                      { value: 'medium', label: 'Orta (30 px)' },
                    ]}
                  />
                </div>

                {/* Preview list */}
                <ImagePreviewList
                  files={files}
                  onRemoveFile={handleRemoveFile}
                  onMoveFile={handleMoveFile}
                />

                {/* Status and Action bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                  <div className="flex flex-col gap-0.5 text-center sm:text-left">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Toplam Görsel</span>
                    <span className="text-sm font-extrabold text-slate-700">{files.length} Adet ({formatFileSize(totalSize)})</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto font-semibold">
                      Temizle
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleConvert}
                      isLoading={isLoading}
                      className="w-full sm:w-auto font-semibold shadow-md shadow-blue-600/10"
                    >
                      PDF Oluştur
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Successful Conversion screen */}
        {pdfBlob && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileCheck className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">İşlem Başarılı</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Görselleriniz PDF'e Çevrildi!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                {files.length} adet görsel başarıyla tek bir PDF dosyası haline dönüştürüldü.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni Çeviri Yap
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
        toolName="Görseli PDF'e Çevir"
        description="Görseli PDF'e Çevir aracımız; elinizdeki makbuz, ders notları, kimlik fotokopileri veya taranmış evrak görsellerini hızlıca resmi PDF belgelerine dönüştürmenizi sağlar.

■ Görseli PDF’e Çevirme Nedir?
Görseli PDF'e çevirme; JPG, PNG veya WebP formatındaki resimlerin, döküman standartlarına uygun biçimde pikselleri korunarak PDF sayfaları haline getirilmesi ve tek veya çok sayfalı bir döküman olarak kaydedilmesidir.

■ JPG ve PNG Dosyaları PDF’e Nasıl Çevrilir?
EvrakFix Görseli PDF'e Çevir aracına resimlerinizi sürükleyip bırakın veya cihazınızdan seçin. Kenar boşluğu ve sayfa yönünü isteğinize göre yapılandırdıktan sonra 'PDF Oluştur' butonuna tıklayarak saniyeler içinde çıktıyı indirebilirsiniz.

■ Birden fazla görsel tek PDF yapılabilir mi?
Evet. İstediğiniz kadar görsel dosyasını tek seferde yükleyerek hepsinin sırayla birer sayfa halinde yer aldığı tek bir birleşik PDF belgesi oluşturabilirsiniz.

■ Görsellerin sırası değiştirilebilir mi?
Evet. Görselleri yükledikten sonra, liste üzerinde yer alan yukarı ve aşağı taşıma butonlarını kullanarak görsellerin PDF belgesindeki sayfa sırasını kolayca düzenleyebilirsiniz.

■ A4 ve Orijinal Boyut Farkı Nedir?
A4 seçeneği, görselleri standart A4 kağıt boyutuna (sığacak şekilde) boyutlandırıp hizalar. Orijinal Boyut seçeneği ise her görselin kendi piksel çözünürlüğündeki en ve boy oranını koruyarak sayfa sınırlarını görselin kendisine göre ayarlar.

■ Görseli PDF’e Çevirmek Güvenli mi?
Evet. EvrakFix yerel (client-side) teknoloji kullanır. Yüklediğiniz görseller uzak bir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcısında işlenir. Gizli veya kişisel belgelerinizin güvenliği tamamen sizin kontrolünüzdedir.

■ Mobil Cihazdan Görsel PDF Yapma Mümkün mü?
Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizin kamerasıyla çektiğiniz evrak fotoğraflarını ek bir uygulama yüklemeden anında seçip PDF belgesine dönüştürebilirsiniz.

■ EvrakFix ile Görseli PDF’e Çevirmenin Avantajları
EvrakFix tamamen ücretsizdir, üyelik veya kullanım limiti yoktur. Dosyalar yerel işlendiği için internete yükleme bekleme süresi yoktur ve gizliliğiniz tamamen güvence altındadır."
        exampleUsage="Telefonunuzla fotoğrafını çektiğiniz kira sözleşmesinin 3 sayfalık görsellerini sisteme yükleyip, A4 ebatında sıralı ve tek bir PDF dökümanına dönüştürerek e-posta ile gönderebilirsiniz."
        steps={[
          {
            title: "Görsellerinizi Yükleyin",
            description: "PDF'e dönüştürmek istediğiniz JPG, JPEG, PNG veya WebP resimlerinizi sürükleyip bırakın veya cihazınızdan seçin."
          },
          {
            title: "Sayfa Düzenini Ayarlayın",
            description: "PDF sayfa boyutunu (A4 veya orijinal boyutta), dikey/yatay yönü ve kenar payı genişliklerini dilediğiniz gibi seçin."
          },
          {
            title: "PDF Yapın ve İndirin",
            description: "Dosya sıralamasını yön butonlarıyla netleştirip 'PDF Oluştur' butonuna tıklayarak tek tıkla resmi PDF belgenizi indirin."
          }
        ]}
        faqs={[
          {
            question: "Görsellerim sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Görselleriniz hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir."
          },
          {
            question: "JPG, PNG ve WebP dosyalarını PDF’e çevirebilir miyim?",
            description: "Evet. JPG, JPEG, PNG ve WebP formatındaki tüm popüler resim dosyalarını sorunsuz bir şekilde PDF formatına dönüştürebilirsiniz."
          },
          {
            question: "Birden fazla görseli tek PDF yapabilir miyim?",
            description: "Evet. Dilediğiniz sayıda görseli yükleyerek bunları sıralı sayfalar halinde tek bir PDF dökümanı haline getirebilirsiniz."
          },
          {
            question: "Görsel sırasını değiştirebilir miyim?",
            description: "Evet. Görselleri yükledikten sonra liste üzerindeki ok butonlarını kullanarak sayfaların sıralamasını dilediğiniz gibi düzenleyebilirsiniz."
          },
          {
            question: "PDF çıktısını hemen indirebilir miyim?",
            description: "Evet. 'PDF Oluştur' butonuna bastıktan sonra dönüştürme işlemi tarayıcı hızında yerel olarak gerçekleşir. Çok sayıda veya yüksek çözünürlüklü görsellerde işlem süresi cihazınızın donanım performansına bağlı olarak birkaç saniye sürebilir ve tamamlandığında indirme butonu görünür."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

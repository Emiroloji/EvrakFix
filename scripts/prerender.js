import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Define routes & their statically defined details (from routes.tsx)
const routeConfigs = [
  {
    path: '/',
    title: 'EvrakFix | Güvenli ve Ücretsiz PDF ve Evrak Araçları',
    description: 'Dosyalarınızı sunucuya göndermeden PDF birleştirme, PDF bölme, imza ekleme, filigran ekleme, görsel sıkıştırma ve dilekçe yazma işlemlerini tarayıcınızda güvenle yapın.',
    sourceFile: null
  },
  {
    path: '/tools',
    title: 'EvrakFix Araçları | Ücretsiz PDF ve Görsel Editörleri',
    description: 'PDF birleştir, PDF böl, görseli PDF\'e çevir, PDF imza ekleme, filigran ekleme, sayfa düzenleyici ve görsel sıkıştırma araçlarımıza tek yerden ulaşın.',
    sourceFile: null
  },
  {
    path: '/about',
    title: 'Hakkımızda & Gizlilik Politikası | EvrakFix',
    description: 'EvrakFix\'in çalışma felsefesini, dosyalarınızın sunucuya yüklenmeden yerel tarayıcınızda nasıl güvenle işlendiğini ve kullanıcı gizliliği taahhütlerimizi öğrenin.',
    sourceFile: null
  },
  {
    path: '/pdf-merge',
    title: 'PDF Birleştir | Ücretsiz ve Güvenli PDF Birleştirme - EvrakFix',
    description: 'Birden fazla PDF dosyasını cihazınızda güvenle tek PDF haline getirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-merge/PdfMergePage.tsx'
  },
  {
    path: '/pdf-split',
    title: 'PDF Böl | Ücretsiz ve Güvenli PDF Sayfa Ayırma - EvrakFix',
    description: 'PDF dosyanızdan istediğiniz sayfaları veya sayfa aralıklarını cihazınızda güvenle ayırın. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-split/PdfSplitPage.tsx'
  },
  {
    path: '/image-to-pdf',
    title: 'Görseli PDF’e Çevir | JPG, PNG ve WebP PDF Yapma - EvrakFix',
    description: 'JPG, PNG ve WebP görsellerinizi cihazınızda güvenle tek PDF dosyasına dönüştürün. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/image-to-pdf/ImageToPdfPage.tsx'
  },
  {
    path: '/pdf-sign',
    title: 'PDF’e İmza Ekle | Ücretsiz ve Güvenli PDF İmzalama - EvrakFix',
    description: 'PDF dosyanıza tarayıcınızda imza çizin, istediğiniz sayfaya ekleyin ve imzalı PDF olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-sign/PdfSignPage.tsx'
  },
  {
    path: '/pdf-watermark',
    title: 'PDF Filigran Ekle | Ücretsiz ve Güvenli PDF Watermark - EvrakFix',
    description: 'PDF dosyanıza cihazınızda güvenle filigran, tarih veya metin ekleyin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-tools/PdfWatermarkPage.tsx'
  },
  {
    path: '/pdf-organizer',
    title: 'PDF Sayfa Düzenleyici | PDF Sayfa Silme, Döndürme ve Sıralama - EvrakFix',
    description: 'PDF sayfalarını cihazınızda güvenle silin, döndürün, sıralayın ve düzenlenmiş PDF olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-organizer/PdfOrganizerPage.tsx'
  },
  {
    path: '/pdf-to-image',
    title: 'PDF’i Görsele Çevir | PDF JPG ve PNG Dönüştürme - EvrakFix',
    description: 'PDF sayfalarını cihazınızda güvenle JPG veya PNG görsel olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-to-image/PdfToImagePage.tsx'
  },
  {
    path: '/image-compressor',
    title: 'Görsel Sıkıştırıcı | JPG, PNG ve WebP Boyut Küçültme - EvrakFix',
    description: 'JPG, PNG ve WebP görsellerinizi cihazınızda güvenle sıkıştırın, yeniden boyutlandırın ve farklı formatlara dönüştürün. Dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/image-compressor/ImageCompressorPage.tsx'
  },
  {
    path: '/document-generator',
    title: 'Dilekçe Oluştur | Ücretsiz PDF Dilekçe Hazırlama - EvrakFix',
    description: 'İstifa, iade talebi, teslim tutanağı ve genel dilekçe şablonlarını doldurarak cihazınızda güvenle PDF dilekçe oluşturun. Üyelik gerekmez, veriler sunucuya gönderilmez.',
    sourceFile: 'src/features/document-generator/DocumentGeneratorPage.tsx'
  },
  {
    path: '/pdf-metadata-cleaner',
    title: 'PDF Metadata Temizleyici | PDF Belge Bilgilerini Sil - EvrakFix',
    description: 'PDF dosyanızdaki başlık, yazar, oluşturucu ve tarih gibi metadata bilgilerini cihazınızda güvenle temizleyin. Dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-metadata-cleaner/PdfMetadataCleanerPage.tsx'
  },
  {
    path: '/pdf-page-numbers',
    title: 'PDF Sayfa Numarası Ekle | Ücretsiz PDF Numaralandırma - EvrakFix',
    description: 'PDF dosyanıza cihazınızda güvenle sayfa numarası ekleyin. Konum ve format seçin, numaralandırılmış PDF’i hemen indirin.',
    sourceFile: 'src/features/pdf-page-numbers/PdfPageNumbersPage.tsx'
  },
  {
    path: '/pdf-protect-unlock',
    title: 'PDF Şifrele & Şifre Çöz | Ücretsiz PDF Şifre Koyma ve Kaldırma - EvrakFix',
    description: 'PDF dosyalarınıza cihazınızda güvenle şifre koyun veya mevcut PDF şifrelerini kaldırın. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-protect-unlock/PdfProtectUnlockPage.tsx'
  },
  {
    path: '/pdf-compressor',
    title: 'PDF Sıkıştırıcı | Ücretsiz PDF Boyut Küçültme - EvrakFix',
    description: 'PDF dosyalarınızın boyutunu kalitesini bozmadan cihazınızda güvenle küçültün. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.',
    sourceFile: 'src/features/pdf-compressor/PdfCompressorPage.tsx'
  },
  {
    path: '/qr-barcode-generator',
    title: 'QR Kod & Barkod Oluşturucu | Ücretsiz QR ve Barkod Yapıcı - EvrakFix',
    description: 'Ücretsiz ve güvenli şekilde kendi QR kodlarınızı ve barkodlarınızı cihazınızda oluşturun, PNG veya SVG olarak indirin.',
    sourceFile: 'src/features/qr-barcode-generator/QrBarcodeGeneratorPage.tsx'
  },
  {
    path: '/xml-invoice-viewer',
    title: 'XML E-Fatura Görselleştirici | Ücretsiz e-Fatura XML Gösterici - EvrakFix',
    description: 'Gelir İdaresi Başkanlığı (GİB) standartlarındaki e-fatura ve e-arşiv XML dosyalarını cihazınızda güvenle görüntüleyin ve yazdırın.',
    sourceFile: 'src/features/xml-invoice-viewer/XmlInvoiceViewerPage.tsx'
  },
  {
    path: '/text-diff-checker',
    title: 'Belge Metin Karşılaştırıcı | İki Metin Arasındaki Farkları Bul - EvrakFix',
    description: 'İki sözleşme veya metin belgesi arasındaki farkları kelime ve satır bazlı olarak cihazınızda güvenle karşılaştırın.',
    sourceFile: 'src/features/text-diff-checker/TextDiffCheckerPage.tsx'
  },
  {
    path: '/pdf-stamp-image',
    title: 'PDF’e Kaşe & Resim Ekle | PDF İmzalama ve Kaşeleme - EvrakFix',
    description: 'PDF belgelerinize cihazınızda güvenle resmi hazır kaşe basın veya kendi imza resminizi (PNG/JPG) yerleştirin.',
    sourceFile: 'src/features/pdf-stamp-image/PdfStampImagePage.tsx'
  },
  {
    path: '/image-ocr',
    title: 'Resimden Metin Okuma (OCR) | Görseldeki Yazıyı Kopyala - EvrakFix',
    description: 'Görsellerinizdeki veya taranmış resmi evrak fotoğraflarınızdaki metinleri yapay zeka ile cihazınızda okuyun ve kopyalayın.',
    sourceFile: 'src/features/image-ocr/ImageOcrPage.tsx'
  },
  {
    path: '/document-scanner',
    title: 'Belge Tarayıcı | Evrak Fotoğrafı Netleştirme ve Tarama - EvrakFix',
    description: 'Telefon kamerasıyla çektiğiniz veya bilgisayarınızdaki gölgeli evrak fotoğraflarını netleştirin, siyah-beyaz yapın ve PDF olarak indirin.',
    sourceFile: 'src/features/document-scanner/DocumentScannerPage.tsx'
  },
  {
    path: '/pdf-to-text',
    title: 'PDF’ten Metin Çıkarıcı | PDF Yazı ve Metin Ayıklama - EvrakFix',
    description: 'Seçilebilir yazı katmanına sahip PDF belgelerinizdeki metinleri saniyeler içinde ayıklayın, kopyalayın veya TXT/Markdown olarak indirin.',
    sourceFile: 'src/features/pdf-to-text/PdfToTextPage.tsx'
  },
  {
    path: '/csv-json-xml-converter',
    title: 'CSV JSON XML Dönüştürücü | Ücretsiz Veri Tablosu Çevirici - EvrakFix',
    description: 'CSV, JSON ve XML formatındaki veri dosyalarınızı tarayıcınızda saniyeler içinde birbirine dönüştürün. Sunucu yüklemesi yoktur, verileriniz güvendedir.',
    sourceFile: 'src/features/csv-json-xml-converter/CsvJsonXmlConverterPage.tsx'
  },
  {
    path: '/pdf-to-grayscale',
    title: 'PDF Yazıcı Dostu Yapıcı | Renkli PDF\'i Siyah-Beyaz Yapma - EvrakFix',
    description: 'Renkli PDF dökümanlarınızı siyah-beyaza çevirin, gri arka planları silip yazı kontrastını artırarak yazıcı kartuşundan tasarruf edin.',
    sourceFile: 'src/features/pdf-to-grayscale/PdfToGrayscalePage.tsx'
  },
  {
    path: '/pdf-resizer',
    title: 'PDF Sayfa Boyutu & Kenar Payı Düzenleyici | PDF Resizer - EvrakFix',
    description: 'PDF belgelerinin sayfa boyutlarını standart A4, A3 veya Letter formatlarına dönüştürün, kenar ve ciltleme payı boşlukları ekleyin.',
    sourceFile: 'src/features/pdf-resizer/PdfResizerPage.tsx'
  },
  {
    path: '/vat-invoice-calculator',
    title: 'KDV ve Fatura Hesaplayıcı | Ücretsiz KDV Dahil Hariç Hesaplama - EvrakFix',
    description: 'Fatura KDV dahil ve hariç tutarlarını tevkifat kesinti oranları (1/10 - 10/10) ile birlikte cihazınızda güvenle hesaplayın.',
    sourceFile: 'src/features/vat-invoice-calculator/VatInvoiceCalculatorPage.tsx'
  },
  {
    path: '/interest-calculator',
    title: 'Gecikme Faizi ve Yasal Faiz Hesaplayıcı | Rapor Dökümü - EvrakFix',
    description: 'Yasal faiz ve ticari avans faizi oranlarındaki dönemsel değişimlere göre faiz döküm raporunuzu cihazınızda güvenle çıkarın.',
    sourceFile: 'src/features/interest-calculator/InterestCalculatorPage.tsx'
  },
  {
    path: '/pdf-booklet-splitter',
    title: 'İkiye Katlanmış PDF Sayfalarını Ayırıcı | Booklet Splitter - EvrakFix',
    description: 'Kitapçık veya yan yana duran çift sayfalı yatay PDF dökümanlarını kalitesini bozmadan ortadan iki dikey sayfaya bölün.',
    sourceFile: 'src/features/pdf-booklet-splitter/PdfBookletSplitterPage.tsx'
  },
  {
    path: '/markdown-editor',
    title: 'Markdown Editör & PDF Dönüştürücü | Canlı Önizleme - EvrakFix',
    description: 'Tarayıcı tabanlı Markdown editörü ile dökümanlarınızı yazın, anlık HTML önizleyin ve cihazınızda güvenle PDF\'e dönüştürün.',
    sourceFile: 'src/features/markdown-editor/MarkdownEditorPage.tsx'
  },
  {
    path: '/pdf-password-recovery',
    title: 'PDF Şifre Kırıcı / Kurtarıcı | Kilitli PDF Açma - EvrakFix',
    description: 'Şifresini unuttuğunuz kilitli PDF dosyalarının kilidini olası şifre listeleriyle tarayıcı düzeyinde brute-force deneyerek açın.',
    sourceFile: 'src/features/pdf-password-recovery/PdfPasswordRecoveryPage.tsx'
  },
  {
    path: '/qr-barcode-reader',
    title: 'QR Kod & Barkod Okuyucu | Kamera ile Barkod Tarama - EvrakFix',
    description: 'Fotoğraf yükleyerek veya kameranızı kullanarak QR kodları ve ticari perakende barkodlarını tarayıcı düzeyinde çözün.',
    sourceFile: 'src/features/qr-barcode-reader/QrBarcodeReaderPage.tsx'
  },
  {
    path: '/image-background-remover',
    title: 'Resim Arka Planı Temizleyici | Şeffaf PNG Yapma - EvrakFix',
    description: 'İmza, kaşe veya logolarınızın beyaz arka planını temizleyerek şeffaf PNG döküman görselleri elde edin.',
    sourceFile: 'src/features/image-background-remover/ImageBackgroundRemoverPage.tsx'
  },
  {
    path: '/cv-builder',
    title: 'CV / Özgeçmiş Oluşturucu | Ücretsiz A4 PDF CV Hazırlama - EvrakFix',
    description: 'Hiçbir sunucuya veri yüklemeden, tarayıcınızda kurumsal A4 PDF özgeçmişler hazırlayıp anında indirin.',
    sourceFile: 'src/features/cv-builder/CvBuilderPage.tsx'
  },
  {
    path: '/severance-calculator',
    title: 'Kıdem ve İhbar Tazminatı Hesaplayıcı | Gelir Vergisi Kesintisi - EvrakFix',
    description: 'Çalışanların brüt maaş ve çalışma sürelerine göre kıdem ve ihbar tazminatını yasal kesintilerle birlikte cihazınızda güvenle hesaplayın.',
    sourceFile: 'src/features/severance-calculator/SeveranceCalculatorPage.tsx'
  },
  {
    path: '/bulk-renamer',
    title: 'Toplu Dosya Adı Değiştirici | Sıra No ve Sayaç Ekleme - EvrakFix',
    description: 'Çok sayıda dosyanın ismini belirlediğiniz kurallara göre tarayıcıda toplu değiştirin ve ZIP olarak indirin.',
    sourceFile: 'src/features/bulk-renamer/BulkRenamerPage.tsx'
  },
  {
    path: '/timesheet-calculator',
    title: 'Serbest Çalışan Mesai & Hakediş Raporlayıcı | Timesheet - EvrakFix',
    description: 'Günlük mesai saatlerinizi ve saatlik ücretlerinizi girerek aylık kazanç tablonuzu ve zaman çizelgenizi PDF olarak indirin.',
    sourceFile: 'src/features/timesheet-calculator/TimesheetCalculatorPage.tsx'
  },
  {
    path: '/text-analyzer',
    title: 'Metin Analizörü & Kelime Bulutu | Türkçe Okunabilirlik - EvrakFix',
    description: 'Metinlerinizin kelime sayısını, yoğunluğunu ve okunabilirlik puanını analiz edin ve kelime bulutu grafiği oluşturun.',
    sourceFile: 'src/features/text-analyzer/TextAnalyzerPage.tsx'
  },
  {
    path: '/pdf-cover-stamp',
    title: 'PDF Kapak Ekle & Barkod Damgala | Evrak Numaralandırma - EvrakFix',
    description: 'PDF belgelerinin başına kurumsal kapak sayfası ekleyin veya sayfaların üst/alt kısımlarına barkod damgalayın.',
    sourceFile: 'src/features/pdf-cover-stamp/PdfCoverStampPage.tsx'
  }
];

// 2. Comprehensive static fallbacks dictionary (guarantees build is 100% bulletproof)
const fallbackData = {
  '/pdf-merge': {
    toolName: 'PDF Birleştirme',
    description: `PDF Birleştirici aracımız, birden fazla PDF dökümanını tek bir belge haline getirmenizi kolaylaştırır. Resmi yazışmalar, e-kitaplar, faturalar veya ders notları gibi farklı PDF dosyalarını sıraya dizerek tek tıkla birleştirebilirsiniz. Tamamen yerel (client-side) çalışan bu araç sayesinde, hassas veriler içeren kişisel veya kurumsal PDF dosyalarınız hiçbir internet sunucusuna gönderilmez, gizliliğiniz tamamen korunur.

■ PDF Birleştirme Nedir?
PDF birleştirme, ayrı ayrı duran birden fazla PDF belgesinin (sayfa yapıları, yazı tipleri ve görsel kaliteleri korunarak) tek bir ardışık PDF dosyası halinde uç uca eklenmesi işlemidir.

■ PDF Dosyaları Nasıl Birleştirilir?
EvrakFix PDF Birleştirici'ye birleştirmek istediğiniz PDF belgelerini sürükleyip bırakın veya seçin. Yön tuşlarını kullanarak dosyaların sıralamasını dilediğiniz gibi ayarlayın. Ardından 'PDF'leri Birleştir' butonuna tıklayarak saniyeler içinde birleşik PDF dosyanızı indirin.

■ Hangi Durumlarda PDF Birleştirme Kullanılır?
İş başvurularında özgeçmiş, transkript ve sertifikaları tek döküman yapmak; mali belgeleri, faturaları veya sözleşme eklerini bir araya getirmek; ders notlarını veya e-kitap bölümlerini tek kitap haline getirmek gibi durumlarda sıklıkla kullanılır.

■ PDF Birleştirme Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya aktarılmaz, kaydedilmez ve üçüncü taraflarla paylaşılmaz. Tüm süreç doğrudan sizin bilgisayarınızda veya telefonunuzda gerçekleştirilir.

■ Birleştirilen PDF Dosyasının Sırası Değiştirilebilir mi?
Evet. Dosyaları seçtikten sonra, listede yer alan yukarı ve aşağı taşı yön butonlarını kullanarak dökümanların birleşme sırasını işlem öncesinde dilediğiniz gibi serbestçe düzenleyebilirsiniz.

■ Mobil Cihazdan PDF Birleştirme Yapılabilir mi?
Evet, EvrakFix responsive mobil uyumlu tasarımı sayesinde Android veya iPhone/iPad cihazlarınızdan da ek uygulama indirmeden fotoğraflarınızı veya PDF belgelerinizi anında seçip birleştirebilirsiniz.

■ EvrakFix ile PDF Birleştirmenin Avantajları
EvrakFix ile üyelik, limit veya ücret olmadan tamamen ücretsiz PDF birleştirebilirsiniz. Sunucu yüklemesi olmadığı için internet hızınızdan bağımsız olarak anında sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır.`,
    steps: [
      { title: 'Dosyalarınızı Seçin', description: 'PDF Birleştirme aracımıza sürükleyip bırakarak veya cihazınızdan seçerek dilediğiniz kadar PDF dosyası ekleyin.' },
      { title: 'Sıralamayı Düzenleyin', description: 'Yukarı ve Aşağı Taşı yön butonlarını kullanarak dökümanların birleşme sırasını dilediğiniz gibi süratle düzenleyin.' },
      { title: 'Birleştirip İndirin', description: '\'PDF\'leri Birleştir\' butonuna tıklayın, dökümanlarınız saniyeler içinde tarayıcınızda birleştirilip indirmeye hazır hale gelsin.' }
    ],
    faqs: [
      { question: 'PDF dosyalarım sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde birleştirilir.' },
      { question: 'Birden fazla PDF’i tek dosya yapabilir miyim?', answer: 'Evet. Dilediğiniz sayıda PDF dosyasını aynı anda yükleyerek tek bir tuşla birleştirebilir ve tek bir PDF belgesi elde edebilirsiniz.' },
      { question: 'PDF sırasını değiştirebilir miyim?', answer: 'Evet. Dosyalarınızı yükledikten sonra, liste üzerindeki yön oklarını kullanarak birleşmesini istediğiniz sıralamayı kolayca belirleyebilirsiniz.' },
      { question: 'PDF birleştirme işlemi mobilde çalışır mı?', answer: 'Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden tarayıcınız üzerinden PDF\'lerinizi anında birleştirebilirsiniz.' },
      { question: 'Birleştirilen PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. PDF\'leri Birleştir butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu saniyeler içinde görünür.' }
    ]
  },
  '/pdf-split': {
    toolName: 'PDF Bölme ve Sayfa Ayıklama',
    description: `PDF Bölme aracımız, geniş sayfa sayısına sahip PDF belgelerinden ihtiyacınız olan sayfaları ayıklayarak yeni bir PDF dosyası üretmenizi sağlar.

■ PDF Bölme Nedir?
PDF bölme, tek bir büyük PDF dosyasının belirli sayfalarını veya sayfa aralıklarını seçerek, orijinal döküman kalitesini (yazı tipi, görsel çözünürlüğü ve mizanpaj) bozmadan yeni bir PDF dosyası halinde ayırma işlemidir.

■ PDF Dosyasından Sayfa Ayırma Nasıl Yapılır?
EvrakFix PDF Bölücü aracına ayırmak istediğiniz PDF dosyasını sürükleyip bırakın veya seçin. Ardından ayıklamak istediğiniz sayfa numaralarını veya sayfa aralıklarını girin. 'PDF'i Böl' butonuna tıklayarak saniyeler içinde yeni dökümanınızı indirin.

■ Hangi Durumlarda PDF Bölme Kullanılır?
Büyük e-kitaplardan veya ders notlarından sadece belirli bölümleri almak, çoklu fatura veya sözleşme içeren PDF'lerden tek bir sayfayı ayıklamak ya da büyük boyutlu tarama dosyalarından gereksiz sayfaları temizlemek için sıklıkla kullanılır.

■ Sayfa Aralığı Seçerek PDF Ayırmak Mümkün mü?
Evet. EvrakFix gelişmiş sayfa seçici motoru sayesinde '1-5', '8,12' veya '15-20' gibi virgülle ayrılmış özel sayfa aralıkları belirleyerek tek seferde karmaşık sayfaları kolayca ayıklayabilirsiniz.

■ PDF Bölme İşlemi Güvenli mi?
Evet, tamamen güvenlidir. EvrakFix sunucusuz (client-side) çalışır. Yüklediğiniz PDF dosyası hiçbir uzak internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcısında (RAM bellek) işlenir. Bu sayede gizli ve hassas belgeleriniz tamamen güvende kalır.

■ Mobil Cihazdan PDF Bölme Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu yapısıyla Android, iPhone veya iPad cihazlarınızdan da ek uygulama kurmadan tarayıcınız aracılığıyla dilediğiniz PDF dökümanını anında bölebilmenizi sağlar.

■ EvrakFix ile PDF Bölmenin Avantajları
EvrakFix ile üyelik, limit veya hiçbir ücret olmadan tamamen ücretsiz PDF bölebilirsiniz. İşlemler yerel gerçekleştiği için internet hızınızdan bağımsız olarak anında tamamlanır ve verileriniz hiçbir zaman cihazınızdan dışarı çıkmaz.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Bölmek istediğiniz PDF dökümanını sürükleyip bırakarak veya cihazınızdan seçerek sisteme güvenle yükleyin.' },
      { title: 'Sayfa Seçimini Yapın', description: 'Dilediğiniz sayfa aralığını yazın veya Tek Sayfalar, Çift Sayfalar gibi hızlı preset tuşlarını kullanarak sayfaları belirleyin.' },
      { title: 'Bölün ve İndirin', description: 'PDF\'i Böl butonuna tıklayarak seçtiğiniz sayfalardan oluşan yeni PDF belgesini tarayıcı hızında anında indirin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde bölünür.' },
      { question: 'PDF içinden sadece belirli sayfaları ayırabilir miyim?', answer: 'Evet. Dilediğiniz sayfa numarasını girerek veya aralık seçerek PDF dosyanızın içinden sadece ihtiyacınız olan sayfaları ayıklayıp yeni bir PDF olarak kaydedebilirsiniz.' },
      { question: '1-3 veya 1,3,5 gibi sayfa aralıkları kullanabilir miyim?', answer: 'Evet. Sayfa seçici alanına \'1-3\' yazarak ilk 3 sayfayı veya \'1,3,5\' yazarak sadece 1., 3. ve 5. sayfaları ayıklayabilirsiniz. İkisini birleştirip \'1-3, 5\' şeklinde de kullanabilirsiniz.' },
      { question: 'PDF bölme işlemi mobilde çalışır mı?', answer: 'Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden ek uygulama indirmeden PDF\'lerinizi anında bölebilirsiniz.' },
      { question: 'Bölünen PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. PDF\'i Böl butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu saniyeler içinde görünür.' }
    ]
  },
  '/image-compressor': {
    toolName: 'Görsel Sıkıştırıcı',
    description: `Görsel Sıkıştırıcı ve Dönüştürücü modülümüz, web sitenizin yüklenme hızını artırmak veya cihazınızda depolama alanı kazanmak için görsellerinizi optimize etmenizi sağlar. JPG, PNG ve WebP formatındaki görsellerin kalitesini kaybetmeden boyutunu düşürebilir, oransal olarak yeniden boyutlandırabilir ve formatlarını birbirine dönüştürebilirsiniz.

■ Görsel Sıkıştırıcı Nedir?
Görsel sıkıştırıcı, resim dosyalarının içindeki görünmez detayları, gereksiz renk bilgilerini ve meta verilerini akıllı algoritmalarla temizleyerek dosya boyutunu düşüren bir araçtır. EvrakFix Görsel Sıkıştırıcı, tüm bu işlemleri tamamen cihazınızın yerel tarayıcısında gerçekleştirir.

■ Görsel Sıkıştırma Ne İşe Yarar?
Görsel sıkıştırma, web sitelerinin daha hızlı yüklenmesini sağlar, mobil veri kullanımını azaltır ve e-posta eki veya form yüklemelerinde boyut sınırlarına takılmanızı engeller. Ayrıca, telefon veya bilgisayarınızda gigabaytlarca depolama alanı kazanmanıza yardımcı olur.

■ JPG, PNG ve WebP Görseller Nasıl Küçültülür?
EvrakFix ile görsellerinizi sürükleyip bıraktıktan sonra sıkıştırma kalitesini (Düşük, Orta, Yüksek) seçebilir, genişlik değerine göre boyutlandırabilir ve anında sıkıştırabilirsiniz. Tek bir tuşla tüm görselleriniz saniyeler içinde küçültülür.

■ Görsel Boyutu Küçültmek Kaliteyi Bozar mı?
Akıllı sıkıştırma oranlarımız sayesinde, pikseller arasındaki benzer renk geçişleri optimize edilir. Bu işlem insan gözünün ayırt edemeyeceği seviyede yapıldığı için görsel kalitesinde gözle görülür bir bozulma olmadan dosya boyutu %70'e varan oranlarda azalır.

■ WebP Formatına Dönüştürmek Ne Avantaj Sağlar?
WebP, Google tarafından geliştirilen modern bir görsel formatıdır. JPG ve PNG formatlarına göre %30'a varan oranlarda daha yüksek sıkıştırma ve daha küçük dosya boyutu sunarken şeffaflık (transparency) desteğini de korur. Web sitenizin SEO performansını artırmak için en iyi tercihtir.

■ Mobilde Görsel Sıkıştırma Yapılabilir mi?
Evet, EvrakFix responsive mobil arayüzü sayesinde iPhone, iPad veya Android cihazlarınızdan da ek hiçbir uygulama indirmeden tarayıcınız üzerinden fotoğraflarınızı güvenle sıkıştırabilirsiniz.

■ Dosyalar Neden Güvende?
EvrakFix tamamen yerel (client-side) çalışmaktadır. Görselleriniz hiçbir uzak sunucuya yüklenmez ve internete gönderilmez. İşlemler doğrudan tarayıcınızın belleğinde (RAM) yapılır, bu yüzden verileriniz tamamen sizin cihazınızda kalır.`,
    steps: [
      { title: 'Görsellerinizi Yükleyin', description: 'Sıkıştırmak, boyutlandırmak veya dönüştürmek istediğiniz JPG, PNG, WebP resimlerini sürükleyip bırakın.' },
      { title: 'Kalite, Boyut ve Format Seçin', description: 'Sıkıştırma seviyesini (Düşük/Orta/Yüksek), yeniden boyutlandırma piksel genişliğini ve dönüştürülecek çıktı formatını seçin.' },
      { title: 'Sıkıştırıp Toplu İndirin', description: 'Tümünü Sıkıştır butonuna tıklayarak işlemi başlatın. Tamamlanan resimleri tek tek veya ZIP arşivi halinde topluca indirin.' }
    ],
    faqs: [
      { question: 'Görsellerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen yerel (client-side) çalışmaktadır. Görselleriniz hiçbir sunucuya yüklenmez, depolanmaz ve paylaşılmaz. Tüm işlemler doğrudan tarayıcınızda ve cihazınızda gerçekleşir.' },
      { question: 'JPG ve PNG dosyalarını sıkıştırabilir miyim?', answer: 'Evet, JPG, JPEG ve PNG formatındaki tüm popüler görsellerinizi dilediğiniz gibi sıkıştırabilir, yeniden boyutlandırabilir ve birbirine dönüştürebilirsiniz.' },
      { question: 'WebP formatına dönüştürmek ne işe yarar?', answer: 'WebP formatı, geleneksel JPG ve PNG formatlarına göre çok daha yüksek sıkıştırma oranları sunar. Kalite kaybı minimum düzeyde tutulurken dosya boyutu ciddi oranda düşürülür, bu da web sayfalarının yüklenme hızını artırır.' },
      { question: 'Görsel kalitesi düşer mi?', answer: 'Akıllı Canvas sıkıştırma algoritmamız sayesinde, insan gözünün fark edemeyeceği detaylar ayıklanır. Böylece görsel netliği korunurken dosya boyutu %70\'e kadar küçültülmüş olur.' },
      { question: 'Mobil cihazdan görsel sıkıştırabilir miyim?', answer: 'Evet. EvrakFix, mobil uyumlu (responsive) tasarımı sayesinde akıllı telefonlar ve tabletlerdeki web tarayıcılarında da ek bir uygulama indirmeye gerek kalmadan kusursuz ve hızlı çalışır.' }
    ]
  },
  '/document-generator': {
    toolName: 'Dilekçe Oluştur',
    description: `Resmi Dilekçe ve Evrak Oluşturucu aracımız; adliyeler, belediyeler, şirketler veya kamu kurumlarına sunacağınız yasal evraklarınızı A4 standartlarında ve otomatik satır taşma / sayfalama korumalı şekilde saniyeler içinde hazırlamanızı sağlar. Genel Dilekçe, İstifa Dilekçesi, Ürün İade Talebi, Demirbaş Teslim Tutanağı ve Borç Alacak Taahhütnamesi gibi hazır resmi şablonları form doldurarak düzenleyebilirsiniz. Girdiğiniz T.C. Kimlik, adres, IBAN veya telefon gibi hiçbir kişisel veri sunucularımıza gitmez.

■ Dilekçe Oluşturucu Nedir?
Dilekçe oluşturucu, resmi makamlara veya özel kurumlara iletmek istediğiniz dilekçeleri, hukuki standartlara uygun olarak tarayıcınızda doldurup A4 PDF formatında çıktı almanızı sağlayan dijital bir araçtır.

■ Online Dilekçe Nasıl Hazırlanır?
EvrakFix üzerinden hazırlamak istediğiniz dilekçe şablonunu seçin, interaktif formda sizden istenen alanları (ad soyad, adres, tarih ve açıklama gibi) doldurun. Sağ tarafta yer alan canlı önizleme ekranında dilekçenizin son halini anlık olarak izleyebilir ve anında PDF olarak indirebilirsiniz.

■ Hangi Dilekçe Şablonları Kullanılabilir?
Uygulamamızda Genel Dilekçe, İstifa Dilekçesi, İade Talep Dilekçesi, Teslim Tutanağı ve Borç Alacak Tutanağının yanı sıra; İzin Dilekçesi, Okul Dilekçesi, Şikayet Dilekçesi, İş Başvuru Dilekçesi ve Apartman Yönetimi Dilekçesi gibi geniş şablon seçenekleri bulunmaktadır.

■ PDF Dilekçe Oluşturmak Güvenli mi?
EvrakFix tamamen yerel (client-side) çalıştığı için son derece güvenlidir. Dilekçeye yazdığınız T.C. Kimlik No, telefon, adres veya kişisel detaylar hiçbir internet sunucusuna gönderilmez, veritabanımız yoktur. İşlemler tarayıcınızın kendi belleğinde gerçekleşir.

■ Dilekçe Hazırlarken Nelere Dikkat Edilmeli?
Dilekçe yazarken muhatap kurumun adının doğru belirtilmesi, konunun net ifade edilmesi, yasal sürelerin aşılmaması (örn: iade için 14 gün) ve iletişim bilgilerinin eksiksiz girilmesi gerekir. Ayrıca yazım kurallarına uygun, sade ve saygılı bir dil kullanılmalıdır.

■ Hazırlanan Dilekçe Resmi Belge Yerine Geçer mi?
EvrakFix ile hazırladığınız dilekçeler genel başvuru taslakları niteliğindedir. Bu dökümanlar yazdırılıp imzalandıktan veya e-imzalandıktan sonra ilgili kurumlara teslim edilebilir, ancak resmi veya hukuki geçerlilik kararı tamamen muhatap kurumun veya ilgili mevzuatın yetkisindedir.

■ EvrakFix ile Dilekçe Oluşturmanın Avantajları
EvrakFix ile üyelik veya ücret ödemeden hızlıca dilekçe oluşturabilirsiniz. Otomatik satır taşıma ve marj yönetimi sayesinde yazım düzeniniz asla bozulmaz. Gizliliğiniz tamamen korunur ve hazırladığınız evraklar anında cihazınıza indirilir.`,
    steps: [
      { title: 'Evrak Şablonunuzu Seçin', description: 'Doldurmak istediğiniz döküman tipini (dilekçe, tutanak, taahhüt vb.) şablon kartlarından seçin.' },
      { title: 'Form Bilgilerini Doldurun', description: 'Açılan interaktif formdaki zorunlu alanları doldurun. Sağ sütundaki A4 kağıt simülasyonunda canlı önizlemeyi (Live Preview) anlık izleyin.' },
      { title: 'Derleyin ve İndirin', description: 'Dökümanı Üret butonuna tıklayarak A4 standartlarında PDF belgenizi tarayıcınızda saniyeler içinde derleyip indirin.' }
    ],
    faqs: [
      { question: 'EvrakFix ile oluşturulan dilekçeler resmi belge midir?', answer: 'EvrakFix ile oluşturulan dilekçeler resmi başvurularda kullanılabilecek genel dilekçe taslaklarıdır. Ancak her kurumun belge formatı, ek evrak ve başvuru şartları farklı olabilir. Bu nedenle teslim etmeden önce ilgili kurumun güncel şartlarını kontrol etmeniz önerilir.' },
      { question: 'Dilekçe bilgilerim sunucuya yükleniyor mu?', answer: 'Kesinlikle hayır. EvrakFix tamamen yerel (client-side) çalışmaktadır. Formda yazdığınız T.C. Kimlik No, adres ve iletişim bilgileri gibi hassas veriler hiçbir sunucuya yüklenmez, doğrudan tarayıcınızın RAM belleğinde işlenir.' },
      { question: 'Dilekçeyi PDF olarak indirebilir miyim?', answer: 'Evet, formu doldurduktan sonra \'Dökümanı Üret\' butonuna tıklayarak A4 sayfa boyutunda ve yazdırılmaya hazır, yüksek kaliteli PDF dökümanınızı tek tıkla cihazınıza indirebilirsiniz.' },
      { question: 'İstifa dilekçesi ve iade talep dilekçesi oluşturabilir miyim?', answer: 'Evet. Sistemimizde hazır bulunan İstifa Dilekçesi, İade Talebi, İzin Dilekçesi, Şikayet Dilekçesi gibi hazır şablonları kullanarak kendinize uygun resmi yazıları kolayca oluşturabilirsiniz.' },
      { question: 'Dilekçe şablonlarını düzenleyebilir miyim?', answer: 'Evet. Form alanlarındaki bilgileri istediğiniz zaman değiştirebilirsiniz. Sağ taraftaki canlı önizleme alanında yaptığınız tüm değişiklikler anında güncellenmektedir.' }
    ]
  },
  '/image-to-pdf': {
    toolName: 'Görseli PDF’e Çevir',
    description: `Görseli PDF'e Çevir aracımız; elinizdeki makbuz, ders notları, kimlik fotokopileri veya taranmış evrak görsellerini hızlıca resmi PDF belgelerine dönüştürmenizi sağlar.

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
EvrakFix tamamen ücretsizdir, üyelik veya kullanım limiti yoktur. Dosyalar yerel işlendiği için internete yükleme bekleme süresi yoktur ve gizliliğiniz tamamen güvence altındadır.`,
    steps: [
      { title: 'Görsellerinizi Yükleyin', description: 'PDF\'e dönüştürmek istediğiniz JPG, JPEG, PNG veya WebP resimlerinizi sürükleyip bırakın veya cihazınızdan seçin.' },
      { title: 'Sayfa Düzenini Ayarlayın', description: 'PDF sayfa boyutunu (A4 veya orijinal boyutta), dikey/yatay yönü ve kenar payı genişliklerini dilediğiniz gibi seçin.' },
      { title: 'PDF Yapın ve İndirin', description: 'Dosya sıralamasını yön butonlarıyla netleştirip \'PDF Oluştur\' butonuna tıklayarak tek tıkla resmi PDF belgenizi indirin.' }
    ],
    faqs: [
      { question: 'Görsellerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Görselleriniz hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir.' },
      { question: 'JPG, PNG ve WebP dosyalarını PDF’e çevirebilir miyim?', answer: 'Evet. JPG, JPEG, PNG ve WebP formatındaki tüm popüler resim dosyalarını sorunsuz bir şekilde PDF formatına dönüştürebilirsiniz.' },
      { question: 'Birden fazla görseli tek PDF yapabilir miyim?', answer: 'Evet. Dilediğiniz sayıda görseli yükleyerek bunları sıralı sayfalar halinde tek bir PDF dökümanı haline getirebilirsiniz.' },
      { question: 'Görsel sırasını değiştirebilir miyim?', answer: 'Evet. Görselleri yükledikten sonra liste üzerindeki ok butonlarını kullanarak sayfaların sıralamasını dilediğiniz gibi düzenleyebilirsiniz.' },
      { question: 'PDF çıktısını hemen indirebilir miyim?', answer: 'Evet. \'PDF Oluştur\' butonuna bastıktan sonra dönüştürme işlemi tarayıcı hızında yerel olarak gerçekleşir. Çok sayıda veya yüksek çözünürlüklü görsellerde işlem süresi cihazınızın donanım performansına bağlı olarak birkaç saniye sürebilir ve tamamlandığında indirme butonu görünür.' }
    ]
  },
  '/pdf-sign': {
    toolName: 'PDF Belge İmzalama',
    description: `PDF İmzalama aracımız; sözleşmeler, teklifler, dilekçeler ve onay formları gibi resmi veya özel belgelerinizi tarayıcı ortamında kolayca imzalamanızı sağlar.

■ PDF’e İmza Ekleme Nedir?
PDF'e imza ekleme, dijital ortamdaki bir PDF belgesinin üzerine, belgenin içeriğini ve orijinal mizanpajını bozmadan, çizilen veya yüklenen bir imza görselinin eklenmesi işlemidir.

■ PDF Dosyasına İmza Nasıl Edinir?
EvrakFix PDF İmzalama aracına belgenizi yükleyin. Çizim alanını kullanarak imzanızı çizin ve kaydedin. İmzanın yer alacağı sayfa numarasını, konumunu ve boyutunu seçip 'Belgeyi İmzala' butonuna tıklayarak işlemi tamamlayın.

■ Tarayıcıda İmza Çizmek Güvenli mi?
Evet. EvrakFix tamamen yerel (client-side) çalıştığı için son derece güvenlidir. Çizdiğiniz imza görseli veya yüklediğiniz PDF belgesi hiçbir uzak sunucuya yüklenmez. Tüm süreç tarayıcınızın geçici belleğinde gerçekleşir.

■ Hangi Durumlarda PDF İmzalama Kullanılır?
Uzaktan iş sözleşmeleri, teklif onay formları, dilekçeler, teslim tutanakları, okul ve izin belgeleri gibi çıktı alıp fiziksel imza atmanın zahmetli olduğu tüm durumlarda pratik bir çözüm olarak kullanılır.

■ İmza Konumu ve Boyutu Ayarlanabilir mi?
Evet. İmzanın yer alacağı sayfa numarasını serbestçe belirleyebilir; Sol Alt, Orta Alt veya Sağ Alt gibi popüler hizalama konumları ile Küçük, Orta veya Büyük boyut seçeneklerinden birini tercih edebilirsiniz.

■ Mobil Cihazdan PDF’e İmza Eklenebilir mi?
Evet. EvrakFix responsive mobil uyumludur. Akıllı telefon veya tabletleriniz üzerinden dokunmatik ekran hassasiyeti sayesinde parmağınızla veya stylus kalemle son derece pürüzsüz ve gerçekçi ıslak imzalar oluşturabilirsiniz.

■ EvrakFix ile PDF’e İmza Ekleyenin Avantajları
Ücretsiz, limitsiz ve üyelik gerektirmeyen yapısıyla saniyeler içinde imzalama yapabilirsiniz. Sunucu yüklemesi olmadığı için işlemler anında tamamlanır ve verileriniz tamamen cihazınızda güvende kalır.

■ PDF’e Eklenen İmza Hukuki Geçerlilik Sağlar mı?
EvrakFix ile PDF belgesine eklenen imza görsel niteliktedir. Nitelikli elektronik imza (e-imza) veya mobil imza statüsünde değildir. Bu nedenle resmi makamlarca nitelikli e-imza şartı koşulan yasal işlemlerde resmi bir geçerliliği olmayabilir; basit sözleşmeler ve kurum içi onaylar için taslak niteliğindedir.`,
    steps: [
      { title: 'Belgenizi Yükleyin', description: 'İmzalamak istediğiniz resmi veya özel PDF dökümanını sürükleyip bırakarak veya cihazınızdan seçerek sisteme yükleyin.' },
      { title: 'İmzanızı Çizin', description: 'Çizim alanına farenizle veya dokunmatik ekranlı mobil cihazınızda parmağınızla imzanızı atın ve \'İmza Olarak Kaydet\' butonuna tıklayarak bu imzayı kaydedin.' },
      { title: 'Konumu Seçip İndirin', description: 'İmzanın uygulanacağı sayfa numarasını, konum açısını (Sol Alt, Orta Alt, Sağ Alt) ve boyutunu seçip \'Belgeyi İmzala\' diyerek indirin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz PDF dökümanları ve çizdiğiniz imza verileri hiçbir internet sunucusuna aktarılmaz, doğrudan tarayıcınızın geçici belleğinde işlenir.' },
      { question: 'İmzayı tarayıcıda çizebilir miyim?', answer: 'Evet. İmza çizim alanını kullanarak farenizle veya dokunmatik ekranlı cihazlarda parmağınızla/kaleminizle kolayca ıslak imza çizerek dökümana ekleyebilirsiniz.' },
      { question: 'İmzayı istediğim sayfaya ekleyebilir miyim?', answer: 'Evet. Seçenekler bölümünden imzanın yer almasını istediğiniz sayfa numarasını belirleyebilir ve o sayfadaki konumu (Sol Alt, Orta Alt, Sağ Alt) seçebilirsiniz.' },
      { question: 'PDF’e eklenen imza resmi elektronik imza yerine geçer mi?', answer: 'Bu araç, PDF üzerine görsel imza eklemek için hazırlanmıştır. Nitelikli elektronik imza veya resmi e-imza yerine geçmez. Resmi işlemler için ilgili kurumun imza şartlarını kontrol etmeniz önerilir.' },
      { question: 'İmzalı PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. Belgeyi İmzala butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu saniyeler içinde görünür.' }
    ]
  },
  '/pdf-watermark': {
    toolName: 'PDF Filigran ve Metin Ekleme',
    description: `PDF Filigran aracımız, telif haklarınızı korumak ve belgelerinize kurumsal kimlik kazandırmak için ideal bir çözümdür.

■ PDF Filigran Ekleme Nedir?
PDF filigran ekleme, bir PDF dökümanının sayfalarının üzerine, içeriğin kopyalanmasını veya izinsiz kullanımını önlemek amacıyla yarı saydam bir metin, logo veya işaretin (watermark) basılması işlemidir.

■ PDF Dosyasına Filigran Nasıl Eklenir?
EvrakFix PDF Filigran Ekleme aracına belgenizi yükleyin. Metin kutusuna filigran yapmak istediğiniz kelimeyi girin. Opaklık ve boyut ayarlarını yaptıktan sonra 'Filigran Ekle' butonuna tıklayarak saniyeler içinde yeni belgenizi indirin.

■ PDF Üzerine Tarih veya Metin Eklenebilir mi?
Evet. Aracımızda bulunan 'Tarih / Metin Ekle' modunu kullanarak belgenizin ilk sayfasının istediğiniz köşesine günün tarihini, ad-soyad bilgisini veya 'ONAYLANDI' gibi özel durum kaşelerini kolayca ekleyebilirsiniz.

■ Hangi Durumlarda PDF Filigran Kullanılır?
Gizli şirket yazışmalarında, teklif taslaklarında, fatura kopyalarında, ders notlarında, telif hakkı korunan dokümanlarda veya 'KOPYADIR', 'TASLAK' gibi durum bildirimlerinin gerektiği tüm senaryolarda kullanılır.

■ Filigran Metni ve Opaklık Ayarlanabilir mi?
Evet. Yazacağınız filigranın opaklığını (şeffaflığını) oransal olarak ayarlayabilirsiniz. Bu sayede belgenin altındaki metinlerin ve resimlerin okunurluğunu bozmayacak en ideal şeffaflık derecesini (örneğin %20) kolayca belirleyebilirsiniz.

■ PDF Filigran Ekleme Güvenli mi?
Evet. EvrakFix yerel (client-side) teknolojiyle çalışır. Yüklediğiniz PDF dosyaları internetteki hiçbir sunucuya yüklenmez, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Süreç tamamen cihazınızda (tarayıcı RAM belleğinde) sonlanır.

■ Mobil Cihazdan PDF Filigran Eklenebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. Android, iPhone veya iPad cihazlarınızın tarayıcısı üzerinden ek bir uygulama indirme gereksinimi olmadan PDF belgelerinize anında filigran basabilirsiniz.

■ EvrakFix ile PDF Filigran Eklemenin Avantajları
EvrakFix ile üyelik, limit veya hiçbir ücret ödemeden tamamen ücretsiz filigran ekleyebilirsiniz. İşlemler sunucusuz yapıldığı için internet hızınızdan bağımsız olarak anında sonuçlanır ve döküman güvenliğiniz en üst düzeyde korunur.`,
    steps: [
      { title: 'PDF Dökümanını Yükleyin', description: 'Filigran basmak veya tarih/metin eklemek istediğiniz PDF dökümanını sürükleyip bırakarak sisteme yükleyin.' },
      { title: 'Filigran / Metin Ayarlarını Girin', description: 'İster tüm sayfalara \'KOPYA\' veya \'TASLAK\' gibi çapraz filigranlar yazın, ister tek bir köşeye özel tarih ve metin ekleyin.' },
      { title: 'Filigranı Basıp İndirin', description: 'Filigran opaklığı (saydamlığı) ve metin boyutunu belirledikten sonra \'Filigran Ekle\' diyerek anında yeni PDF dosyanızı indirin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır, tarayıcı tabanlı çalışır ve PDF dosyanız hiçbir sunucuya yüklenmez.' },
      { question: 'PDF üzerine filigran metni ekleyebilir miyim?', answer: 'Evet. \'Çapraz Filigran Ekle\' modunu kullanarak belgenizin tüm sayfalarına 45 derece eğimle otomatik olarak filigran metni ekleyebilirsiniz.' },
      { question: 'Filigranın opaklığını ayarlayabilir miyim?', answer: 'Evet. Filigranın saydamlık derecesini (opaklığını) dilediğiniz gibi ayarlayarak alttaki döküman metinlerinin okunurluğunu engellemeyecek şekilde ayarlayabilirsiniz.' },
      { question: 'PDF’e tarih veya kısa metin ekleyebilir miyim?', answer: 'Evet. \'Tarih / Metin Ekle\' moduna geçerek dökümanın ilk sayfasında dilediğiniz köşeye bugünün tarihini veya kısa bir onay metnini kolayca basabilirsiniz.' },
      { question: 'Filigranlı PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. \'Filigran Ekle\' butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu görünür. Çok sayfalı veya yüksek boyutlu PDF dosyalarında işlem süresi cihazınızın donanım performansına bağlı olarak birkaç saniye sürebilir.' }
    ]
  },
  '/pdf-organizer': {
    toolName: 'PDF Sayfa Düzenleyici',
    description: `PDF Sayfa Düzenleme modülümüz, PDF belgelerinizin sayfa yapısını görsel bir panel üzerinden dilediğiniz gibi şekillendirmenizi sağlar. Yüklediğiniz PDF dosyasının tüm sayfalarını küçük resim önizlemeleri (thumbnails) halinde görebilir, gereksiz sayfaları silebilir, sayfaları 90 derece açılarla döndürebilir ve sayfaların sırasını yön butonlarıyla kolayca değiştirebilirsiniz.

■ PDF sayfa düzenleyici nedir?
PDF sayfa düzenleyici (PDF organizer), bir PDF belgesinin sayfalarını silme, yönünü döndürme, sırasını değiştirme veya yeniden organize etme işlemlerini gerçekleştiren pratik bir araçtır. EvrakFix, bu işlemleri tamamen cihazınızda yaparak belgelerinizi saniyeler içinde düzenlemenize olanak tanır.

■ PDF sayfaları nasıl silinir?
EvrakFix PDF Düzenleyici'ye belgenizi yükledikten sonra, görsel panelde silmek istediğiniz sayfanın üzerindeki 'Sil' butonuna tıklayarak o sayfayı işaretleyebilirsiniz. Yanlışlıkla sildiğiniz sayfaları 'Geri Al' seçeneği ile kurtarabilirsiniz. İşlem bittiğinde yeni PDF'inizi indirebilirsiniz.

■ PDF sayfası nasıl döndürülür?
Yanlış taranmış veya ters duran PDF sayfalarını düzeltmek için ilgili sayfa kartında bulunan 'Döndür' butonunu kullanabilirsiniz. Her tıklama sayfayı saat yönünde 90 derece döndürür. Dökümanı indirdiğinizde bu yön ayarı kalıcı olarak yeni PDF dosyasına kaydedilir.

■ PDF sayfa sırası nasıl değiştirilir?
Sürükle-bırak karmaşası olmadan, sayfa kartlarının altındaki sola ve sağa taşıma yön butonlarını kullanarak sayfaların sırasını dilediğiniz gibi değiştirebilirsiniz. Bu sayede sayfaları sırayla dizmek son derece kolay ve hatasız hale gelir.

■ Hangi durumlarda PDF sayfa düzenleme kullanılır?
Taramadan kaynaklı ters sayfaları düzeltmek, çok sayfalı raporlardaki boş sayfaları temizlemek, fatura veya ders notlarının sırasını düzenlemek ya da sadece belirli sayfaları ayırarak yeni bir belge oluşturmak için kullanılır.

■ PDF sayfa düzenleme güvenli mi?
Evet, güvenlidir. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Yüklediğiniz PDF dökümanları internetteki hiçbir sunucuya yüklenmez, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Tüm işlemler doğrudan tarayıcı belleğinizde (RAM) tamamlanır.

■ Mobil cihazdan PDF sayfa düzenleme yapılabilir mi?
Evet. EvrakFix, tüm modern mobil tarayıcılarla (iOS ve Android) tam uyumludur. Akıllı telefon veya tabletlerinizden ek bir uygulama indirmeden PDF sayfalarınızı kolayca silebilir, döndürebilir ve sıralayabilirsiniz.

■ EvrakFix ile PDF sayfa düzenlemenin avantajları
Üyelik gerektirmeyen, sınırsız ve tamamen ücretsiz hizmet sunar. Dosyalar sunucuya yüklenmediği için internet hızından bağımsız olarak anında sonuç alınır ve hassas dökümanlarınız tamamen cihazınızda güvende kalır.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Sayfa düzenlemesi yapmak istediğiniz tek PDF dökümanını sürükleyip bırakarak veya seçerek yükleyin.' },
      { title: 'Sayfaları Yönetin (Sil, Döndür, Taşı)', description: 'Görsel ızgarada sayfaları yön butonlarıyla sola/sağa taşıyın, 90° döndürün veya istemediğiniz sayfaları anında silin.' },
      { title: 'Değişiklikleri Kaydedip İndirin', description: 'İşlem bittiğinde \'Düzenlenmiş PDF\'i İndir\' butonuna tıklayarak yeni dökümanınızı saniyeler içinde bilgisayarınıza kaydedin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır, tarayıcı tabanlı çalışır ve PDF dosyanız hiçbir sunucuya yüklenmez. Büyük boyutlu dosyaların işlenmesi tamamen cihazınızın donanım performansına (RAM ve işlemci) bağlıdır.' },
      { question: 'PDF sayfalarını silebilir miyim?', answer: 'Evet. Yüklediğiniz belgedeki istemediğiniz sayfaları tek tek silebilirsiniz. Eğer yanlışlıkla silerseniz, \'Geri Al\' butonuyla sayfayı kolayca geri getirebilirsiniz.' },
      { question: 'PDF sayfalarını döndürebilir miyim?', answer: 'Evet. Ters taranmış sayfaları düzeltmek için 90, 180 veya 270 derece döndürme yapabilirsiniz. Bu yön değişiklikleri yeni PDF dosyasına kalıcı olarak işlenir.' },
      { question: 'PDF sayfalarının sırasını değiştirebilir miyim?', answer: 'Evet. Sayfa önizlemelerinin altında bulunan yön butonları sayesinde sayfaların sıralamasını kolayca değiştirebilir ve dilediğiniz sırada dizebilirsiniz.' },
      { question: 'Düzenlenmiş PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. Düzenleme işlemini bitirip \'Düzenlenmiş PDF\'i İndir\' butonuna tıkladığınızda işlem saniyeler içinde tamamlanır ve indirme başlar. Büyük PDF dosyalarında işlem süresi cihazınızın performansına bağlı olarak değişebilir.' }
    ]
  },
  '/pdf-to-image': {
    toolName: "PDF'i Görsele Çevir",
    description: `PDF'i Görsele Çevir aracımız; PDF belgelerinizin sayfalarını yüksek kaliteli bağımsız resim dosyalarına (PNG veya JPG) dönüştürmenizi sağlar. İster belirli sayfaları tek tek seçin, isterseniz tüm sayfaları tek tıkla yüksek çözünürlüklü görsellere dönüştürerek ZIP arşivi halinde toplu indirin. Kalite (Düşük/Orta/Yüksek) ve çözünürlük ölçeklerini (1x, 2x, 3x) dilediğiniz gibi belirleyebilirsiniz. Tüm görselleştirme işlemleri tamamen tarayıcınızın render motoruyla yerel olarak gerçekleştirilir.

■ PDF’i görsele çevirme nedir?
PDF’i görsele çevirme, bir PDF belgesindeki sayfaların her birini bağımsız JPG, JPEG veya PNG resim formatına dönüştürme işlemidir. Bu sayede belgenin içeriğini resim dosyası olarak paylaşabilir, sunumlarınıza veya web sitelerinize doğrudan ekleyebilirsiniz.

■ PDF sayfası JPG veya PNG olarak nasıl indirilir?
EvrakFix PDF'i Görsele Çevir aracına belgenizi yükleyin. Sayfa listesindeki önizleme kartlarının altında yer alan çıktı formatını (PNG veya JPG) seçin. Tek bir sayfayı indirmek için o sayfanın üzerindeki 'Görsel Al' butonuna tıklayarak doğrudan resim olarak indirebilirsiniz.

■ PDF içinden tek sayfa görsel olarak alınabilir mi?
Evet. Tüm PDF belgesini dönüştürmek yerine, sadece ihtiyacınız olan sayfaları tek tek seçerek bağımsız birer görsel dosyası olarak bilgisayarınıza veya telefonunuza anında kaydedebilirsiniz.

■ Birden fazla PDF sayfası görsel olarak indirilebilir mi?
Evet. Dönüştürmek istediğiniz birden fazla sayfayı veya tüm dökümanı seçtikten sonra 'Seçili Sayfaları ZIP İndir' butonunu kullanarak tüm görselleri tek bir sıkıştırılmış ZIP arşivi halinde toplu olarak indirebilirsiniz.

■ JPG ve PNG çıktı farkı nedir?
PNG formatı kayıpsız sıkıştırma sunar; özellikle yazılar, logolar, tablolar ve şablonlar içeren dökümanlarda mükemmel netlik sağlar. JPG ise dosya boyutunu oldukça küçültür ve fotoğraflı, renkli veya taranmış dökümanlar için daha uygundur.

■ PDF’i görsele çevirmek güvenli mi?
Evet, tamamen güvenlidir. EvrakFix yerel (client-side) çalışmaktadır. Yüklediğiniz PDF belgesi hiçbir uzak internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde (RAM) işlenerek görsele dönüştürülür. Gizli verileriniz tamamen cihazınızda kalır.

■ Mobil cihazdan PDF’i görsele çevirme yapılabilir mi?
Evet. EvrakFix mobil uyumlu bir tasarıma sahiptir. iOS ve Android cihazlarınızın tarayıcıları üzerinden ek bir program indirmeden PDF belgelerinizi saniyeler içinde JPG veya PNG resim formatına çevirebilirsiniz.

■ EvrakFix ile PDF’i görsele çevirmenin avantajları
Üyelik ve sınır olmadan tamamen ücretsizdir. Sunucu yüklemesi olmadığı için işlemler anında tamamlanır, internet kotanızı harcamaz ve döküman güvenliğinizi en üst düzeyde (yerel cihazda) korur.`,
    steps: [
      { title: 'PDF Dökümanını Yükleyin', description: 'Sayfalarını resme dönüştürmek istediğiniz tek PDF dökümanını sürükleyip bırakarak veya seçerek yükleyin.' },
      { title: 'Format ve Çözünürlüğü Belirleyin', description: 'Çıktı formatını (PNG / JPG), görsel kalitesini ve netlik ölçeğini (1x, 2x, 3x ultra çözünürlük) kontrol panelinden ayarlayın.' },
      { title: 'Görsel Olarak İndirin', description: 'Dönüştürmek istediğiniz sayfaları işaretleyin. Tekil olarak \'Görsel Al\' ile veya seçilenleri topluca ZIP paketi şeklinde indirin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır, tarayıcı tabanlı çalışır ve PDF dosyanız hiçbir sunucuya yüklenmez. Çok sayfalı veya yüksek boyutlu PDF belgelerinde dönüştürme hızı cihazınızın işlemci ve bellek (RAM) performansına bağlıdır.' },
      { question: 'PDF sayfalarını JPG olarak indirebilir miyim?', answer: 'Evet. Çıktı seçeneklerinden JPG formatını seçerek PDF sayfalarınızı yüksek veya standart kalitede JPG resimleri olarak cihazınıza kaydedebilirsiniz.' },
      { question: 'PDF sayfalarını PNG olarak indirebilir miyim?', answer: 'Evet. Özellikle metinlerin, logoların ve çizgilerin net görünmesini istediğiniz dökümanlar için çıktı formatını PNG olarak belirleyip indirebilirsiniz.' },
      { question: 'Sadece seçtiğim sayfaları görsele çevirebilir miyim?', answer: 'Evet. Sayfa önizleme panelinden sadece dönüştürmek istediğiniz sayfaları seçebilir ve sadece bu sayfaları tek tek veya topluca ZIP halinde indirebilirsiniz.' },
      { question: 'Görsel çıktı dosyalarını hemen indirebilir miyim?', answer: 'Evet. Sayfaları dönüştür butonuna bastığınız anda işlemler tarayıcı hızında yerel olarak tamamlanır ve indirme saniyeler içinde başlar. Çok yüksek çözünürlüklü ve çok sayfalı işlemlerde cihazınızın performansına bağlı olarak birkaç saniye sürebilir.' }
    ]
  },
  '/pdf-metadata-cleaner': {
    toolName: 'PDF Metadata Temizleyici',
    description: `PDF Metadata Temizleyici aracımız, PDF belgelerinizin arka planında saklanan ve gizliliğinizi riske atabilecek kimlik bilgilerini sıfırlamanızı sağlar. Yüklediğiniz PDF'in içeriğine dokunmadan; yazar ismi, oluşturma tarihi, düzenleme tarihi, kullanılan yazılım lisans bilgileri ve gömülü XML tabanlı XMP meta verileri tarayıcınızda yerel olarak temizlenir. Hiçbir belgeniz sunucularımıza gitmez, gizliliğiniz tamamen güvence altındadır.

■ PDF metadata nedir?
PDF metadata; belgenin başlığı, yazarı, konusu, anahtar kelimeleri, oluşturulduğu tarih, son değiştirilme tarihi ve belgeyi oluşturan yazılım gibi arka planda saklanan tanımlayıcı yasal ve teknik bilgilerdir.

■ PDF metadata neden temizlenir?
Gizliliğinizi korumak, kurumsal verilerin dışarı sızmasını önlemek ve belgeleriniz üzerinden bilgisayar kullanıcı adı, işletim sistemi, yazılım sürümleri gibi hassas verilerin başkaları tarafından görüntülenmesini engellemek için temizlenir.

■ PDF dosyasındaki yazar bilgisi nasıl silinir?
EvrakFix PDF Metadata Temizleyici'ye PDF belgenizi yükledikten sonra, 'Metadata Temizle' butonuna tıklayarak yazar adı, belge başlığı ve diğer tüm kimlik verilerini saniyeler içinde silebilirsiniz.

■ PDF metadata temizlemek güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Dosyalarınız sunucuya gönderilmez, tüm işlemler bilgisayarınızda veya telefonunuzda yerel olarak gerçekleşir.

■ Hangi bilgiler temizlenebilir?
Belge başlığı (Title), yazar (Author), konu (Subject), anahtar kelimeler (Keywords), oluşturucu yazılımlar (Creator/Producer) ile oluşturma ve son değiştirilme tarihleri tamamen silinir veya sıfırlanır.

■ Mobil cihazdan PDF metadata temizlenebilir mi?
Evet. EvrakFix mobil uyumludur. iPhone, iPad veya Android cihazlarınızın tarayıcılarından ek bir uygulama olmadan PDF belgelerinin metadata bilgilerini kolayca temizleyebilirsiniz.

■ EvrakFix ile metadata temizlemenin avantajları
Üyelik gerekmez, limitsiz ve tamamen ücretsizdir. Dosyalar sunucuya yüklenmediği için internet kotanızdan tasarruf sağlar ve gizlilik seviyesini en üst düzeyde tutar.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Metadata bilgilerini silmek istediğiniz PDF belgesini sürükleyip bırakarak veya cihazınızdan seçerek yükleyin.' },
      { title: 'Metadata Temizle Butonuna Tıklayın', description: '\'Metadata Temizle\' butonuna basarak dosya bilgilerini, yazar adını, tarihleri ve XMP etiketlerini sıfırlayın.' },
      { title: 'Temizlenmiş PDF\'i İndirin', description: 'İşlem bittiğinde temizlenmiş yeni PDF dökümanınızı güvenle bilgisayarınıza veya telefonunuza indirin.' }
    ],
    faqs: [
      { question: 'PDF metadata nedir?', answer: 'PDF metadata; belgenin başlığı, yazarı, konusu, anahtar kelimeleri, oluşturulduğu tarih, son değiştirilme tarihi ve belgeyi oluşturan yazılım gibi arka planda saklanan tanımlayıcı yasal ve teknik bilgilerdir.' },
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir.' },
      { question: 'Hangi metadata bilgileri temizlenir?', answer: 'Belgenizin başlığı (Title), yazarı (Author), konusu (Subject), anahtar kelimeleri (Keywords), oluşturucu yazılımı (Creator/Producer) ile oluşturma ve son düzenleme tarihleri tamamen nötr değerlerle sıfırlanır.' },
      { question: 'PDF içeriği silinir mi?', answer: 'Kesinlikle hayır. Bu işlem yalnızca PDF dosyasının arka planında saklanan kimlik ve tarih verilerini temizler. PDF içindeki sayfalar, resimler, metinler veya formlar hiçbir şekilde silinmez ya da bozulmaz.' },
      { question: 'Temizlenmiş PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. \'Metadata Temizle\' butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar. Çok yüksek sayfalı dökümanlarda işlem süresi cihazınızın donanım performansına bağlı olarak birkaç saniye sürebilir.' }
    ]
  },
  '/pdf-page-numbers': {
    toolName: 'PDF Sayfa Numarası Ekle',
    description: `PDF Sayfa Numarası Ekle aracımız, dökümanlarınızın okuma ve arşivleme düzenini kolaylaştırmak için sayfa numaraları eklemenizi sağlar. Tamamen tarayıcınızda ve yerel olarak çalışan bu modül sayesinde, PDF dökümanınız sunucuya yüklenmeden saniyeler içinde numaralandırılır. Yazı boyutu, başlangıç sayfası, biçim ve konum (alt/üst, sağ/sol/orta) ayarlarını kişiselleştirerek profesyonel çıktılar elde edebilirsiniz.

■ PDF sayfa numarası ekleme nedir?
PDF sayfa numarası ekleme, çok sayfalı PDF belgelerinin okunabilirliğini, takibini ve düzenini kolaylaştırmak amacıyla sayfalarına sıralı numaraların basılması işlemidir.

■ PDF dosyasına sayfa numarası nasıl eklenir?
EvrakFix PDF Sayfa Numarası Ekle aracına belgenizi yükledikten sonra, seçenek paneli üzerinden dilediğiniz konum, format, yazı boyutu ve başlangıç numarasını belirleyip 'Sayfa Numarası Ekle' butonuna tıklayarak işlemi tamamlayabilirsiniz.

■ Sayfa numarası hangi konuma eklenebilir?
Sayfa numaralarını dökümanınızın alt sol, alt orta, alt sağ, üst orta veya üst sağ olmak üzere 5 farklı noktasına yerleştirebilirsiniz.

■ Sayfa numarası formatı değiştirilebilir mi?
Evet. Format seçenekleri üzerinden sadece numara (1, 2...), metinli numara (Sayfa 1, Sayfa 2...), toplam sayfa sayısı ile birlikte (1 / 10...) ya da hem metinli hem toplamlı (Sayfa 1 / 10...) formatları seçebilirsiniz.

■ Hangi durumlarda PDF numaralandırma kullanılır?
Resmi dilekçeler, tez çalışmaları, kitap taslakları, sözleşmeler, raporlar veya iş başvurularında sayfa takibini kolaylaştırmak ve belgeleri düzenli göstermek amacıyla kullanılır.

■ PDF sayfa numarası eklemek güvenli mi?
Evet, tamamen güvenlidir. EvrakFix yerel (client-side) olarak çalışmaktadır. Yüklediğiniz PDF belgesi hiçbir uzak sunucuya yüklenmez, doğrudan tarayıcınızda işlenir.

■ EvrakFix ile PDF numaralandırmanın avantajları
Üyelik gerektirmeden, limitsiz ve tamamen ücretsiz çalışır. İşlemler yerel olarak yapıldığı için sunucu bekleme süresi yoktur ve döküman güvenliğiniz en yüksek düzeyde (cihazınızda) kalır.`,
    steps: [
      { title: 'PDF Dökümanını Yükleyin', description: 'Sayfa numarası eklemek istediğiniz PDF dosyasını sürükleyip bırakarak veya cihazınızdan seçerek yükleme alanına aktarın.' },
      { title: 'Numaralandırma Ayarlarını Yapın', description: 'Sayfa numarası formatını, konumunu, yazı boyutunu ve başlangıç numarasını kontrol paneli üzerinden belirleyin.' },
      { title: 'Sayfa Numarası Ekle Butonuna Basın', description: '\'Sayfa Numarası Ekle\' butonuna basarak numaralandırılmış yeni PDF dosyanızı anında cihazınıza indirin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz PDF dosyaları internetteki hiçbir sunucuya gönderilmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak işlenir.' },
      { question: 'Sayfa numarasını istediğim konuma ekleyebilir miyim?', answer: 'Evet. Sayfa numaralarını alt sol, alt orta, alt sağ, üst orta veya üst sağ olmak üzere 5 farklı konuma hizalayarak ekleyebilirsiniz.' },
      { question: 'Sayfa numarası formatını değiştirebilir miyim?', answer: 'Evet. Format ayarlarında yalnızca numara (1, 2...), metin içeren numara (Sayfa 1, Sayfa 2...), toplam sayfa sayısı ile birlikte (1 / 10...) veya hem metin hem toplam sayfa sayısı içeren (Sayfa 1 / 10...) formatları serbestçe seçebilirsiniz.' },
      { question: 'Başlangıç sayfa numarasını değiştirebilir miyim?', answer: 'Evet. Başlangıç numarası ayarını kullanarak belgenizin sayfa numaralandırmasını 1 yerine dilediğiniz herhangi bir sayıdan (örneğin 5 veya 100) başlatabilirsiniz.' },
      { question: 'Numaralandırılmış PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. Sayfa numarası ekle butonuna tıkladığınızda işlem cihazınızda saniyeler içinde tamamlanır ve numaralı PDF belgeniz otomatik olarak bilgisayarınıza veya telefonunuza indirilir.' }
    ]
  },
  '/pdf-protect-unlock': {
    toolName: 'PDF Şifreleme ve Şifre Çözme',
    description: `PDF Şifrele & Şifre Çöz (PDF Protect / Unlock) aracımız, belgelerinizin gizliliğini en üst düzeyde korumanızı veya mevcut şifre korumalarını kaldırmanızı sağlar. Cihazınızda yerel (client-side) çalışan bu modül sayesinde, PDF belgeleriniz ve girdiğiniz şifreler hiçbir uzak internet sunucusuna gönderilmez, gizliliğiniz korunur.

■ PDF Şifreleme Nedir?
PDF şifreleme, bir PDF belgesine yetkisiz erişimi engellemek amacıyla dökümana bir kullanıcı veya açılış şifresi eklenmesi işlemidir. Şifrelenmiş PDF dosyaları, doğru şifre girilmediği sürece hiçbir PDF okuyucu veya tarayıcıda görüntülenemez.

■ PDF Şifresi Nasıl Konulur?
EvrakFix PDF Şifreleme aracına belgenizi yükleyin. 'Şifre Ekle' modunu seçip güçlü bir şifre girin. 'PDF'i Şifrele' butonuna tıkladığınızda dökümanınız saniyeler içinde şifrelenir ve indirmeye hazır hale gelir.

■ PDF Şifresi Nasıl Kaldırılır (Şifre Çözme)?
Mevcut şifresini bildiğiniz bir PDF dosyasının korumasını kaldırmak için belgenizi yükleyin. 'Şifre Kaldır' modunu seçip dosyanın şifresini yazın. 'Şifreyi Kaldır' butonuna tıkladığınızda şifreleme kalıcı olarak kaldırılır ve döküman şifresiz olarak indirilir.

■ PDF Şifreleme ve Şifre Çözme Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Girdiğiniz şifreler, metinler veya PDF dosyaları internet üzerinden hiçbir sunucuya yüklenmez, depolanmaz ve paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın RAM belleğinde tamamlanır.

■ Şifrelenmiş PDF Dosyasını Açmak İçin Ne Gerekir?
Bir PDF dosyasının şifresini kaldırabilmek veya içeriğini okuyabilmek için dökümana konulmuş olan orijinal açılış (user) şifresini bilmeniz ve sisteme girmeniz gerekir. Şifresini bilmediğiniz dosyaların şifresini kırmak yasal ve teknik olarak mümkün değildir.

■ Mobil Cihazlardan PDF Şifrelenebilir veya Şifresi Çözülebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android işletim sistemli telefon veya tabletlerinizden ek uygulama indirmeden tarayıcınız üzerinden PDF belgelerinizi saniyeler içinde şifreleyebilir veya şifrelerini çözebilirsiniz.

■ EvrakFix ile PDF Şifreleme ve Çözmenin Avantajları
EvrakFix ile üyelik, kota veya ücret olmadan tamamen ücretsiz şifreleme ve şifre kaldırma işlemleri yapabilirsiniz. Sunucu yüklemesi olmadığı için internet hızından bağımsız olarak milisaniyeler içinde sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Şifrelemek veya şifresini kaldırmak istediğiniz PDF dosyasını sürükleyip bırakarak yükleyin.' },
      { title: 'İşlem ve Şifre Belirleyin', description: 'Yapmak istediğiniz işlemi (Şifre Ekle veya Şifre Kaldır) seçip kullanacağınız şifreyi girin.' },
      { title: 'İşleyin ve İndirin', description: 'İşlem butonuna tıklayın; şifrelenmiş veya şifresi çözülmüş PDF belgeniz saniyeler içinde otomatik olarak insin.' }
    ],
    faqs: [
      { question: 'PDF dosyam şifrelenirken veya şifresi çözülürken sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Dökümanlarınız hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir.' },
      { question: 'Şifresini bilmediğim bir PDF\'in şifresini kaldırabilir miyim?', answer: 'Hayır. Hukuki ve teknik güvenlik standartları gereği, bir PDF\'in şifresini kaldırabilmek için dosyanın mevcut şifresini bilmeniz ve sisteme girmeniz gerekmektedir.' },
      { question: 'PDF dosyam için belirleyeceğim şifre uzunluğu ne olmalıdır?', answer: 'Güvenliğiniz için en az 6 karakterli, büyük/küçük harf ve rakam içeren güçlü şifreler tercih etmenizi öneririz.' },
      { question: 'Bu işlem mobil tarayıcılarda çalışır mı?', answer: 'Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden ek uygulama indirmeden PDF şifreleyebilir veya şifresini çözebilirsiniz.' },
      { question: 'İşlem sonrasında dosyamı hemen indirebilir miyim?', answer: 'Evet. İşlem butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar.' }
    ]
  },
  '/pdf-compressor': {
    toolName: 'PDF Sıkıştırma',
    description: `PDF Sıkıştırıcı (PDF Compressor) aracımız, büyük boyutlu PDF belgelerinizin boyutunu tarayıcınızda yerel (client-side) olarak küçültmenizi sağlar. Belgelerinizin kalitesini ve boyutunu dilediğiniz gibi ayarlayarak paylaşım, e-posta gönderimi veya arşivleme işlemlerinizi kolaylaştırın. Dosyalarınız hiçbir uzak internet sunucusuna gönderilmez, verileriniz tamamen sizin cihazınızda güvende kalır.

■ PDF Sıkıştırma Nedir?
PDF sıkıştırma, PDF belgesi içerisinde yer alan yüksek çözünürlüklü görsellerin kalitesini ve boyutunu optimize ederek PDF dosyasının toplam disk ebatını (KB veya MB cinsinden) küçültme işlemidir. Bu işlem belgelerin internet üzerinden daha hızlı aktarılmasını sağlar.

■ PDF Dosyası Nasıl Sıkıştırılır?
EvrakFix PDF Sıkıştırıcı'ya sıkıştırmak istediğiniz PDF belgesini sürükleyip bırakın. Sıkıştırma kalitesi seviyesini seçin. Ardından 'PDF'i Sıkıştır' butonuna tıklayarak işlemi başlatın. Sıkıştırılmış PDF belgeniz saniyeler içinde otomatik olarak indirilecektir.

■ PDF Sıkıştırma Kalitesi ve Boyut Farkları Nelerdir?
Aracımız üç farklı sıkıştırma seviyesi sunar:
- Düşük Sıkıştırma (Yüksek Kalite): Görsellerin netliğini korur, boyutu makul miktarda düşürür.
- Orta Sıkıştırma (Orta Kalite): En iyi kalite/boyut dengesini sunar (Önerilir).
- Yüksek Sıkıştırma (Düşük Kalite): Görsel kalitesinden ödün vererek maksimum dosya küçültme oranı sağlar.

■ Sıkıştırma İşlemi Sonrasında Metin Seçilebilir mi?
PDF Sıkıştırıcı aracımız, sayfaları yüksek performanslı Canvas motoru üzerinde görsele dönüştürerek sıkıştırma uygular. Bu nedenle, sıkıştırılmış PDF dökümanı içindeki yazıların kopyalanması, seçilmesi veya metin araması yapılması özelliği devre dışı kalabilir. Arama yapılabilir PDF kopyasına ihtiyacınız varsa orijinal dosyayı saklamanızı tavsiye ederiz.

■ PDF Sıkıştırma Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya aktarılmaz, kaydedilmez ve üçüncü taraflarla paylaşılmaz. Tüm süreç doğrudan sizin bilgisayarınızda veya telefonunuzda gerçekleştirilir.

■ Mobil Cihazdan PDF Sıkıştırma Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu tasarımı sayesinde Android veya iPhone/iPad cihazlarınızın tarayıcıları üzerinden ek bir program indirmeden PDF belgelerinizi saniyeler içinde kolayca sıkıştırabilirsiniz.

■ EvrakFix ile PDF Sıkıştırmanın Avantajları
EvrakFix ile üyelik, limit veya hiçbir ücret olmadan tamamen ücretsiz PDF sıkıştırabilirsiniz. İşlemler yerel gerçekleştiği için internet hızınızdan bağımsız olarak anında tamamlanır ve verileriniz hiçbir zaman cihazınızdan dışarı çıkmaz.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Sıkıştırmak istediğiniz PDF dosyasını sürükleyip bırakarak veya cihazınızdan seçerek yükleyin.' },
      { title: 'Sıkıştırma Seviyesi Seçin', description: 'İhtiyacınıza en uygun olan Düşük, Orta veya Yüksek sıkıştırma seviyelerinden birini belirleyin.' },
      { title: 'Sıkıştırın ve İndirin', description: 'PDF\'i Sıkıştır butonuna tıklayarak işlemi başlatın; sıkıştırılmış dökümanınız anında bilgisayarınıza insin.' }
    ],
    faqs: [
      { question: 'PDF dosyam sıkıştırılırken sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir.' },
      { question: 'PDF sıkıştırma işlemi sonrasında belgemin kalitesi bozulur mu?', answer: 'Seçtiğiniz sıkıştırma seviyesine göre kalite değişir. Düşük Sıkıştırma (Yüksek Kalite) modu görsellerin netliğini korur. Yüksek Sıkıştırma modu ise boyutu maksimum düzeyde düşürür ancak görsel netliğini azaltabilir.' },
      { question: 'PDF sıkıştırıldıktan sonra içindeki yazılar seçilebilir mi?', answer: 'PDF Sıkıştırıcı aracımız, sayfaları görsele dönüştürerek sıkıştırır. Bu sebeple işlem sonrasında PDF içindeki metinlerin seçilmesi veya kopyalanması devre dışı kalabilir.' },
      { question: 'Çok büyük boyutlu PDF\'leri sıkıştırabilir miyim?', answer: 'Evet. Ancak çok sayfalı ve yüksek boyutlu PDF dökümanlarında sıkıştırma hızı doğrudan cihazınızın donanım performansına (RAM ve işlemci) bağlıdır.' },
      { question: 'İşlem sonrasında sıkıştırılmış PDF\'i hemen indirebilir miyim?', answer: 'Evet. Sıkıştırma işlemi tamamlandığı anda yeni PDF belgeniz otomatik olarak bilgisayarınıza veya telefonunuza indirilir.' }
    ]
  },
  '/qr-barcode-generator': {
    toolName: 'QR Kod ve Barkod Oluşturma',
    description: `QR Kod & Barkod Oluşturucu (QR & Barcode Generator) aracımız, kendi web siteleriniz, kartvizitleriniz, envanter takibiniz veya ürün etiketleriniz için tamamen ücretsiz şekilde kod üretmenizi sağlar. Çevrimdışı (offline) ve cihaz tabanlı (client-side) çalışan yapısı sayesinde girdiğiniz şifreler, telefon numaraları, gizli mesajlar veya linkler asla uzak internet sunucularına aktarılmaz.

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

■ Mobil Cihazdan QR ve Barkod Üretilebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android yüklü cihazlarınızdan kameranızla okutmak üzere hızlıca QR kod üretebilir, SVG veya PNG formatlarında anında telefonunuza kaydedip kullanabilirsiniz.`,
    steps: [
      { title: 'Kod Tipini Belirleyin', description: 'Oluşturmak istediğiniz kod formatını (QR Kod veya Barkod sekmesini) seçin.' },
      { title: 'Veri ve Özelleştirme Girin', description: 'İlgili metni/numarayı yazın. Boyut, format tipi ve çizgi/arka plan renklerinizi dilediğiniz gibi seçin.' },
      { title: 'Format Seçip İndirin', description: 'Çözünürlük kaybı istemiyorsanız SVG, genel kullanım için PNG butonuna tıklayarak dosyanızı anında indirin.' }
    ],
    faqs: [
      { question: 'Girdiğim bilgiler (link, numara, metin) sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Girdiğiniz tüm içerikler doğrudan cihazınızın tarayıcısında Canvas veya SVG\'ye çizilir, uzak internet sunucularına aktarılmaz.' },
      { question: 'QR kod ve barkod arasındaki fark nedir?', answer: 'QR kodlar (2D) kare matris biçiminde olup çok yüksek veri saklayabilir ve linkler/uzun metinler için idealdir. Barkodlar ise dikey çizgiler (1D) halinde olup lojistik ve ürün etiketlerinde kullanılan kısa sayı dizilerini tutar.' },
      { question: 'Barkod oluştururken neden hata alıyorum?', answer: 'Seçtiğiniz barkod formatının katı kuralları olabilir. Örneğin EAN-13 sadece 12 veya 13 haneli rakamları kabul ederken harf girilmesine izin vermez. Verinizi format kurallarına göre düzenlemeniz gerekir.' },
      { question: 'Oluşturduğum kodları hangi formatlarda indirebilirim?', answer: 'Ölçeklenebilir vektör standardı olan SVG formatında veya klasik dijital resim standardı olan PNG formatında tamamen ücretsiz olarak indirebilirsiniz.' },
      { question: 'Hazırlanan QR kodlar kalıcı mıdır, süresi dolar mı?', answer: 'Evet. Oluşturulan QR kodlar doğrudan girdiğiniz veriyi barındıran statik kodlardır. Arada herhangi bir yönlendirme servisi olmadığı için asla süreleri dolmaz ve kalıcı olarak çalışırlar.' }
    ]
  },
  '/xml-invoice-viewer': {
    toolName: 'XML E-Fatura Görselleştirici',
    description: `EvrakFix XML E-Fatura / E-Arşiv Görselleştirici aracımız, Gelir İdaresi Başkanlığı (GİB) standartlarındaki e-fatura, e-arşiv veya e-irsaliye XML dosyalarını herhangi bir programa gerek olmadan anında görüntülemenizi sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz e-fatura dosyaları hiçbir uzak sunucuya aktarılmaz, ticari ve finansal gizliliğiniz tamamen korunur.

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
EvrakFix ile üyelik, kota veya ücret olmadan tamamen ücretsiz XML fatura görüntüleme yapabilirsiniz. İnternet hızınızdan bağımsız olarak anında açılır, verileriniz tamamen cihazınızda güvende kalır ve resmi şablonu koruyarak çıktı almanızı sağlar.`,
    steps: [
      { title: 'Fatura XML Dosyasını Yükleyin', description: 'Görüntülemek istediğiniz .xml uzantılı e-Fatura veya e-Arşiv dosyasını sürükleyip bırakarak yükleyin.' },
      { title: 'Faturayı İnceleyin', description: 'Sistem XML içindeki XSLT şablonunu parse ederek faturayı resmi görünümünde tarayıcınızda açacaktır.' },
      { title: 'Yazdırın veya PDF Kaydedin', description: '\'Yazdır / PDF Kaydet\' butonuna tıklayarak faturanın yazıcı çıktısını alabilir ya da PDF olarak kaydedebilirsiniz.' }
    ],
    faqs: [
      { question: 'XML fatura dosyalarım veya verilerim sunucuya yükleniyor mu?', answer: 'Kesinlikle hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Faturalarınız hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak işlenir.' },
      { question: 'Tüm entegratörlerin fatura şablonları destekleniyor mu?', answer: 'Evet. UBL-TR standardına uygun olarak hazırlanan ve içerisinde XSLT stil dosyası barındıran tüm e-fatura XML dosyaları özgün şablonlarıyla görüntülenir.' },
      { question: 'Fatura XML dosyasında stil şablonu (XSLT) yoksa ne olur?', answer: 'Eğer faturada gömülü bir XSLT şablonu bulunmuyorsa, EvrakFix sizin için otomatik olarak temiz ve standart bir e-fatura şablonu uygulayarak fatura bilgilerini anlaşılır bir şekilde ekrana yansıtır.' },
      { question: 'XML faturaları PDF olarak indirebilir miyim?', answer: 'Evet. \'Yazdır / PDF Kaydet\' seçeneğini kullanarak tarayıcınızın kendi yazdırma penceresindeki \'PDF Olarak Kaydet\' özelliğinden yararlanarak PDF çıktısı oluşturabilirsiniz.' },
      { question: 'Bu araç ücretli midir veya limit var mıdır?', answer: 'Hayır. EvrakFix XML Görselleştirici tamamen ücretsizdir ve herhangi bir dosya yükleme sınırı veya kota bulunmamaktadır.' }
    ]
  },
  '/text-diff-checker': {
    toolName: 'Belge Metin Karşılaştırıcı',
    description: `EvrakFix Belge Metin Karşılaştırıcı (Text Diff Checker) aracımız, iki farklı metin belgesi, sözleşme taslağı veya makale versiyonunu yan yana ve kelime düzeyinde karşılaştırmanızı sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan yapısı sayesinde, gizlilik içeren resmi sözleşmeleriniz veya özel metinleriniz hiçbir uzak sunucuya yüklenmez, verileriniz tamamen cihazınızda kalır.

■ Metin Karşılaştırıcı Nedir?
Metin karşılaştırıcı (diff checker), iki metin belgesi arasındaki farkları algılayan ve eklenen kelimeleri yeşil arka planla, silinen kelimeleri ise kırmızı arka plan ve üstü çizili şekilde görsel olarak vurgulayan dijital bir analiz aracıdır.

■ İki Metin Arasındaki Farklar Nasıl Görülür?
EvrakFix karşılaştırma aracına gidin. Sol kutuya orijinal (eski) metni, sağ kutuya ise düzenlenmiş (yeni) metni yapıştırın. 'Metinleri Karşılaştır' butonuna tıkladığınızda kelime düzeyinde tüm değişiklikler saniyeler içinde analiz edilerek vurgulanır.

■ Kelime ve Satır Bazlı Karşılaştırma Farkı Nedir?
- Kelime Bazlı: Cümle içindeki küçük kelime değişikliklerini, eklenen ekleri ve imla düzeltmelerini tespit etmek için idealdir.
- Satır Bazlı: Kod dosyaları, uzun paragraflar veya maddeli sözleşme metinlerindeki komple satır değişikliklerini analiz etmek için daha uygundur.

■ Metin Karşılaştırma Güvenli mi?
Evet, son derece güvenlidir. EvrakFix yerel (client-side) çalışan sunucusuz bir uygulamadır. Girdiğiniz sözleşmeler, kişisel veriler veya kod parçacıkları hiçbir şekilde internetteki uzak bir sunucuya yüklenmez, kaydedilmez. Tüm karşılaştırma algoritmaları doğrudan tarayıcınızın kendi işlem gücüyle yerel olarak çalıştırılır.

■ Mobil Cihazlardan Metin Karşılaştırma Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu tasarımı sayesinde telefon veya tabletlerinizden de ek uygulama indirmeden tarayıcınız üzerinden metinlerinizi kolayca karşılaştırabilmenizi sağlar.

■ EvrakFix Metin Karşılaştırıcının Avantajları
Üyelik, kayıt veya ücret ödemeden limitsiz metin karşılaştırabilirsiniz. Sunucu yüklemesi olmadığı için milisaniyeler içinde anında sonuç verir ve verilerinizin gizliliğini tarayıcı düzeyinde korur.`,
    steps: [
      { title: 'Metinleri Yapıştırın', description: 'Eski orijinal metni sol taraftaki alana, düzenlenmiş yeni metni sağ taraftaki alana yapıştırın.' },
      { title: 'Karşılaştırma Modunu Seçin', description: 'Değişikliklerin hassasiyetine göre Kelime Bazlı veya Satır Bazlı karşılaştırma modunu belirleyin.' },
      { title: 'Karşılaştırın ve Analiz Edin', description: '\'Metinleri Karşılaştır\' butonuna tıklayarak eklenen ve silinen kısımları renkli panelde anında inceleyin.' }
    ],
    faqs: [
      { question: 'Girdiğim sözleşme ve metinler sunucuya kaydediliyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Metinleriniz hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcısında karşılaştırılır.' },
      { question: 'Farklı dillerdeki metinleri karşılaştırabilir miyim?', answer: 'Evet. Aracımız karakter ve kelime bazlı çalıştığı için Türkçe, İngilizce, Almanca veya herhangi bir dilde yazılmış metinleri sorunsuz bir şekilde karşılaştırabilir.' },
      { question: 'Karşılaştırma sonucunda kaç karakterin değiştiğini görebilir miyim?', answer: 'Evet. Karşılaştırma işlemi bittiğinde panelin üst kısmında kaç karakterin eklendiği (+) ve kaç karakterin silindiği (-) istatistiksel olarak gösterilir.' },
      { question: 'Metin uzunluğu sınırı var mıdır?', answer: 'Hayır, teorik olarak bir sınır yoktur. Ancak binlerce sayfalık çok uzun metinlerde işlem süresi ve tarayıcı performansı cihazınızın donanım gücüne (RAM ve işlemci) bağlıdır.' },
      { question: 'Kod dosyalarındaki farkları bulmak için kullanılabilir mi?', answer: 'Evet. HTML, CSS, Javascript veya diğer programlama dillerindeki kod farklarını satır bazlı karşılaştırma modunu seçerek analiz edebilirsiniz.' }
    ]
  },
  '/pdf-stamp-image': {
    toolName: 'PDF’e Kaşe & Resim Ekle',
    description: `EvrakFix PDF’e Kaşe & Resim Ekle (PDF Stamp / Image Embedder) aracımız, resmi ve kurumsal evraklarınıza, faturalarınıza veya sözleşmelerinize el yazısı imzanızın görselini ya da 'ASLI GİBİDİR', 'ONAYLANDI' kaşelerini eklemenizi sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, PDF belgeleriniz ve yüklediğiniz şirket kaşeleri hiçbir uzak internet sunucusuna gönderilmez, gizliliğiniz tamamen korunur.

■ PDF’e Kaşe Ekleme Nedir?
PDF'e kaşe ekleme, bir PDF belgesinin istenilen bir sayfasına, belgenin orijinal içeriğine ve metin katmanına zarar vermeden, yarı saydam veya opak bir şekilde grafik tabanlı kurumsal kaşe veya logo yerleştirme işlemidir.

■ PDF Dosyasına İmza veya Resim Nasıl Eklenir?
EvrakFix Kaşe Ekleme aracına belgenizi yükleyin. 'Görsel / İmza Yükle' sekmesinden el yazısı imza resminizi (PNG/JPG) seçin. Sayfa önizleme ekranı üzerinde imzanın yer almasını istediğiniz köşeye tıklayarak veya parametrelerden boyut, yön ve saydamlık ayarlarını yaparak yerleştirin. 'Belgeyi Kaşele' butonuna tıklayarak saniyeler içinde yeni belgenizi indirin.

■ Resmi Hazır Kaşe Presets Nedir?
Dışarıdan bir kaşe resmi yüklemek zorunda kalmamanız için EvrakFix içerisinde popüler resmi kaşe şablonları barındırır. 'ASLI GİBİDİR', 'ONAYLANDI', 'İPTAL EDİLDİ', 'GİZLİDİR', 'ÖDENDİ' yazılı kaşeleri kırmızı, mavi veya yeşil renk seçenekleriyle tarayıcınızda dinamik olarak çizip dökümana basabilirsiniz.

■ PDF Kaşe Ekleme İşlemi Güvenli mi?
Evet. EvrakFix tamamen yerel (client-side) çalışır. İşlediğiniz PDF dosyaları veya yüklediğiniz imzalı resimler internet üzerinden hiçbir sunucuya yüklenmez, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın RAM belleğinde tamamlanır.

■ Mobil Cihazdan PDF Kaşelenebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android işletim sistemli telefon veya tabletlerinizden ek uygulama indirmeden tarayıcınız üzerinden PDF belgelerine anında imza veya kaşe basabilir, PDF çıktısını alabilirsiniz.

■ EvrakFix ile PDF Kaşelemenin Avantajları
EvrakFix ile üyelik, limit veya ücret olmadan tamamen ücretsiz kaşeleme ve resim ekleme işlemleri yapabilirsiniz. Sunucu yüklemesi olmadığı için internet hızından bağımsız olarak anında sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Kaşe veya resim yerleştirmek istediğiniz PDF dökümanını sürükleyip bırakarak yükleyin.' },
      { title: 'Kaşe Tipi ve Konum Seçin', description: 'İster hazır kaşe (ASLI GİBİDİR vb.) seçin, ister imza resminizi yükleyin. Önizleme canvas\'ında yerleştirmek istediğiniz noktaya tıklayın.' },
      { title: 'İşleyin ve İndirin', description: 'Boyut ve saydamlık ayarlarını yaptıktan sonra \'Belgeyi Kaşele ve İndir\' butonuna basarak indirin.' }
    ],
    faqs: [
      { question: 'Yüklediğim PDF veya kaşe resimlerim sunucuya gidiyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dökümanlarınız ve kaşe/imza resimleriniz hiçbir sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir.' },
      { question: 'Şeffaf imza eklemek için hangi formatı kullanmalıyım?', answer: 'Arka planı transparan (şeffaf) olan el yazısı imzalarınızı belgenin üzerine yerleştirmek için en iyi sonucu PNG formatındaki resim dosyaları verir.' },
      { question: 'Kaşenin açısını eğik (açılı) yapabilir miyim?', answer: 'Evet. Açı seçenekleri üzerinden kaşenizi 15 derece veya 30 derece eğerek daha gerçekçi bir ıslak kaşe görünümü elde edebilirsiniz.' },
      { question: 'Belgede sadece ilk veya son sayfaya mı ekleyebilirim?', answer: 'Hayır. Belgenizin sayfa sayısı kaç olursa olsun, sayfa seçici menüsü üzerinden istediğiniz sayfa numarasını seçerek kaşeyi o sayfaya basabilirsiniz.' },
      { question: 'Kaşeli PDF dosyasını hemen indirebilir miyim?', answer: 'Evet. \'Belgeyi Kaşele ve İndir\' butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar.' }
    ]
  },
  '/image-ocr': {
    toolName: 'Resimden Metin Okuma (OCR)',
    description: `EvrakFix Resimden Metin Okuma (OCR) aracımız, görsellerinizin, taranmış resmi evraklarınızın, fiş ve fatura fotoğraflarınızın içindeki metinleri yapay zeka yardımıyla otomatik olarak kopyalanabilir düz metne dönüştürür. Tamamen tarayıcınızda ve yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz belgeler veya fotoğraflar hiçbir uzak sunucuya yüklenmez, kişisel ve kurumsal gizliliğiniz tamamen korunur.

■ Resimden Metin Okuma (OCR) Nedir?
OCR (Optical Character Recognition - Optik Karakter Tanıma), resim dosyalarının, taranmış belgelerin veya ekran görüntülerinin içerisindeki yazılı harfleri ve sayıları analiz ederek bilgisayarda düzenlenebilir ve kopyalanabilir metin formatına çeviren gelişmiş bir yapay zeka teknolojisidir.

■ Görseldeki Yazı Nasıl Kopyalanır?
EvrakFix OCR aracına metnini almak istediğiniz resmi sürükleyip bırakın. Çözümleme dilini (Türkçe/İngilizce) seçin ve 'Metinleri Oku' butonuna tıklayın. Saniyeler içinde görseldeki tüm yazılar sağ kutuda belirecektir; 'Metni Kopyala' butonuna tıklayarak bilgisayarınıza veya telefonunuza kaydedebilirsiniz.

■ OCR Metin Okuma Güvenli mi?
Evet, tamamen güvenlidir. EvrakFix yerel (client-side) tesseract motorunu kullanır. İşlediğiniz resim dosyaları uzak internet sunucularına aktarılmaz, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Süreç tamamen kendi bilgisayarınızda veya telefonunuzda (tarayıcı RAM belleğinde) sonlanır.

■ Mobil Cihazdan Resim Metne Çevrilebilir mi?
Evet. EvrakFix responsive mobil uyumludur. Akıllı telefon veya tabletinizin kamerasıyla anlık olarak çektiğiniz bir belgenin, kitap sayfasının veya fişin fotoğrafını tarayıcınız üzerinden ek bir uygulama kurmadan doğrudan metne dönüştürebilirsiniz.

■ EvrakFix OCR Aracının Avantajları
Üyelik gerekmez, limitsiz ve tamamen ücretsizdir. İşlemler yerel olarak yapıldığı için sunucu bekleme süresi yoktur ve gizlilik seviyesini en üst düzeyde (cihazınızda) tutar.`,
    steps: [
      { title: 'Resmi veya Ekran Görüntüsünü Yükleyin', description: 'İçindeki metni okumak istediğiniz JPG, JPEG veya PNG formatındaki resmi sürükleyip bırakarak yükleyin.' },
      { title: 'Dil Seçimini Yapın', description: 'En doğru sonuç için resimdeki yazının diliyle uyumlu dil seçeneğini (Türkçe veya İngilizce) seçin.' },
      { title: 'Tara ve Metni Kopyala', description: '\'Resimdeki Metinleri Oku\' butonuna tıklayın, analiz tamamlandığında üretilen metni tek tıkla kopyalayın.' }
    ],
    faqs: [
      { question: 'Yüklediğim resimler veya belgeler sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Resimleriniz hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcı belleğinde yerel olarak çözümlenir.' },
      { question: 'Hangi resim formatları destekleniyor?', answer: 'JPG, JPEG ve PNG formatındaki tüm popüler resim ve ekran görüntüsü (screenshot) dosyalarını yükleyerek tarayabilirsiniz.' },
      { question: 'OCR işleminin doğruluk oranı nedir?', answer: 'Doğruluk oranı doğrudan görselin netliğine, yazı tipine, ışık kalitesine ve çözünürlüğüne bağlıdır. İyi ışıkta çekilmiş, net ve bilgisayar yazısı içeren görsellerde doğruluk oranı %98\'e kadar ulaşır.' },
      { question: 'El yazısı metinleri okuyabilir miyim?', answer: 'OCR motorumuz el yazısı metinleri de okumayı dener; ancak el yazısının kişiye özel eğimleri ve düzensizlikleri nedeniyle doğruluk oranı bilgisayar (font) yazısına göre daha düşük olmaktadır.' }
    ]
  },
  '/document-scanner': {
    toolName: 'Belge Tarayıcı',
    description: `EvrakFix Belge Tarayıcı (Scan & Contrast Filter) aracımız, akıllı telefonunuzun kamerasıyla çektiğiniz veya bilgisayarınızda bulunan evrak resimlerini tarayıp netleştirmenizi sağlar. Çekimden kaynaklı oluşan sayfa kenarı gölgelerini temizler, kağıt rengini beyazlaştırır ve siyah yazıları belirginleştirir. Tamamen yerel (client-side) çalışan bu modül sayesinde, yüklediğiniz kişisel evrak, makbuz, kimlik fotokopisi veya sınav kağıdı resimleri hiçbir sunucuya yüklenmez ve gizliliğiniz korunur.

■ Belge Tarayıcı Nedir?
Belge tarayıcı, mobil kameralarla çekilen belgelerin gölgeli, eğik veya yetersiz ışıklı resimlerini analiz ederek resmi bir ofis tarayıcısından (flatbed scanner) taranmış gibi düz, beyaz arka planlı ve yüksek kontrastlı bir PDF/resim dökümanına dönüştüren araçtır.

■ Evrak Fotoğrafları Nasıl Netleştirilir?
Evrak resminizi seçin. 'Sihirli Renk' (Magic Scan) filtresini seçtiğinizde sistem otomatik olarak koyu gölgeleri beyazlaştırır ve yazıları koyulaştırır. İsteğinize göre döndürerek yönünü düzeltin. Sonrasında PDF olarak kaydedip çıktıya hazır hale getirin.

■ PDF veya PNG İndirme Seçenekleri Nedir?
- PDF Olarak İndir: Resmi yazışmalar veya e-devlet yüklemeleri için dökümanı standart A4 boyutuna hizalayarak yüksek kaliteli bir PDF haline verir.
- Görsel Olarak İndir: Resmi doğrudan temizlenmiş ve yönü düzeltilmiş bir PNG dosyası olarak kaydeder.

■ Belge Tarayıcı Güvenli mi?
Evet. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Görselleriniz veya kimlik fotokopileriniz internet üzerinden hiçbir uzak sunucuya aktarılmaz, depolanmaz ve üçüncü şahıslarla paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın tarayıcı belleğinde gerçekleşir.`,
    steps: [
      { title: 'Fotoğrafı Yükleyin', description: 'Tarayıp netleştirmek istediğiniz evrak fotoğrafını (JPG, PNG, WebP) sürükleyip bırakarak yükleyin.' },
      { title: 'Filtre ve Ayarları Düzenleyin', description: 'Sihirli Renk veya Siyah-Beyaz modlarından birini seçip parlaklık, kontrast veya yön açısını ayarlayın.' },
      { title: 'PDF veya PNG Olarak İndirin', description: 'Ayarlar bittiğinde \'PDF Olarak İndir\' butonuna tıklayarak taranmış resmi dökümanınızı anında indirin.' }
    ],
    faqs: [
      { question: 'Evrak fotoğraflarım veya belgelerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Resimleriniz hiçbir sunucuya aktarılmadan doğrudan cihazınızın tarayıcısında işlenir.' },
      { question: 'Sihirli Renk (Magic Scan) filtresi ne işe yarar?', answer: 'Sihirli renk filtresi, evrak resmindeki kağıt dokusu gölgelerini ve sarı oda ışığı lekelerini beyazlaştırırken, mürekkep yazılarının ve renkli logoların kalitesini artırarak yazıcı dostu bir çıktı sunar.' },
      { question: 'Yamuk çekilen fotoğrafların yönünü düzeltebilir miyim?', answer: 'Evet. \'Döndür\' butonu yardımıyla ters veya yan taranmış evrak resimlerinizi saat yönünde 90 derecelik açılarla çevirip düzeltebilirsiniz.' },
      { question: 'Tarama sonrası dosya boyutu çok büyük olur mu?', answer: 'Hayır. Araç, resmi PDF\'e aktarırken JPEG sıkıştırma standartlarını kullanarak dosya boyutunu e-posta eki veya e-devlet yükleme sınırlarına uygun şekilde optimize eder.' },
      { question: 'Bu aracı mobil cihazlarda kullanabilir miyim?', answer: 'Evet. Mobil tarayıcılarla tam uyumludur. Akıllı telefonunuzdan girdiğinizde doğrudan kameranızı açıp anlık evrak fotoğrafı çekerek tarayabilirsiniz.' }
    ]
  },
  '/pdf-to-text': {
    toolName: 'PDF’ten Metin Çıkarıcı',
    description: `EvrakFix PDF’ten Metin Çıkarıcı (PDF to Text / Markdown) aracımız, bilgisayarınızda veya mobil cihazınızda bulunan seçilebilir metin katmanına sahip PDF dökümanlarındaki tüm yazıları saniyeler içinde düz metne dönüştürür. PDF dosyalarından elinizle yazı kopyalamanın zor olduğu durumlarda, tüm sayfaların metinlerini tek seferde ayıklar. Sunucusuz (client-side) çalışan gizlilik odaklı mimarisi sayesinde, sözleşmeleriniz veya özel dökümanlarınız hiçbir şekilde internet sunucularına aktarılmaz, verileriniz tamamen cihazınızda kalır.

■ PDF’ten Metin Çıkarma Nedir?
PDF'ten metin çıkarma (PDF text extraction), bir PDF dökümanı içerisindeki sayısal yazı katmanlarını okuyarak yazı tipi, görsel ve biçimlendirmelerden arındırılmış yalın düz metin (plain text) üretme işlemidir.

■ PDF Dosyasındaki Yazılar Nasıl Kopyalanır?
EvrakFix PDF Metin Ayıklayıcı'ya dosyanızı yükleyin. Sistem, PDF'teki tüm yazıları tarayıcıda çözümler ve sayfa sayfa ayırarak önizleme kutusuna yansıtır. 'Tümünü Kopyala' butonuna tıklayarak hafızaya alabilir ya da bilgisayarınıza TXT veya Markdown olarak kaydedebilirsiniz.

■ Hangi PDF Dosyalarından Metin Çıkarılabilir?
Yalnızca dijital ortamda üretilmiş (Word'den PDF'e çevrilmiş, e-kitaplar vb.) veya OCR işlemi uygulanarak metin katmanı kazandırılmış PDF belgelerinden metin çıkarılabilir. Tarayıcıdan doğrudan resim olarak aktarılmış, seçilemeyen yazılar içeren PDF'ler için 'Resimden Metin Okuma (OCR)' aracımızı kullanmanız gerekir.

■ Metin Ayıklama İşlemi Güvenli mi?
Evet, son derece güvenlidir. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışmaktadır. PDF dökümanınız hiçbir uzak sunucuya yüklenmez, doğrudan cihazınızın RAM belleğinde işlenir. Gizlilik taahhüdümüz kapsamında verileriniz tamamen sizde kalır.`,
    steps: [
      { title: 'PDF Dosyasını Yükleyin', description: 'Metnini kopyalamak istediğiniz seçilebilir yazı katmanına sahip PDF belgesini sürükleyip bırakarak yükleyin.' },
      { title: 'Formatı Belirleyin', description: 'Dışa aktarma formatını düz metin (.txt) veya yapılandırılmış Markdown (.md) olarak belirleyin.' },
      { title: 'Kopyalayın veya İndirin', description: 'Dönüşüm tamamlandığında \'Tümünü Kopyala\' tuşuyla kopyalayın ya da dosya olarak cihazınıza indirin.' }
    ],
    faqs: [
      { question: 'Belgelerim ve metinlerim sunucuya kaydediliyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dosyası ve ayıklanan yazılar hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcısında işlenir.' },
      { question: 'Taranmış resimli PDF’lerden yazı çıkarabilir miyim?', answer: 'Bu araç sadece seçilebilir yazı katmanı olan dijital PDF\'ler içindir. Fotoğraf olarak taranmış PDF\'ler için lütfen ana menüdeki \'Resimden Metin Okuma (OCR)\' aracımızı tercih edin.' },
      { question: 'Markdown (.md) formatında dışa aktarmak ne avantaj sağlar?', answer: 'Markdown formatı, sayfa başlıklarını ve sayfa sınırlarını temiz bir yapısal formatta (## Sayfa 1 ve ---) saklar, bu sayede not alma uygulamalarında veya dökümantasyon sistemlerinde doğrudan kullanılabilir.' },
      { question: 'Dosya boyutu veya sayfa sayısı sınırı var mı?', answer: 'Hayır, herhangi bir sınır yoktur. Ancak yüzlerce sayfalık çok büyük PDF dosyalarında çözümleme hızı doğrudan tarayıcınızın ve cihazınızın donanım performansına bağlı olarak değişir.' },
      { question: 'Türkçe karakterler bozulmadan çıkar mı?', answer: 'Evet. pdfjs parser motoru UTF-8 karakter kodlamasıyla çalışır. Türkçe karakterler (ş, ı, ğ, ç, ö, ü) ve özel semboller tamamen orijinal haliyle korunarak ayıklanır.' }
    ]
  },
  '/csv-json-xml-converter': {
    toolName: 'CSV JSON XML Dönüştürücü',
    description: `EvrakFix CSV JSON XML Dönüştürücü, veri tabloları ve veri ağacı yapılarını tarayıcınızda saniyeler içinde birbirine dönüştürmenizi sağlar. Excel veya veritabanı çıktısı olan CSV dosyalarını JSON veya XML kod şemalarına, ya da XML e-fatura taslaklarını kopyalanabilir CSV tablolarına çevirmek için idealdir. Tamamen sunucusuz (client-side) çalışan bu araç sayesinde girdiğiniz hiçbir ticari veri, muhasebe tablosu veya finansal kod uzak sunuculara yüklenmez.

■ CSV JSON XML Dönüştürücü Nedir?
CSV, JSON ve XML veri formatları arasında hızlı çeviriler gerçekleştiren dijital bir araçtır:
- CSV (Comma Separated Values): Tablo verileri ve Excel için ideal basitleştirilmiş format.
- JSON (JavaScript Object Notation): Modern web API'leri için standart ağaç veri formatı.
- XML (eXtensible Markup Language): Resmi dökümanlar ve e-faturalar için etiket tabanlı format.

■ CSV Dosyası JSON’a Nasıl Dönüştürülür?
CSV metninizi sol kutuya yapıştırın veya dosya yükleme alanından seçin. Format seçim panellerinde girdi olarak CSV, çıktı olarak JSON işaretleyip 'Dönüştür' tuşuna basın. Saniyeler içinde çıktı kutusunda JSON kodunu elde edeceksiniz.

■ XML Fatura Verisi CSV Yapılabilir mi?
Evet. UBL-TR standardına uygun e-fatura XML verilerini yapıştırıp çıktı olarak CSV'yi seçtiğinizde, sistem otomatik olarak hiyerarşik etiketleri analiz eder ve tablo şeklinde düzleştirip Excel'de açabileceğiniz bir CSV çıktısı oluşturur.

■ Dönüşüm İşlemi Güvenli mi?
Evet, tamamen yerel ve güvenlidir. EvrakFix sunucusuz çalışır. Yapıştırdığınız veya yüklediğiniz hiçbir veri internetteki uzak bir sunucuya aktarılmaz, izlenmez ve kaydedilmez. Tüm dönüşüm algoritmaları tarayıcınızın kendi işlem gücüyle yerel olarak sonlanır.`,
    steps: [
      { title: 'Girdi Verinizi Yükleyin', description: 'Dönüştürmek istediğiniz CSV, JSON veya XML metnini yapıştırın ya da dosya olarak sisteme yükleyin.' },
      { title: 'Dönüşüm Yönünü Seçin', description: 'Girdi ve çıktı formatını seçin. Sistem dosya yüklendiğinde uzantıya göre girdiyi otomatik algılar.' },
      { title: 'Dönüştürün ve Alın', description: '\'Veriyi Dönüştür\' butonuna basarak dönüşümü başlatın, çıktıyı kopyalayın veya dosya olarak indirin.' }
    ],
    faqs: [
      { question: 'Girdiğim veriler sunucuya gönderiliyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Verileriniz hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde dönüştürülür.' },
      { question: 'Bozuk veya eksik CSV dosyaları hata verir mi?', answer: 'Dönüştürücü motorumuz basit yazım hatalarını tolere edecek şekilde tasarlanmıştır. Ancak başlık satırı (header) bulunmayan veya düzensiz virgül kullanan dosyalarda sütun eşleşmesi hatalı olabilir.' },
      { question: 'Büyük boyutlu veritabanı çıktıları dönüştürülebilir mi?', answer: 'Evet. Birkaç megabayta kadar olan büyük veri setleri tarayıcıda işlenebilir. Ancak işlem hızı tamamen bilgisayarınızın donanım performansına (RAM ve işlemci) bağlıdır.' },
      { question: 'XML şemalarında iç içe geçmiş etiketler nasıl CSV olur?', answer: 'Sistem, XML ağacını düzleştirme (flatten) algoritması kullanarak tüm iç içe etiketleri parent_child yapısında başlıklar halinde sütunlara döker, böylece veri kaybı olmadan tabloya aktarılır.' },
      { question: 'Bu araç tamamen ücretsiz midir?', answer: 'Evet. Herhangi bir kullanım sınırı, kota veya ücretlendirme bulunmamaktadır.' }
    ]
  },
  '/pdf-to-grayscale': {
    toolName: 'PDF Yazıcı Dostu Yapıcı',
    description: `EvrakFix PDF Yazıcı Dostu Yapıcı (Grayscale & Toner Saver) aracımız, renkli dökümanlarınızı, ders notlarınızı veya kitap taramalarınızı siyah-beyaza çevirmenizi sağlar. Akıllı arka plan temizleme (Toner Saver) teknolojisi sayesinde sayfadaki gereksiz renkli zemin dolgularını ve koyu sayfa gölgelerini tespit ederek beyaza çevirir; yazıcı kartuşundan ve tonerden yüksek oranda tasarruf etmenizi sağlar. Tamamen tarayıcıda çalışan gizlilik odaklı mimarisiyle dökümanlarınız hiçbir şekilde internet sunucularına aktarılmadan tamamen kendi cihazınızda işlenir.

■ PDF Yazıcı Dostu Yapıcı Nedir?
Renkli dökümanların yazıcıdan çıktı alınırken çok fazla kartuş tüketmesini önlemek amacıyla sayfaları gri tonlamaya çeviren ve toner tasarrufu sağlamak için hafif gölgeli kağıt arka planlarını tamamen beyaz yapan akıllı bir dönüşüm aracıdır.

■ PDF Siyah-Beyaz Nasıl Yapılır?
EvrakFix yazıcı dostu sayfasına PDF dosyanızı yükleyin. 'Toner Tasarrufu' ve 'Yazı Kontrastını Artır' seçeneklerini aktif hale getirip 'Yazıcı Dostu Yap' butonuna tıklayın. Sayfalarınız saniyeler içinde analiz edilerek gri tonlara çevrilir ve arka planları temizlenmiş PDF belgesi indirilmeye hazır hale gelir.

■ Toner Tasarrufu Filtresi Ne Avantaj Sağlar?
Birçok taranmış dökümanda sayfaların arkasında gri veya kirli sarı bir renk tonu kalır. Yazıcı bu kısımları da basmaya çalışarak çok fazla mürekkep harcar. Toner Tasarrufu filtresi, bu kirli tonları dijital olarak algılar ve beyaza yuvarlayarak yazıcınızın sadece asıl metin ve çizgileri basmasını sağlar.

■ Dönüşüm İşlemi Güvenli mi?
Evet. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya yüklenmez, doğrudan cihazınızın tarayıcı belleğinde (RAM) işlenir. Dosyalarınız tamamen güvendedir.`,
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Siyah-beyaz yapmak veya kartuş tasarrufu uygulamak istediğiniz renkli PDF dosyasını yükleyin.' },
      { title: 'Tasarruf Seçeneklerini Ayarlayın', description: 'Toner Tasarrufu (arka plan silme) ve Yazı Kontrastını Artırma kutucuklarını ihtiyacınıza göre işaretleyin.' },
      { title: 'Dönüştürün ve İndirin', description: '\'Yazıcı Dostu Yap\' butonuna basarak işlemi başlatın, tamamlandığında siyah-beyaz PDF\'inizi anında indirin.' }
    ],
    faqs: [
      { question: 'Belgelerim ve metinlerim sunucuya gönderiliyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Belgeleriniz hiçbir uzak internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcısında işlenir.' },
      { question: 'Renkli PDF’i siyah-beyaza çevirince dosya kalitesi düşer mi?', answer: 'Hayır. Yüksek kaliteli piksel render algoritmalarımız sayesinde orijinal PDF sayfa çözünürlüğü korunur, sadece renk kanalları optimize edilerek gri tonlamaya çevrilir.' },
      { question: 'Tasarruflu modda yazılar kaybolur mu?', answer: 'Hayır. \'Yazı Kontrastını Artır\' seçeneği aktif olduğunda, renklerin griye dönmesiyle soluklaşabilecek olan açık renkli yazılar koyulaştırılarak okunurluğu artırılır.' },
      { question: 'Çok sayfalı büyük kitaplarda işlem süresi ne kadardır?', answer: 'Çözümleme işlemi sayfa sayısına ve sayfa çözünürlüğüne bağlı olarak değişir. İşlemler tarayıcıda yapıldığı için süre doğrudan cihazınızın RAM ve işlemci donanım gücüne bağlıdır.' },
      { question: 'Bu hizmet için herhangi bir ücret ödenmesi gerekir mi?', answer: 'Hayır. EvrakFix bünyesindeki tüm araçlar gibi PDF Yazıcı Dostu Yapıcı da tamamen ücretsizdir ve kullanım limiti bulunmamaktadır.' }
    ]
  },
  '/pdf-resizer': {
    toolName: 'PDF Sayfa Boyutu & Kenar Payı Düzenleyici',
    description: `EvrakFix PDF Sayfa Boyutu & Kenar Payı Düzenleyici (PDF Resizer), PDF dökümanlarınızın sayfa boyutlarını standart A4, A3, A5 veya Letter formatlarına dönüştürmenizi sağlar. Sayfa kenarlarındaki yazıları korumak veya çıktı alırken zımbalama payı bırakmak için özel kenar boşlukları (margins) ekleyebilirsiniz. En büyük avantajı, sayfaları resme dönüştürmeden doğrudan vektör düzeyinde ölçeklemesidir; böylece yazılarınızın netliği bozulmaz ve arama seçilebilirliği aynen korunur.

■ PDF Resizer Nedir?
PDF resizer, dökümanın sayfa alanlarını (MediaBox/CropBox) ölçeklendirerek sayfaları A4 veya Letter gibi standart yazıcı boyutlarına uyumlu hale getiren ve kenar boşluklarını milimetrik olarak ayarlayan gelişmiş bir düzenleyicidir.

■ Sayfa Boyutları Nasıl A4 Yapılır?
PDF dosyanızı yükleyin. Hedef sayfa boyutu listesinden 'A4 Boyutu' seçeneğini işaretleyin. Kayma olmaması için kenar boşluğunu (örneğin 20 pt) ayarlayıp 'Boyutlandır' butonuna basın. Vektör kalitesinde derlenen yeni PDF belgeniz saniyeler içinde inecektir.

■ Vektörel Ölçeklendirme Nedir?
Geleneksel araçlar sayfayı resme çevirip büyüttüğü için metin kalitesi bulanıklaşır ve yazıların seçilmesi/kopyalanması engellenir. EvrakFix ise sayfa katmanlarını doğrudan PDF kod yapısı içinde embed ederek yeniden çizer; bu sayede döküman orijinalliğini ve metin seçilebilirliğini korur.

■ Boyut Değiştirme Güvenli mi?
Evet. EvrakFix sunucusuz (client-side) çalışır. İşlediğiniz PDF belgeleri veya sözleşmeler internetteki uzak sunuculara yüklenmez, doğrudan kendi bilgisayarınızın tarayıcısında işlenir. Gizliliğiniz tarayıcı düzeyinde koruma altındadır.`,
    steps: [
      { title: 'PDF Dosyasını Yükleyin', description: 'Boyutunu ve kenar paylarını değiştirmek istediğiniz PDF dökümanını sürükleyip bırakarak yükleyin.' },
      { title: 'Boyut ve Boşluk Seçin', description: 'Dönüştürmek istediğiniz hedef boyutu (A4, A3, Letter vb.) seçin ve kenar payı sürgüsünü ayarlayın.' },
      { title: 'İşleyin ve İndirin', description: '\'Belgeyi Yeniden Boyutlandır\' butonuna tıklayarak işlemi başlatın, tamamlandığında PDF\'inizi anında indirin.' }
    ],
    faqs: [
      { question: 'Belgelerim ve verilerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dosyası hiçbir internet sunucusuna gönderilmez, doğrudan cihazınızın tarayıcısının yerel belleğinde işlenir.' },
      { question: 'Boyutlandırma sonrasında PDF’teki yazılar kopyalanabilir kalır mı?', answer: 'Evet. Sayfalar resme dönüştürülmez. Orijinal vektörel yapı korunduğu için PDF içerisindeki metin arama ve metin kopyalama özellikleri aynen aktif kalır.' },
      { question: 'Kenar boşluğu eklemek ne işe yarar?', answer: 'Özellikle kitapçık basımlarında, ciltleme veya zımbalama yapıldığında sayfa kenarındaki metinlerin kaybolmaması için kenar marjı eklemek kritik öneme sahiptir.' },
      { question: 'Yatay (Landscape) sayfalar dikey (Portrait) olur mu?', answer: 'Seçtiğiniz preset boyuta göre sayfalar otomatik ölçeklenir ve ortalanır. Geniş sayfaların bozulmaması için orijinal en/boy oranını koruyarak yeni sayfa sınırlarına sığdırılır.' },
      { question: 'Bu araç ücretli midir veya limit var mıdır?', answer: 'Hayır. PDF Resizer tamamen ücretsizdir ve herhangi bir dosya yükleme sınırı veya kota bulunmamaktadır.' }
    ]
  },
  '/vat-invoice-calculator': {
    toolName: 'KDV ve Fatura Hesaplayıcı',
    description: `EvrakFix KDV ve Fatura Hesaplayıcı, faturalarınızın KDV dahil veya KDV hariç bedellerini cihazınızda saniyeler içinde hesaplamanızı sağlar. Türkiye'de uygulanan standart KDV oranları (%20, %10, %1) ile birlikte faturalarınıza özel KDV tevkifat oranlarını (1/10'dan 10/10'a kadar) kolayca yansıtabilirsiniz. Finansal verileriniz internete yüklenmeden doğrudan kendi tarayıcınızda hesaplanır.

■ KDV Hesaplama Nedir?
Katma Değer Vergisi (KDV) hesaplama, mal veya hizmetin net matrahı üzerine uygulanacak olan vergi oranına göre vergi tutarını bulma ve matraha ekleyerek (dahil) veya matrahtan çıkararak (hariç) toplam tutarları hesaplama işlemidir.

■ Tevkifatlı Fatura Hesaplama Nasıl Yapılır?
Gelişmiş hesaplayıcımıza fatura tutarını yazın, KDV Dahil veya KDV Hariç durumunu seçin, KDV oranını belirleyin ve son olarak varsa Tevkifat Oranını (örneğin 5/10) seçin. Matrah, KDV, tevkifat kesintisi ve net fatura bedeli anında listelenir.`,
    steps: [
      { title: 'Tutar Girin ve Tür Seçin', description: 'Hesaplamak istediğiniz fatura bedelini yazıp KDV Dahil veya KDV Hariç seçeneğini işaretleyin.' },
      { title: 'KDV ve Tevkifatı Seçin', description: 'Güncel KDV oranını (%20, %10, %1) ve varsa tevkifat oranını listeden belirleyin.' },
      { title: 'Sonuçları Alın', description: 'Matrah, KDV tutarı, tevkif edilen KDV ve net tahsil edilecek tutar saniyeler içinde hesaplanır.' }
    ],
    faqs: [
      { question: 'Finansal bilgilerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Girdiğiniz tutar, KDV oranı veya tevkifat gibi finansal hiçbir veri sunucularımıza gitmez, tamamen tarayıcınızda hesaplanır.' },
      { question: 'Güncel KDV oranları nelerdir?', answer: 'Temmuz 2023 itibarıyla Türkiye\'de genel KDV oranı %20, gıda ve bazı temel ürünler için indirimli KDV oranları %10 ve %1 olarak uygulanmaktadır.' },
      { question: 'KDV tevkifatı nasıl hesaplanır?', answer: 'Tevkifat oranına göre (örneğin 5/10), hesaplanan toplam KDV tutarı kesintiye uğrar. Kesilen tutar satıcıya ödenmez, alıcı tarafından doğrudan vergi dairesine beyan edilir.' }
    ]
  },
  '/interest-calculator': {
    toolName: 'Gecikme Faizi ve Yasal Faiz Hesaplayıcı',
    description: `EvrakFix Yasal ve Gecikme Faizi Hesaplayıcı, borçların vade tarihleri ile ödeme tarihleri arasında geçen süreler için yasal faiz ve ticari temerrüt faizlerini otomatik hesaplar. Türkiye'deki yasal faiz ve ticari (avans) faiz oranlarının tarihsel dönemsel değişimlerini veri tabanında tutarak, tarih aralığına göre gün gün hesaplama dökümünü çıkarır.

■ Yasal Faiz Değişimleri
Borçlar Kanununa göre yasal faiz oranları değişkenlik göstermektedir. Araç, başlangıç ve bitiş tarihleri arasındaki faiz oranı değişimlerini (yıllık %9 veya yıllık %24 gibi) otomatik bölümlere ayırarak hatasız hesaplama yapar.

■ Faiz Hesaplama Nasıl Yapılır?
Ana para tutarını yazın, faiz başlangıç (vade) tarihini ve faiz bitiş (ödeme) tarihini seçin. Faiz oranının türünü (Yasal, Ticari veya Özel) belirlediğinizde faiz raporunuz anında oluşturulur.`,
    steps: [
      { title: 'Tutar ve Tarihleri Belirleyin', description: 'Hesaplamak istediğiniz ana para tutarını, başlangıç ve bitiş tarihlerini girin.' },
      { title: 'Faiz Türünü Seçin', description: 'Yasal faiz, ticari temerrüt faizi veya serbest özel bir oran belirleyin.' },
      { title: 'Raporu İnceleyin', description: 'Oranların değiştiği dönemlere göre gün gün hesaplanan detaylı döküm tablosunu alın.' }
    ],
    faqs: [
      { question: 'Hesaplanan faiz verileri sunucuya yükleniyor mu?', answer: 'Hayır. Borç tutarı, başlangıç veya bitiş tarihi gibi kişisel ve finansal hiçbir veri uzak sunuculara yüklenmez. Tüm hesaplamalar tarayıcınızda yapılır.' },
      { question: 'Yasal faiz ve ticari faiz oranları güncel mi?', answer: 'Evet, Türkiye\'deki güncel yasal faiz (yıllık %24) ve ticari avans faizi (yıllık %48) oranları sisteme entegredir.' },
      { question: 'Özel faiz oranıyla hesaplama yapabilir miyim?', answer: 'Evet. Özel Faiz Oranı seçeneğini işaretleyerek kendi belirlediğiniz yıllık faiz yüzdesine göre hesaplama yapabilirsiniz.' }
    ]
  },
  '/pdf-booklet-splitter': {
    toolName: 'PDF Kitapçık Sayfa Ayırıcı',
    description: `EvrakFix PDF Kitapçık Ayırıcı, yan yana duran çift sayfalı yatay (landscape) PDF belgelerini dikey (portrait) tekli sayfalar halinde ortadan bölmenizi sağlar. pdf-lib kütüphanesini kullanarak orijinal vektör katmanlarını ve yazı fontlarını koruyarak bölme yapar; bu sayede yazıların netliği bozulmaz ve arama seçilebilirliği aynen kalır.

■ Kitapçık Bölme Nedir?
İki sayfa yan yana basılmış veya taranmış kitapçıkların, sayfa ortasından dikey bir hatla bölünerek ardışık tekli sayfalar halinde getirilmesi işlemidir.

■ PDF Kitapçık Nasıl Bölünür?
PDF dökümanını Dropzone alanına yükleyin. 'Yalnızca Yatay Sayfaları Böl' ayarını etkinleştirerek 'Sayfaları Ortadan Böl' butonuna basın. Bölünen sayfalar saniyeler içinde yeni PDF olarak indirilmeye hazır olacaktır.`,
    steps: [
      { title: 'Kitapçık PDF Yükleyin', description: 'Ortadan ikiye bölmek istediğiniz yatay düzenli PDF dökümanını seçin.' },
      { title: 'Ayarları Belirleyin', description: 'Dikey sayfaların korunup korunmayacağını (Yalnızca yatay sayfaları böl) ayarlayın.' },
      { title: 'İşleyin ve İndirin', description: 'Sayfaları Ortadan Böl butonuna tıklayarak yeni PDF\'inizi anında cihazınıza kaydedin.' }
    ],
    faqs: [
      { question: 'PDF dökümanım sunucuya gidiyor mu?', answer: 'Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. PDF dökümanı hiçbir internet sunucusuna gönderilmez, doğrudan tarayıcınızda bölünür.' },
      { question: 'Bölme sonrasında yazı kalitesi düşer mi?', answer: 'Hayır. Sayfalar resme dönüştürülmez. Orijinal vektör yapısı korunduğu için metinlerin seçilebilirliği ve aratılabilirliği aynen kalır.' },
      { question: 'Dikey sayfalar da bölünür mü?', answer: 'Yalnızca yatay sayfaları böl ayarı aktifken dikey sayfalar (kapak vb.) bölünmeden olduğu gibi korunur.' }
    ]
  },
  '/markdown-editor': {
    toolName: 'Markdown Editör & PDF Dönüştürücü',
    description: `EvrakFix Markdown Editör, düz metin kodları ile şık dökümanlar yazıp bunları cihazınızda PDF formatına dönüştürmenizi sağlar. Sol tarafta dökümanınızı düzenlerken sağ taraftaki panelde HTML önizlemesini gerçek zamanlı izleyebilirsiniz. Tamamen tarayıcı düzeyinde çalışarak veri güvenliğinizi korur.

■ Markdown Nedir?
Markdown, düz metin biçimlendirme dilidir. Sadece klavyeden başlık (#), liste (-), kalın (**yazı**) gibi sembollerle hızlıca şık ve standartlara uygun kurumsal yazılar yazmanızı sağlar.

■ Markdown PDF'e Nasıl Dönüştürülür?
Editörde belgenizi oluşturun. 'Cihazda PDF Yap' veya 'Yazdır / Farklı Kaydet' butonlarını kullanarak A4 standartlarında profesyonel PDF çıktısı alın.`,
    steps: [
      { title: 'Metninizi Yazın', description: 'Sol taraftaki editöre dökümanınızı Markdown biçiminde yazın veya hazır butonları kullanın.' },
      { title: 'Önizlemeyi İzleyin', description: 'Sağ taraftaki canlı panelde belgenizin bittiğinde nasıl görüneceğini gerçek zamanlı takip edin.' },
      { title: 'PDF Olarak Kaydedin', description: 'Yazdır veya PDF Yap butonlarıyla dökümanınızı saniyeler içinde PDF formatında indirin.' }
    ],
    faqs: [
      { question: 'Yazdığım belgeler sunucuya kaydediliyor mu?', answer: 'Hayır. EvrakFix üzerinde yazdığınız hiçbir metin veya döküman sunuculara gitmez, tamamen tarayıcınızda çalışır.' },
      { question: 'Tablo veya kod blokları ekleyebilir miyim?', answer: 'Evet. Editörün üst araç çubuğundaki düğmeler yardımıyla tablo, kod blokları ve yatay ayraçları kolayca ekleyebilirsiniz.' },
      { question: 'PDF indirirken mizanpaj bozulur mu?', answer: 'Hayır. A4 standardına göre otomatik sayfa bölünmeleri ve satır sığdırmaları yapılarak kurumsal bir PDF dökümanı üretilir.' }
    ]
  },
  '/pdf-password-recovery': {
    toolName: 'PDF Şifre Kırıcı / Kurtarıcı',
    description: `EvrakFix PDF Şifre Kurtarıcı, şifresini unuttuğunuz kilitli PDF dökümanlarının şifresini yerel sözlük (dictionary) denemeleriyle kırmanızı sağlar. Tüm denemeler tamamen cihazınızda (client-side) yapıldığı için, hassas şifre tahminleriniz veya belgeleriniz internetteki hiçbir uzak sunucuya aktarılmaz.

■ PDF Şifre Kırma Nedir?
Belirlenen veya en yaygın kullanılan şifre listelerinin, PDF şifre çözme motorunda (pdf-lib) yüksek hızda denenerek doğru parolanın bulunması işlemidir.

■ Şifre Nasıl Kurtarılır?
Şifreli PDF dosyasını yükleyin. Olası şifre tahminlerinizi (isim, doğum yılı vb.) virgül veya alt alta girin. 'Şifre Kurtarmayı Başlat' butonuna tıklayarak tarayıcınızda denemeleri başlatın.`,
    steps: [
      { title: 'Şifreli PDF Yükleyin', description: 'Şifresini kırmak veya kurtarmak istediğiniz kilitli PDF belgesini seçin.' },
      { title: 'Tahminlerinizi Yazın', description: 'Hatırladığınız olası şifre parçalarını, isimleri veya yılları tahmin kutusuna girin.' },
      { title: 'Kilidi Açıp İndirin', description: 'Doğru şifre bulunduğunda parolayı görebilir ve şifresiz sürümü indirebilirsiniz.' }
    ],
    faqs: [
      { question: 'PDF dosyam ve şifre tahminlerim güvende mi?', answer: 'Evet. Tüm işlemler 100% cihazınızda (tarayıcı belleği) gerçekleşir. Hiçbir veri internete yüklenmez, dosyalarınız tamamen güvendeler.' },
      { question: 'Brute-force kırma hızı nedir?', answer: 'Kırma hızı tamamen tarayıcınızın ve cihazınızın işlemci performansına bağlıdır. Yerel denemeler milisaniyeler içinde tamamlanır.' },
      { question: 'Her PDF şifresi kırılabilir mi?', answer: 'Yalnızca girdiğiniz tahmin listesinde veya sistemin ortak şifre sözlüğünde yer alan parolalar kırılabilir. Çok karmaşık rastgele şifreler için kendi kelime listenizi eklemelisiniz.' }
    ]
  },
  '/qr-barcode-reader': {
    toolName: 'QR Kod & Barkod Okuyucu',
    description: `EvrakFix QR Kod & Barkod Okuyucu, yüklediğiniz fotoğraflardaki veya cihazınızın kamerasını kullanarak canlı taradığınız kodları çözümler. QR kodlarının yanı sıra perakende ürün barkodlarını da (EAN-13, CODE-128 vb.) tarayıcı düzeyinde sıfır sunucu yüküyle deşifre eder.

■ QR & Barkod Deşifre Etme
QR kod veya ticari barkod desenlerindeki pikselleri ve çizgileri tarayarak, kodun içindeki metin, link, ürün kodu veya kargo bilgilerini okuma işlemidir.

■ Barkod Kamera ile Nasıl Okutulur?
Kamerayı Başlat butonuna tıklayarak kameranıza izin verin. Kod desenini ekrandaki kesikli çizgilerin ortasına odaklayın. Sistem kodu otomatik algılayıp içeriği gösterecektir.`,
    steps: [
      { title: 'Kamera veya Görsel Seçin', description: 'Canlı kamera tarayıcıyı başlatın veya cihazınızdan barkod içeren bir görsel seçin.' },
      { title: 'Kodu Odaklayın', description: 'Kamerayı koda yaklaştırın veya görselin çözümlenmesini bekleyin.' },
      { title: 'İçeriği Alın', description: 'Deşifre edilen metni kopyalayabilir, link ise doğrudan web sitesine gidebilirsiniz.' }
    ],
    faqs: [
      { question: 'Kamera görüntüsü sunucuya iletiliyor mu?', answer: 'Hayır. Kamera kareleri ve yüklediğiniz fotoğraflar tamamen yerel olarak tarayıcınızda (canvas üzerinde) işlenir. İnternete hiçbir görsel veri aktarılmaz.' },
      { question: 'Hangi barkod türleri destekleniyor?', answer: 'Tüm standart QR kodlarının yanı sıra, tarayıcı desteğinize bağlı olarak EAN-13, EAN-8, UPC-A, CODE-128 ve CODE-39 barkod formatları okunabilir.' },
      { question: 'Link içeren QR kodları güvenli mi?', answer: 'Deşifre edilen link size gösterilir, siz tıklayıp onaylamadığınız sürece harici web siteleri otomatik açılmaz.' }
    ]
  },
  '/image-background-remover': {
    toolName: 'Resim Arka Planı Temizleyici',
    description: `EvrakFix Resim Arka Planı Temizleyici, el yazısı imza fotoğraflarınızın veya dijital kaşelerinizin beyaz/gri arka planını silerek şeffaf PNG (transparent) haline verir. Gelişmiş Euclidean RGB piksel taramasıyla çalışır.

■ Arka Plan Silme Nedir?
Resimdeki arka plan renk kanallarını (genellikle beyaz kağıt piksellerini) tespit edip şeffaflık katmanı ekleyerek nesneyi (örneğin imzayı) arka plandan ayırma işlemidir.

■ İmza Arka Planı Nasıl Temizlenir?
İmza fotoğrafını yükleyin. Beyaz rengin silinme hassasiyeti için tolerans sürgüsünü ayarlayın. İmza çizgilerini keskinleştirmek için Kontrastı Artır seçeneğini açık tutarak şeffaf PNG olarak indirin.`,
    steps: [
      { title: 'Görselinizi Yükleyin', description: 'Beyaz arka planını temizlemek istediğiniz imza veya logo resmini sürükleyip bırakın.' },
      { title: 'Hassasiyeti Ayarlayın', description: 'Tolerans çubuğuyla beyaz renklerin silinme hassasiyetini anlık önizleme ile belirleyin.' },
      { title: 'Şeffaf PNG İndirin', description: 'Arka planı silinen ve mürekkebi netleştirilen imzanızı transparent PNG olarak anında kaydedin.' }
    ],
    faqs: [
      { question: 'Resim verilerim güvende mi?', answer: 'Evet. Resim pikselleri 100% tarayıcınızda yerel çalışır, hiçbir uzak sunucuya yüklenmez ve üçüncü kişilerle paylaşılmaz.' },
      { question: 'İmzamın kalitesi bozulur mu?', answer: 'Hayır. Görsel çözünürlüğü korunarak sadece beyaz pikseller şeffaf yapılır. Kontrast güçlendirme mürekkebi daha net gösterir.' },
      { question: 'Hangi formatta indirme yapılır?', answer: 'Şeffaflığı (transparency) desteklemesi için çıktınız her zaman kayıpsız PNG formatında indirilir.' }
    ]
  },
  '/cv-builder': {
    toolName: 'CV / Özgeçmiş Oluşturucu',
    description: `EvrakFix CV / Özgeçmiş Oluşturucu, hiçbir sunucuya kişisel verilerinizi göndermeden tarayıcınızda kurumsal A4 PDF özgeçmişler hazırlamanızı sağlar. Kişisel bilgiler, iş deneyimleri, eğitim geçmişi, projeler ve yeteneklerinizi doldurarak şık bir tasarımla PDF formatında indirebilirsiniz.

■ CV Oluşturma Güvenliği
Girdiğiniz isim, telefon, adres, e-posta ve iş geçmişi gibi hassas kişisel veriler tarayıcı düzeyinde RAM'de işlenir. Sunucu veritabanı bulunmadığı için verileriniz tamamen gizli kalır.

■ Özgeçmiş PDF Nasıl Hazırlanır?
Kategorileri doldurun veya 'Örnek Doldur' seçeneğiyle taslağı hazırlayın. 'CV\'yi PDF Olarak İndir' butonuna basarak A4 formatındaki resmi belgenizi indirin.`,
    steps: [
      { title: 'Kategorileri Doldurun', description: 'Kişisel bilgiler, iş geçmişi, eğitim, yetenekler gibi alanları doldurun.' },
      { title: 'Örnek Veri Kullanın', description: 'Dilerseniz tek tıkla örnek şablonu doldurup üzerinde hızlıca düzenleme yapın.' },
      { title: 'PDF Olarak Kaydedin', description: 'CV\'yi PDF Olarak İndir butonuna tıklayarak resmi A4 belgenizi saniyeler içinde kaydedin.' }
    ],
    faqs: [
      { question: 'Kişisel bilgilerim bir sisteme kaydediliyor mu?', answer: 'Hayır. EvrakFix\'in veritabanı veya üye kayıt sistemi yoktur. Girdiğiniz tüm bilgiler sadece sizin bilgisayarınızda kalır.' },
      { question: 'Boş bırakılan alanlar CV\'de nasıl görünür?', answer: 'Boş bıraktığınız tüm alanlar veya listeler PDF oluşturulurken otomatik olarak gizlenir, belgede boş yer kaplamaz.' },
      { question: 'Daha sonra CV\'mi düzenleyebilir miyim?', answer: 'Veriler sunucuda depolanmadığı için tarayıcı sekmesini kapattığınızda temizlenir. Düzenleme yapana kadar sekmeyi açık tutmalısınız.' }
    ]
  },
  '/severance-calculator': {
    toolName: 'Kıdem ve İhbar Tazminatı Hesaplayıcı',
    description: `EvrakFix Kıdem ve İhbar Tazminatı Hesaplayıcı; çalışanların hak kazandığı tazminat miktarlarını yasal gelir/damga vergisi ve güncel kıdem tavan sınırlamalarına göre hesaplar. Hesaplanan verileri resmi bir rapor şablonunda PDF olarak bilgisayarınıza veya telefonunuza anında kaydetmenizi sağlar.

■ Kıdem Tazminatı Nedir?
Kıdem tazminatı, en az 1 tam yıl çalışan bir işçinin iş sözleşmesinin haklı nedenlerle feshi durumunda çalıştığı her yıl için 30 günlük giydirilmiş brüt maaş üzerinden hak ettiği yasal bir ödemedir.`,
    steps: [
      { title: 'Tarihleri Seçin', description: 'İşçinin işe başlama ve işten ayrılış tarihlerini gün bazlı olarak seçin.' },
      { title: 'Maaşı Tanımlayın', description: 'Brüt temel maaşı ve düzenli ödenen sosyal yardımları (yol, yemek vb.) girin.' },
      { title: 'Raporu İndirin', description: 'Tazminat tavanı ve vergileri hesaplanan haklarınızı PDF raporu olarak bilgisayarınıza indirin.' }
    ],
    faqs: [
      { question: 'Asgari çalışma süresi nedir?', answer: 'Bir çalışanın kıdem tazminatına hak kazanabilmesi için aynı işverene bağlı olarak en az 1 tam yıl (365 gün) çalışmış olması zorunludur.' },
      { question: 'Verilerim güvende mi?', answer: 'Evet. Hesaplamalar ve PDF dökümü oluşturma tamamen cihazınızın tarayıcısında yapılır. Hiçbir finansal veri veya tarih sunuculara yüklenmez.' },
      { question: 'Hangi vergiler kesilir?', answer: 'Kıdem tazminatından sadece damga vergisi (%0.759) kesilir. İhbar tazminatından ise hem gelir vergisi (%15) hem de damga vergisi kesilmektedir.' }
    ]
  },
  '/bulk-renamer': {
    toolName: 'Toplu Dosya Adı Değiştirici',
    description: `EvrakFix Toplu Dosya Adı Değiştirici; klasörlerinizdeki çok sayıda dosyanın ismini belirlediğiniz kurallara göre tek tıkla ve saniyeler içinde topluca değiştirmenizi sağlar. Değiştirilen dosyalar yeni isimleriyle ZIP olarak indirilir.

■ Toplu İsimlendirme Nedir?
Çok sayıda belgenin veya görselin adının kurumsal bir şablona (önek, sonek, sıralı sayaç ekleyerek) uyarlanıp tek seferde güncellenmesi işlemidir.`,
    steps: [
      { title: 'Dosyaları Yükleyin', description: 'İsmi değişecek tüm dosyaları dropzone alanına sürükleyip topluca ekleyin.' },
      { title: 'Kuralları Seçin', description: 'Önek, sonek, harf biçimi (büyük/küçük) ve sıralı sayaç kurallarını ayarlayın.' },
      { title: 'ZIP Olarak Kaydedin', description: 'Canlı önizleme listesini kontrol edip yeni isimlerle dosyaları ZIP paketi olarak indirin.' }
    ],
    faqs: [
      { question: 'Hangi uzantılar destekleniyor?', answer: 'Uzantı kısıtlaması yoktur. PDF, PNG, JPG, Word, Excel, TXT vb. tüm dosyaları yükleyip adlandırabilirsiniz.' },
      { question: 'Sayaç nasıl çalışır?', answer: 'Sayaç seçeneğini işaretleyerek isimlerin arkasına sıralı sayılar (001, 002 vb.) yerleştirebilirsiniz.' },
      { question: 'Dosyalarım çalınabilir mi?', answer: 'Hayır. Dosyalar hiçbir sunucuya yüklenmez. İsim değiştirme ve ZIP sıkıştırma tamamen yerel tarayıcı belleğinde yapılır.' }
    ]
  },
  '/timesheet-calculator': {
    toolName: 'Mesai & Kazanç Hesaplayıcı',
    description: `EvrakFix Mesai Hesaplayıcı (Timesheet); saatlik çalışanlar, serbest çalışanlar veya danışmanlar için günlük/aylık çalışma çizelgesi ve kazanç dökümü oluşturulmasını sağlar. Çizelgenizi PDF veya Excel uyumlu CSV olarak ihraç edebilirsiniz.

■ Timesheet Nedir?
Çalışılan günlerin, giriş-çıkış saatlerinin, mola sürelerinin ve mesai katsayılarının listelendiği resmi zaman çizelgesi dökümüdür.`,
    steps: [
      { title: 'Ücretleri Tanımlayın', description: 'Standart saatlik çalışma ücretinizi ve para biriminizi (₺, $, €, £) ayarlayın.' },
      { title: 'Mesai Girişi Yapın', description: 'Tarih, giriş/çıkış saatleri ve mola dakikalarını girerek listeye mesai ekleyin.' },
      { title: 'Tabloyu Dışa Aktarın', description: 'Toplam kazancınızı inceleyip zaman çizelgenizi Excel (CSV) veya kurumsal PDF olarak indirin.' }
    ],
    faqs: [
      { question: 'Gece vardiyaları doğru hesaplanır mı?', answer: 'Evet. Giriş saatini çıkış saatinden geç yazarsanız (örn. 22:00 - 06:00), sistem ertesi güne geçildiğini otomatik algılayıp vardiyayı doğru hesaplar.' },
      { question: 'Mola süreleri düşülür md?', answer: 'Evet, girdiğiniz mola dakikası toplam çalışılan süreden otomatik olarak düşülerek net çalışma saati hesaplanır.' },
      { question: 'Bilgilerim kaydediliyor mu?', answer: 'Hayır. Verileriniz tarayıcınızdan çıkmaz. Sayfayı kapattığınızda temizlenir.' }
    ]
  },
  '/text-analyzer': {
    toolName: 'Metin Analizörü & Kelime Bulutu',
    description: `EvrakFix Metin Analizörü; yazılı belgelerinizin kelime, karakter, cümle yoğunluğunu analiz eder ve Türkçe okunabilirlik indeksini (Ateşman Formülü) hesaplar. Ayrıca metindeki kelimelerden dinamik bir kelime bulutu grafiği çizer.

■ Türkçe Okunabilirlik Analizi Nedir?
Ateşman formülüyle, metinlerin hece ve cümle uzunluklarını Türkçe dil yapısına göre oranlayarak okunabilirlik zorluk derecesini çıkarma işlemidir.`,
    steps: [
      { title: 'Metninizi Girin', description: 'Analiz edilmesini istediğiniz yazıyı ilgili alana yapıştırın.' },
      { title: 'Metrikleri Görün', description: 'Okunabilirlik puanını, kelime, cümle sayısı ve okuma süresini anlık inceleyin.' },
      { title: 'Grafiği İndirin', description: 'Metindeki yoğun kelimelerden oluşturulan kelime bulutunu PNG görseli olarak indirin.' }
    ],
    faqs: [
      { question: 'Ateşman skoru ne anlama gelir?', answer: 'Skor 100\'e yaklaştıkça metin kolaylaşır (ilkokul), 30\'un altına indikçe ağırlaşır (akademik/hukuki).' },
      { question: 'Bağlaçlar kelime bulutunda görünür mü?', answer: 'Hayır. Türkçe\'deki "ve, veya, ama, ile, bir" gibi etkisiz kelimeler (stopwords) analizde otomatik temizlenir.' },
      { question: 'Güvenli mi?', answer: 'Metinleriniz hiçbir sunucuya iletilmez, tamamen cihazınızda (client-side) analiz edilir.' }
    ]
  },
  '/pdf-cover-stamp': {
    toolName: 'PDF Kapak Ekle & Barkod Bas',
    description: `EvrakFix PDF Kapak Ekle & Barkod Damgalayıcı; PDF belgelerinizin başına resmi kapak sayfaları (Modern, Klasik, Minimalist) yerleştirmenizi veya sayfalarına arşiv referans numarası ve barkod damgası basmanızı sağlar.

■ PDF Kapak ve Damga Nedir?
PDF dökümanının ilk sayfasına tasnif bilgileri içeren bir kapak eklenmesi veya sayfaların üst/alt kısımlarına takip barkodu eklenmesi işlemidir.`,
    steps: [
      { title: 'PDF Yükleyin', description: 'İşlem yapmak istediğiniz PDF dosyasını dropzone alanına sürükleyip yükleyin.' },
      { title: 'Bilgileri Yazın', description: 'Belge başlığı, hazırlayan kurum, arşiv referans numarası ve tarihi girin.' },
      { title: 'Belgeyi Kaydedin', description: 'Kapak şablonu veya damgalama konumunu seçip işlenmiş PDF\'inizi indirin.' }
    ],
    faqs: [
      { question: 'PDF dökümanımın kalitesi bozulur mu?', answer: 'Hayır. Sayfaları görselleştirmeden doğrudan vektör katmanı olarak işlediğimiz için PDF netliği ve metin seçilebilirliği korunur.' },
      { question: 'Damgalanan barkod taranabilir mi?', answer: 'Oluşturulan barkodlar arşivcilik standartlarını simüle eden vektörel çizgilerdir.' },
      { question: 'Yüklenen dosyalar güvende mi?', answer: 'Evet. Dosyalarınız tamamen yerel tarayıcınızda işlenir, sunucuya aktarılmaz.' }
    ]
  }
};

// 3. Helper to parse TSX file content dynamically
function extractSEOFromTSX(filePath, routePath) {
  try {
    if (!filePath) return null;
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Extract ToolSEOInfo block first to prevent matching props from other components (e.g. Dropzone)
    const toolSEOInfoMatch = content.match(/<ToolSEOInfo([\s\S]+?)\/>/);
    if (!toolSEOInfoMatch) return null;

    const block = toolSEOInfoMatch[1];

    // Extract toolName
    const toolNameMatch = block.match(/toolName=(["'])([\s\S]+?)\1/);
    const toolName = toolNameMatch ? toolNameMatch[2] : '';

    // Extract description
    const descMatch = block.match(/description=(["'])([\s\S]+?)\1/);
    const description = descMatch ? descMatch[2].trim() : '';

    // Extract steps
    const stepsSectionMatch = block.match(/steps=\{\[\s*([\s\S]+?)\s*\]\}/);
    const steps = [];
    if (stepsSectionMatch) {
      const stepRegex = /\{\s*title:\s*["']([\s\S]+?)["'],\s*description:\s*["']([\s\S]+?)["']\s*\}/g;
      let match;
      while ((match = stepRegex.exec(stepsSectionMatch[1])) !== null) {
        steps.push({ title: match[1], description: match[2] });
      }
    }

    // Extract faqs
    const faqsSectionMatch = block.match(/faqs=\{\[\s*([\s\S]+?)\s*\](?:\.map|\})/);
    const faqs = [];
    if (faqsSectionMatch) {
      const faqRegex = /\{\s*question:\s*["']([\s\S]+?)["'],\s*(?:description|answer):\s*["']([\s\S]+?)["']\s*\}/g;
      let match;
      while ((match = faqRegex.exec(faqsSectionMatch[1])) !== null) {
        faqs.push({ question: match[1], answer: match[2] });
      }
    }

    if (toolName && description) {
      console.log(`Successfully parsed TSX for dynamic SEO extraction: ${routePath}`);
      return { toolName, description, steps, faqs };
    }
  } catch (err) {
    console.warn(`Dynamic parsing failed for ${filePath}. Falling back to default data:`, err.message);
  }
  return null;
}

// 4. Run the static generator
function runPrerender() {
  const distDir = path.join(rootDir, 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Prerender Error: dist/index.html not found! Please run "npm run build" first.');
    process.exit(1);
  }

  const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  console.log('\n--- STARTING STATIK SEO PRERENDER INJECTION (V2.9) ---');

  for (const config of routeConfigs) {
    let finalHtml = htmlTemplate;

    // A. Parse dynamic TSX data OR get fallback data
    let dynamicData = extractSEOFromTSX(config.sourceFile, config.path);
    if (!dynamicData && fallbackData[config.path]) {
      dynamicData = fallbackData[config.path];
      console.log(`Using resilient fallback SEO data for: ${config.path}`);
    }

    // B. Replace meta tags in head
    // 1. Browser Title
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/, `<title>${config.title}</title>`);
    
    // 2. Primary Meta Tags
    finalHtml = finalHtml.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${config.title}" />`);
    finalHtml = finalHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${config.description}" />`);

    // 3. Open Graph (Facebook)
    finalHtml = finalHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${config.title}" />`);
    finalHtml = finalHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${config.description}" />`);
    finalHtml = finalHtml.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="https://www.evrakfix.com${config.path === '/' ? '' : config.path}" />`);

    // 4. Twitter
    finalHtml = finalHtml.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${config.title}" />`);
    finalHtml = finalHtml.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${config.description}" />`);
    finalHtml = finalHtml.replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="https://www.evrakfix.com${config.path === '/' ? '' : config.path}" />`);

    // 5. Inject Canonical URL
    const canonicalTag = `<link rel="canonical" href="https://www.evrakfix.com${config.path === '/' ? '' : config.path}" />`;
    finalHtml = finalHtml.replace('</head>', `  ${canonicalTag}\n</head>`);

    // C. Generate structured JSON-LD schemas
    const schemas = [];

    // 1. BreadcrumbList Schema (all subpages)
    if (config.path !== '/') {
      const pageName = config.title.split(' | ')[0];
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://www.evrakfix.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": pageName,
            "item": `https://www.evrakfix.com${config.path}`
          }
        ]
      });
    }

    // 2. WebApplication Schema (global homepage)
    if (config.path === '/') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "EvrakFix",
        "url": "https://www.evrakfix.com/",
        "description": config.description,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "TRY"
        }
      });
    }

    // 3. FAQPage Schema (for tool pages if faqs parsed)
    if (dynamicData && dynamicData.faqs && dynamicData.faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": dynamicData.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    // Inject schema scripts into head
    let schemaScriptTags = '';
    schemas.forEach(schema => {
      schemaScriptTags += `  <script type="application/ld+json" data-schema="jsonld">${JSON.stringify(schema)}</script>\n`;
    });
    finalHtml = finalHtml.replace('</head>', `${schemaScriptTags}</head>`);

    // D. Generate zengin semantik HTML shell ve `#root` içine gömme
    let shellHTML = '';

    if (config.path === '/') {
      // HomePage static shell
      shellHTML = `
        <div class="seo-shell" style="max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
          <h1 style="font-size: 2.75rem; font-weight: 900; color: #0f172a; margin-bottom: 1.25rem; line-height: 1.2;">EvrakFix — PDF ve Evrak İşlemleri Cihazınızda Güvenle</h1>
          <p style="font-size: 1.15rem; line-height: 1.8; color: #475569; margin-bottom: 2.5rem; font-weight: 300;">
            EvrakFix ile dosyalarınızı sunucuya göndermeden PDF birleştirme, bölme, imza ekleme, filigran ekleme, görsel sıkıştırma ve dilekçe yazma işlemlerini tarayıcınızda tamamen güvenli ve hızlı şekilde yapın.
          </p>
          
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 3rem; margin-bottom: 1.25rem;">Neden Güvenli ve Yerel?</h2>
          <p style="font-size: 1rem; line-height: 1.7; color: #64748b;">
            Geleneksel araçların aksine, EvrakFix dosyalarınızı uzak bir sunucuya yüklemez. Tüm döküman işleme süreci doğrudan tarayıcınızda ve cihazınızın kendi işlemci gücüyle yerel olarak yapılır. Dosyalarınız asla internete çıkmaz, gizliliğiniz tamamen güvence altındadır.
          </p>
        </div>
      `;
    } else if (config.path === '/tools') {
      // ToolsPage static shell
      shellHTML = `
        <div class="seo-shell" style="max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
          <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">Tüm PDF ve Evrak Araçları</h1>
          <p style="font-size: 1.1rem; line-height: 1.7; color: #475569; margin-bottom: 2.5rem;">
            PDF birleştirici, PDF bölücü, görselden PDF yapıcı, PDF imzalayıcı, filigran ekleyici, sayfa düzenleyici ve görsel sıkıştırıcı gibi yerel çalışan tüm araçlarımıza tek bir yerden ulaşın.
          </p>
        </div>
      `;
    } else if (config.path === '/about') {
      // AboutPage static shell
      shellHTML = `
        <div class="seo-shell" style="max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
          <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">Hakkımızda & Gizlilik Politikası</h1>
          <p style="font-size: 1.1rem; line-height: 1.7; color: #475569; margin-bottom: 2rem;">
            EvrakFix'in çalışma felsefesini, dosyalarınızın sunucuya yüklenmeden yerel tarayıcınızda nasıl güvenle işlendiğini ve kullanıcı gizliliği taahhütlerimizi öğrenin.
          </p>
        </div>
      `;
    } else if (dynamicData) {
      // ToolPages dynamic rich shell
      const stepsHTML = dynamicData.steps
        ? dynamicData.steps.map((step, idx) => `
            <li style="margin-bottom: 1rem;">
              <strong style="color: #0f172a;">${idx + 1}. ${step.title}:</strong> 
              <span style="color: #475569;">${step.description}</span>
            </li>
          `).join('')
        : '';

      const faqsHTML = dynamicData.faqs
        ? dynamicData.faqs.map(faq => `
            <div style="margin-bottom: 1.5rem; padding: 1.25rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #f1f5f9;">
              <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.5rem;">❓ ${faq.question}</h4>
              <p style="font-size: 0.9rem; line-height: 1.6; color: #475569; margin: 0;">${faq.answer}</p>
            </div>
          `).join('')
        : '';

      shellHTML = `
        <div class="seo-shell" style="max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
          <h1 style="font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">${dynamicData.toolName}</h1>
          <p style="font-size: 1.1rem; line-height: 1.7; color: #475569; margin-bottom: 2.5rem; font-weight: 300;">${dynamicData.description}</p>
          
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-top: 2.5rem; margin-bottom: 1.25rem;">${dynamicData.toolName} Nasıl Kullanılır?</h2>
          <ol style="margin-left: 1.5rem; padding-left: 0; line-height: 1.8; font-size: 0.95rem;">
            ${stepsHTML}
          </ol>
          
          <h2 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-top: 3rem; margin-bottom: 1.25rem;">Sıkça Sorulan Sorular</h2>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${faqsHTML}
          </div>
        </div>
      `;
    }

    if (shellHTML) {
      finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${shellHTML.trim()}</div>`);
    }

    // E. Save pre-rendered HTML to dist/
    if (config.path === '/') {
      // Save root homepage directly to dist/index.html (overwriting blank shell)
      fs.writeFileSync(templatePath, finalHtml, 'utf8');
      console.log(`Saved pre-rendered home page index.html`);
    } else {
      // Save subpage to dist/[path]/index.html
      const subpageDir = path.join(distDir, config.path.substring(1));
      if (!fs.existsSync(subpageDir)) {
        fs.mkdirSync(subpageDir, { recursive: true });
      }
      fs.writeFileSync(path.join(subpageDir, 'index.html'), finalHtml, 'utf8');
      console.log(`Saved pre-rendered subpage to: ${subpageDir}/index.html`);
    }
  }

  console.log(`--- STATIK SEO PRERENDER COMPLETED SUCCESSFULLY (${routeConfigs.length}/${routeConfigs.length}) ---\n`);
}

runPrerender();

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

  console.log('\n--- STARTING STATIK SEO PRERENDER INJECTION (V2.2) ---');

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

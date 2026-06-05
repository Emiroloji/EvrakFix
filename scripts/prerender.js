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
    title: 'EvrakFix | %100 Güvenli Ücretsiz PDF ve Evrak Araçları',
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
    title: 'PDF Birleştirici | Ücretsiz & Güvenli Çoklu PDF Birleştirme - EvrakFix',
    description: 'Birden fazla PDF dökümanını dilediğiniz sıraya dizin ve sunuculara yüklemeden, tarayıcınızda %100 güvenli ve hızlı şekilde tek bir PDF olarak birleştirin.',
    sourceFile: 'src/features/pdf-merge/PdfMergePage.tsx'
  },
  {
    path: '/pdf-split',
    title: 'PDF Bölücü | PDF Sayfalarını Ayırma ve Ayıklama Aracı - EvrakFix',
    description: 'Büyük PDF dosyalarınızı belirlediğiniz sayfa aralıklarına göre (tek-çift sayfalar, özel aralıklar) tarayıcınızın hızıyla anında bölün ve indirin.',
    sourceFile: 'src/features/pdf-split/PdfSplitPage.tsx'
  },
  {
    path: '/image-to-pdf',
    title: 'Görseli PDF\'e Çevir | JPG, PNG ve WebP\'den PDF Yap - EvrakFix',
    description: 'JPG, JPEG, PNG veya WebP formatındaki resimlerinizi sürükleyip bırakın, sıralayın, A4 veya orijinal boyutta yüksek kaliteli PDF belgelerine dönüştürün.',
    sourceFile: 'src/features/image-to-pdf/ImageToPdfPage.tsx'
  },
  {
    path: '/pdf-sign',
    title: 'PDF İmzalama | PDF Belgelerine Islak İmza Ekleme - EvrakFix',
    description: 'PDF belgelerininizin üzerine fare veya dokunmatik ekranla ıslak imzanızı çizin, imza konumunu ve boyutunu seçip dökümana güvenle yerleştirin.',
    sourceFile: 'src/features/pdf-sign/PdfSignPage.tsx'
  },
  {
    path: '/pdf-watermark',
    title: 'PDF Filigran Ekleme | PDF\'e Tarih, Metin ve Logo Ekle - EvrakFix',
    description: 'PDF belgelerinizin tüm sayfalarına 45 derece eğik çapraz filigran metinleri basarak veya seçtiğiniz konuma tarih/onay metni yerleştirerek telifinizi koruyun.',
    sourceFile: 'src/features/pdf-tools/PdfWatermarkPage.tsx'
  },
  {
    path: '/pdf-organizer',
    title: 'PDF Sayfa Düzenleyici | Sayfa Döndürme, Silme ve Sıralama - EvrakFix',
    description: 'PDF dökümanlarınızın sayfalarını visual grid üzerinde görün, sayfaları silin, 90/180 derece döndürün, sıralarını yön butonlarıyla kolayca düzenleyin.',
    sourceFile: 'src/features/pdf-organizer/PdfOrganizerPage.tsx'
  },
  {
    path: '/pdf-to-image',
    title: "PDF'i Görsele Çevir | PDF Sayfalarını PNG ve JPG Yapma - EvrakFix",
    description: 'PDF dökümanınızın sayfalarını yüksek çözünürlüklü PNG veya JPG görsellerine dönüştürün, tek tek veya toplu olarak ZIP arşivi şeklinde güvenle indirin.',
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
  }
];

// 2. Comprehensive static fallbacks dictionary (guarantees build is 100% bulletproof)
const fallbackData = {
  '/pdf-merge': {
    toolName: 'PDF Birleştirme',
    description: 'PDF Birleştirici aracımız, birden fazla PDF dökümanını tek bir belge haline getirmenizi kolaylaştırır. Farklı PDF dosyalarını sıraya dizerek tek tıkla birleştirebilirsiniz. Tamamen yerel çalışan bu araç sayesinde dosyalarınız internet sunucusuna gönderilmez, gizliliğiniz %100 korunur.',
    steps: [
      { title: 'Dosyalarınızı Seçin', description: 'PDF Birleştirme aracımıza sürükleyip bırakarak veya cihazınızdan seçerek PDF dosyalarını ekleyin.' },
      { title: 'Sıralamayı Düzenleyin', description: 'Taşı yön butonlarını kullanarak dökümanların birleşme sırasını dilediğiniz gibi süratle düzenleyin.' },
      { title: 'Birleştirip İndirin', description: 'PDF\'leri Birleştir butonuna tıklayın, dökümanlarınız saniyeler içinde tarayıcınızda birleştirilip indirmeye hazır hale gelsin.' }
    ],
    faqs: [
      { question: 'Bir kerede en fazla kaç PDF birleştirebilirim?', answer: 'Herhangi bir dosya sayısı sınırı yoktur. Tarayıcınızın işlemci ve bellek sınırları dahilinde dilediğiniz sayıda PDF dökümanını birleştirebilirsiniz.' },
      { question: 'Birleştirilen PDF dosyalarında çözünürlük bozulması olur mu?', answer: 'Hayır. Sayfalar orijinal piksel kalitesiyle, yazı tipleri, vektör çizimleri ve tüm döküman detaylarıyla birebir kopyalanarak birleştirilir.' },
      { question: 'Yüklediğim PDF dosyaları sisteminize kaydedilir mi?', answer: 'Kesinlikle hayır. EvrakFix sunucusuz çalışan bir sistemdir. Dosyalarınız tamamen bilgisayarınızın veya telefonunuzun yerel belleğinde işlenir ve asla internete aktarılmaz.' }
    ]
  },
  '/pdf-split': {
    toolName: 'PDF Bölme ve Sayfa Ayıklama',
    description: 'PDF Bölme aracımız, geniş sayfalı PDF belgelerinden ihtiyacınız olan sayfaları ayıklayarak yeni bir PDF dosyası üretmenizi sağlar. İster belirli bir sayfa aralığı, ister tekil sayfalar, isterseniz de tek/çift sayfa numaralarını hedefleyin; sayfaları dökümandan kusursuzca koparır.',
    steps: [
      { title: 'PDF Belgenizi Yükleyin', description: 'Bölmek istediğiniz PDF dökümanını sürükleyip bırakarak veya cihazınızdan seçerek sisteme güvenle yükleyin.' },
      { title: 'Sayfa Seçimini Yapın', description: 'Dilediğiniz sayfa aralığını yazın veya Tek Sayfalar, Çift Sayfalar gibi hızlı preset tuşlarını kullanarak sayfaları belirleyin.' },
      { title: 'Bölün ve İndirin', description: 'PDF\'i Böl butonuna tıklayarak seçtiğiniz sayfalardan oluşan yeni PDF belgesini tarayıcı hızında anında indirin.' }
    ],
    faqs: [
      { question: 'Belirli sayfa aralıklarını nasıl girebilirim?', answer: 'Sayfa aralığı giriş alanına aralarına virgül koyarak yazabilirsiniz. Örneğin "3-8, 12, 15-20" yazarak 3 ile 8 arasındaki sayfaları, 12. sayfayı ve 15 ile 20 arasındaki sayfaları tek bir PDF halinde ayıklayabilirsiniz.' },
      { question: 'Bölünen PDF sayfalarının kalitesinde veya çözünürlüğünde azalma olur mu?', answer: 'Kesinlikle hayır. Bu işlem, sayfaların yeniden çizilmesiyle değil, PDF döküman yapısının kayıpsız kopyalanmasıyla yapılır. Vektörel grafikler, yazılar ve resimler tam kalitesini korur.' }
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
EvrakFix %100 yerel (client-side) çalışmaktadır. Görselleriniz hiçbir uzak sunucuya yüklenmez ve internete gönderilmez. İşlemler doğrudan tarayıcınızın belleğinde (RAM) yapılır, bu yüzden verileriniz tamamen sizin cihazınızda kalır.`,
    steps: [
      { title: 'Görsellerinizi Yükleyin', description: 'Sıkıştırmak, boyutlandırmak veya dönüştürmek istediğiniz JPG, PNG, WebP resimlerini sürükleyip bırakın.' },
      { title: 'Kalite, Boyut ve Format Seçin', description: 'Sıkıştırma seviyesini (Düşük/Orta/Yüksek), yeniden boyutlandırma piksel genişliğini ve dönüştürülecek çıktı formatını seçin.' },
      { title: 'Sıkıştırıp Toplu İndirin', description: 'Tümünü Sıkıştır butonuna tıklayarak işlemi başlatın. Tamamlanan resimleri tek tek veya ZIP arşivi halinde topluca indirin.' }
    ],
    faqs: [
      { question: 'Görsellerim sunucuya yükleniyor mu?', answer: 'Hayır. EvrakFix %100 yerel (client-side) çalışmaktadır. Görselleriniz hiçbir sunucuya yüklenmez, depolanmaz ve paylaşılmaz. Tüm işlemler doğrudan tarayıcınızda ve cihazınızda gerçekleşir.' },
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
EvrakFix %100 yerel (client-side) çalıştığı için son derece güvenlidir. Dilekçeye yazdığınız T.C. Kimlik No, telefon, adres veya kişisel detaylar hiçbir internet sunucusuna gönderilmez, veritabanımız yoktur. İşlemler tarayıcınızın kendi belleğinde gerçekleşir.

■ Dilekçe Hazırlarken Nelere Dikkat Edilmeli?
Dilekçe yazarken muhatap kurumun adının doğru belirtilmesi, konunun net ifade edilmesi, yasal sürelerin aşılmaması (örn: iade için 14 gün) ve iletişim bilgilerinin eksiksiz girilmesi gerekir. Ayrıca yazım kurallarına uygun, sade ve saygılı bir dil kullanılmalıdır.

■ Hazırlanan Dilekçe Resmi Belge Yerine Geçer mi?
EvrakFix ile hazırladığınız dilekçeler genel başvuru taslakları niteliğindedir. Bu dökümanlar yazdırılıp imzalandıktan veya e-imzalandıktan sonra ilgili kurumlara teslim edilebilir, ancak resmi veya hukuki geçerlilik kararı tamamen muhatap kurumun veya ilgili mevzuatın yetkisindedir.

■ EvrakFix ile Dilekçe Oluşturmanın Avantajları
EvrakFix ile üyelik veya ücret ödemeden hızlıca dilekçe oluşturabilirsiniz. Otomatik satır taşıma ve marj yönetimi sayesinde yazım düzeniniz asla bozulmaz. Gizliliğiniz %100 korunur ve hazırladığınız evraklar anında cihazınıza indirilir.`,
    steps: [
      { title: 'Evrak Şablonunuzu Seçin', description: 'Doldurmak istediğiniz döküman tipini (dilekçe, tutanak, taahhüt vb.) şablon kartlarından seçin.' },
      { title: 'Form Bilgilerini Doldurun', description: 'Açılan interaktif formdaki zorunlu alanları doldurun. Sağ sütundaki A4 kağıt simülasyonunda canlı önizlemeyi (Live Preview) anlık izleyin.' },
      { title: 'Derleyin ve İndirin', description: 'Dökümanı Üret butonuna tıklayarak A4 standartlarında PDF belgenizi tarayıcınızda saniyeler içinde derleyip indirin.' }
    ],
    faqs: [
      { question: 'EvrakFix ile oluşturulan dilekçeler resmi belge midir?', answer: 'EvrakFix ile oluşturulan dilekçeler resmi başvurularda kullanılabilecek genel dilekçe taslaklarıdır. Ancak her kurumun belge formatı, ek evrak ve başvuru şartları farklı olabilir. Bu nedenle teslim etmeden önce ilgili kurumun güncel şartlarını kontrol etmeniz önerilir.' },
      { question: 'Dilekçe bilgilerim sunucuya yükleniyor mu?', answer: 'Kesinlikle hayır. EvrakFix %100 yerel (client-side) çalışmaktadır. Formda yazdığınız T.C. Kimlik No, adres ve iletişim bilgileri gibi hassas veriler hiçbir sunucuya yüklenmez, doğrudan tarayıcınızın RAM belleğinde işlenir.' },
      { question: 'Dilekçeyi PDF olarak indirebilir miyim?', answer: 'Evet, formu doldurduktan sonra \'Dökümanı Üret\' butonuna tıklayarak A4 sayfa boyutunda ve yazdırılmaya hazır, yüksek kaliteli PDF dökümanınızı tek tıkla cihazınıza indirebilirsiniz.' },
      { question: 'İstifa dilekçesi ve iade talep dilekçesi oluşturabilir miyim?', answer: 'Evet. Sistemimizde hazır bulunan İstifa Dilekçesi, İade Talebi, İzin Dilekçesi, Şikayet Dilekçesi gibi hazır şablonları kullanarak kendinize uygun resmi yazıları kolayca oluşturabilirsiniz.' },
      { question: 'Dilekçe şablonlarını düzenleyebilir miyim?', answer: 'Evet. Form alanlarındaki bilgileri istediğiniz zaman değiştirebilirsiniz. Sağ taraftaki canlı önizleme alanında yaptığınız tüm değişiklikler anında güncellenmektedir.' }
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
    const toolNameMatch = block.match(/toolName=["']([^"']+)["']/);
    const toolName = toolNameMatch ? toolNameMatch[1] : '';

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
            EvrakFix ile dosyalarınızı sunucuya göndermeden PDF birleştirme, bölme, imza ekleme, filigran ekleme, görsel sıkıştırma ve dilekçe yazma işlemlerini tarayıcınızda %100 güvenli ve hızlı şekilde yapın.
          </p>
          
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 3rem; margin-bottom: 1.25rem;">Neden %100 Güvenli ve Yerel?</h2>
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

  console.log('--- STATIK SEO PRERENDER COMPLETED SUCCESSFULLY (12/12) ---\n');
}

runPrerender();

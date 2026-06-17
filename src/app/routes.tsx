import React, { lazy } from 'react';
import { HomePage } from '../pages/HomePage';
import { ToolsPage } from '../pages/ToolsPage';
import { AboutPage } from '../pages/AboutPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Lazy-loaded feature pages for performance optimization (V2.0)
const PdfMergePage = lazy(() => import('../features/pdf-merge/PdfMergePage').then(m => ({ default: m.PdfMergePage })));
const PdfSplitPage = lazy(() => import('../features/pdf-split/PdfSplitPage').then(m => ({ default: m.PdfSplitPage })));
const ImageToPdfPage = lazy(() => import('../features/image-to-pdf/ImageToPdfPage').then(m => ({ default: m.ImageToPdfPage })));
const PdfSignPage = lazy(() => import('../features/pdf-sign/PdfSignPage').then(m => ({ default: m.PdfSignPage })));
const PdfWatermarkPage = lazy(() => import('../features/pdf-tools/PdfWatermarkPage').then(m => ({ default: m.PdfWatermarkPage })));
const DocumentGeneratorPage = lazy(() => import('../features/document-generator/DocumentGeneratorPage').then(m => ({ default: m.DocumentGeneratorPage })));
const PdfOrganizerPage = lazy(() => import('../features/pdf-organizer/PdfOrganizerPage').then(m => ({ default: m.PdfOrganizerPage })));
const PdfToImagePage = lazy(() => import('../features/pdf-to-image/PdfToImagePage').then(m => ({ default: m.PdfToImagePage })));
const ImageCompressorPage = lazy(() => import('../features/image-compressor/ImageCompressorPage').then(m => ({ default: m.ImageCompressorPage })));
const PdfMetadataCleanerPage = lazy(() => import('../features/pdf-metadata-cleaner/PdfMetadataCleanerPage').then(m => ({ default: m.PdfMetadataCleanerPage })));
const PdfPageNumbersPage = lazy(() => import('../features/pdf-page-numbers/PdfPageNumbersPage').then(m => ({ default: m.PdfPageNumbersPage })));
const PdfProtectUnlockPage = lazy(() => import('../features/pdf-protect-unlock/PdfProtectUnlockPage').then(m => ({ default: m.PdfProtectUnlockPage })));
const PdfCompressorPage = lazy(() => import('../features/pdf-compressor/PdfCompressorPage').then(m => ({ default: m.PdfCompressorPage })));
const QrBarcodeGeneratorPage = lazy(() => import('../features/qr-barcode-generator/QrBarcodeGeneratorPage').then(m => ({ default: m.QrBarcodeGeneratorPage })));
const XmlInvoiceViewerPage = lazy(() => import('../features/xml-invoice-viewer/XmlInvoiceViewerPage').then(m => ({ default: m.XmlInvoiceViewerPage })));
const TextDiffCheckerPage = lazy(() => import('../features/text-diff-checker/TextDiffCheckerPage').then(m => ({ default: m.TextDiffCheckerPage })));
const PdfStampImagePage = lazy(() => import('../features/pdf-stamp-image/PdfStampImagePage').then(m => ({ default: m.PdfStampImagePage })));
const ImageOcrPage = lazy(() => import('../features/image-ocr/ImageOcrPage').then(m => ({ default: m.ImageOcrPage })));
const DocumentScannerPage = lazy(() => import('../features/document-scanner/DocumentScannerPage').then(m => ({ default: m.DocumentScannerPage })));
const PdfToTextPage = lazy(() => import('../features/pdf-to-text/PdfToTextPage').then(m => ({ default: m.PdfToTextPage })));
const CsvJsonXmlConverterPage = lazy(() => import('../features/csv-json-xml-converter/CsvJsonXmlConverterPage').then(m => ({ default: m.CsvJsonXmlConverterPage })));
const PdfToGrayscalePage = lazy(() => import('../features/pdf-to-grayscale/PdfToGrayscalePage').then(m => ({ default: m.PdfToGrayscalePage })));
const PdfResizerPage = lazy(() => import('../features/pdf-resizer/PdfResizerPage').then(m => ({ default: m.PdfResizerPage })));
const VatInvoiceCalculatorPage = lazy(() => import('../features/vat-invoice-calculator/VatInvoiceCalculatorPage').then(m => ({ default: m.VatInvoiceCalculatorPage })));
const InterestCalculatorPage = lazy(() => import('../features/interest-calculator/InterestCalculatorPage').then(m => ({ default: m.InterestCalculatorPage })));
const PdfBookletSplitterPage = lazy(() => import('../features/pdf-booklet-splitter/PdfBookletSplitterPage').then(m => ({ default: m.PdfBookletSplitterPage })));
const MarkdownEditorPage = lazy(() => import('../features/markdown-editor/MarkdownEditorPage').then(m => ({ default: m.MarkdownEditorPage })));
const PdfPasswordRecoveryPage = lazy(() => import('../features/pdf-password-recovery/PdfPasswordRecoveryPage').then(m => ({ default: m.PdfPasswordRecoveryPage })));
const QrBarcodeReaderPage = lazy(() => import('../features/qr-barcode-reader/QrBarcodeReaderPage').then(m => ({ default: m.QrBarcodeReaderPage })));
const ImageBackgroundRemoverPage = lazy(() => import('../features/image-background-remover/ImageBackgroundRemoverPage').then(m => ({ default: m.ImageBackgroundRemoverPage })));
const CvBuilderPage = lazy(() => import('../features/cv-builder/CvBuilderPage').then(m => ({ default: m.CvBuilderPage })));

export interface Route {
  path: string;
  component: React.ReactNode;
  title: string;
  description: string;
}

export const routes: Route[] = [
  {
    path: '/',
    component: <HomePage />,
    title: 'EvrakFix | Güvenli ve Ücretsiz PDF ve Evrak Araçları',
    description: 'Dosyalarınızı sunucuya göndermeden PDF birleştirme, PDF bölme, imza ekleme, filigran ekleme, görsel sıkıştırma ve dilekçe yazma işlemlerini tarayıcınızda güvenle yapın.'
  },
  {
    path: '/tools',
    component: <ToolsPage />,
    title: 'EvrakFix Araçları | Ücretsiz PDF ve Görsel Editörleri',
    description: 'PDF birleştir, PDF böl, görseli PDF\'e çevir, PDF imza ekleme, filigran ekleme, sayfa düzenleyici ve görsel sıkıştırma araçlarımıza tek yerden ulaşın.'
  },
  {
    path: '/about',
    component: <AboutPage />,
    title: 'Hakkımızda & Gizlilik Politikası | EvrakFix',
    description: 'EvrakFix\'in çalışma felsefesini, dosyalarınızın sunucuya yüklenmeden yerel tarayıcınızda nasıl güvenle işlendiğini ve kullanıcı gizliliği taahhütlerimizi öğrenin.'
  },
  {
    path: '/pdf-merge',
    component: <PdfMergePage />,
    title: 'PDF Birleştir | Ücretsiz ve Güvenli PDF Birleştirme - EvrakFix',
    description: 'Birden fazla PDF dosyasını cihazınızda güvenle tek PDF haline getirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-split',
    component: <PdfSplitPage />,
    title: 'PDF Böl | Ücretsiz ve Güvenli PDF Sayfa Ayırma - EvrakFix',
    description: 'PDF dosyanızdan istediğiniz sayfaları veya sayfa aralıklarını cihazınızda güvenle ayırın. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/image-to-pdf',
    component: <ImageToPdfPage />,
    title: 'Görseli PDF’e Çevir | JPG, PNG ve WebP PDF Yapma - EvrakFix',
    description: 'JPG, PNG ve WebP görsellerinizi cihazınızda güvenle tek PDF dosyasına dönüştürün. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-sign',
    component: <PdfSignPage />,
    title: 'PDF’e İmza Ekle | Ücretsiz ve Güvenli PDF İmzalama - EvrakFix',
    description: 'PDF dosyanıza tarayıcınızda imza çizin, istediğiniz sayfaya ekleyin ve imzalı PDF olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-watermark',
    component: <PdfWatermarkPage />,
    title: 'PDF Filigran Ekle | Ücretsiz ve Güvenli PDF Watermark - EvrakFix',
    description: 'PDF dosyanıza cihazınızda güvenle filigran, tarih veya metin ekleyin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/document-generator',
    component: <DocumentGeneratorPage />,
    title: 'Dilekçe Oluştur | Ücretsiz PDF Dilekçe Hazırlama - EvrakFix',
    description: 'İstifa, iade talebi, teslim tutanağı ve genel dilekçe şablonlarını doldurarak cihazınızda güvenle PDF dilekçe oluşturun. Üyelik gerekmez, veriler sunucuya gönderilmez.'
  },
  {
    path: '/pdf-organizer',
    component: <PdfOrganizerPage />,
    title: 'PDF Sayfa Düzenleyici | PDF Sayfa Silme, Döndürme ve Sıralama - EvrakFix',
    description: 'PDF sayfalarını cihazınızda güvenle silin, döndürün, sıralayın ve düzenlenmiş PDF olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-to-image',
    component: <PdfToImagePage />,
    title: 'PDF’i Görsele Çevir | PDF JPG ve PNG Dönüştürme - EvrakFix',
    description: 'PDF sayfalarını cihazınızda güvenle JPG veya PNG görsel olarak indirin. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/image-compressor',
    component: <ImageCompressorPage />,
    title: 'Görsel Sıkıştırıcı | JPG, PNG ve WebP Boyut Küçültme - EvrakFix',
    description: 'JPG, PNG ve WebP görsellerinizi cihazınızda güvenle sıkıştırın, yeniden boyutlandırın ve farklı formatlara dönüştürün. Dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-metadata-cleaner',
    component: <PdfMetadataCleanerPage />,
    title: 'PDF Metadata Temizleyici | PDF Belge Bilgilerini Sil - EvrakFix',
    description: 'PDF dosyanızdaki başlık, yazar, oluşturucu ve tarih gibi metadata bilgilerini cihazınızda güvenle temizleyin. Dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-page-numbers',
    component: <PdfPageNumbersPage />,
    title: 'PDF Sayfa Numarası Ekle | Ücretsiz PDF Numaralandırma - EvrakFix',
    description: 'PDF dosyanıza cihazınızda güvenle sayfa numarası ekleyin. Konum ve format seçin, numaralandırılmış PDF’i hemen indirin.'
  },
  {
    path: '/pdf-protect-unlock',
    component: <PdfProtectUnlockPage />,
    title: 'PDF Şifrele & Şifre Çöz | Ücretsiz PDF Şifre Koyma ve Kaldırma - EvrakFix',
    description: 'PDF dosyalarınıza cihazınızda güvenle şifre koyun veya mevcut PDF şifrelerini kaldırın. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/pdf-compressor',
    component: <PdfCompressorPage />,
    title: 'PDF Sıkıştırıcı | Ücretsiz PDF Boyut Küçültme - EvrakFix',
    description: 'PDF dosyalarınızın boyutunu kalitesini bozmadan cihazınızda güvenle küçültün. Üyelik gerekmez, dosyalarınız sunucuya yüklenmez.'
  },
  {
    path: '/qr-barcode-generator',
    component: <QrBarcodeGeneratorPage />,
    title: 'QR Kod & Barkod Oluşturucu | Ücretsiz QR ve Barkod Yapıcı - EvrakFix',
    description: 'Ücretsiz ve güvenli şekilde kendi QR kodlarınızı ve barkodlarınızı cihazınızda oluşturun, PNG veya SVG olarak indirin.'
  },
  {
    path: '/xml-invoice-viewer',
    component: <XmlInvoiceViewerPage />,
    title: 'XML E-Fatura Görselleştirici | Ücretsiz e-Fatura XML Gösterici - EvrakFix',
    description: 'Gelir İdaresi Başkanlığı (GİB) standartlarındaki e-fatura ve e-arşiv XML dosyalarını cihazınızda güvenle görüntüleyin ve yazdırın.'
  },
  {
    path: '/text-diff-checker',
    component: <TextDiffCheckerPage />,
    title: 'Belge Metin Karşılaştırıcı | İki Metin Arasındaki Farkları Bul - EvrakFix',
    description: 'İki sözleşme veya metin belgesi arasındaki farkları kelime ve satır bazlı olarak cihazınızda güvenle karşılaştırın.'
  },
  {
    path: '/pdf-stamp-image',
    component: <PdfStampImagePage />,
    title: 'PDF’e Kaşe & Resim Ekle | PDF İmzalama ve Kaşeleme - EvrakFix',
    description: 'PDF belgelerinize cihazınızda güvenle resmi hazır kaşe basın veya kendi imza resminizi (PNG/JPG) yerleştirin.'
  },
  {
    path: '/image-ocr',
    component: <ImageOcrPage />,
    title: 'Resimden Metin Okuma (OCR) | Görseldeki Yazıyı Kopyala - EvrakFix',
    description: 'Görsellerinizdeki veya taranmış resmi evrak fotoğraflarınızdaki metinleri yapay zeka ile cihazınızda okuyun ve kopyalayın.'
  },
  {
    path: '/document-scanner',
    component: <DocumentScannerPage />,
    title: 'Belge Tarayıcı | Evrak Fotoğrafını Netleştir ve PDF Yap - EvrakFix',
    description: 'Telefon kamerasıyla çektiğiniz evrak fotoğraflarını cihazınızda tarayıp netleştirin, gölgeleri temizleyin ve PDF olarak indirin.'
  },
  {
    path: '/pdf-to-text',
    component: <PdfToTextPage />,
    title: 'PDF’ten Metin Çıkarıcı | PDF Yazılarını Kopyala ve İndir - EvrakFix',
    description: 'Seçilebilir PDF dökümanlarınızdaki tüm yazıları cihazınızda hızlıca ayıklayıp TXT veya Markdown olarak indirin.'
  },
  {
    path: '/csv-json-xml-converter',
    component: <CsvJsonXmlConverterPage />,
    title: 'CSV JSON XML Dönüştürücü | Ücretsiz Dosya Veri Çevirici - EvrakFix',
    description: 'CSV, JSON ve XML dosyalarınızı veya metinlerinizi cihazınızda güvenle birbirine dönüştürün, anında indirin.'
  },
  {
    path: '/pdf-to-grayscale',
    component: <PdfToGrayscalePage />,
    title: 'PDF Yazıcı Dostu Yapıcı | PDF Siyah Beyaz Yapma - EvrakFix',
    description: 'PDF dosyalarınızın renklerini gri tonlamaya çevirin ve toner tasarrufu için arka plan gölgelerini temizleyin.'
  },
  {
    path: '/pdf-resizer',
    component: <PdfResizerPage />,
    title: 'PDF Sayfa Boyutu & Kenar Payı Düzenleyici | PDF Resizer - EvrakFix',
    description: 'PDF belgelerinizi A4, Letter veya A3 boyutlarına vektör kalitesini ve metin seçilebilirliğini bozmadan yeniden ölçeklendirin.'
  },
  {
    path: '/vat-invoice-calculator',
    component: <VatInvoiceCalculatorPage />,
    title: 'KDV ve Fatura Hesaplayıcı | Ücretsiz KDV Dahil Hariç Hesaplama - EvrakFix',
    description: 'Fatura KDV dahil ve hariç tutarlarını tevkifat kesinti oranları (1/10 - 10/10) ile birlikte cihazınızda güvenle hesaplayın.'
  },
  {
    path: '/interest-calculator',
    component: <InterestCalculatorPage />,
    title: 'Gecikme Faizi ve Yasal Faiz Hesaplayıcı | Rapor Dökümü - EvrakFix',
    description: 'Yasal faiz ve ticari avans faizi oranlarındaki dönemsel değişimlere göre faiz döküm raporunuzu cihazınızda güvenle çıkarın.'
  },
  {
    path: '/pdf-booklet-splitter',
    component: <PdfBookletSplitterPage />,
    title: 'İkiye Katlanmış PDF Sayfalarını Ayırıcı | Booklet Splitter - EvrakFix',
    description: 'Kitapçık veya yan yana duran çift sayfalı yatay PDF dökümanlarını kalitesini bozmadan ortadan iki dikey sayfaya bölün.'
  },
  {
    path: '/markdown-editor',
    component: <MarkdownEditorPage />,
    title: 'Markdown Editör & PDF Dönüştürücü | Canlı Önizleme - EvrakFix',
    description: 'Tarayıcı tabanlı Markdown editörü ile dökümanlarınızı yazın, anlık HTML önizleyin ve cihazınızda güvenle PDF\'e dönüştürün.'
  },
  {
    path: '/pdf-password-recovery',
    component: <PdfPasswordRecoveryPage />,
    title: 'PDF Şifre Kırıcı / Kurtarıcı | Kilitli PDF Açma - EvrakFix',
    description: 'Şifresini unuttuğunuz kilitli PDF dosyalarının kilidini olası şifre listeleriyle tarayıcı düzeyinde brute-force deneyerek açın.'
  },
  {
    path: '/qr-barcode-reader',
    component: <QrBarcodeReaderPage />,
    title: 'QR Kod & Barkod Okuyucu | Kamera ile Barkod Tarama - EvrakFix',
    description: 'Fotoğraf yükleyerek veya kameranızı kullanarak QR kodları ve ticari perakende barkodlarını tarayıcı düzeyinde çözün.'
  },
  {
    path: '/image-background-remover',
    component: <ImageBackgroundRemoverPage />,
    title: 'Resim Arka Planı Temizleyici | Şeffaf PNG Yapma - EvrakFix',
    description: 'İmza, kaşe veya logolarınızın beyaz arka planını temizleyerek şeffaf PNG döküman görselleri elde edin.'
  },
  {
    path: '/cv-builder',
    component: <CvBuilderPage />,
    title: 'CV / Özgeçmiş Oluşturucu | Ücretsiz A4 PDF CV Hazırlama - EvrakFix',
    description: 'Hiçbir sunucuya veri yüklemeden, tarayıcınızda kurumsal A4 PDF özgeçmişler hazırlayıp anında indirin.'
  }
];

import { navigateTo } from '../lib/utils/navigation';

export function updateSEOMeta(title: string, description: string, path: string) {
  // Update browser title
  document.title = title;
  
  // Update primary meta tags
  const metaTitle = document.querySelector('meta[name="title"]');
  if (metaTitle) metaTitle.setAttribute('content', title);
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  
  // Update Open Graph (Facebook)
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
  
  // Update Twitter
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', title);
  
  const twitterDesc = document.querySelector('meta[property="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', description);

  // Update Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = `https://www.evrakfix.com${path === '/' ? '' : path}`;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Update/Inject Structured Data (JSON-LD)
  const existingScripts = document.querySelectorAll('script[data-schema="jsonld"]');
  existingScripts.forEach(script => script.remove());

  const schemas: any[] = [];

  // 1. BreadcrumbList Schema (for all subpages)
  if (path !== '/') {
    const matchedRoute = routes.find(r => r.path === path);
    const pageName = matchedRoute ? matchedRoute.title.split(' | ')[0] : 'Sayfa';
    
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
          "item": `https://www.evrakfix.com${path}`
        }
      ]
    });
  }

  // 2. WebApplication Schema (global or on home page)
  if (path === '/') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "EvrakFix",
      "url": "https://www.evrakfix.com/",
      "description": description,
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

  // Inject script tags into head
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema', 'jsonld');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

export const usePathRouting = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Global Click Interceptor for Clean SPA Yönlendirmesi
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target && 
        target instanceof HTMLAnchorElement &&
        target.target !== '_blank' &&
        !e.defaultPrevented &&
        e.button === 0 && // left click only
        !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey // no modifier keys
      ) {
        const href = target.getAttribute('href');
        // Only intercept local paths (starting with / and not external links or hash-only links)
        if (href && href.startsWith('/') && !href.startsWith('//') && !href.includes(':')) {
          e.preventDefault();
          navigateTo(href);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const matchedRoute = routes.find((route) => route.path === currentPath);

  React.useEffect(() => {
    if (matchedRoute) {
      updateSEOMeta(matchedRoute.title, matchedRoute.description, currentPath);
    }
  }, [currentPath, matchedRoute]);

  return matchedRoute ? matchedRoute.component : <NotFoundPage />;
};

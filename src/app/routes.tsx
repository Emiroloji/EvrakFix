import React from 'react';
import { HomePage } from '../pages/HomePage';
import { ToolsPage } from '../pages/ToolsPage';
import { AboutPage } from '../pages/AboutPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PdfMergePage } from '../features/pdf-merge/PdfMergePage';
import { PdfSplitPage } from '../features/pdf-split/PdfSplitPage';
import { ImageToPdfPage } from '../features/image-to-pdf/ImageToPdfPage';
import { PdfSignPage } from '../features/pdf-sign/PdfSignPage';
import { PdfWatermarkPage } from '../features/pdf-tools/PdfWatermarkPage';
import { DocumentGeneratorPage } from '../features/document-generator/DocumentGeneratorPage';
import { PdfOrganizerPage } from '../features/pdf-organizer/PdfOrganizerPage';
import { PdfToImagePage } from '../features/pdf-to-image/PdfToImagePage';
import { ImageCompressorPage } from '../features/image-compressor/ImageCompressorPage';

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
    title: 'EvrakFix | %100 Güvenli Ücretsiz PDF ve Evrak Araçları',
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
    title: 'PDF Birleştirici | Ücretsiz & Güvenli Çoklu PDF Birleştirme - EvrakFix',
    description: 'Birden fazla PDF dökümanını dilediğiniz sıraya dizin ve sunuculara yüklemeden, tarayıcınızda %100 güvenli ve hızlı şekilde tek bir PDF olarak birleştirin.'
  },
  {
    path: '/pdf-split',
    component: <PdfSplitPage />,
    title: 'PDF Bölücü | PDF Sayfalarını Ayırma ve Ayıklama Aracı - EvrakFix',
    description: 'Büyük PDF dosyalarınızı belirlediğiniz sayfa aralıklarına göre (tek-çift sayfalar, özel aralıklar) tarayıcınızın hızıyla anında bölün ve indirin.'
  },
  {
    path: '/image-to-pdf',
    component: <ImageToPdfPage />,
    title: 'Görseli PDF\'e Çevir | JPG, PNG ve WebP\'den PDF Yap - EvrakFix',
    description: 'JPG, JPEG, PNG veya WebP formatındaki resimlerinizi sürükleyip bırakın, sıralayın, A4 veya orijinal boyutta yüksek kaliteli PDF belgelerine dönüştürün.'
  },
  {
    path: '/pdf-sign',
    component: <PdfSignPage />,
    title: 'PDF İmzalama | PDF Belgelerine Islak İmza Ekleme - EvrakFix',
    description: 'PDF belgelerinizin üzerine fare veya dokunmatik ekranla ıslak imzanızı çizin, imza konumunu ve boyutunu seçip dökümana güvenle yerleştirin.'
  },
  {
    path: '/pdf-watermark',
    component: <PdfWatermarkPage />,
    title: 'PDF Filigran Ekleme | PDF\'e Tarih, Metin ve Logo Ekle - EvrakFix',
    description: 'PDF belgelerinizin tüm sayfalarına 45 derece eğik çapraz filigran metinleri basarak veya seçtiğiniz konuma tarih/onay metni yerleştirerek telifinizi koruyun.'
  },
  {
    path: '/document-generator',
    component: <DocumentGeneratorPage />,
    title: 'Dilekçe & Evrak Oluşturucu | Hazır Resmi Şablonlar - EvrakFix',
    description: 'İstifa dilekçesi, iade talebi, genel dilekçe veya teslim tutanağı gibi resmi evrak şablonlarını tarayıcıda form doldurarak saniyeler içinde A4 PDF yapın.'
  },
  {
    path: '/pdf-organizer',
    component: <PdfOrganizerPage />,
    title: 'PDF Sayfa Düzenleyici | Sayfa Döndürme, Silme ve Sıralama - EvrakFix',
    description: 'PDF dökümanlarınızın sayfalarını visual grid üzerinde görün, sayfaları silin, 90/180 derece döndürün, sıralarını yön butonlarıyla kolayca düzenleyin.'
  },
  {
    path: '/pdf-to-image',
    component: <PdfToImagePage />,
    title: "PDF'i Görsele Çevir | PDF Sayfalarını PNG ve JPG Yapma - EvrakFix",
    description: 'PDF dökümanınızın sayfalarını yüksek çözünürlüklü PNG veya JPG görsellerine dönüştürün, tek tek veya toplu olarak ZIP arşivi şeklinde güvenle indirin.'
  },
  {
    path: '/image-compressor',
    component: <ImageCompressorPage />,
    title: 'Görsel Sıkıştırıcı & Format Dönüştürücü | JPG, PNG, WebP - EvrakFix',
    description: 'Görsellerinizin kalitesini bozmadan dosya boyutunu küçültün, genişlik değerine göre yeniden boyutlandırın ve JPG, PNG, WebP formatlarına dönüştürün.'
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

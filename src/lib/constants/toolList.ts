export interface ToolItem {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'pdf' | 'document' | 'other';
  icon: string; // Used to look up components dynamically
  badge?: string;
  isPopular?: boolean;
}

export const toolList: ToolItem[] = [
  {
    id: 'pdf-merge',
    title: 'PDF Birleştir',
    description: 'Birden fazla PDF dosyasını yükleyin, sırasını belirleyin ve tek bir PDF olarak birleştirin.',
    path: '/pdf-merge',
    category: 'pdf',
    icon: 'Merge',
    isPopular: true
  },
  {
    id: 'pdf-split',
    title: 'PDF Böl',
    description: 'Tek bir PDF dosyasını belirli sayfa aralıklarına göre bölerek yeni PDF\'ler oluşturun.',
    path: '/pdf-split',
    category: 'pdf',
    icon: 'Scissors',
    isPopular: true
  },
  {
    id: 'image-to-pdf',
    title: 'Görseli PDF\'e Çevir',
    description: 'JPG, PNG veya WebP resimlerinizi yükleyin, sıralayın ve A4 veya orijinal boyutta PDF\'e dönüştürün.',
    path: '/image-to-pdf',
    category: 'pdf',
    icon: 'Image'
  },
  {
    id: 'pdf-sign',
    title: 'Belgeye İmza Ekle',
    description: 'PDF dosyanızı yükleyin, tarayıcınızda imza çizin ve istediğiniz sayfaya/konuma yerleştirin.',
    path: '/pdf-sign',
    category: 'pdf',
    icon: 'Signature',
    isPopular: true
  },
  {
    id: 'pdf-watermark',
    title: 'Filigran Ekle',
    description: 'PDF dosyalarınızın üzerine tüm sayfalara çapraz filigran metni ve opaklık ayarı ile filigran ekleyin.',
    path: '/pdf-watermark',
    category: 'pdf',
    icon: 'Layers'
  },
  {
    id: 'pdf-organizer',
    title: 'PDF Sayfa Düzenleyici',
    description: 'PDF sayfalarını silin, döndürün, sıralayın ve yeni PDF olarak indirin.',
    path: '/pdf-organizer',
    category: 'pdf',
    icon: 'LayoutGrid',
    isPopular: true
  },
  {
    id: 'pdf-to-image',
    title: "PDF'i Görsele Çevir",
    description: 'PDF sayfalarını PNG veya JPG olarak indirin.',
    path: '/pdf-to-image',
    category: 'pdf',
    icon: 'Image',
    badge: 'Yeni'
  },
  {
    id: 'image-compressor',
    title: 'Görsel Sıkıştırıcı',
    description: 'JPG, PNG ve WebP görsellerinizi sıkıştırın, yeniden boyutlandırın ve dönüştürün.',
    path: '/image-compressor',
    category: 'other',
    icon: 'Sliders',
    badge: 'Yeni'
  },
  {
    id: 'document-generator',
    title: 'Dilekçe Oluştur',
    description: 'İstifa, iade, genel dilekçe veya teslim tutanağı gibi hazır şablonları doldurarak anında PDF üretin.',
    path: '/document-generator',
    category: 'document',
    icon: 'FileText',
    badge: 'Yeni'
  },
  {
    id: 'pdf-metadata-cleaner',
    title: 'PDF Metadata Temizleyici',
    description: 'PDF dosyanızdaki başlık, yazar, oluşturucu ve tarih gibi belge bilgilerini cihazınızda güvenle temizleyin.',
    path: '/pdf-metadata-cleaner',
    category: 'pdf',
    icon: 'EyeOff',
    badge: 'Yeni'
  },
  {
    id: 'pdf-page-numbers',
    title: 'PDF Sayfa Numarası Ekle',
    description: 'PDF dosyanıza cihazınızda güvenle sayfa numarası ekleyin ve numaralandırılmış PDF olarak indirin.',
    path: '/pdf-page-numbers',
    category: 'pdf',
    icon: 'Hash',
    badge: 'Yeni'
  },
  {
    id: 'pdf-protect-unlock',
    title: 'PDF Şifrele & Şifre Çöz',
    description: 'PDF dosyalarınıza cihazınızda güvenle şifre koyun veya mevcut PDF şifrelerini kaldırın.',
    path: '/pdf-protect-unlock',
    category: 'pdf',
    icon: 'Lock',
    badge: 'Yeni'
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Sıkıştırıcı',
    description: 'PDF dosyalarınızın boyutunu kalitesini bozmadan cihazınızda güvenle küçültün.',
    path: '/pdf-compressor',
    category: 'pdf',
    icon: 'Minimize2',
    badge: 'Yeni'
  },
  {
    id: 'qr-barcode-generator',
    title: 'QR & Barkod Oluşturucu',
    description: 'Ücretsiz ve güvenli şekilde kendi QR kodlarınızı ve barkodlarınızı cihazınızda oluşturun.',
    path: '/qr-barcode-generator',
    category: 'other',
    icon: 'QrCode',
    badge: 'Yeni'
  },
  {
    id: 'xml-invoice-viewer',
    title: 'XML Fatura Gösterici',
    description: 'XML formatındaki e-Fatura, e-Arşiv veya e-İrsaliye dosyalarını cihazınızda açın ve yazdırın.',
    path: '/xml-invoice-viewer',
    category: 'other',
    icon: 'FileText',
    badge: 'Yeni'
  },
  {
    id: 'text-diff-checker',
    title: 'Metin Karşılaştırıcı',
    description: 'İki farklı metin versiyonunu yan yana karşılaştırın ve değişiklikleri anlık olarak görün.',
    path: '/text-diff-checker',
    category: 'document',
    icon: 'ArrowRightLeft',
    badge: 'Yeni'
  },
  {
    id: 'pdf-stamp-image',
    title: 'PDF\'e Kaşe & Resim Ekle',
    description: 'PDF dökümanlarınıza kurumsal kaşe basabilir veya el yazısı imzanızın resmini ekleyebilirsiniz.',
    path: '/pdf-stamp-image',
    category: 'pdf',
    icon: 'Award',
    badge: 'Yeni'
  },
  {
    id: 'image-ocr',
    title: 'Resimden Metin Okuma (OCR)',
    description: 'Görsellerinizdeki veya taranmış evrak fotoğraflarınızdaki metinleri cihazınızda yapay zeka ile okuyun.',
    path: '/image-ocr',
    category: 'document',
    icon: 'Sparkles',
    badge: 'Yeni'
  },
  {
    id: 'document-scanner',
    title: 'Belge Tarayıcı',
    description: 'Telefon kamerasıyla çektiğiniz evrak fotoğraflarını cihazınızda tarayıp netleştirin, gölgeleri temizleyin ve PDF olarak indirin.',
    path: '/document-scanner',
    category: 'other',
    icon: 'Camera',
    badge: 'Yeni'
  },
  {
    id: 'pdf-to-text',
    title: 'PDF’ten Metin Çıkarıcı',
    description: 'PDF dökümanlarınızdaki tüm yazıları cihazınızda hızlıca ayıklayıp TXT veya Markdown olarak indirin veya kopyalayın.',
    path: '/pdf-to-text',
    category: 'document',
    icon: 'FileText',
    badge: 'Yeni'
  },
  {
    id: 'csv-json-xml-converter',
    title: 'CSV JSON XML Dönüştürücü',
    description: 'CSV, JSON ve XML dosyalarınızı veya metinlerinizi cihazınızda güvenle birbirine dönüştürün.',
    path: '/csv-json-xml-converter',
    category: 'other',
    icon: 'RefreshCw',
    badge: 'Yeni'
  },
  {
    id: 'pdf-to-grayscale',
    title: 'PDF Yazıcı Dostu Yapıcı',
    description: 'PDF dosyalarınızın renklerini gri tonlamaya çevirin ve toner tasarrufu için arka plan gölgelerini temizleyin.',
    path: '/pdf-to-grayscale',
    category: 'pdf',
    icon: 'Printer',
    badge: 'Yeni'
  },
  {
    id: 'pdf-resizer',
    title: 'PDF Sayfa Boyutu & Kenar Payı',
    description: 'PDF belgelerinizi A4, Letter veya A3 boyutlarına vektör kalitesini bozmadan yeniden ölçeklendirin.',
    path: '/pdf-resizer',
    category: 'pdf',
    icon: 'Maximize2',
    badge: 'Yeni'
  },
  {
    id: 'vat-invoice-calculator',
    title: 'KDV ve Fatura Hesaplayıcı',
    description: 'KDV dahil ve hariç tutarlarını tevkifat oranları ile birlikte cihazınızda güvenle hesaplayın.',
    path: '/vat-invoice-calculator',
    category: 'other',
    icon: 'Calculator',
    badge: 'Yeni'
  },
  {
    id: 'interest-calculator',
    title: 'Gecikme Faizi Hesaplayıcı',
    description: 'Yasal ve ticari faiz oranlarındaki dönemsel değişimleri otomatik hesaba katarak faiz raporu çıkarın.',
    path: '/interest-calculator',
    category: 'other',
    icon: 'Percent',
    badge: 'Yeni'
  },
  {
    id: 'pdf-booklet-splitter',
    title: 'PDF Kitapçık Ayırıcı',
    description: 'Çift sayfalı yatay PDF dökümanlarını kalitesini bozmadan ortadan iki dikey sayfaya bölün.',
    path: '/pdf-booklet-splitter',
    category: 'pdf',
    icon: 'BookOpen',
    badge: 'Yeni'
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editör & PDF',
    description: 'Markdown formatında dökümanlar yazın, canlı önizleyin ve cihazınızda PDF\'e dönüştürün.',
    path: '/markdown-editor',
    category: 'document',
    icon: 'Edit3',
    badge: 'Yeni'
  },
  {
    id: 'pdf-password-recovery',
    title: 'PDF Şifre Kurtarıcı',
    description: 'Şifresini unuttuğunuz kilitli PDF dosyalarının şifresini brute-force ile kurtarın.',
    path: '/pdf-password-recovery',
    category: 'pdf',
    icon: 'Key',
    badge: 'Yeni'
  },
  {
    id: 'qr-barcode-reader',
    title: 'QR & Barkod Okuyucu',
    description: 'Fotoğraf yükleyerek veya kameranızı kullanarak QR kodları ve perakende barkodları çözün.',
    path: '/qr-barcode-reader',
    category: 'other',
    icon: 'Scan',
    badge: 'Yeni'
  },
  {
    id: 'image-background-remover',
    title: 'Arka Plan Temizleyici',
    description: 'İmza, kaşe veya logolarınızın beyaz arka planını temizleyerek şeffaf PNG elde edin.',
    path: '/image-background-remover',
    category: 'other',
    icon: 'Eraser',
    badge: 'Yeni'
  },
  {
    id: 'cv-builder',
    title: 'CV / Özgeçmiş Oluşturucu',
    description: 'Hiçbir sunucuya veri yüklemeden tarayıcınızda kurumsal A4 PDF özgeçmişler hazırlayın.',
    path: '/cv-builder',
    category: 'document',
    icon: 'Briefcase',
    badge: 'Yeni'
  },
  {
    id: 'severance-calculator',
    title: 'Kıdem Tazminatı Hesapla',
    description: 'Brüt maaş ve çalışma sürelerine göre kıdem ve ihbar tazminatını yasal kesintilerle birlikte hesaplayın.',
    path: '/severance-calculator',
    category: 'other',
    icon: 'Scale',
    badge: 'Yeni'
  },
  {
    id: 'bulk-renamer',
    title: 'Toplu Dosya Adı Değiştirici',
    description: 'Çok sayıda dosyanın adını belirli kurallara göre tarayıcıda toplu değiştirin ve ZIP olarak indirin.',
    path: '/bulk-renamer',
    category: 'other',
    icon: 'FolderOpen',
    badge: 'Yeni'
  },
  {
    id: 'timesheet-calculator',
    title: 'Mesai & Kazanç Hesaplayıcı',
    description: 'Günlük mesai ve saatlik ücretlerinize göre aylık kazanç tablonuzu ve zaman çizelgenizi PDF yapın.',
    path: '/timesheet-calculator',
    category: 'other',
    icon: 'CalendarDays',
    badge: 'Yeni'
  },
  {
    id: 'text-analyzer',
    title: 'Metin Analizörü & Kelime Bulutu',
    description: 'Metinlerin kelime sayısı, yoğunluğu ve okunabilirlik analizini yapın ve kelime bulutu grafiği çizin.',
    path: '/text-analyzer',
    category: 'document',
    icon: 'Languages',
    badge: 'Yeni'
  },
  {
    id: 'pdf-cover-stamp',
    title: 'PDF Kapak Ekle & Barkod Bas',
    description: 'PDF belgelerinin başına kurumsal kapak sayfası ekleyin veya sayfaların üstüne barkod damgalayın.',
    path: '/pdf-cover-stamp',
    category: 'pdf',
    icon: 'FileBadge',
    badge: 'Yeni'
  }
];

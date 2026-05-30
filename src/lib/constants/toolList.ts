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
    path: '#/pdf-merge',
    category: 'pdf',
    icon: 'Merge',
    isPopular: true
  },
  {
    id: 'pdf-split',
    title: 'PDF Böl',
    description: 'Tek bir PDF dosyasını belirli sayfa aralıklarına göre bölerek yeni PDF\'ler oluşturun.',
    path: '#/pdf-split',
    category: 'pdf',
    icon: 'Scissors',
    isPopular: true
  },
  {
    id: 'image-to-pdf',
    title: 'Görseli PDF\'e Çevir',
    description: 'JPG, PNG veya WebP resimlerinizi yükleyin, sıralayın ve A4 veya orijinal boyutta PDF\'e dönüştürün.',
    path: '#/image-to-pdf',
    category: 'pdf',
    icon: 'Image'
  },
  {
    id: 'pdf-sign',
    title: 'Belgeye İmza Ekle',
    description: 'PDF dosyanızı yükleyin, tarayıcınızda imza çizin ve istediğiniz sayfaya/konuma yerleştirin.',
    path: '#/pdf-sign',
    category: 'pdf',
    icon: 'Signature',
    isPopular: true
  },
  {
    id: 'pdf-watermark',
    title: 'Filigran Ekle',
    description: 'PDF dosyalarınızın üzerine tüm sayfalara çapraz filigran metni ve opaklık ayarı ile filigran ekleyin.',
    path: '#/pdf-watermark',
    category: 'pdf',
    icon: 'Layers'
  },
  {
    id: 'pdf-organizer',
    title: 'PDF Sayfa Düzenleyici',
    description: 'PDF sayfalarını silin, döndürün, sıralayın ve yeni PDF olarak indirin.',
    path: '#/pdf-organizer',
    category: 'pdf',
    icon: 'LayoutGrid',
    isPopular: true
  },
  {
    id: 'pdf-to-image',
    title: "PDF'i Görsele Çevir",
    description: 'PDF sayfalarını PNG veya JPG olarak indirin.',
    path: '#/pdf-to-image',
    category: 'pdf',
    icon: 'Image',
    badge: 'Yeni'
  },
  {
    id: 'image-compressor',
    title: 'Görsel Sıkıştırıcı',
    description: 'JPG, PNG ve WebP görsellerinizi sıkıştırın, yeniden boyutlandırın ve dönüştürün.',
    path: '#/image-compressor',
    category: 'other',
    icon: 'Sliders',
    badge: 'Yeni'
  },
  {
    id: 'document-generator',
    title: 'Dilekçe Oluştur',
    description: 'İstifa, iade, genel dilekçe veya teslim tutanağı gibi hazır şablonları doldurarak anında PDF üretin.',
    path: '#/document-generator',
    category: 'document',
    icon: 'FileText',
    badge: 'Yeni'
  }
];

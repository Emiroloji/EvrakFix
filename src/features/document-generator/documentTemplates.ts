export type DocumentField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
};

export type DocumentTemplate = {
  id: string;
  title: string;
  description: string;
  fields: DocumentField[];
  generateText: (values: Record<string, string>) => string;
};

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'general-petition',
    title: 'Genel Dilekçe',
    description: 'Resmi veya özel kurumlara herhangi bir konuda başvuru, talep veya şikayet bildirmek için kullanılır.',
    fields: [
      { id: 'authority', label: 'Kurum / Makam Adı', type: 'text', required: true, placeholder: 'Örn: KADIKÖY BELEDİYE BAŞKANLIĞI\'NA' },
      { id: 'subject', label: 'Dilekçe Konusu', type: 'text', required: true, placeholder: 'Örn: Sokak Aydınlatması Talebi' },
      { id: 'details', label: 'Açıklama / Metin', type: 'textarea', required: true, placeholder: 'Talebinizi veya şikayetinizi detaylıca buraya yazın...' },
      { id: 'name', label: 'Adınız Soyadınız', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'tcNo', label: 'T.C. Kimlik No (Opsiyonel)', type: 'text', required: false, placeholder: '11 Haneli TC Kimlik No' },
      { id: 'phone', label: 'Telefon Numarası', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'address', label: 'İkametgah Adresi', type: 'textarea', required: true, placeholder: 'Açık Adresiniz' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const tcLine = v.tcNo ? `\nT.C. Kimlik No: ${v.tcNo}` : '';
      return `${v.authority.toUpperCase()}\n\nKONU: ${v.subject}\n\n${v.details}\n\n\nGereğini bilgilerinize saygılarımla arz ederim.\n\nTarih: ${v.date}\n\nAd Soyad: ${v.name}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:${tcLine}\nTelefon: ${v.phone}\nAdres: ${v.address}`;
    }
  },
  {
    id: 'resignation-letter',
    title: 'İstifa Dilekçesi',
    description: 'Çalıştığınız şirketten kendi isteğinizle resmi olarak ayrılma talebinizi bildirmek için kullanılır.',
    fields: [
      { id: 'company', label: 'Şirket / Kurum Adı', type: 'text', required: true, placeholder: 'Örn: ABC TEKNOLOJİ A.Ş. GENEL MÜDÜRLÜĞÜ\'NE' },
      { id: 'name', label: 'Adınız Soyadınız', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'position', label: 'Çalıştığınız Pozisyon / Departman', type: 'text', required: true, placeholder: 'Örn: Yazılım Geliştirici' },
      { id: 'lastDate', label: 'Son Çalışma Tarihiniz', type: 'date', required: true },
      { id: 'reason', label: 'Ayrılma Nedeni / Açıklama (Opsiyonel)', type: 'textarea', required: false, placeholder: 'Kendi isteğimle, kariyer hedeflerim doğrultusunda...' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const reasonText = v.reason 
        ? `Ayrılma gerekçem: ${v.reason}`
        : 'Şirketinizde geçirdiğim süre boyunca edinmiş olduğum tecrübeler için teşekkür eder, bundan sonraki süreçte şirketinize başarılar dilerim.';
      
      return `${v.company.toUpperCase()}\n\nŞirketiniz bünyesinde ${v.date} tarihinden bu yana "${v.position}" görevini yürütmekteyim.\n\nGördüğüm lüzum üzerine, ${v.lastDate} tarihi itibarıyla kendi isteğimle bu görevimden istifa etmek istediğimi bildiririm.\n\n${reasonText}\n\nİstifamın kabulünü ve gerekli işlemlerin başlatılmasını rica ederim.\n\nSaygılarımla,\n\nTarih: ${v.date}\n\nAd Soyad: ${v.name}\nİmza: _________________`;
    }
  },
  {
    id: 'refund-request',
    title: 'İade Talep Dilekçesi',
    description: 'Satın aldığınız ayıplı veya iade hakkı bulunan bir ürün/hizmetin ücret iadesini talep etmek için kullanılır.',
    fields: [
      { id: 'company', label: 'Satıcı / Firma Adı', type: 'text', required: true, placeholder: 'Örn: XYZ E-TİCARET LİMİTED ŞİRKETİ MÜŞTERİ HİZMETLERİ\'NE' },
      { id: 'name', label: 'Adınız Soyadınız', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'productName', label: 'Ürün / Hizmet Adı', type: 'text', required: true, placeholder: 'Örn: Akıllı Telefon / Model X' },
      { id: 'orderNo', label: 'Sipariş / Fatura Numarası', type: 'text', required: true, placeholder: 'Örn: ORD-1234567' },
      { id: 'purchaseDate', label: 'Satın Alma Tarihi', type: 'date', required: true },
      { id: 'reason', label: 'İade Gerekçesi', type: 'textarea', required: true, placeholder: 'Ürünün ekranında piksel hatası olması veya 14 günlük cayma hakkı...' },
      { id: 'price', label: 'Ödenen Tutar (TL)', type: 'text', required: true, placeholder: 'Örn: 15.000 TL' },
      { id: 'iban', label: 'İadenin Yapılacağı IBAN No', type: 'text', required: true, placeholder: 'TRxx xxxx xxxx xxxx xxxx xxxx xx' },
      { id: 'phone', label: 'Telefon Numarası', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      return `${v.company.toUpperCase()}\n\nFirmanızdan ${v.purchaseDate} tarihinde ${v.orderNo} fatura numarası ile "${v.productName}" satın aldım.\n\nSöz konusu ürün/hizmetle ilgili olarak şu sorunla karşılaştım:\n${v.reason}\n\nTüketici Hakları Korunması Kanunu gereğince, ödemiş olduğum ${v.price} tutarındaki ücretin tarafıma iade edilmesini talep ediyorum.\n\nİade tutarının aşağıda belirtmiş olduğum IBAN numarasına gönderilmesini rica ederim.\n\nGereğini bilgilerinize sunarım.\n\nTarih: ${v.date}\n\nAd Soyad: ${v.name}\nİmza: _________________\n\nBANKA VE İLETİŞİM BİLGİLERİ:\nIBAN: ${v.iban}\nTelefon: ${v.phone}`;
    }
  },
  {
    id: 'handover-protocol',
    title: 'Teslim Tutanağı',
    description: 'Bir şirkete ait demirbaş, bilgisayar, araç veya herhangi bir varlığın taraflar arasında teslim edildiğini belgeler.',
    fields: [
      { id: 'deliverer', label: 'Teslim Eden Kişi (Ad Soyad/Unvan)', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'receiver', label: 'Teslim Alan Kişi (Ad Soyad/Unvan)', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'items', label: 'Teslim Edilen Demirbaş / Varlıklar', type: 'textarea', required: true, placeholder: 'Örn: 1 Adet MacBook Pro Laptop (Seri No: ABC123XYZ)\n1 Adet Şarj Cihazı ve Taşıma Çantası' },
      { id: 'conditions', label: 'Teslim Şartları / Durumu', type: 'textarea', required: true, placeholder: 'Demirbaşlar çalışır durumda, hasarsız ve eksiksiz olarak teslim edilmiştir.' },
      { id: 'date', label: 'Tutanak Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      return `TESLİM TESELLÜM TUTANAĞI\n\nİşbu tutanak, aşağıda bilgileri yer alan taraflar arasında demirbaş/varlık teslimatının belgelenmesi amacıyla düzenlenmiştir.\n\nTESLİM EDİLEN VARLIKLAR:\n${v.items}\n\nTESLİM ŞARTLARI / DURUMU:\n${v.conditions}\n\nYukarıda belirtilen varlıklar, Teslim Eden tarafından Teslim Alan kişiye ${v.date} tarihinde eksiksiz, sağlam ve çalışır vaziyette teslim edilmiş ve teslim alınmıştır.\n\nİşbu tutanak taraflarca okunarak karşılıklı imza altına alınmıştır.\n\n\nTarih: ${v.date}\n\nTESLİM EDEN:\nAd Soyad: ${v.deliverer}\nİmza: _________________\n\nTESLİM ALAN:\nAd Soyad: ${v.receiver}\nİmza: _________________`;
    }
  },
  {
    id: 'debt-settlement',
    title: 'Borç Alacak Tutanağı',
    description: 'İki şahıs veya firma arasındaki alacak-verecek durumunun tutar, vade ve ödeme taahhüdüyle belgelenmesini sağlar.',
    fields: [
      { id: 'creditor', label: 'Alacaklı Kişi / Firma Adı', type: 'text', required: true, placeholder: 'Ad Soyad / Firma' },
      { id: 'debtor', label: 'Borçlu Kişi / Firma Adı', type: 'text', required: true, placeholder: 'Ad Soyad / Firma' },
      { id: 'amount', label: 'Borç Tutarı (TL / Döviz)', type: 'text', required: true, placeholder: 'Örn: 50.000 TL (Ellibin Türk Lirası)' },
      { id: 'dueDate', label: 'Ödeme / Vade Tarihi', type: 'date', required: true },
      { id: 'details', label: 'Ödeme Şekli ve Şartları', type: 'textarea', required: true, placeholder: 'Borçlu, belirtilen borç tutarını vade tarihinde alacaklının banka hesabına havale/EFT yoluyla tek seferde ödeyecektir.' },
      { id: 'date', label: 'Tutanak Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      return `BORÇ ALACAK VE ÖDEME TAAHHÜT TUTANAĞI\n\nİşbu tutanak, Alacaklı ile Borçlu arasında mevcut borç ilişkisinin ve ödeme şartlarının belirlenmesi amacıyla tanzim edilmiştir.\n\n1. TARAFLAR VE BORÇ TANIMI:\nBorçlu, Alacaklı'ya ${v.amount} tutarında borçlu olduğunu gayrikabili rücu kabul, beyan ve ikrar eder.\n\n2. VADE VE ÖDEME ŞARTLARI:\nBorçlu, söz konusu ${v.amount} tutarındaki borcunu en geç ${v.dueDate} tarihinde ödeyeceğini taahhüt eder.\nÖdeme Planı detayları:\n${v.details}\n\n3. ANLAŞMA HÜKÜMLERİ:\nBorçlu, taahhüt ettiği tarihte borcunu tamamen ve eksiksiz ödemediği takdirde yasal takip başlatılacağını kabul eder.\n\nİşbu tutanak ${v.date} tarihinde iki nüsha olarak karşılıklı rıza ile tanzim ve imza edilmiştir.\n\n\nTarih: ${v.date}\n\nALACAKLI:\nAd Soyad: ${v.creditor}\nİmza: _________________\n\nBORÇLU:\nAd Soyad: ${v.debtor}\nİmza: _________________`;
    }
  }
];

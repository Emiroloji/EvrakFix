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
      const authority = v.authority || '';
      const tcLine = v.tcNo ? `\nT.C. Kimlik No: ${v.tcNo}` : '';
      return `${authority.toUpperCase()}\n\nKONU: ${v.subject || ''}\n\n${v.details || ''}\n\n\nGereğini bilgilerinize saygılarımla arz ederim.\n\nTarih: ${v.date || ''}\n\nAd Soyad: ${v.name || ''}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:${tcLine}\nTelefon: ${v.phone || ''}\nAdres: ${v.address || ''}`;
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
      const company = v.company || '';
      const reasonText = v.reason 
        ? `Ayrılma gerekçem: ${v.reason}`
        : 'Şirketinizde geçirdiğim süre boyunca edinmiş olduğum tecrübeler için teşekkür eder, bundan sonraki süreçte şirketinize başarılar dilerim.';
      
      return `${company.toUpperCase()}\n\nŞirketiniz bünyesinde ${v.date || ''} tarihinden bu yana "${v.position || ''}" görevini yürütmekteyim.\n\nGördüğüm lüzum üzerine, ${v.lastDate || ''} tarihi itibarıyla kendi isteğimle bu görevimden istifa etmek istediğimi bildiririm.\n\n${reasonText}\n\nİstifamın kabulünü ve gerekli işlemlerin başlatılmasını rica ederim.\n\nSaygılarımla,\n\nTarih: ${v.date || ''}\n\nAd Soyad: ${v.name || ''}\nİmza: _________________`;
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
      const company = v.company || '';
      return `${company.toUpperCase()}\n\nFirmanızdan ${v.purchaseDate || ''} tarihinde ${v.orderNo || ''} fatura numarası ile "${v.productName || ''}" satın aldım.\n\nSöz konusu ürün/hizmetle ilgili olarak şu sorunla karşılaştım:\n${v.reason || ''}\n\nTüketici Hakları Korunması Kanunu gereğince, ödemiş olduğum ${v.price || ''} tutarındaki ücretin tarafıma iade edilmesini talep ediyorum.\n\nİade tutarının aşağıda belirtmiş olduğum IBAN numarasına gönderilmesini rica ederim.\n\nGereğini bilgilerinize sunarım.\n\nTarih: ${v.date || ''}\n\nAd Soyad: ${v.name || ''}\nİmza: _________________\n\nBANKA VE İLETİŞİM BİLGİLERİ:\nIBAN: ${v.iban || ''}\nTelefon: ${v.phone || ''}`;
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
      return `TESLİM TESELLÜM TUTANAĞI\n\nİşbu tutanak, aşağıda bilgileri yer alan taraflar arasında demirbaş/varlık teslimatının belgelenmesi amacıyla düzenlenmiştir.\n\nTESLİM EDİLEN VARLIKLAR:\n${v.items || ''}\n\nTESLİM ŞARTLARI / DURUMU:\n${v.conditions || ''}\n\nYukarıda belirtilen varlıklar, Teslim Eden tarafından Teslim Alan kişiye ${v.date || ''} tarihinde eksiksiz, sağlam ve çalışır vaziyette teslim edilmiş ve teslim alınmıştır.\n\nİşbu tutanak taraflarca okunarak karşılıklı imza altına alınmıştır.\n\n\nTarih: ${v.date || ''}\n\nTESLİM EDEN:\nAd Soyad: ${v.deliverer || ''}\nİmza: _________________\n\nTESLİM ALAN:\nAd Soyad: ${v.receiver || ''}\nİmza: _________________`;
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
      return `BORÇ ALACAK VE ÖDEME TAAHHÜT TUTANAĞI\n\nİşbu tutanak, Alacaklı ile Borçlu arasında mevcut borç ilişkisinin ve ödeme şartlarının belirlenmesi amacıyla tanzim edilmiştir.\n\n1. TARAFLAR VE BORÇ TANIMI:\nBorçlu, Alacaklı'ya ${v.amount || ''} tutarında borçlu olduğunu gayrikabili rücu kabul, beyan ve ikrar eder.\n\n2. VADE VE ÖDEME ŞARTLARI:\nBorçlu, söz konusu ${v.amount || ''} tutarındaki borcunu en geç ${v.dueDate || ''} tarihinde ödeyeceğini taahhüt eder.\nÖdeme Planı detayları:\n${v.details || ''}\n\n3. ANLAŞMA HÜKÜMLERİ:\nBorçlu, taahhüt ettiği tarihte borcunu tamamen ve eksiksiz ödemediği takdirde yasal takip başlatılacağını kabul eder.\n\nİşbu tutanak ${v.date || ''} tarihinde iki nüsha olarak karşılıklı rıza ile tanzim ve imza edilmiştir.\n\n\nTarih: ${v.date || ''}\n\nALACAKLI:\nAd Soyad: ${v.creditor || ''}\nİmza: _________________\n\nBORÇLU:\nAd Soyad: ${v.debtor || ''}\nİmza: _________________`;
    }
  },
  {
    id: 'leave-request',
    title: 'İzin Dilekçesi',
    description: 'Çalışanların yıllık izin, mazeret izni veya ücretsiz izin taleplerini işverene sunmaları için kullanılır.',
    fields: [
      { id: 'company', label: 'Şirket / Kurum Adı', type: 'text', required: true, placeholder: 'Örn: ABC TEKNOLOJİ A.Ş. İNSAN KAYNAKLARI MÜDÜRLÜĞÜ\'NE' },
      { id: 'name', label: 'Adınız Soyadınız', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'registrationNo', label: 'Sicil / Personel Numarası (Opsiyonel)', type: 'text', required: false, placeholder: 'Örn: Sicil No: 12345' },
      { id: 'leaveType', label: 'İzin Türü', type: 'text', required: true, placeholder: 'Örn: Yıllık Ücretli İzin / Mazeret İzni' },
      { id: 'startDate', label: 'İzin Başlangıç Tarihi', type: 'date', required: true },
      { id: 'endDate', label: 'İzin Bitiş Tarihi', type: 'date', required: true },
      { id: 'duration', label: 'Toplam İzin Gün Sayısı', type: 'text', required: true, placeholder: 'Örn: 5 İş Günü' },
      { id: 'contactAddress', label: 'İzin Boyunca Bulunacağınız Adres / İletişim', type: 'textarea', required: true, placeholder: 'İzin süresince açık adresiniz ve ulaşılabilecek telefon numarası...' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const company = v.company || '';
      const regLine = v.registrationNo ? `\nSicil No: ${v.registrationNo}` : '';
      return `${company.toUpperCase()}\n\nŞirketiniz bünyesinde çalışmaktayım. ${v.startDate || ''} tarihi ile ${v.endDate || ''} tarihleri arasında toplam ${v.duration || ''} gün süreyle "${v.leaveType || ''}" kullanmak istiyorum.\n\nİznimin onaylanmasını ve gerekli işlemlerin yapılmasını saygılarımla arz ederim.\n\nTarih: ${v.date || ''}\n\nAd Soyad: ${v.name || ''}${regLine}\nİmza: _________________\n\nİZİN SÜRESİNCE İLETİŞİM BİLGİLERİ:\nAdres & Telefon: ${v.contactAddress || ''}`;
    }
  },
  {
    id: 'school-petition',
    title: 'Okul Dilekçesi',
    description: 'Öğrenci veya velilerin okul müdürlüğüne mazeret sınavı, kayıt dondurma, izin veya muafiyet taleplerini iletmeleri için kullanılır.',
    fields: [
      { id: 'schoolName', label: 'Okul / Fakülte Müdürlüğü Adı', type: 'text', required: true, placeholder: 'Örn: KADIKÖY ANADOLU LİSESİ MÜDÜRLÜĞÜ\'NE' },
      { id: 'studentName', label: 'Öğrencinin Adı Soyadı', type: 'text', required: true, placeholder: 'Öğrenci Adı Soyadı' },
      { id: 'classNo', label: 'Sınıf / Numara / Bölüm', type: 'text', required: true, placeholder: 'Örn: 10-A Sınıfı, 432 Numaralı Öğrenci' },
      { id: 'parentName', label: 'Veli Adı Soyadı (Opsiyonel)', type: 'text', required: false, placeholder: 'Örn: Veli Adı (Reşit olmayan öğrenciler için)' },
      { id: 'subject', label: 'Dilekçe Konusu', type: 'text', required: true, placeholder: 'Örn: Mazeret Sınavı Talebi / Kayıt Dondurma' },
      { id: 'details', label: 'Açıklama / Talep Metni', type: 'textarea', required: true, placeholder: 'Mazeretinizi ve talebinizi buraya detaylıca yazın...' },
      { id: 'phone', label: 'İletişim Telefonu', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const schoolName = v.schoolName || '';
      const parentLine = v.parentName ? `\nVeli Adı Soyadı: ${v.parentName}` : '';
      return `${schoolName.toUpperCase()}\n\nOkulunuz ${v.classNo || ''} öğrencisi ${v.studentName || ''} ile ilgili olarak;\n\nKONU: ${v.subject || ''}\n\n${v.details || ''}\n\nGereğini bilgilerinize saygılarımla arz ederim.\n\nTarih: ${v.date || ''}\n\nTalep Sahibi / Veli Ad Soyad: ${v.parentName || v.studentName || ''}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:${parentLine}\nTelefon: ${v.phone || ''}`;
    }
  },
  {
    id: 'complaint-petition',
    title: 'Şikayet Dilekçesi',
    description: 'Hizmet aksaması, gürültü, çevre kirliliği veya tüketici hak ihlalleri durumunda ilgili makamlara şikayet bildirmek için kullanılır.',
    fields: [
      { id: 'authority', label: 'Şikayet Edilen Kurum / Makam Adı', type: 'text', required: true, placeholder: 'Örn: KADIKÖY KAYMAKAMLIĞI\'NA / İLÇE TÜKETİCİ HAKEM HEYETİ\'NE' },
      { id: 'complainantName', label: 'Şikayetçi Adı Soyadı', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'defendantName', label: 'Şikayet Edilen Taraf (Kişi / Firma)', type: 'text', required: true, placeholder: 'Örn: ABC İnşaat A.Ş. veya Şahıs Adı' },
      { id: 'incidentDate', label: 'Olay / Tespit Tarihi', type: 'date', required: true },
      { id: 'details', label: 'Şikayet Detayları ve Açıklama', type: 'textarea', required: true, placeholder: 'Yaşanan olayı, yeri, saati ve şikayet sebeplerinizi detaylıca yazın...' },
      { id: 'demand', label: 'Talep ve Sonuç', type: 'textarea', required: true, placeholder: 'Gerekli incelemenin yapılmasını ve mağduriyetimin giderilmesini saygılarımla arz ederim.' },
      { id: 'phone', label: 'Telefon Numarası', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'address', label: 'İkametgah Adresi', type: 'textarea', required: true, placeholder: 'Açık Adresiniz' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const authority = v.authority || '';
      return `${authority.toUpperCase()}\n\nŞİKAYETÇİ: ${v.complainantName || ''}\nŞİKAYET EDİLEN: ${v.defendantName || ''}\nOLAY TARİHİ: ${v.incidentDate || ''}\n\nŞİKAYETİN KONUSU VE DETAYLARI:\n${v.details || ''}\n\nTALEP VE SONUÇ:\n${v.demand || ''}\n\nTarih: ${v.date || ''}\n\nŞikayetçi Ad Soyad: ${v.complainantName || ''}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:\nTelefon: ${v.phone || ''}\nAdres: ${v.address || ''}`;
    }
  },
  {
    id: 'job-application',
    title: 'İş Başvuru Dilekçesi',
    description: 'Bir kuruma, şirkete veya kamu kuruluşuna açık pozisyonlar için iş başvurusunda bulunmak ve özgeçmiş sunmak amacıyla kullanılır.',
    fields: [
      { id: 'company', label: 'Şirket / Kurum Adı', type: 'text', required: true, placeholder: 'Örn: ABC HOLDİNG İNSAN KAYNAKLARI DİREKTÖRLÜĞÜ\'NE' },
      { id: 'name', label: 'Adınız Soyadınız', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'position', label: 'Başvurulan Pozisyon', type: 'text', required: true, placeholder: 'Örn: Finans Uzmanı / Kıdemli Satış Temsilcisi' },
      { id: 'education', label: 'Öğrenim Durumu', type: 'text', required: true, placeholder: 'Örn: Yıldız Teknik Üniversitesi - İktisat Lisans Mezunu' },
      { id: 'experience', label: 'İş Deneyimi Özeti', type: 'textarea', required: true, placeholder: 'Daha önceki iş deneyimlerinizi ve bu pozisyona uygunluğunuzu kısaca açıklayınız...' },
      { id: 'phone', label: 'Telefon Numarası', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'email', label: 'E-posta Adresi', type: 'text', required: true, placeholder: 'ornek@mail.com' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const company = v.company || '';
      return `${company.toUpperCase()}\n\nKONU: İş Başvurusu (${v.position || ''})\n\nKurumunuz bünyesinde açık bulunan "${v.position || ''}" kadrosunda görev almak istiyorum. \n\nÖğrenim Durumum: ${v.education || ''}\n\nMesleki Deneyimlerim ve Yetkinliklerim:\n${v.experience || ''}\n\nPozisyon gereksinimlerini karşıladığıma inanıyor, kurumunuzun vizyonuna katkı sağlamak istiyorum. Ekli özgeçmişimin incelenerek tarafıma olumlu veya olumsuz geri dönüş yapılmasını arz ederim.\n\nTarih: ${v.date || ''}\n\nAd Soyad: ${v.name || ''}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:\nTelefon: ${v.phone || ''}\nE-posta: ${v.email || ''}`;
    }
  },
  {
    id: 'apartment-management',
    title: 'Apartman Yönetimi Dilekçesi',
    description: 'Apartman veya site yönetimine aidat, ortak alan kullanımı, tadilat, gürültü veya güvenlik sorunlarını iletmek için kullanılır.',
    fields: [
      { id: 'management', label: 'Apartman / Site Yönetimi Adı', type: 'text', required: true, placeholder: 'Örn: YILDIZ APARTMANI KAT MALİKLERİ YÖNETİMİ\'NE' },
      { id: 'name', label: 'Adınız Soyadınız (Kat Maliki veya Kiracı)', type: 'text', required: true, placeholder: 'Ad Soyad' },
      { id: 'doorNo', label: 'Blok / Daire Numarası', type: 'text', required: true, placeholder: 'Örn: A Blok, Daire 12' },
      { id: 'subject', label: 'Konu', type: 'text', required: true, placeholder: 'Örn: Çatı Sızıntısı ve Ortak Alan Temizliği Hk.' },
      { id: 'details', label: 'Talep veya Şikayet Açıklaması', type: 'textarea', required: true, placeholder: 'Apartmanda yaşanan ortak alan arızalarını, taleplerinizi veya şikayetlerinizi buraya yazın...' },
      { id: 'phone', label: 'Telefon Numarası', type: 'text', required: true, placeholder: '05xx xxx xx xx' },
      { id: 'date', label: 'Dilekçe Tarihi', type: 'date', required: true }
    ],
    generateText: (v) => {
      const management = v.management || '';
      return `${management.toUpperCase()}\n\nApartmanınızın / Sitenizin ${v.doorNo || ''} numaralı sakiniyim.\n\nKONU: ${v.subject || ''}\n\nTalebin Detayı:\n${v.details || ''}\n\nOrtak giderlerden veya apartman düzeninden kaynaklanan bu sorunun yönetim kurulunuzca değerlendirilerek çözüme kavuşturulmasını rica ederim.\n\nTarih: ${v.date || ''}\n\nKat Maliki / Sakini Ad Soyad: ${v.name || ''}\nİmza: _________________\n\nİLETİŞİM BİLGİLERİ:\nTelefon: ${v.phone || ''}`;
    }
  }
];

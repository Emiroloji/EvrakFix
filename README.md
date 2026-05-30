# EvrakFix 📄✨

EvrakFix, kullanıcıların günlük evrak ve PDF işlemlerini **%100 güvenli, ücretsiz ve sınırsız** olarak doğrudan tarayıcılarında yapabilmelerini sağlayan, veritabanı veya backend barındırmayan, sunucusuz (serverless) kurulabilir bir Progressive Web App (PWA) uygulamasıdır.

## 🛡️ Güvenlik ve Gizlilik Felsefemiz (KVKK Uyumlu)
EvrakFix'e yüklediğiniz hiçbir dosya veya girdiğiniz hiçbir bilgi internet üzerinden bir sunucuya **gönderilmez, yüklenmez ve saklanmaz.**
Tüm PDF birleştirme, sayfa ayıklama, görsel çeviri, imza çizme, tarih/filigran ekleme, sayfa düzenleme, görsel sıkıştırma ve dilekçe üretme süreçleri **tamamen sizin bilgisayarınızın içinde (istemci tarafında)** tarayıcınızın kendi gücüyle (WebAssembly ve V8 JavaScript motoru) gerçekleştirilir. Service Worker altyapımız sayesinde internet bağlantınızı keserek çevrimdışı (offline) olarak da güvenle kullanabilirsiniz.

---

## 🚀 Öne Çıkan Özellikler

1. **PDF Sayfa Düzenleyici:** Tek bir PDF yükleyin, sayfalarını görsel olarak önizleyin, sayfaları silin/geri alın, 90/180/270 derece döndürün veya sayfaların sırasını yanlarındaki yön butonlarıyla kolayca değiştirip yeni PDF indirin.
2. **Görsel Sıkıştırıcı & Format Dönüştürücü:** JPG, PNG veya WebP görsellerinizi kaliteden ödün vermeden tarayıcınızda sıkıştırın, oransal olarak yeniden boyutlandırın (1920px, 1280px, 800px veya özel genişlik) ve farklı formatlara dönüştürün.
3. **PDF'i Görsele Çevir:** Yüklediğiniz PDF dökümanının sayfalarını yüksek çözünürlükte PNG veya JPG formatına çevirip tek tek veya seçili tüm sayfaları ZIP arşivi içinde indirin.
4. **PDF Birleştirme:** Birden fazla PDF belgesini yükleyin, sürükleyerek veya yön tuşlarıyla sırasını değiştirin ve tek tıkla tek PDF haline getirin.
5. **PDF Bölme:** Tek bir PDF dökümanının sayfa sayısını anında tespit edip, `1-3, 5, 7-9` gibi sayfa aralıklarıyla veya tek/çift sayfa presetleriyle dilediğiniz sayfaları ayıklayıp yeni PDF yapın.
6. **Görseli PDF'e Çevir:** JPG, PNG veya WebP görsellerinizi toplu yükleyin, A4 (Dikey/Yatay) veya Orijinal görsel boyutunda, kenar payı tercihleriyle orantılı ölçeklenmiş bir PDF'e çevirin.
7. **Belgeye İmza Ekle:** Fareyle veya mobil cihazınızda parmağınızla retina kalitesinde ıslak imzanızı çizin, PDF belgesinin dilediğiniz sayfasına ve konumuna yerleştirin.
8. **Filigran & Tarih Ekle:** PDF'in tüm sayfalarına çapraz açılı ve opaklık ayarlı büyük filigran basın ya da ilk sayfanın 4 köşesinden birine isim/tarih gibi metinleri ekleyin.
9. **Dilekçe & Evrak Oluşturucu:** Hazır şablonları (Genel Dilekçe, İstifa Dilekçesi, İade Talebi, Teslim ve Borç Tutanağı) form doldurarak canlı önizleyin ve otomatik satır sarmalı (word-wrap), çok sayfalı A4 standartlarında PDF çıktısı alın.

---

## 🛠️ Kullanılan Teknolojiler

- **React 19 + TypeScript** (Modüler ve güvenli uygulama yapısı)
- **Vite** (Ultra hızlı derleme ve geliştirme ortamı)
- **Tailwind CSS v4** (Modern, konfigürasyonsuz ve performanslı CSS altyapısı)
- **pdf-lib** (Tarayıcı içi PDF okuma, kopyalama, imzalama ve yazma motoru)
- **pdfjs-dist** (PDF sayfalarını Canvas üzerinde High-DPI önizleme render motoru)
- **jszip** (Resim gruplarını tarayıcıda ZIP paketlemek için sıkıştırma aracı)
- **lucide-react** (Premium ve minimalist çizgi ikon seti)
- **react-dropzone** (Sürükle-bırak dosya yükleme alanı)
- **file-saver** (Dosya indirme yönetimi)

---

## 📁 Proje Klasör Yapısı

```txt
src/
  app/
    App.tsx (Uygulama ana giriş noktası)
    routes.tsx (Hash-based yönlendirme sistemi)
    layout/ (MainLayout, Header, Footer düzenleri)
  pages/
    HomePage.tsx (Premium karşılama ve Nasıl Çalışır şemaları)
    ToolsPage.tsx (Kategori filtrelemeli tüm araçlar listesi)
    AboutPage.tsx (Güvenlik, Gizlilik, KVKK politikaları ve S.S.S.)
    NotFoundPage.tsx (404 Sayfası)
  features/
    pdf-organizer/ (PDF Sayfa Düzenleyici arayüzü ve kopyalama servisi)
    image-compressor/ (Görsel Sıkıştırıcı ayarları, grid arayüzü ve canvas servisi)
    pdf-to-image/ (PDF'i resim formatına çevirme arayüzü ve render servisi)
    pdf-merge/ (PDF Birleştirme sayfası ve pdfMerge.service)
    pdf-split/ (PDF Bölme sayfası, PageRangeInput ve pdfSplit.service)
    image-to-pdf/ (Görsel çeviri sayfası, ImagePreviewList ve imageToPdf.service)
    pdf-sign/ (İmza sayfası, SignatureCanvas ve pdfSign.service)
    pdf-tools/ (Filigran sayfası ve pdfTools.service)
    document-generator/ (Dilekçe sayfası, TemplateSelector, DocumentForm ve documentGenerator.service)
  components/ui/ (Varyantlı Button, Card, Input, Textarea, Select, Badge, Alert, Loading, EmptyState, Dropzone)
  lib/ (Dosya ve PDF doğrulama, boyut formatlama ve cn sınıfları)
  styles/
    globals.css (Tailwind v4 ve premium cam panel -glassmorphism- stilleri)
```

---

## 📦 Kurulum ve Çalıştırma

Projesiyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın (Dev Mode):**
   ```bash
   npm run dev
   ```
   Tarayıcınızda terminalde gösterilen adresi (genellikle `http://localhost:5173`) açın.

3. **Üretim Derlemesi Alın (Production Build):**
   ```bash
   npm run build
   ```
   Derleme çıktıları `dist/` klasörü altında tamamen statik kurulabilir PWA HTML/JS/CSS varlıkları olarak üretilir.

---

## 🚀 Üretim Ortamına Yayınlama (Production Deployment)

EvrakFix tamamen sunucusuz (client-side only) çalıştığı için, derleme sonucu oluşan `dist/` klasörünü herhangi bir statik barındırma platformuna sıfır maliyetle kolayca yükleyebilirsiniz.

### ⚡ Vercel ile Yayınlama (Tavsiye Edilen)
EvrakFix, Vercel ile %100 uyumludur ve sıfır yapılandırma gerektirir:
1. Projenizi GitHub, GitLab veya Bitbucket depolarından birine push edin.
2. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidip **"Add New" -> "Project"** seçin.
3. Proje deponuzu Vercel'e aktarın. Altyapı otomatik olarak algılanacaktır:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **"Deploy"** butonuna basın. Uygulamanız saniyeler içinde SSL sertifikalı olarak canlıya alınacaktır.

### 🐙 GitHub Pages ile Yayınlama
1. Eğer proje depo kök dizini yerine bir alt klasörde barındırılacaksa, `vite.config.ts` dosyasına `base: '/<depo-adi>/'` ayarını ekleyin.
2. `gh-pages` paketini kurarak `dist` içeriğini ilgili dala deploy edin:
   ```bash
   npm install gh-pages --save-dev
   ```
   `package.json` içerisine deploy scriptini ekleyin:
   ```json
   "deploy": "gh-pages -d dist"
   ```
   Ardından `npm run deploy` komutuyla yayınlayın.

---

## 🛡️ PWA ve Tarayıcı Önbellek Yönetimi (Cache Note)
Projede yapılan kod güncellemelerinin veya yeni sürümlerin kullanıcılarda takılı kalmasını (tarayıcının eski dosyaları cache'den getirmesini) önlemek için `/public/sw.js` dosyasının ilk satırındaki `CACHE_NAME` sürümünü (örneğin: `evrakfix-cache-v1.5.0`) artırın. 

Service worker, sunucudaki `sw.js` dosyasının değiştiğini algıladığı anda (skipWaiting ve clients.claim tetikleyerek) eski önbelleği anında silecek ve güncel uygulama dosyalarını kullanıcılara ulaştıracaktır.


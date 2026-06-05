import { ShieldAlert, ServerOff, Cpu, Lock, HelpCircle, HardDrive, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';

export const AboutPage = () => {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Hakkımızda & Gizlilik Politikası</h1>
        <p className="text-slate-500 text-base leading-relaxed">
          EvrakFix, kullanıcı verilerini ve gizliliğini her şeyin önüne koyan modern bir web uygulamasıdır. İşte sistemimizin çalışma felsefesi ve güvenlik politikaları.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" title="Temel Güvenlik Felsefemiz" icon={<ShieldAlert className="h-5 w-5 text-emerald-600" />}>
        EvrakFix'e yüklediğiniz hiçbir dosya internet üzerinden herhangi bir sunucuya yüklenmez, saklanmaz veya analiz edilmez. Tüm PDF dönüştürme, birleştirme, bölme, sıkıştırma ve imzalama işlemleri **tamamen sizin cihazınızın içinde (istemci tarafında)** gerçekleştirilir.
      </Alert>

      {/* Grid: How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-4 p-5 bg-white border-slate-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-500 shrink-0">
            <ServerOff className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Sunucusuz İşlem</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sunucumuz sadece HTML, CSS ve JavaScript kodlarını tarayıcınıza iletir. İşlemi başlattığınızda arka planda bir sunucu yükü veya veri aktarımı asla gerçekleşmez.
          </p>
        </Card>

        <Card className="flex flex-col gap-4 p-5 bg-white border-slate-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-500 shrink-0">
            <Cpu className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Tarayıcı Gücü</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tarayıcınızın modern motorları kullanılarak dosyalarınız doğrudan cihazınızın RAM ve CPU gücüyle milisaniyeler içinde işlenir. İnternetsiz dahi çalışmaya devam eder.
          </p>
        </Card>

        <Card className="flex flex-col gap-4 p-5 bg-white border-slate-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Kalıcı Güvenlik</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kullanıcı hesabı oluşturmanıza, kredi kartı girmenize gerek yoktur. Uygulamada hiçbir izleyici (tracker) veya veritabanı bulunmaz. Verileriniz tamamen cihazınızda kalır.
          </p>
        </Card>
      </div>

      {/* Performance Disclaimer Box */}
      <Alert variant="info" title="İşlem Gücü ve Performans Bildirimi" icon={<Info className="h-5 w-5 text-blue-600" />}>
        Dosyaların tarayıcı tarafında işlenmesi nedeniyle; çok sayfalı (örneğin 100+ sayfa) veya yüksek çözünürlüklü görseller barındıran PDF'lerde tarayıcınızın çalışma hızı, bilgisayarınızın veya mobil cihazınızın RAM/İşlemci kapasitesi ile doğrudan ilişkilidir. Büyük dosyalarda tarayıcınızın kısa süreliğine yanıt vermeyi durdurması tamamen normal bir istemci tarafı bekleme durumudur.
      </Alert>

      {/* Security Policies Details */}
      <div className="bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-3xl flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-blue-600" />
          Gizlilik ve KVKK Politikası
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="flex flex-col gap-3">
            <p>
              <strong>1. Veri Transferi Yok:</strong> Uygulamaya eklediğiniz dosyaların içeriği (metinler, resimler, imzalar) hiçbir uzak sunucuya aktarılmaz. Tüm veri saklama ve işleme operasyonları tarayıcınızın yerel bellek sandbox'ı içerisinde sınırlandırılmıştır.
            </p>
            <p>
              <strong>2. KVKK Uyumlu Altyapı:</strong> Kişisel Verilerin Korunması Kanunu (KVKK) ve GDPR kapsamında kişisel veri barındırabilecek evraklarınız, herhangi bir sunucu veritabanına kaydedilmediği için tamamen güvendedir. Veri sızıntısı ihtimali teknik olarak sıfırdır.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p>
              <strong>3. Üyelik ve Çerez Yokluğu:</strong> EvrakFix, kullanım alışkanlıklarınızı izlemek amacıyla reklam hedefleme çerezleri veya analitik izleyiciler barındırmaz. Kimliğinizi açığa çıkaracak hiçbir veri toplanmaz.
            </p>
            <p>
              <strong>4. İşlem Sonu Temizlik:</strong> İndirme işlemi bittiğinde veya tarayıcı sekmesini kapattığınızda, tarayıcı RAM'indeki tüm geçici dosya referansları (`URL.revokeObjectURL` ile) anında yok edilerek kalıcı bellekten temizlenir.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed FAQ */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          Sıkça Sorulan Sorular
        </h2>

        <div className="flex flex-col gap-5">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-800 mb-1">EvrakFix tamamen ücretsiz mi? Reklam var mı?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Evet. EvrakFix tamamen ücretsizdir ve herhangi bir dosya limiti, sayfa sayısı kısıtlaması, üyelik zorunluluğu veya can sıkıcı filigranlar barındırmaz. Temiz, sade ve reklamsız bir arayüz sunar.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Dosyalarım nerede işleniyor? İnternetim olmasa da çalışır mı?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dosyalarınız tamamen tarayıcınızın yerel belleğinde (RAM) işlenir. Service Worker (PWA) altyapımız sayesinde sayfayı bir kez açtıktan sonra, internet bağlantınızı tamamen kesseniz dahi EvrakFix araçlarını çevrimdışı (offline) olarak kullanmaya devam edebilirsiniz.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Hangi kütüphaneler kullanılıyor? Kodlar güvenli mi?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              PDF ve evrak işlemleri için dünya çapında güvenilen açık kaynaklı `pdf-lib`, `pdfjs-dist` ve `jszip` kütüphaneleri kullanılmaktadır. Projede hiçbir üçüncü taraf kapalı kaynak izleyici veya reklam servisi bulunmadığından kodlar tamamen şeffaf ve güvenlidir.
            </p>
          </div>
        </div>
      </div>

      {/* Kullanım Şartları ve Sorumluluk Reddi */}
      <div id="terms" className="bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-3xl flex flex-col gap-6 scroll-mt-20">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-blue-600" />
          Kullanım Şartları ve Sorumluluk Reddi
        </h2>

        <div className="flex flex-col gap-3.5 text-xs text-slate-650 leading-relaxed font-normal">
          <p>
            <strong>1. Hizmetin Kullanımı:</strong> EvrakFix, tamamen tarayıcı tabanlı (client-side) çalışan, ücretsiz ve açık kaynaklı bir PDF ve evrak düzenleme araçları bütünüdür. Kullanıcılar, sistemi herhangi bir üyelik yapmadan özgürce kullanabilirler.
          </p>
          <p>
            <strong>2. Kişisel Veri ve Güvenlik Sorumluluğu:</strong> EvrakFix, sunucu barındırmayan yerel bir sistem olduğu için yüklediğiniz veya işlediğiniz hiçbir veriyi, dosyayı veya bilgiyi uzaktaki bir sunucuya göndermez, saklamaz veya işlemez. Bu nedenle, dökümanlarınızın gizliliği teknik olarak sizin kendi cihazınızın güvenliği (virüs olmaması, tarayıcı eklentileri vb.) ile sınırlıdır.
          </p>
          <p>
            <strong>3. Sorumluluk Reddi (Disclaimer):</strong> EvrakFix araçları (PDF birleştirme, bölme, imzalama, dilekçe oluşturma, görsel sıkıştırma vb.) "olduğu gibi" (as-is) sunulmaktadır. Uygulamanın kullanımından, dosya işleme sırasındaki olası veri kayıplarından, tarayıcı çökmelerinden, dilekçe şablonlarındaki hukuki metinlerin uygunluğundan veya tarayıcınızın donanım yetersizliğinden kaynaklanabilecek dolaylı ya da doğrudan hiçbir zarardan EvrakFix geliştiricileri sorumlu tutulamaz. Resmi evraklarınızı resmi makamlara göndermeden önce son çıktı PDF dosyasını kontrol etmeniz tamamen sizin sorumluluğunuzdadır.
          </p>
        </div>
      </div>
    </div>
  );
};

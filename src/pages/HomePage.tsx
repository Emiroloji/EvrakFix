import * as Icons from 'lucide-react';
import { toolList } from '../lib/constants/toolList';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Shield, Sparkles, Zap, ArrowRight, Lock, UploadCloud, Cpu, DownloadCloud } from 'lucide-react';

export const HomePage = () => {
  // Only show the 6 popular/first tools on the home page for a cleaner look
  const displayedTools = toolList.slice(0, 6);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-6 py-14 md:py-24 rounded-3xl overflow-hidden bg-slate-900 text-white px-6 md:px-12 shadow-xl shadow-slate-900/10">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-600/35 via-slate-900 to-slate-900 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <Badge variant="info" className="bg-blue-500/15 text-blue-300 border-blue-500/20 px-4 py-1 gap-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>%100 Tarayıcı Tabanlı Evrak Çözümü</span>
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight">
          PDF ve Evrak İşlemlerini <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Cihazınızda Güvenle</span> Yapın.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-350 max-w-3xl leading-relaxed font-light">
          EvrakFix ile dosyalarınızı sunucuya göndermeden PDF birleştirme, bölme, imza ekleme, filigran ekleme, görsel sıkıştırma ve dilekçe yazma işlemlerini tarayıcınızda saniyeler içinde tamamlayın.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto z-10">
          <Button
            size="lg"
            variant="primary"
            onClick={() => { window.location.hash = '/tools'; }}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto font-bold px-8 shadow-lg shadow-blue-500/20"
          >
            Araçları Kullan
          </Button>
          <Button
            size="lg"
            variant="white"
            onClick={() => {
              const element = document.getElementById('how-it-works');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto font-semibold text-slate-900 border-slate-200/20 bg-white/10 hover:bg-white/20 text-white"
          >
            Nasıl Çalışır?
          </Button>
        </div>

        {/* trust banners */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 pt-8 border-t border-white/10 w-full text-slate-400 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>%100 Gizlilik Güvencesi</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Veritabanı Yok, Üyelik Yok</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Dosyalar Asla İnternete Gitmez</span>
          </div>
        </div>
      </section>

      {/* Feature Tools Grid */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
              Popüler PDF & Evrak Araçları
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl">
              Dosyanızı seçin, işleminizi yapın ve anında indirin. Tamamen ücretsiz ve sınırsız.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { window.location.hash = '/tools'; }}
            className="self-start md:self-auto font-bold h-10 border-slate-200"
          >
            Tüm Araçları Gör
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool) => {
            const IconComponent = (Icons as any)[tool.icon] || Icons.FileText;
            
            return (
              <Card
                key={tool.id}
                hoverable
                onClick={() => { window.location.hash = tool.path.replace('#', ''); }}
                className="flex flex-col justify-between group h-full relative overflow-hidden p-6 border-slate-100 bg-white"
              >
                <div>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    {tool.badge && (
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-2.5 py-0.5">
                        {tool.badge}
                      </Badge>
                    )}
                    {!tool.badge && tool.isPopular && (
                      <Badge variant="primary" className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-2.5 py-0.5">
                        Popüler
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="mt-4 flex flex-col gap-2 p-0">
                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-sm leading-relaxed min-h-[40px]">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-6 pt-4 border-t border-slate-50 group-hover:gap-2.5 transition-all">
                  <span>Hemen Kullan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="flex flex-col gap-10 py-4 scroll-mt-20">
        <div className="text-center flex flex-col gap-2 max-w-2xl mx-auto">
          <Badge variant="primary" className="mx-auto bg-blue-50 text-blue-600 border-none font-bold px-3 py-1 text-xs">
            Hızlı ve Basit
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
            EvrakFix Nasıl Çalışır?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Uygulamamızın çalışması için üye olmanız, ödeme yapmanız veya beklemek için dosya yüklemeniz gerekmez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute top-1/3 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Adım 1</span>
              <h3 className="text-base font-bold text-slate-800">Dosyanızı Seçin</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                PDF, JPG, PNG veya WebP dosyalarınızı sürükleyip bırakın veya tıkla-seç yöntemiyle saniyeler içinde yükleyin.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Cpu className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Adım 2</span>
              <h3 className="text-base font-bold text-slate-800">Tarayıcıda İşleyin</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sayfaları silin, sıralayın, döndürün, imzalayın veya sıkıştırın. Tüm işlemler cihazınızın kendi işlemci gücüyle gerçekleşir.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <DownloadCloud className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Adım 3</span>
              <h3 className="text-base font-bold text-slate-800">Anında İndirin</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                İşlem tamamlandığı anda düzenlenmiş dosyayı veya sıkıştırılmış resimleri indirin. Verileriniz internete yüklenmeden cihazınızda kalır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Disclaimer Banner */}
      <section className="rounded-3xl border border-blue-100 bg-blue-50/40 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm shadow-blue-500/5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-blue-600 border border-blue-100/50 shadow-sm shrink-0">
          <Shield className="h-7 w-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-bold text-slate-800">Cihazınızda Çalışan Teknoloji (Client-Side)</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            EvrakFix web sunucuları sadece uygulamanın görsel arayüz kodlarını size ulaştırmak için kullanılır. Dosyalarınızı sürükleyip bıraktığınızda, dosya içeriği internete gönderilmez. Bilgisayarınızın veya telefonunuzun RAM'inde işlenir ve doğrudan indirilir. Bu, tam gizlilik koruması ve sıfır sunucu gecikmesi sağlar.
          </p>
        </div>
      </section>
    </div>
  );
};

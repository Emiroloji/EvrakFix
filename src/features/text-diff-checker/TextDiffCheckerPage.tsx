import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { diffWordsWithSpace, diffLines } from 'diff';
import type { Change } from 'diff';
import { Shield, ArrowRightLeft } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const TextDiffCheckerPage = () => {
  const [oldText, setOldText] = React.useState('');
  const [newText, setNewText] = React.useState('');
  const [diffMode, setDiffMode] = React.useState<'words' | 'lines'>('words');
  const [diffResult, setDiffResult] = React.useState<Change[] | null>(null);
  const [stats, setStats] = React.useState({ additions: 0, deletions: 0 });

  // Perform diffing
  const handleCompare = () => {
    if (!oldText.trim() && !newText.trim()) {
      setDiffResult([]);
      setStats({ additions: 0, deletions: 0 });
      return;
    }

    const changes = diffMode === 'words' 
      ? diffWordsWithSpace(oldText, newText)
      : diffLines(oldText, newText);

    setDiffResult(changes);

    // Calculate stats
    let additions = 0;
    let deletions = 0;
    changes.forEach(change => {
      if (change.added) additions += change.value.length;
      if (change.removed) deletions += change.value.length;
    });
    setStats({ additions, deletions });
  };

  // Load sample text for quick demo
  const handleLoadSample = () => {
    setOldText(`Kiralık Sözleşmesi Hükümleri:
1. Kiracı daireyi temiz teslim etmelidir.
2. Kira bedeli her ayın 5. gününe kadar banka hesabına yatırılacaktır.
3. Evcil hayvan beslemek kesinlikle yasaktır.`);
    
    setNewText(`Kira Sözleşmesi Maddeleri:
1. Kiracı daireyi boyalı ve temiz teslim edecektir.
2. Kira bedeli her ayın 10. gününe kadar belirtilen banka hesabına havale/EFT ile yatırılacaktır.
3. Evcil hayvan besleme kuralları apartman yönetimine tabidir.`);
    setDiffResult(null);
  };

  const handleClear = () => {
    setOldText('');
    setNewText('');
    setDiffResult(null);
    setStats({ additions: 0, deletions: 0 });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Belge Metin Karşılaştırıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          İki farklı metin veya sözleşme versiyonunu yan yana karşılaştırın, eklenen ve silinen kısımları anlık görün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Karşılaştırma işlemi tamamen tarayıcınızda yapılır. Girdiğiniz gizli sözleşme veya döküman metinleri asla sunucuya aktarılmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Grid Editor */}
      <Card className="p-6 md:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Original Text */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eski Metin (Orijinal Versiyon)</label>
              <button 
                onClick={handleLoadSample} 
                className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Örnek Veri Yükle
              </button>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => { setOldText(e.target.value); setDiffResult(null); }}
              placeholder="Karşılaştırmak istediğiniz orijinal metni buraya yapıştırın..."
              className="w-full h-48 p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Modified Text */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yeni Metin (Düzenlenmiş Versiyon)</label>
              {oldText || newText ? (
                <button 
                  onClick={handleClear} 
                  className="text-xs text-slate-450 hover:text-red-600 font-bold hover:underline cursor-pointer"
                >
                  Temizle
                </button>
              ) : null}
            </div>
            <textarea
              value={newText}
              onChange={(e) => { setNewText(e.target.value); setDiffResult(null); }}
              placeholder="Karşılaştırmak istediğiniz değiştirilmiş yeni metni buraya yapıştırın..."
              className="w-full h-48 p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-5 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duyarlılık:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setDiffMode('words'); setDiffResult(null); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  diffMode === 'words' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Kelime Bazlı
              </button>
              <button
                onClick={() => { setDiffMode('lines'); setDiffResult(null); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  diffMode === 'lines' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Satır Bazlı
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleCompare}
            disabled={!oldText && !newText}
            className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-2 px-6 h-11"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Metinleri Karşılaştır
          </Button>
        </div>

        {/* Comparison Result */}
        {diffResult !== null && (
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Karşılaştırma Sonucu</span>
              <div className="flex gap-4 text-xs font-bold">
                <span className="text-emerald-600">+{stats.additions} Karakter Eklendi</span>
                <span className="text-rose-500">-{stats.deletions} Karakter Çıkarıldı</span>
              </div>
            </div>

            {/* Rendered Diff */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto min-h-36 max-h-[400px]">
              {diffResult.length === 0 ? (
                <span className="text-slate-400 italic">İki metin arasında hiçbir fark bulunamadı.</span>
              ) : (
                diffResult.map((part, index) => {
                  if (part.added) {
                    return (
                      <ins 
                        key={index} 
                        className="bg-emerald-100/90 text-emerald-950 no-underline px-1 py-0.5 rounded font-semibold border-b border-emerald-300 mx-0.5"
                      >
                        {part.value}
                      </ins>
                    );
                  }
                  if (part.removed) {
                    return (
                      <del 
                        key={index} 
                        className="bg-rose-100/90 text-rose-950 line-through px-1 py-0.5 rounded border-b border-rose-300 mx-0.5"
                      >
                        {part.value}
                      </del>
                    );
                  }
                  return <span key={index} className="text-slate-700">{part.value}</span>;
                })
              )}
            </div>
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="Belge Metin Karşılaştırıcı"
        description="EvrakFix Belge Metin Karşılaştırıcı (Text Diff Checker) aracımız, iki farklı metin belgesi, sözleşme taslağı veya makale versiyonunu yan yana ve kelime düzeyinde karşılaştırmanızı sağlar. Tamamen tarayıcınızda ve yerel (client-side) çalışan yapısı sayesinde, gizlilik içeren resmi sözleşmeleriniz veya özel metinleriniz hiçbir uzak sunucuya yüklenmez, verileriniz tamamen cihazınızda kalır.

■ Metin Karşılaştırıcı Nedir?
Metin karşılaştırıcı (diff checker), iki metin belgesi arasındaki farkları algılayan ve eklenen kelimeleri yeşil arka planla, silinen kelimeleri ise kırmızı arka plan ve üstü çizili şekilde görsel olarak vurgulayan dijital bir analiz aracıdır.

■ İki Metin Arasındaki Farklar Nasıl Görülür?
EvrakFix karşılaştırma aracına gidin. Sol kutuya orijinal (eski) metni, sağ kutuya ise düzenlenmiş (yeni) metni yapıştırın. 'Metinleri Karşılaştır' butonuna tıkladığınızda kelime düzeyinde tüm değişiklikler saniyeler içinde analiz edilerek vurgulanır.

■ Kelime ve Satır Bazlı Karşılaştırma Farkı Nedir?
- Kelime Bazlı: Cümle içindeki küçük kelime değişikliklerini, eklenen ekleri ve imla düzeltmelerini tespit etmek için idealdir.
- Satır Bazlı: Kod dosyaları, uzun paragraflar veya maddeli sözleşme metinlerindeki komple satır değişikliklerini analiz etmek için daha uygundur.

■ Metin Karşılaştırma Güvenli mi?
Evet, son derece güvenlidir. EvrakFix yerel (client-side) çalışan sunucusuz bir uygulamadır. Girdiğiniz sözleşmeler, kişisel veriler veya kod parçacıkları hiçbir şekilde internetteki uzak bir sunucuya yüklenmez, kaydedilmez. Tüm karşılaştırma algoritmaları doğrudan tarayıcınızın kendi işlem gücüyle yerel olarak çalıştırılır.

■ Mobil Cihazlardan Metin Karşılaştırma Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu tasarımı sayesinde telefon veya tabletlerinizden de ek uygulama indirmeden tarayıcınız üzerinden metinlerinizi kolayca karşılaştırabilmenizi sağlar.

■ EvrakFix Metin Karşılaştırıcının Avantajları
Üyelik, kayıt veya ücret ödemeden limitsiz metin karşılaştırabilirsiniz. Sunucu yüklemesi olmadığı için milisaniyeler içinde anında sonuç verir ve verilerinizin gizliliğini tarayıcı düzeyinde korur."
        exampleUsage="Avukatınızdan veya iş ortağınızdan gelen revize edilmiş yeni bir sözleşme taslağını eski sözleşmeyle karşılaştırarak, araya eklenmiş veya silinmiş olan tüm maddeleri ve kelime değişikliklerini tek bir tıkla tespit edebilirsiniz."
        steps={[
          {
            title: "Metinleri Yapıştırın",
            description: "Eski orijinal metni sol taraftaki alana, düzenlenmiş yeni metni sağ taraftaki alana yapıştırın."
          },
          {
            title: "Karşılaştırma Modunu Seçin",
            description: "Değişikliklerin hassasiyetine göre Kelime Bazlı veya Satır Bazlı karşılaştırma modunu belirleyin."
          },
          {
            title: "Karşılaştırın ve Analiz Edin",
            description: "'Metinleri Karşılaştır' butonuna tıklayarak eklenen ve silinen kısımları renkli panelde anında inceleyin."
          }
        ]}
        faqs={[
          {
            question: "Girdiğim sözleşme ve metinler sunucuya kaydediliyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Metinleriniz hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcısında karşılaştırılır."
          },
          {
            question: "Farklı dillerdeki metinleri karşılaştırabilir miyim?",
            description: "Evet. Aracımız karakter ve kelime bazlı çalıştığı için Türkçe, İngilizce, Almanca veya herhangi bir dilde yazılmış metinleri sorunsuz bir şekilde karşılaştırabilir."
          },
          {
            question: "Karşılaştırma sonucunda kaç karakterin değiştiğini görebilir miyim?",
            description: "Evet. Karşılaştırma işlemi bittiğinde panelin üst kısmında kaç karakterin eklendiği (+) ve kaç karakterin silindiği (-) istatistiksel olarak gösterilir."
          },
          {
            question: "Metin uzunluğu sınırı var mıdır?",
            description: "Hayır, teorik olarak bir sınır yoktur. Ancak binlerce sayfalık çok uzun metinlerde işlem süresi ve tarayıcı performansı cihazınızın donanım gücüne (RAM ve işlemci) bağlıdır."
          },
          {
            question: "Kod dosyalarındaki farkları bulmak için kullanılabilir mi?",
            description: "Evet. HTML, CSS, Javascript veya diğer programlama dillerindeki kod farklarını satır bazlı karşılaştırma modunu seçerek analiz edebilirsiniz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default TextDiffCheckerPage;

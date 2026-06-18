import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Sparkles, Shield, BarChart2, Download, FileText } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { analyzeText, type TextAnalysisResult } from './textAnalyzer.service';

const SAMPLE_TEXT = `EvrakFix, kullanıcıların kişisel belgelerini, sözleşmelerini, faturalarını ve dilekçelerini tamamen yerel düzeyde, yani tarayıcı ortamında güvenle düzenlemesini sağlayan bir yardımcı araçlar paketidir. EvrakFix üzerindeki tüm PDF sıkıştırma, PDF bölme, dilekçe oluşturma ve resim arka planı temizleme araçları istemci tarafında (client-side) çalışır. Bu sayede, hassas dökümanlarınız hiçbir internet sunucusuna yüklenmez, verileriniz üçüncü şahıslara sızmaz ve tamamen güvende kalır. EvrakFix, kullanıcı dostu modern tasarımı, üstün PWA desteği ve yüksek hızlı işlem yeteneğiyle Türkiye'deki en güvenilir evrak yönetim asistanıdır.`;

export const TextAnalyzerPage = () => {
  const [text, setText] = React.useState<string>('');
  const [result, setResult] = React.useState<TextAnalysisResult>(analyzeText(''));
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const res = analyzeText(text);
    setResult(res);
  }, [text]);

  // Render Word Cloud to Canvas
  React.useEffect(() => {
    if (!canvasRef.current || result.keywordDensity.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#1e3a8a', '#2563eb', '#3b82f6', '#0ea5e9', '#06b6d4', '#0d9488', '#0f766e', '#1d4ed8'];

    // Spiral placement algorithm for word cloud
    result.keywordDensity.forEach((item, idx) => {
      // Scale font size based on keyword frequency
      const maxCount = result.keywordDensity[0].count;
      const factor = maxCount > 1 ? item.count / maxCount : 1;
      const fontSize = Math.max(12, Math.min(38, Math.round(12 + factor * 26)));

      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = colors[idx % colors.length];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Golden spiral offsets
      const r = idx * 15;
      const theta = idx * 2.4; 
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);

      ctx.fillText(item.word, x, y);
    });
  }, [result.keywordDensity]);

  const handleDownloadCloud = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `evrakfix_kelime_bulutu_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const steps = [
    {
      title: 'Metninizi Yapıştırın',
      description: 'Analiz etmek istediğiniz makale, sözleşme, ödev veya herhangi bir metni giriş alanına yapıştırın.'
    },
    {
      title: 'İstatistikleri İnceleyin',
      description: 'Kelime, cümle, karakter sayısı ve ortalama okuma süresi gibi temel metin metriklerini anlık olarak görün.'
    },
    {
      title: 'Okunabilirlik Düzeyini Görün',
      description: 'Metninizin Türkçe yasal veya akademik okunabilirlik skorunu (Ateşman İndeksi) inceleyip dil seviyesini analiz edin.'
    },
    {
      title: 'Kelime Bulutunu Kaydedin',
      description: 'En sık kullanılan kelimelerden oluşturulan etkileşimli kelime bulutunu PNG formatında cihazınıza indirin.'
    }
  ];

  const faqs = [
    {
      question: 'Türkçe Ateşman Okunabilirlik İndeksi nedir?',
      answer: 'Ateşman formülü, Türkçe metinlerin okunabilirlik düzeyini kelime ve hece (ünlü harf) uzunluklarına göre ölçen bilimsel bir ölçektir. 100 puana yaklaştıkça metin kolaylaşır (ilkokul seviyesi), 30 puanın altına indikçe zorlaşır (akademik ve hukuki metinler).'
    },
    {
      question: 'Yazdığım metinler internete yükleniyor mu?',
      answer: 'Kesinlikle hayır. EvrakFix tamamen tarayıcı tabanlı çalışır. Analiz ettiğiniz hiçbir yazı veya döküman sunucularımıza gönderilmez, tamamen cihazınızda (client-side) işlenir.'
    },
    {
      question: 'Kelime Bulutunda neden "ve", "veya" gibi kelimeler yok?',
      answer: 'Metin Analizörü aracı, Türkçe dilindeki bağlaçları ve edatları (ve, veya, ama, ile, gibi, bu vb.) "stopword" (etkisiz kelimeler) olarak filtreler. Böylece kelime bulutu metninizin gerçek konusunu yansıtır.'
    },
    {
      question: 'Okuma süresi nasıl hesaplanıyor?',
      answer: 'Yetişkin bir insanın Türkçe metinleri ortalama dakikada 180 kelime hızla okuduğu kabul edilerek toplam kelime sayısının bu orana bölünmesiyle tahmini okuma süresi belirlenir.'
    }
  ];

  const seoDescription = `Metinlerinizin kelime sayısını, karakter yoğunluğunu, Türkçe Ateşman okunabilirlik düzeyini analiz edin. En sık geçen anahtar kelimelerden yerel kelime bulutu (Word Cloud) oluşturup PNG olarak indirin.`;
  const exampleUsage = `Yazdığınız bir blog yazısının veya makalenin SEO uyumluluğunu ölçmek için metni yapıştırıp hangi anahtar kelimelerin en yoğun kullanıldığını görebilir, dil seviyesinin okuyucu kitlenize uygun olup olmadığını Ateşman skoruyla test edebilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Metin Analizörü & Kelime Bulutu</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Yazılarınızın kelime, karakter, cümle yoğunluklarını ve Türkçe okunabilirlik düzeyini hesaplayın; kelime bulutu grafikleri üretin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Yapıştırdığınız metinler hiçbir uzak sunucuya gönderilmez. Analiz tarayıcınızda yapılır.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Input Textarea */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          <Card className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-blue-600" />
                <span>Analiz Edilecek Metin</span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setText(SAMPLE_TEXT)}
                  className="text-xs font-semibold text-blue-650 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Örnek Ekle
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setText('')}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Temizle
                </button>
              </div>
            </div>

            <textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Metninizi buraya yazın veya yapıştırın..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-850 text-sm leading-relaxed transition-all"
            />
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Kelime Sayısı', value: result.wordCount },
              { title: 'Karakter (Boşluklu)', value: result.charWithSpaces },
              { title: 'Karakter (Boşluksuz)', value: result.charNoSpaces },
              { title: 'Tahmini Okuma', value: `${result.readingTimeMinutes} dk` }
            ].map((stat, idx) => (
              <Card key={idx} className="p-4 flex flex-col gap-1 items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <span className="text-base font-black text-slate-800">{stat.value}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side: Analysis Results & Word Cloud */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          {/* Readability Score */}
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <span>Okunabilirlik Analizi</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center font-black text-xl w-16 h-16 shrink-0 border border-blue-100">
                {result.readabilityScore}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ateşman İndeksi</span>
                <span className="text-sm font-bold text-slate-800">{result.readabilityLevel}</span>
              </div>
            </div>

            {/* Readability bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${result.readabilityScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              * Ateşman skoru 100'e yaklaştıkça metin kolaylaşır (ilkokul düzeyine yaklaşır). Sıfıra yaklaştıkça akademik ve hukuki dile kayar.
            </p>
          </Card>

          {/* Word Cloud Canvas */}
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="h-4.5 w-4.5 text-blue-600" />
                <span>Kelime Bulutu</span>
              </span>
              {result.keywordDensity.length > 0 && (
                <button
                  onClick={handleDownloadCloud}
                  className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Görseli İndir"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </h3>

            <div className="flex items-center justify-center bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden p-2 relative">
              <canvas
                ref={canvasRef}
                width={380}
                height={260}
                className="w-full h-auto aspect-[380/260] rounded-xl"
              />
              {result.keywordDensity.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-semibold bg-slate-50/90">
                  Metin girildiğinde kelime bulutu çizilir.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* SEO Section */}
      <ToolSEOInfo
        toolName="Metin Analizörü & Kelime Bulutu"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

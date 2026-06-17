import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Shield, Percent, Calendar, Calculator, Sparkles } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { calculateInterest, type CalculationResult } from './interestCalculator.service';
import { openSecurityModal } from '../../lib/utils/security';

export const InterestCalculatorPage = () => {
  const [principal, setPrincipal] = React.useState<number>(10000);
  const [startDate, setStartDate] = React.useState<string>('2024-01-01');
  const [endDate, setEndDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [interestType, setInterestType] = React.useState<'yasal' | 'ticari' | 'custom'>('yasal');
  const [customRate, setCustomRate] = React.useState<number>(12);
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Trigger calculation when inputs change
  React.useEffect(() => {
    try {
      setError(null);
      if (principal <= 0) {
        setResult(null);
        return;
      }
      const res = calculateInterest(
        principal,
        startDate,
        endDate,
        interestType,
        interestType === 'custom' ? customRate : undefined
      );
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Hesaplama yapılırken bir hata oluştu.');
      setResult(null);
    }
  }, [principal, startDate, endDate, interestType, customRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const steps = [
    {
      title: 'Tutar ve Tarihleri Girin',
      description: 'Hesaplanacak asıl alacak tutarını (Ana para) yazın. Faiz başlangıç (Vade) ve faiz bitiş tarihlerini takvimden seçin.'
    },
    {
      title: 'Faiz Türünü Belirleyin',
      description: 'Yasal Faiz (adi işlerde geçerli), Temerrüt/Ticari Faiz (ticari alacaklarda geçerli) veya kendi Özel faiz oranınızı seçin.'
    },
    {
      title: 'Dönemsel Raporu İnceleyin',
      description: 'Faiz oranlarının değiştiği dönemlere göre gün gün hesaplanan detaylı döküm tablosunu ve toplam tutarı anında alın.'
    }
  ];

  const faqs = [
    {
      question: 'Yasal faiz oranı nedir?',
      answer: 'Türkiye\'de yasal faiz oranı adi işlerde borçlar kanunu çerçevesinde uygulanan faizdir. 2006\'dan Haziran 2024\'e kadar yıllık %9 olarak uygulanmış, 1 Haziran 2024 itibarıyla ise yıllık %24\'e yükseltilmiştir.'
    },
    {
      question: 'Ticari faiz (avans faizi) nedir?',
      answer: 'Ticari faiz, ticari işlerde veya ticari fatura borcu temerrüdünde uygulanan faiz oranıdır. Merkez Bankası\'nın belirlediği reeskont/avans faiz oranlarına göre güncellenir. 21 Mayıs 2024 itibarıyla ticari faiz oranı yıllık %48 olarak uygulanmaktadır.'
    },
    {
      question: 'Dönemsel faiz değişimi nasıl hesaplanıyor?',
      answer: 'EvrakFix, girdiğiniz başlangıç ve bitiş tarihleri arasında geçen tüm günleri tek tek tarar. Hangi tarihlerde yasal veya ticari faiz oranlarının değiştiğini belirler ve her bir oran dönemi için faizi ayrı ayrı hesaplayarak toplar.'
    },
    {
      question: 'Finansal verilerim sunucularınıza iletiliyor mu?',
      answer: 'Hayır. EvrakFix bünyesindeki tüm araçlar gibi Faiz Hesaplama da tamamen tarayıcınızın JavaScript motorunda yerel olarak çalıştırılır. Dosya yüklenmez, veritabanı kullanılmaz.'
    }
  ];

  const seoDescription = `Yasal faiz, ticari temerrüt faizi ve avans faizi hesaplama işlemlerinizi gün bazında dönemsel değişimlerle birlikte cihazınızda güvenle yapın. Tarih aralıklarındaki faiz oranı güncellemelerini otomatik algılayan faiz hesaplama aracı.`;

  const exampleUsage = `Bir borçlunuzdan 10.000 TL alacağınız var ve vade tarihi 15 Ocak 2024. Borçlu ödemeyi 15 Haziran 2024'te yaptı. Borçlu ticari bir işletme olmadığı için Yasal Faiz uygulanacaktır. Başlangıç tarihine 15.01.2024, bitişe 15.06.2024 yazıp Yasal Faiz seçtiğinizde; faiz oranının %9 olduğu dönem ve 1 Haziran sonrası %24 olduğu dönem sistem tarafından otomatik bölünerek, toplam 152 günlük yasal faiz ve toplam tahsil edilecek tutar kuruşu kuruşuna listelenir.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Gecikme Faizi ve Yasal Faiz Hesaplayıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Tarihsel yasal ve ticari faiz oranları değişimlerini otomatik hesaba katarak faiz raporunuzu cihazınızda çıkarın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm faiz dökümü yerel tarayıcınızda hesaplanır. Verileriniz hiçbir şekilde sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left - Params */}
        <Card className="p-6 md:p-8 lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Hesaplama Parametreleri</span>
          </h2>

          <div className="flex flex-col gap-4">
            {/* Principal */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="interest-principal" className="text-xs font-bold text-slate-650">Ana Para Tutarı (TL)</label>
              <input
                id="interest-principal"
                type="number"
                min="0"
                step="0.01"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
              />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-start" className="text-xs font-bold text-slate-650">Başlangıç Tarihi</label>
                <input
                  id="interest-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition-all bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-end" className="text-xs font-bold text-slate-650">Bitiş Tarihi</label>
                <input
                  id="interest-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition-all bg-white"
                />
              </div>
            </div>

            {/* Interest Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650">Faiz Oranı Türü</label>
              <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="interestType"
                    checked={interestType === 'yasal'}
                    onChange={() => setInterestType('yasal')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Yasal Faiz (Yıllık %9 / %24)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="interestType"
                    checked={interestType === 'ticari'}
                    onChange={() => setInterestType('ticari')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ticari Temerrüt Faizi (Yıllık %48)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="interestType"
                    checked={interestType === 'custom'}
                    onChange={() => setInterestType('custom')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Özel Faiz Oranı (%)</span>
                </label>
              </div>
            </div>

            {/* Custom Rate Input */}
            {interestType === 'custom' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-custom-rate" className="text-xs font-bold text-slate-650">Özel Yıllık Oran (%)</label>
                <input
                  id="interest-custom-rate"
                  type="number"
                  min="0"
                  max="500"
                  step="0.1"
                  value={customRate}
                  onChange={(e) => setCustomRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Right - Results & Period Table */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {error && (
            <Alert variant="error" icon={<Percent className="h-5 w-5" />}>
              {error}
            </Alert>
          )}

          {result && (
            <>
              {/* Summary Block */}
              <Card className="bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                <h3 className="text-md font-bold text-slate-100 border-b border-white/10 pb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span>Hesaplama Sonucu</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-light text-slate-350">
                  <div className="flex flex-col gap-1">
                    <span>Toplam Gün:</span>
                    <span className="font-bold text-white text-base">{result.totalDays} Gün</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span>Uygulanan Oranlar:</span>
                    <span className="font-bold text-white text-sm">
                      {interestType === 'yasal' ? 'Yasal Değişken' : interestType === 'ticari' ? 'Ticari Değişken' : `%${customRate} Sabit`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <span>Faiz Tutarı:</span>
                    <span className="font-bold text-emerald-400 text-lg">+{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right mt-2">
                    <span>Toplam Ödenecek:</span>
                    <span className="font-black text-blue-400 text-xl">
                      {formatCurrency(result.totalAmount)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Period table breakdown */}
              <Card className="p-6 md:p-8 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Dönemsel Faiz Dökümü</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-2.5 font-bold">Dönem Aralığı</th>
                        <th className="py-2.5 font-bold text-center">Yıllık Oran</th>
                        <th className="py-2.5 font-bold text-center">Gün</th>
                        <th className="py-2.5 font-bold text-right">Dönem Faizi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {result.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 font-semibold text-slate-800">
                            {row.periodStart} - {row.periodEnd}
                          </td>
                          <td className="py-3 text-center font-bold text-slate-650">%{row.rate}</td>
                          <td className="py-3 text-center">{row.days} Gün</td>
                          <td className="py-3 text-right font-bold text-emerald-600">{formatCurrency(row.interest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      <ToolSEOInfo
        toolName="Gecikme Faizi ve Yasal Faiz Hesaplayıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

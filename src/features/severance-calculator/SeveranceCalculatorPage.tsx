import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Scale, Shield, Calculator, Download, Calendar, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { calculateSeverancePay, generateSeveranceReportPdf, type SeveranceCalculationResult } from './severanceCalculator.service';

export const SeveranceCalculatorPage = () => {
  const [startDate, setStartDate] = React.useState<string>('2023-01-01');
  const [endDate, setEndDate] = React.useState<string>('2026-01-01');
  const [grossSalary, setGrossSalary] = React.useState<number>(30000);
  const [socialBenefits, setSocialBenefits] = React.useState<number>(5000);
  const [severanceCeiling, setSeveranceCeiling] = React.useState<number>(41828.42);
  const [noticePayAction, setNoticePayAction] = React.useState<'paid' | 'worked' | 'none'>('paid');
  
  const [result, setResult] = React.useState<SeveranceCalculationResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState<boolean>(false);

  // Perform calculation automatically when inputs change
  React.useEffect(() => {
    if (startDate && endDate && grossSalary >= 0 && socialBenefits >= 0 && severanceCeiling >= 0) {
      const res = calculateSeverancePay({
        startDate,
        endDate,
        grossSalary,
        socialBenefits,
        noticePayAction,
        severanceCeiling
      });
      setResult(res);
    } else {
      setResult(null);
    }
  }, [startDate, endDate, grossSalary, socialBenefits, noticePayAction, severanceCeiling]);

  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsGeneratingPdf(true);
    try {
      const blob = await generateSeveranceReportPdf(
        { startDate, endDate, grossSalary, socialBenefits, noticePayAction, severanceCeiling },
        result
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tazminat_hesap_raporu_${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(val);
  };

  const steps = [
    {
      title: 'Çalışma Tarihlerini Girin',
      description: 'İşçinin tam işe başlama tarihini ve iş sözleşmesinin sona erdiği tarihi (çıkış tarihi) gün/ay/yıl olarak seçin.'
    },
    {
      title: 'Maaş ve Ek Hakları Belirleyin',
      description: 'Brüt temel aylık maaş miktarını girin. Varsa yol, yemek, ikramiye, prim gibi ek brüt sosyal yardımları da ekleyerek giydirilmiş brüt ücreti hesaplatın.'
    },
    {
      title: 'İhbar ve Tavan Limitlerini Seçin',
      description: 'İhbar tazminatı ödenip ödenmeyeceğini seçin. Güncel kıdem tazminatı tavan sınırını kontrol edip gerekirse güncelleyin.'
    },
    {
      title: 'Hesap Raporunu Alın ve İndirin',
      description: 'Net tazminat hakedişinizi, vergi kesintileriyle birlikte anında görün ve isterseniz PDF raporu olarak bilgisayarınıza veya telefonunuza indirin.'
    }
  ];

  const faqs = [
    {
      question: 'Kıdem tazminatı alabilmek için asgari çalışma süresi nedir?',
      answer: 'Bir çalışanın kıdem tazminatına hak kazanabilmesi için aynı işverene bağlı işyerinde en az 1 tam yıl (365 gün) çalışmış olması gerekmektedir. 1 yıldan az çalışanlara kıdem tazminatı ödenmez.'
    },
    {
      question: 'Kıdem tazminatı tavan sınırı nedir?',
      answer: 'Kıdem tazminatı tavanı, işçinin giydirilmiş brüt maaşı ne kadar yüksek olursa olsun, 1 yıllık çalışma karşılığında alabileceği maksimum brüt tazminat tutarıdır. Bu tavan devlet tarafından yılda iki kez (Ocak ve Temmuz aylarında) memur maaş katsayısına paralel olarak güncellenir.'
    },
    {
      question: 'İhbar tazminatı nedir ve ihbar süreleri nasıl belirlenir?',
      answer: 'İş sözleşmesini feshetmek isteyen tarafın, bunu belirli bir süre önce karşı tarafa bildirmesi gerekir. Bildirim yapılmaksızın işten çıkarma yapıldığında ihbar tazminatı ödenir. Süreler çalışma süresine göre değişir: 6 aydan az kıdem için 2 hafta, 6 ay-1.5 yıl arası için 4 hafta, 1.5-3 yıl arası için 6 hafta, 3 yıldan fazla kıdem için 8 hafta.'
    },
    {
      question: 'Tazminat ödemelerinden hangi yasal kesintiler yapılır?',
      answer: 'Kıdem tazminatı gelir vergisinden muaftır, bu ödemeden yalnızca %0.759 (binde 7.59) oranında damga vergisi kesilir. İhbar tazminatı ise hem %15 oranında gelir vergisine hem de %0.759 oranında damga vergisine tabidir.'
    },
    {
      question: 'Verilerim güvende mi? Sunucularınıza kaydediliyor mu?',
      answer: 'Evet, EvrakFix\'in gizlilik politikası gereği girdiğiniz maaş, tarih ve finansal hiçbir bilgi sunuculara yüklenmez. Tüm hesaplamalar ve PDF raporunun oluşturulması tarayıcınızda (client-side) yerel olarak yapılır.'
    }
  ];

  const seoDescription = `Kıdem ve ihbar tazminatınızı en son yasal parametrelere, güncel kıdem tavanına ve damga/gelir vergisi kesintilerine göre tarayıcı düzeyinde güvenle hesaplayın. A4 formatında PDF raporu indirin.`;
  const exampleUsage = `İşten çıkarılan ve 3 yıl 2 ay kıdemi olan, brüt 35.000 TL maaş ve 5.000 TL sosyal yardımı bulunan bir çalışanın tazminat raporunu çıkarmak istiyorsunuz. İşe giriş/çıkış tarihlerini yazıp, sosyal yardımları eklediğinizde sistem toplam kıdem gününü, tavan sınırı aşımını kontrol ederek net kıdem ve ihbar tazminatını anında hesaplar ve çıktı PDF'ini hazırlar.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Kıdem ve İhbar Tazminatı Hesaplayıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Çalışanların hak ettiği tazminat miktarlarını yasal vergi ve tavan kesintileriyle birlikte tarayıcınızda güvenle hesaplayın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm finansal verileriniz ve tarih girdileriniz yerel tarayıcınızda işlenir. İnternete asla sızmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Inputs */}
        <Card className="p-6 md:p-8 lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Hesaplama Parametreleri</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start-date" className="text-xs font-bold text-slate-650 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>İşe Başlama Tarihi</span>
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end-date" className="text-xs font-bold text-slate-650 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>İşten Ayrılış Tarihi</span>
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Gross Base Salary */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gross-salary" className="text-xs font-bold text-slate-650">Brüt Temel Maaş (Aylık/TL)</label>
              <input
                id="gross-salary"
                type="number"
                min="0"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
              />
            </div>

            {/* Social Benefits */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="social-benefits" className="text-xs font-bold text-slate-650">Ek Brüt Sosyal Yardımlar (Yol/Yemek vb.)</label>
              <input
                id="social-benefits"
                type="number"
                min="0"
                value={socialBenefits}
                onChange={(e) => setSocialBenefits(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
              />
            </div>

            {/* Severance Ceiling */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="severance-ceiling" className="text-xs font-bold text-slate-650">Kıdem Tazminatı Tavanı (TL/Yıl)</label>
              <input
                id="severance-ceiling"
                type="number"
                min="0"
                value={severanceCeiling}
                onChange={(e) => setSeveranceCeiling(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
              />
            </div>

            {/* Notice Pay Option */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="notice-pay-option" className="text-xs font-bold text-slate-650">İhbar Tazminatı Durumu</label>
              <select
                id="notice-pay-option"
                value={noticePayAction}
                onChange={(e) => setNoticePayAction(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
              >
                <option value="paid">İhbar Tazminatı Ödensin (Bildirimsiz Fesih)</option>
                <option value="worked">İhbar Süresi Fiilen Çalışıldı</option>
                <option value="none">İhbar Tazminatı Hesaplanmasın</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Right Side: Results */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {result && (
            <Card className="bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-6 shadow-xl shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-md font-bold flex items-center gap-2 border-b border-white/10 pb-3 text-slate-100">
                <Scale className="h-5 w-5 text-blue-400" />
                <span>Hesaplanan Haklar Dökümü</span>
              </h2>

              <div className="flex flex-col gap-3.5 text-xs font-light text-slate-350">
                <div className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <span>Hizmet Süresi:</span>
                  <span className="font-bold text-white text-right">
                    {result.employmentYears} Yıl, {result.employmentRemainingDays} Gün <br />
                    <span className="text-[10px] text-slate-400 font-normal">({result.employmentDays} Toplam Gün)</span>
                  </span>
                </div>
                
                {/* Severance Payout */}
                <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                  <div className="flex justify-between">
                    <span>Brüt Kıdem Tazminatı:</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(result.grossSeverance)}</span>
                  </div>
                  {result.grossSeverance > 0 && (
                    <div className="flex justify-between text-[11px] text-red-400">
                      <span>Damga Vergisi Kesintisi (%0.759):</span>
                      <span>-{formatCurrency(result.stampTaxSeverance)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-100 text-[13px] pt-1">
                    <span>Net Kıdem Tazminatı:</span>
                    <span className="text-blue-300">{formatCurrency(result.netSeverance)}</span>
                  </div>
                </div>

                {/* Notice Payout */}
                {result.noticeDays > 0 && (
                  <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                    <div className="flex justify-between">
                      <span>Brüt İhbar Tazminatı ({result.noticeDays} Gün):</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(result.grossNotice)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-red-400">
                      <span>Gelir Vergisi Kesintisi (%15):</span>
                      <span>-{formatCurrency(result.incomeTaxNotice)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-red-400">
                      <span>Damga Vergisi Kesintisi (%0.759):</span>
                      <span>-{formatCurrency(result.stampTaxNotice)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-100 text-[13px] pt-1">
                      <span>Net İhbar Tazminatı:</span>
                      <span className="text-blue-300">{formatCurrency(result.netNotice)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-2.5 border-t border-white/10 mt-1">
                  <span className="font-bold text-white text-sm">Toplam Net Payout:</span>
                  <span className="font-black text-emerald-400 text-xl sm:text-2xl">
                    {formatCurrency(result.netTotal)}
                  </span>
                </div>

                {/* Export Button */}
                <Button
                  variant="white"
                  className="w-full text-slate-900 font-bold text-xs py-2.5 bg-white hover:bg-slate-150 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadPdf}
                >
                  {isGeneratingPdf ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />
                  ) : (
                    <Download className="h-4 w-4 text-slate-700" />
                  )}
                  <span>Hesap Raporunu PDF İndir</span>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <ToolSEOInfo
        toolName="Kıdem ve İhbar Tazminatı Hesaplayıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Shield, Calculator, Coins } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const VatInvoiceCalculatorPage = () => {
  const [amount, setAmount] = React.useState<number>(1000);
  const [vatRate, setVatRate] = React.useState<number>(20); // 20% is default in Turkey
  const [isVatIncluded, setIsVatIncluded] = React.useState<boolean>(false); // false: Hariç, true: Dahil
  const [withholdingNumerator, setWithholdingNumerator] = React.useState<number>(0); // e.g. 5 for 5/10
  
  // Calculate values
  let matrah = 0;
  let vatAmount = 0;
  let withholdingAmount = 0;
  let totalAmount = 0;

  if (isVatIncluded) {
    // Amount is VAT Included: matrah = Amount / (1 + vatRate/100)
    matrah = amount / (1 + vatRate / 100);
    vatAmount = amount - matrah;
  } else {
    // Amount is VAT Excluded: matrah = Amount
    matrah = amount;
    vatAmount = (matrah * vatRate) / 100;
  }

  // Calculate withholding (KDV Tevkifarı)
  if (withholdingNumerator > 0) {
    withholdingAmount = (vatAmount * withholdingNumerator) / 10;
  }

  // Total amount payable / invoiced
  if (isVatIncluded) {
    totalAmount = amount - withholdingAmount;
  } else {
    totalAmount = matrah + vatAmount - withholdingAmount;
  }

  // Helper to format currency
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
      title: 'Tutar ve Tür Seçin',
      description: 'Hesaplamak istediğiniz fatura tutarını girin ve bu tutarın KDV Dahil mi yoksa KDV Hariç mi olduğunu belirtin.'
    },
    {
      title: 'KDV ve Tevkifat Belirleyin',
      description: 'Güncel KDV oranını (%20, %10, %1) veya özel bir oran seçin. Varsa KDV Tevkifat oranını (5/10, 9/10 vb.) ekleyin.'
    },
    {
      title: 'Sonuçları Alın',
      description: 'Matrah, KDV Tutarı, Tevkifat Tutarı ve Toplam Tahsil Edilecek Tutar anında hesaplanır.'
    }
  ];

  const faqs = [
    {
      question: 'KDV hesaplama işlemi güvenli mi?',
      answer: 'Hesaplayıcı tamamen yerel tarayıcınızda (client-side) çalışır. Girdiğiniz tutar, oran veya finansal hiçbir bilgi sunucularımıza gönderilmez veya kaydedilmez.'
    },
    {
      question: 'Güncel KDV oranları nelerdir?',
      answer: 'Temmuz 2023 itibarıyla Türkiye\'de genel KDV oranı %20, gıda ve bazı temel ürünler için indirimli KDV oranları %10 ve %1 olarak uygulanmaktadır.'
    },
    {
      question: 'KDV Tevkifatı nedir ve nasıl hesaplanır?',
      answer: 'KDV tevkifatı, devletin alıcıya KDV borcunun bir kısmını satıcıya ödemek yerine doğrudan vergi dairesine yatırma görevi vermesidir. Tevkifat tutarı, toplam KDV tutarının belirlenen paya (örneğin 5/10 oranında yarısına) bölünmesiyle hesaplanır.'
    },
    {
      question: 'KDV Dahil fiyattan KDV Hariç matrah nasıl bulunur?',
      answer: 'KDV Dahil tutarı, (1 + KDV Oranı / 100) değerine bölerek KDV hariç matrahı kolayca bulabilirsiniz. Örneğin %20 KDV dahil 120 TL için: 120 / 1.20 = 100 TL matrahtır.'
    },
    {
      question: 'İnternetim olmadığında bu aracı kullanabilir miyim?',
      answer: 'Evet, EvrakFix tamamen PWA (Progressive Web App) altyapısına sahiptir. Sayfa bir kez yüklendikten sonra internetsiz kalsanız dahi tüm hesaplamaları sorunsuzca yapabilirsiniz.'
    }
  ];

  const seoDescription = `KDV ve fatura hesaplama işlemlerinizi tamamen tarayıcı düzeyinde, güvenli ve ücretsiz gerçekleştirin. KDV Dahil'den Hariç'e veya KDV Hariç'ten Dahil'e dönüştürme yapın; fatura tevkifatı (1/10 - 10/10) oranlarını anında hesaplayın. Finansal verileriniz asla sunuculara gönderilmez.`;

  const exampleUsage = `Bir serbest meslek makbuzu veya ticari fatura keseceksiniz. KDV hariç 5.000 TL hizmet bedeliniz var ve %20 KDV ile 5/10 oranında KDV tevkifatı uygulamanız gerekiyor. Bu araca 5.000 TL yazıp KDV Hariç seçeneğini işaretleyip, %20 KDV ve 5/10 tevkifatı seçtiğinizde; 1.000 TL KDV, 500 TL Tevkifat hesaplanır ve müşterinizden tahsil etmeniz gereken net tutar 5.500 TL olarak anında ekranınızda listelenir.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>KDV ve Fatura Hesaplayıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          KDV dahil/hariç hesaplama, tevkifat kesintileri ve fatura kalem dökümünü cihazınızda yapın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm hesaplamalar yerel olarak tarayıcınızda yapılır. Finansal verileriniz hiçbir sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side - Input Fields */}
        <Card className="p-6 md:p-8 lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Hesaplama Parametreleri</span>
          </h2>

          <div className="flex flex-col gap-4">
            {/* Input Amount */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="calc-amount" className="text-xs font-bold text-slate-650">Tutar (TL)</label>
              <input
                id="calc-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
              />
            </div>

            {/* Included / Excluded Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650">KDV Durumu</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVatIncluded(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !isVatIncluded 
                      ? 'bg-white text-blue-650 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  KDV Hariç
                </button>
                <button
                  type="button"
                  onClick={() => setIsVatIncluded(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isVatIncluded 
                      ? 'bg-white text-blue-650 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  KDV Dahil
                </button>
              </div>
            </div>

            {/* VAT Rate Selectors */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650">KDV Oranı (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 10, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setVatRate(rate)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      vatRate === rate
                        ? 'bg-blue-50 border-blue-200 text-blue-650'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    %{rate}
                  </button>
                ))}
                {/* Custom VAT input button */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Diğer"
                    value={![1, 10, 20].includes(vatRate) ? vatRate : ''}
                    onChange={(e) => setVatRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className={`w-full h-full text-center px-2 py-2 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all ${
                      ![1, 10, 20].includes(vatRate)
                        ? 'bg-blue-50 border-blue-200 text-blue-650'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Withholding Tax (KDV Tevkifatı) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650">KDV Tevkifatı (Varsa)</label>
              <select
                value={withholdingNumerator}
                onChange={(e) => setWithholdingNumerator(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all bg-white"
              >
                <option value={0}>Tevkifat Uygulanmasın (0/10)</option>
                <option value={1}>1/10 Oranında Tevkifat</option>
                <option value={2}>2/10 Oranında Tevkifat</option>
                <option value={3}>3/10 Oranında Tevkifat</option>
                <option value={4}>4/10 Oranında Tevkifat</option>
                <option value={5}>5/10 Oranında Tevkifat (Yarı Yarıya)</option>
                <option value={7}>7/10 Oranında Tevkifat</option>
                <option value={9}>9/10 Oranında Tevkifat</option>
                <option value={10}>10/10 Oranında Tevkifat (Tamamı)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Right Side - Invoice Details & Results */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-6 shadow-xl shadow-slate-900/10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-md font-bold flex items-center gap-2 border-b border-white/10 pb-3 text-slate-100">
              <Coins className="h-5 w-5 text-blue-400" />
              <span>Fatura Özeti (TL)</span>
            </h2>

            <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
              <div className="flex justify-between items-center">
                <span>Matrah (KDV Hariç Tutar):</span>
                <span className="font-bold text-white text-base">{formatCurrency(matrah)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>KDV Tutarı (%{vatRate}):</span>
                <span className="font-bold text-white text-base">+{formatCurrency(vatAmount)}</span>
              </div>

              {withholdingNumerator > 0 && (
                <div className="flex justify-between items-center bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 text-red-300">
                  <span>Tevkifat Tutarı ({withholdingNumerator}/10):</span>
                  <span className="font-bold">-{formatCurrency(withholdingAmount)}</span>
                </div>
              )}

              <hr className="border-white/10 my-1" />

              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-white">Toplam Fatura Tutarı:</span>
                <span className="font-black text-blue-400 text-xl sm:text-2xl">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2.5 mt-2">
              <Button
                variant="white"
                className="w-full text-slate-900 font-bold text-xs py-2 bg-white hover:bg-slate-100 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Matrah: ${formatCurrency(matrah)}\nKDV (%${vatRate}): ${formatCurrency(vatAmount)}\nTevkifat: ${formatCurrency(withholdingAmount)}\nToplam: ${formatCurrency(totalAmount)}`
                  );
                  alert('Fatura özeti kopyalandı.');
                }}
              >
                Sonuçları Kopyala
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="KDV ve Fatura Hesaplayıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

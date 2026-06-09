import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { csvToJson, jsonToCsv, csvToXml, jsonToXml, xmlToJson, xmlToCsv } from './csvJsonXmlConverter.service';
import { Shield, AlertCircle, Download, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

type FormatType = 'csv' | 'json' | 'xml';

export const CsvJsonXmlConverterPage = () => {
  const [inputText, setInputText] = React.useState('');
  const [outputText, setOutputText] = React.useState('');
  const [inputFormat, setInputFormat] = React.useState<FormatType>('csv');
  const [outputFormat, setOutputFormat] = React.useState<FormatType>('json');
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  // File loading
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'csv') setInputFormat('csv');
    else if (extension === 'json') setInputFormat('json');
    else if (extension === 'xml') setInputFormat('xml');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInputText(event.target.result as string);
        setError(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConvert = () => {
    setError(null);
    setOutputText('');

    const text = inputText.trim();
    if (!text) {
      setError('Lütfen dönüştürülecek bir veri girin veya dosya yükleyin.');
      return;
    }

    if (inputFormat === outputFormat) {
      setOutputText(text);
      return;
    }

    try {
      let result = '';
      if (inputFormat === 'csv') {
        if (outputFormat === 'json') result = csvToJson(text);
        else if (outputFormat === 'xml') result = csvToXml(text);
      } else if (inputFormat === 'json') {
        if (outputFormat === 'csv') result = jsonToCsv(text);
        else if (outputFormat === 'xml') result = jsonToXml(text);
      } else if (inputFormat === 'xml') {
        if (outputFormat === 'json') result = xmlToJson(text);
        else if (outputFormat === 'csv') result = xmlToCsv(text);
      }
      setOutputText(result);
    } catch (err: any) {
      console.error(err);
      setError(
        `Dönüştürme başarısız oldu. Girdi formatının '${inputFormat.toUpperCase()}' standartlarına tam uyduğundan emin olun. Hata: ${err.message}`
      );
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `donusum.${outputFormat}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          CSV JSON XML Dönüştürücü
        </h1>
        <p className="text-slate-500 text-sm">
          Tablo veya veri formatındaki CSV, JSON ve XML belgelerinizi tarayıcı ortamında birbirine dönüştürün.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Verileriniz tamamen tarayıcınızda işlenir. Girdiğiniz metinler hiçbir uzak sunucuya aktarılmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Workspace */}
      <Card className="p-6 md:p-8 flex flex-col gap-6">
        {/* Format selectors & File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600">Girdi Formatı</label>
            <Select
              value={inputFormat}
              onChange={(e: any) => setInputFormat(e.target.value as FormatType)}
              options={[
                { value: 'csv', label: 'CSV (Virgülle Ayrılmış)' },
                { value: 'json', label: 'JSON (Veri Ağacı)' },
                { value: 'xml', label: 'XML (İşaretleme Dili)' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600">Çıktı Formatı</label>
            <Select
              value={outputFormat}
              onChange={(e: any) => setOutputFormat(e.target.value as FormatType)}
              options={[
                { value: 'json', label: 'JSON (Veri Ağacı)' },
                { value: 'csv', label: 'CSV (Virgülle Ayrılmış)' },
                { value: 'xml', label: 'XML (İşaretleme Dili)' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600">Veya Dosya Yükle</label>
            <div className="relative w-full h-11 border border-slate-200 bg-white rounded-xl flex items-center px-3 cursor-pointer hover:border-blue-500 transition-all">
              <input
                type="file"
                accept=".csv,.json,.xml"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <span className="text-xs text-slate-500 font-bold truncate">Dosya Seç (.csv, .json, .xml)</span>
            </div>
          </div>
        </div>

        {/* Input/Output editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input editor */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-650">Girdi Verisi ({inputFormat.toUpperCase()})</label>
              <button
                onClick={handleClear}
                className="text-xs text-slate-450 hover:text-red-650 font-bold cursor-pointer"
              >
                Temizle
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Lütfen buraya ${inputFormat.toUpperCase()} formatındaki verinizi yapıştırın...`}
              className="w-full h-72 p-4 bg-white border border-slate-200 rounded-2xl font-mono text-xs leading-relaxed text-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Output editor */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-650">Dönüşüm Çıktısı ({outputFormat.toUpperCase()})</label>
              {outputText && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    İndir
                  </button>
                </div>
              )}
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Dönüştürülen veriler burada görüntülenecektir..."
              className="w-full h-72 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs leading-relaxed text-slate-700 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Convert trigger */}
        <Button
          variant="primary"
          onClick={handleConvert}
          className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-11 flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Veriyi Dönüştür
        </Button>

        {/* Error message */}
        {error && (
          <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
            {error}
          </Alert>
        )}
      </Card>

      {/* SEO Content */}
      <ToolSEOInfo
        toolName="CSV JSON XML Dönüştürücü"
        description="EvrakFix CSV JSON XML Dönüştürücü, veri tabloları ve veri ağacı yapılarını tarayıcınızda saniyeler içinde birbirine dönüştürmenizi sağlar. Excel veya veritabanı çıktısı olan CSV dosyalarını JSON veya XML kod şemalarına, ya da XML e-fatura taslaklarını kopyalanabilir CSV tablolarına çevirmek için idealdir. Tamamen sunucusuz (client-side) çalışan bu araç sayesinde girdiğiniz hiçbir ticari veri, muhasebe tablosu veya finansal kod uzak sunuculara yüklenmez.

■ CSV JSON XML Dönüştürücü Nedir?
CSV, JSON ve XML veri formatları arasında hızlı çeviriler gerçekleştiren dijital bir araçtır:
- CSV (Comma Separated Values): Tablo verileri ve Excel için ideal basitleştirilmiş format.
- JSON (JavaScript Object Notation): Modern web API'leri için standart ağaç veri formatı.
- XML (eXtensible Markup Language): Resmi dökümanlar ve e-faturalar için etiket tabanlı format.

■ CSV Dosyası JSON’a Nasıl Dönüştürülür?
CSV metninizi sol kutuya yapıştırın veya dosya yükleme alanından seçin. Format seçim panellerinde girdi olarak CSV, çıktı olarak JSON işaretleyip 'Dönüştür' tuşuna basın. Saniyeler içinde çıktı kutusunda JSON kodunu elde edeceksiniz.

■ XML Fatura Verisi CSV Yapılabilir mi?
Evet. UBL-TR standardına uygun e-fatura XML verilerini yapıştırıp çıktı olarak CSV'yi seçtiğinizde, sistem otomatik olarak hiyerarşik etiketleri analiz eder ve tablo şeklinde düzleştirip Excel'de açabileceğiniz bir CSV çıktısı oluşturur.

■ Dönüşüm İşlemi Güvenli mi?
Evet, tamamen yerel ve güvenlidir. EvrakFix sunucusuz çalışır. Yapıştırdığınız veya yüklediğiniz hiçbir veri internetteki uzak bir sunucuya aktarılmaz, izlenmez ve kaydedilmez. Tüm dönüşüm algoritmaları tarayıcınızın kendi işlem gücüyle yerel olarak sonlanır."
        exampleUsage="Excel'den kopyaladığınız bir müşteri listesini yazılım ekibinizin kullanabilmesi için saniyeler içinde JSON dizisine çevirebilir, ya da bir web sisteminden aldığınız JSON verilerini CSV'ye dönüştürüp Excel tablosu olarak açabilirsiniz."
        steps={[
          {
            title: "Girdi Verinizi Yükleyin",
            description: "Dönüştürmek istediğiniz CSV, JSON veya XML metnini yapıştırın ya da dosya olarak sisteme yükleyin."
          },
          {
            title: "Dönüşüm Yönünü Seçin",
            description: "Girdi ve çıktı formatını seçin. Sistem dosya yüklendiğinde uzantıya göre girdiyi otomatik algılar."
          },
          {
            title: "Dönüştürün ve Alın",
            description: "'Veriyi Dönüştür' butonuna basarak dönüşümü başlatın, çıktıyı kopyalayın veya dosya olarak indirin."
          }
        ]}
        faqs={[
          {
            question: "Girdiğim veriler sunucuya gönderiliyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Verileriniz hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde dönüştürülür."
          },
          {
            question: "Bozuk veya eksik CSV dosyaları hata verir mi?",
            description: "Dönüştürücü motorumuz basit yazım hatalarını tolere edecek şekilde tasarlanmıştır. Ancak başlık satırı (header) bulunmayan veya düzensiz virgül kullanan dosyalarda sütun eşleşmesi hatalı olabilir."
          },
          {
            question: "Büyük boyutlu veritabanı çıktıları dönüştürülebilir mi?",
            description: "Evet. Birkaç megabayta kadar olan büyük veri setleri tarayıcıda işlenebilir. Ancak işlem hızı tamamen bilgisayarınızın donanım performansına (RAM ve işlemci) bağlıdır."
          },
          {
            question: "XML şemalarında iç içe geçmiş etiketler nasıl CSV olur?",
            description: "Sistem, XML ağacını düzleştirme (flatten) algoritması kullanarak tüm iç içe etiketleri `parent_child` yapısında başlıklar halinde sütunlara döker, böylece veri kaybı olmadan tabloya aktarılır."
          },
          {
            question: "Bu araç tamamen ücretsiz midir?",
            description: "Evet. Herhangi bir kullanım sınırı, kota veya ücretlendirme bulunmamaktadır."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

export default CsvJsonXmlConverterPage;

import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { FolderOpen, Shield, RefreshCw, AlertCircle, FileArchive, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { generateNewName, packageRenamedFilesToZip, type RenamerOptions } from './bulkRenamer.service';

export const BulkRenamerPage = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [options, setOptions] = React.useState<RenamerOptions>({
    prefix: '',
    suffix: '',
    caseFormat: 'original',
    replaceSpaces: 'none',
    counterStart: 1,
    counterPadding: 3,
    includeCounter: false
  });
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [progressMsg, setProgressMsg] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  // Files selected handler
  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
    setSuccess(false);
  };

  const handleClear = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
  };

  const handleDownloadZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProgressMsg('ZIP derleniyor...');

    try {
      const zipBlob = await packageRenamedFilesToZip(files, options, (msg) => {
        setProgressMsg(msg);
      });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evrakfix_toplu_isimlendirme.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err: any) {
      console.error('ZIP renamer error:', err);
      setError('Dosyalar isimlendirilip ZIP arşivi oluşturulurken teknik bir hata meydana geldi.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const steps = [
    {
      title: 'Dosyalarınızı Yükleyin',
      description: 'Yeniden adlandırmak istediğiniz tüm dökümanları, görselleri veya PDF dosyalarını topluca sürükleyip bırakarak panele ekleyin.'
    },
    {
      title: 'Adlandırma Kurallarını Girin',
      description: 'Dosya isimlerinin önüne (Önek) veya arkasına (Sonek) eklenecek yazıları belirleyin, sayaç numaralandırması ve harf büyüklüklerini yapılandırın.'
    },
    {
      title: 'Canlı Önizleme Yapın',
      description: 'Girdiğiniz her kural sonrasında dökümanların yeni adlarının nasıl görüneceğini listeden anlık olarak kontrol edin.'
    },
    {
      title: 'ZIP Olarak İndirin',
      description: 'Butona tıkladığınızda tüm dosyalar yeni isimleriyle saniyeler içinde paketlenip tek bir ZIP arşivi olarak indirilir.'
    }
  ];

  const faqs = [
    {
      question: 'Hangi dosya türlerini toplu adlandırabilirim?',
      answer: 'Herhangi bir dosya türü sınırlaması yoktur. PDF, PNG, JPG, Word, Excel, TXT ve tüm diğer uzantılara sahip dosyaları topluca sürükleyip kurallara göre yeniden adlandırabilirsiniz.'
    },
    {
      question: 'Dosya isimlerine sayaç (sıralı numara) nasıl eklerim?',
      answer: 'Sayaç Kullan seçeneğini işaretleyerek sıralı sayıları dosya isminin sonuna ekleyebilirsiniz. Başlangıç numarasını (örn. 100) ve basamak sayısını (örn. 3 basamak için 001, 002) özelleştirebilirsiniz.'
    },
    {
      question: 'Dosyalarım ve isimleri bir sunucuya gidiyor mu?',
      answer: 'Hayır, kesinlikle gitmiyor. EvrakFix tamamen tarayıcınızın kendi bellek alanında (client-side) çalışır. Dosyalarınız sunucuya yüklenmediği için gizliliğiniz %100 güvendedir ve işlem internet kotanızı harcamaz.'
    },
    {
      question: 'Çok fazla dosya yüklersem tarayıcı çöker mi?',
      answer: 'Dosya adları ve metadata bilgileri çok az bellek kaplar. Bu nedenle 100+ dosyayı aynı anda tarayıcınızda hiç kasmadan adlandırabilirsiniz. Ancak ZIP oluşturulurken çok büyük dosyaların (GB boyutlarında) paketlenmesi tarayıcı RAM sınırlarına takılabilir, orta ve standart ofis dökümanlarında hiçbir sorun yaşanmaz.'
    }
  ];

  const seoDescription = `Çok sayıda belgenin ismini önek, sonek, sıralı numaralandırma (sayaç) ve harf formatlarıyla tarayıcı düzeyinde toplu olarak değiştirin. Güvenli ve ücretsiz toplu ad değiştirici.`;
  const exampleUsage = `Tarayıp bilgisayara attığınız ve 'scan_001.pdf', 'scan_002.pdf' gibi karmaşık isme sahip faturaları, 'Fatura_Mayis_001.pdf', 'Fatura_Mayis_002.pdf' şeklinde kurumsal bir şablona çevirmek için dosyaları yükleyip öneke 'Fatura_Mayis_' yazarak saniyeler içinde ZIP olarak indirebilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Toplu Dosya Adı Değiştirici</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Çok sayıda dosyanızın ismini önek, sonek, sayaç numaralandırması ve harf kurallarıyla cihazınızda toplu olarak değiştirin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosya isimleri ve içerikleri tamamen cihazınızda işlenir. İnternete asla gönderilmez.</span>
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
        {/* Left Side: Parameters Form */}
        <Card className="p-6 md:p-8 lg:col-span-5 flex flex-col gap-5">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderOpen className="h-5 w-5 text-blue-600" />
            <span>Adlandırma Kuralları</span>
          </h2>

          <div className="flex flex-col gap-4">
            {/* Prefix */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="renamer-prefix" className="text-xs font-bold text-slate-650">Önek (Dosya Adı Başına)</label>
              <input
                id="renamer-prefix"
                type="text"
                value={options.prefix}
                onChange={(e) => setOptions(prev => ({ ...prev, prefix: e.target.value }))}
                placeholder="ornek: Fatura_2026_"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Suffix */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="renamer-suffix" className="text-xs font-bold text-slate-650">Sonek (Dosya Adı Sonuna)</label>
              <input
                id="renamer-suffix"
                type="text"
                value={options.suffix}
                onChange={(e) => setOptions(prev => ({ ...prev, suffix: e.target.value }))}
                placeholder="ornek: _imzali"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Case Formatting */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="renamer-case" className="text-xs font-bold text-slate-650">Harf Biçimi</label>
              <select
                id="renamer-case"
                value={options.caseFormat}
                onChange={(e) => setOptions(prev => ({ ...prev, caseFormat: e.target.value as any }))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
              >
                <option value="original">Orijinal Harf Durumu</option>
                <option value="upper">TÜMÜ BÜYÜK HARF</option>
                <option value="lower">tümü küçük harf</option>
                <option value="title">Baş Harfleri Büyük</option>
              </select>
            </div>

            {/* Space replacement */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="renamer-spaces" className="text-xs font-bold text-slate-650">Boşluk Karakteri Düzeni</label>
              <select
                id="renamer-spaces"
                value={options.replaceSpaces}
                onChange={(e) => setOptions(prev => ({ ...prev, replaceSpaces: e.target.value as any }))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
              >
                <option value="none">Boşlukları Değiştirme</option>
                <option value="hyphen">Boşlukları Tire Yap (-)</option>
                <option value="underscore">Boşlukları Alt Tire Yap (_)</option>
                <option value="remove">Boşlukları Tamamen Sil</option>
              </select>
            </div>

            {/* Counter Section */}
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4 mt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.includeCounter}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeCounter: e.target.checked }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-4 w-4"
                />
                <span>Sıralı Sayaç Ekle</span>
              </label>

              {options.includeCounter && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="renamer-count-start" className="text-[10px] font-bold text-slate-500">Başlangıç Değeri</label>
                    <input
                      id="renamer-count-start"
                      type="number"
                      min="0"
                      value={options.counterStart}
                      onChange={(e) => setOptions(prev => ({ ...prev, counterStart: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="renamer-count-padding" className="text-[10px] font-bold text-slate-500">Basamak Sayısı (Padding)</label>
                    <input
                      id="renamer-count-padding"
                      type="number"
                      min="1"
                      max="10"
                      value={options.counterPadding}
                      onChange={(e) => setOptions(prev => ({ ...prev, counterPadding: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Side: Upload and Preview List */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          {error && (
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}>
              Tüm dosyalar başarıyla adlandırılıp ZIP olarak indirildi.
            </Alert>
          )}

          <Card className="p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Dosya Listesi & Önizleme</h3>
              {files.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs font-bold text-slate-500 hover:text-red-650 transition-colors cursor-pointer"
                >
                  Tümünü Temizle
                </button>
              )}
            </div>

            {files.length === 0 ? (
              <Dropzone
                onFilesSelected={handleFilesSelected}
                accept={{ '*': [] }}
                multiple={true}
                title="Dosyaları buraya sürükleyin veya seçin"
                description="Uzantı kısıtlaması yoktur. İstediğiniz kadar dosya ekleyebilirsiniz."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {/* Scrollable Preview Table */}
                <div className="max-h-[350px] overflow-y-auto border border-slate-150 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-150">
                      <tr>
                        <th className="p-3">Orijinal Dosya Adı</th>
                        <th className="p-3 w-8"></th>
                        <th className="p-3">Yeni Dosya Adı</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {files.map((file, idx) => {
                        const newName = generateNewName(file.name, options, idx);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 truncate max-w-[180px]" title={file.name}>{file.name}</td>
                            <td className="p-3 text-slate-400 text-center"><ArrowRight className="h-3.5 w-3.5" /></td>
                            <td className="p-3 truncate max-w-[200px] font-semibold text-blue-650" title={newName}>{newName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bottom zip trigger */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                  <span className="text-xs font-bold text-slate-400">{files.length} Dosya Yüklendi</span>
                  <Button
                    variant="primary"
                    disabled={isProcessing}
                    onClick={handleDownloadZip}
                    className="bg-blue-600 hover:bg-blue-700 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md py-2.5 px-5"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{progressMsg}</span>
                      </>
                    ) : (
                      <>
                        <FileArchive className="h-4 w-4" />
                        <span>Yeni İsimlerle ZIP İndir</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* SEO Section */}
      <ToolSEOInfo
        toolName="Toplu Dosya Adı Değiştirici"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { FileBadge, Shield, FileText, CheckCircle2, AlertCircle, RefreshCw, Layers, Download } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { processPdfCoverStamp, type CoverStampOptions } from './pdfCoverStamp.service';

export const PdfCoverStampPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [options, setOptions] = React.useState<CoverStampOptions>({
    action: 'cover',
    coverStyle: 'modern',
    title: 'KURUMSAL RAPOR',
    subtitle: 'Evrak Tasnif ve Arşiv Kaydı',
    author: 'EvrakFix Departmanı',
    date: new Date().toISOString().substring(0, 10),
    archiveNo: 'EF-' + Math.floor(100000 + Math.random() * 900000).toString(),
    stampPosition: 'top-right'
  });
  
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [processedBlob, setProcessedBlob] = React.useState<Blob | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(selected);
      setError(null);
      setSuccess(false);
      setProcessedBlob(null);
    } else {
      setError('Lütfen geçerli bir PDF dosyası yükleyin.');
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setProcessedBlob(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProcessedBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const resultBlob = await processPdfCoverStamp(arrayBuffer, options);
      setProcessedBlob(resultBlob);
      setSuccess(true);
    } catch (err: any) {
      console.error('PDF Cover/Stamp processing error:', err);
      setError('PDF damgalanırken teknik bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedBlob || !file) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const label = options.action === 'cover' ? 'kapakli' : 'barkodlu';
    a.download = `${originalName}_${label}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const steps = [
    {
      title: 'PDF Belgenizi Yükleyin',
      description: 'Başına kapak eklemek veya sayfalarına numara/barkod damgalamak istediğiniz PDF dökümanını seçin.'
    },
    {
      title: 'İşlem Türünü ve Bilgileri Girin',
      description: 'Sadece kapak sayfası ekleme (Cover) veya tüm sayfalara damgalama (Stamp) modunu seçip başlık, tarih ve arşiv no girin.'
    },
    {
      title: 'Şablon ve Konumu Özelleştirin',
      description: 'Kapak için Modern, Klasik veya Minimal tasarımlarından birini; damga için sayfa konumu koordinatlarını seçin.'
    },
    {
      title: 'Yeni PDF’inizi İndirin',
      description: 'Belgenizin görsel yapısı, vektör kalitesi ve metin aranabilirliği korunarak hazırlanan yeni dökümanınızı kaydedin.'
    }
  ];

  const faqs = [
    {
      question: 'PDF dosyamın metin kalitesi veya vektör yapısı bozulur mu?',
      answer: 'Hayır. Sayfaları resme çeviren kalitesiz araçların aksine, EvrakFix doğrudan PDF\'in vektörel yapısına müdahale eder. Mevcut yazı katmanları, linkler ve vektörler korunarak sadece kapak ve damga katmanları eklenir.'
    },
    {
      question: 'Arşiv Barkodu gerçekte okunabilir mi?',
      answer: 'Damga ayarını "Sağ Üst - Barkodlu" seçtiğinizde belgelere yerleştirilen barkod çizgileri arşivcilik standartlarını simüle eden vektörel çizimlerdir. Gerçek bir taranabilir barkod cihazı testi için taslaktır.'
    },
    {
      question: 'Dosyam sunucuya yükleniyor mu?',
      answer: 'Hayır. EvrakFix tamamen tarayıcı tabanlı çalışır. Yüklediğiniz PDF dosyaları, girdiğiniz arşiv no ve başlık bilgileri hiçbir uzak sunucuya gönderilmez, gizliliğiniz cihazınızda kalır.'
    },
    {
      question: 'Kapak tasarımlarının farkı nedir?',
      answer: 'Modern şablon; kalın sol bantlı ve kurumsal logoludur. Klasik şablon; çift çerçeveli ve ortalanmış klasik resmi yazı formatındadır. Minimalist ise sade, tek çizgi ve geniş tipografi düzenine sahiptir.'
    }
  ];

  const seoDescription = `PDF belgelerinize tarayıcı düzeyinde kurumsal kapak sayfası ekleyin veya sayfaların üst/alt kısımlarına evrak referans numarası ve arşiv barkodu damgalayın. Güvenli ve ücretsiz PDF arşivleme aracı.`;
  const exampleUsage = `Şirket içi hazırladığınız bir rapor dökümanını arşivlemek istiyorsunuz. Belgeyi yükleyip, departman adını ve benzersiz arşiv takip kodunu yazarak dökümanın başına kurumsal mavi kapak sayfasını ekleyip saniyeler içinde çıktısını alabilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Kapak Ekle & Barkod Damgala</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgelerinizin başına şık kapak sayfaları yerleştirin veya arşiv numarası ve referans barkodları damgalayın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm PDF birleştirme, kapak ekleme ve damgalama işlemleri yerel tarayıcınızda yapılır. Dosyalarınız güvendedir.</span>
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
        <Card className="p-6 md:p-8 lg:col-span-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-slate-850 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileBadge className="h-5 w-5 text-blue-600" />
            <span>Belge Bilgileri & Tasarım</span>
          </h2>

          <div className="flex flex-col gap-4">
            {/* Action selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650">Yapılacak İşlem</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setOptions(prev => ({ ...prev, action: 'cover' }))}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    options.action === 'cover'
                      ? 'bg-white text-blue-655 shadow-sm border border-slate-200/50'
                      : 'text-slate-550 hover:text-slate-700'
                  }`}
                >
                  Kapak Sayfası Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setOptions(prev => ({ ...prev, action: 'stamp' }))}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    options.action === 'stamp'
                      ? 'bg-white text-blue-655 shadow-sm border border-slate-200/50'
                      : 'text-slate-555 hover:text-slate-700'
                  }`}
                >
                  Referans Damgala
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cover-title" className="text-xs font-bold text-slate-650">Belge Başlığı</label>
              <input
                id="cover-title"
                type="text"
                value={options.title}
                onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Örn: 2026 YILI FAALIYET RAPORU"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Subtitle (only for cover) */}
            {options.action === 'cover' && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cover-subtitle" className="text-xs font-bold text-slate-650">Alt Başlık</label>
                <input
                  id="cover-subtitle"
                  type="text"
                  value={options.subtitle}
                  onChange={(e) => setOptions(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Örn: Finans ve Pazarlama Departmanı"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
                />
              </div>
            )}

            {/* Author */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cover-author" className="text-xs font-bold text-slate-650">Hazırlayan Kişi / Departman</label>
              <input
                id="cover-author"
                type="text"
                value={options.author}
                onChange={(e) => setOptions(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Archive / Reference No */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cover-archive" className="text-xs font-bold text-slate-650">Arşiv / Referans No</label>
              <input
                id="cover-archive"
                type="text"
                value={options.archiveNo}
                onChange={(e) => setOptions(prev => ({ ...prev, archiveNo: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-mono transition-all"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cover-date" className="text-xs font-bold text-slate-650">Belge Tarihi</label>
              <input
                id="cover-date"
                type="text"
                value={options.date}
                onChange={(e) => setOptions(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {/* Style selector for Cover / Position selector for Stamp */}
            {options.action === 'cover' ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cover-style-select" className="text-xs font-bold text-slate-650">Kapak Tasarımı Şablonu</label>
                <select
                  id="cover-style-select"
                  value={options.coverStyle}
                  onChange={(e) => setOptions(prev => ({ ...prev, coverStyle: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
                >
                  <option value="modern">Modern (Kurumsal Lacivert Yan Bantlı)</option>
                  <option value="classic">Klasik Çerçeveli (Resmi Belge Görünümü)</option>
                  <option value="minimal">Minimalist (Sade ve Geniş Tipografi)</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="stamp-pos-select" className="text-xs font-bold text-slate-650">Damgalama Sayfa Konumu</label>
                <select
                  id="stamp-pos-select"
                  value={options.stampPosition}
                  onChange={(e) => setOptions(prev => ({ ...prev, stampPosition: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
                >
                  <option value="top-right">Sağ Üst Köşe - Barkodlu & Referanslı</option>
                  <option value="bottom-right">Sağ Alt Köşe - Referans Metni</option>
                  <option value="bottom-center">Orta Alt Köşe - Referans Metni</option>
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Right Side: File Upload & Actions */}
        <div className="lg:col-span-6 flex flex-col gap-4 w-full">
          {error && (
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          )}

          {success && processedBlob && (
            <Card className="p-6 md:p-8 flex flex-col gap-5 border-emerald-100 bg-emerald-50/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Başarılı</span>
                  <h4 className="text-sm font-bold text-slate-800">PDF Hazırlandı!</h4>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-normal">
                PDF dosyanıza kurumsal kapak veya referans numaraları eklendi. Aşağıdaki butondan yeni dosyanızı hemen indirebilirsiniz.
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="w-1/3 border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Yenile
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md py-2.5"
                >
                  <Download className="h-4 w-4" />
                  İşlenmiş PDF'i İndir
                </Button>
              </div>
            </Card>
          )}

          {!processedBlob && (
            <Card className="p-6 md:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-850 text-sm">PDF Dosya Seçimi</h3>
                {file && (
                  <button
                    onClick={handleClear}
                    className="text-xs font-bold text-slate-500 hover:text-red-650 transition-colors cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {!file ? (
                <Dropzone
                  onFilesSelected={handleFilesSelected}
                  accept={{ 'application/pdf': ['.pdf'] }}
                  multiple={false}
                  title="Üzerinde işlem yapılacak PDF dökümanını buraya sürükleyin"
                  description="Sadece tek bir PDF dökümanı yükleyebilirsiniz."
                />
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-blue-50 text-blue-650 rounded-xl shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {((file.size || 0) / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    disabled={isProcessing}
                    onClick={handleProcess}
                    className="bg-blue-600 hover:bg-blue-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md py-2.5 mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>PDF İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4" />
                        <span>Kapak / Damga Ekleme İşlemini Başlat</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <ToolSEOInfo
        toolName="PDF Kapak Ekle & Barkod Damgala"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

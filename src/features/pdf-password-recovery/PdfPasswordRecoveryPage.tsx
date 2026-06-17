import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { PDFDocument } from 'pdf-lib';
import { Shield, Key, AlertCircle, RefreshCw, CheckCircle2, Download, Play } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';

const COMMON_PASSWORDS = [
  '1234', '123456', '0000', '12345678', '1111', '12345', '123456789', 
  'password', 'parola', 'sifre', 'admin', 'user', '123', '987654321',
  '1234567890', '2020', '2021', '2022', '2023', '2024', '2025', '2026'
];

export const PdfPasswordRecoveryPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [customWordlist, setCustomWordlist] = React.useState<string>('');
  const [testedCount, setTestedCount] = React.useState(0);
  const [totalToTest, setTotalToTest] = React.useState(0);
  const [currentGuess, setCurrentGuess] = React.useState('');
  const [recoveredPassword, setRecoveredPassword] = React.useState<string | null>(null);
  const [unlockedBlob, setUnlockedBlob] = React.useState<Blob | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // File selection
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(selected);
      setError(null);
      setRecoveredPassword(null);
      setUnlockedBlob(null);
      setTestedCount(0);
    } else {
      setError('Lütfen geçerli bir PDF dosyası yükleyin.');
    }
  };

  // Run the dictionary attack
  const handleStartRecovery = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setRecoveredPassword(null);
    setUnlockedBlob(null);
    setTestedCount(0);

    // Prepare dictionary list
    const customList = customWordlist
      .split(/[\n,;]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const dictionary = Array.from(new Set([...customList, ...COMMON_PASSWORDS]));
    setTotalToTest(dictionary.length);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // First, check if the PDF is actually password protected
      try {
        await PDFDocument.load(arrayBuffer);
        // It loaded without password! It's not protected.
        setError('Bu PDF dosyası zaten şifre korumalı değil.');
        setIsProcessing(false);
        return;
      } catch (e) {
        // It threw error, meaning it is indeed encrypted. Proceed.
      }

      let foundPassword: string | null = null;
      let decryptedBytes: Uint8Array | null = null;

      // Loop over the password guesses
      for (let i = 0; i < dictionary.length; i++) {
        const pwd = dictionary[i];
        setTestedCount(i + 1);
        setCurrentGuess(pwd);

        // Yield execution to React to update progress UI
        if (i % 5 === 0) {
          await new Promise(r => setTimeout(r, 15));
        }

        try {
          const uint8Array = new Uint8Array(arrayBuffer);
          const decrypted = await decryptPDF(uint8Array, pwd);
          // If no error is thrown, the password is correct!
          foundPassword = pwd;
          decryptedBytes = decrypted;
          break;
        } catch (err) {
          // Wrong password, continue
        }
      }

      if (foundPassword && decryptedBytes) {
        setRecoveredPassword(foundPassword);
        setUnlockedBlob(new Blob([decryptedBytes as any], { type: 'application/pdf' }));
      } else {
        setError('Belirtilen şifre kombinasyonları ile PDF açılamadı. Lütfen tahmin listenize yeni şifreler ekleyip tekrar deneyin.');
      }
    } catch (err: any) {
      console.error('Password recovery error:', err);
      setError('Şifre çözme işlemi sırasında teknik bir hata oluştu.');
    } finally {
      setIsProcessing(false);
      setCurrentGuess('');
    }
  };

  const handleDownload = () => {
    if (!unlockedBlob || !file) return;
    const url = URL.createObjectURL(unlockedBlob);
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${nameWithoutExt}_unlocked.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setRecoveredPassword(null);
    setUnlockedBlob(null);
    setTestedCount(0);
  };

  const steps = [
    {
      title: 'Şifreli PDF’i Yükleyin',
      description: 'Açmak istediğiniz, şifresini unuttuğunuz veya kurtarmak istediğiniz kilitli PDF dökümanını seçin.'
    },
    {
      title: 'Tahmin Listenizi Girin',
      description: 'Eğer şifreye dair hatırladığınız kısımlar varsa (isim, doğum yılı vb.) bunları virgül veya alt alta yazarak listeye ekleyin.'
    },
    {
      title: 'Kırma İşlemini Başlatın',
      description: 'Butona tıkladığınızda şifreler tarayıcı düzeyinde milisaniyeler içinde test edilir. Doğru şifre bulunduğunda PDF kilitleri kaldırılır.'
    }
  ];

  const faqs = [
    {
      question: 'PDF Şifre Kırma aracı nasıl çalışır?',
      answer: 'Araç, verdiğiniz şifre listesini ve sistemdeki en yaygın PDF şifrelerini (123456, 2024 vb.) PDF şifre çözme motorunda (pdf-lib) sırayla dener. Şifre eşleştiğinde belge yüklenir ve şifre koruması kaldırılmış yeni bir kopya oluşturulur.'
    },
    {
      question: 'Dosyam veya şifre listem bir sunucuya yükleniyor mu?',
      answer: 'Hayır. Tüm deneme ve kırma işlemi yerel olarak tarayıcınızın belleğinde (client-side) gerçekleşir. Gizli dökümanınız veya olası şifreleriniz internete asla sızmaz. Güvenle kullanabilirsiniz.'
    },
    {
      question: 'Kendi şifre listemi (Wordlist) nasıl ekleyebilirim?',
      answer: 'Giriş alanına hatırladığınız olası kelimeleri, şifre parçalarını, doğum yıllarınızı veya özel karakterleri aralarına virgül koyarak veya alt alta satırlar halinde yapıştırabilirsiniz.'
    },
    {
      question: 'İşlem sınırı veya ücret var mı?',
      answer: 'Hayır, EvrakFix bünyesindeki tüm araçlar gibi bu araç da tamamen sınırsız ve ücretsizdir.'
    }
  ];

  const seoDescription = `Şifresini unuttuğunuz şifreli PDF belgelerinizi tarayıcı düzeyinde brute-force (sözlük atağı) ile açın. Olası şifre tahminlerinizi girerek PDF şifrenizi cihazınızda güvenle kurtarın.`;

  const exampleUsage = `Önceden şifrelediğiniz bir banka dekontu veya resmi evrakın şifresini hatırlamıyorsunuz fakat şifrenin doğum yılınız (1990 vb.), adınız veya '123' gibi basit bir şey olduğunu tahmin ediyorsunuz. Olası tahminlerinizi listeye ekleyip testi başlattığınızda, saniyede onlarca deneme yapılarak doğru şifre bulunur, size gösterilir ve şifresiz PDF'iniz indirmeye hazır hale gelir.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Şifre Kırıcı / Kurtarıcı</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Şifresini unuttuğunuz PDF dökümanlarının kilidini, olası şifre listelerini tarayıcı düzeyinde deneyerek güvenle açın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm şifre denemeleri yerel tarayıcınızda yapılır. Şifre tahminleriniz ve dosyalarınız internete sızmaz.</span>
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
        {/* Left pane: File upload + Custom dictionary */}
        <Card className="p-6 md:p-8 lg:col-span-7 flex flex-col gap-6">
          {!file ? (
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              title="Şifreli PDF dosyasını buraya sürükleyin veya seçin"
              description="İşlem tarayıcıda yapılacak, sunucuya aktarılmayacaktır."
            />
          ) : (
            <div className="flex flex-col gap-5">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Key className="h-6 w-6" />
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
                <button
                  onClick={handleClear}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Kaldır
                </button>
              </div>

              {/* Custom Wordlist text field */}
              {!recoveredPassword && !isProcessing && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recovery-wordlist" className="text-xs font-bold text-slate-650 flex justify-between">
                    <span>Özel Şifre Tahminleriniz</span>
                    <span className="text-[10px] text-slate-400 font-normal">Virgül veya alt alta yazın</span>
                  </label>
                  <textarea
                    id="recovery-wordlist"
                    rows={4}
                    value={customWordlist}
                    onChange={(e) => setCustomWordlist(e.target.value)}
                    placeholder="ornek: 1990, sirketadi2024, Ahmet123, 1990ahmet, dekont1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    * EvrakFix, yazdığınız bu tahminleri ve arka planda yer alan en yaygın 22 global PDF şifresini sırayla test edecektir.
                  </p>
                </div>
              )}

              {/* Start Button */}
              {!isProcessing && !recoveredPassword && (
                <div className="flex justify-end border-t border-slate-100 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleStartRecovery}
                    className="bg-blue-600 hover:bg-blue-700 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="h-4 w-4" />
                    Şifre Kurtarmayı Başlat
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right pane: Progress / Success feedback */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {error && (
            <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          )}

          {/* Progress state */}
          {isProcessing && (
            <Card className="p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4">
              <RefreshCw className="h-9 w-9 text-blue-600 animate-spin" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 text-sm">Şifreler Test Ediliyor...</span>
                <span className="text-xs text-slate-400">
                  Denetlenen: {testedCount} / {totalToTest}
                </span>
              </div>
              {currentGuess && (
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-500 font-mono text-xs truncate max-w-xs">
                  Denenecek: {currentGuess}
                </div>
              )}
              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-100" 
                  style={{ width: `${(testedCount / totalToTest) * 100}%` }}
                />
              </div>
            </Card>
          )}

          {/* Success state */}
          {recoveredPassword && unlockedBlob && (
            <Card className="p-6 md:p-8 flex flex-col gap-5 border-emerald-100 bg-emerald-50/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Başarılı</span>
                  <h4 className="text-sm font-bold text-slate-800">Şifre Kurtarıldı!</h4>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col gap-1.5">
                <span className="text-xs text-slate-400 font-semibold">Kurtarılan Şifre:</span>
                <span className="font-mono font-bold text-lg text-blue-600 tracking-wide select-all">
                  {recoveredPassword}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-normal font-light">
                PDF dosyasının şifre koruması kaldırıldı. Aşağıdaki butondan kilitlenmemiş sürümünü indirebilirsiniz.
              </p>

              <Button
                variant="primary"
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                <Download className="h-4 w-4" />
                Şifresiz PDF'i İndir
              </Button>
            </Card>
          )}
        </div>
      </div>

      <ToolSEOInfo
        toolName="PDF Şifre Kırıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

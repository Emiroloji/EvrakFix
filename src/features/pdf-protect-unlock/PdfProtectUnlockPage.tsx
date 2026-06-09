import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Input } from '../../components/ui/Input';
import { processPdfProtectUnlock } from './pdfProtectUnlock.service';
import type { ProtectUnlockOperation } from './types';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, RefreshCw, AlertCircle, Download, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfProtectUnlockPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [downloadedBlob, setDownloadedBlob] = React.useState<Blob | null>(null);

  // Form states
  const [operation, setOperation] = React.useState<ProtectUnlockOperation>('protect');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // File selection handler
  const handleFileSelected = React.useCallback((selectedFiles: File[]) => {
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);

    if (selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const validation = validatePdfFile(selectedFile);

    if (!validation.isValid) {
      setError(validation.error || 'Dosya geçersiz.');
      return;
    }

    setFile(selectedFile);
  }, []);

  // Process PDF Action
  const handleProcess = async () => {
    if (!file) return;
    if (!password) {
      setError('Lütfen işlem için bir şifre girin.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const processedBlob = await processPdfProtectUnlock(file, {
        operation,
        password
      });
      
      setDownloadedBlob(processedBlob);
      setSuccess(true);
      
      // Auto download
      const suffix = operation === 'protect' ? 'sifreli' : 'sifresiz';
      downloadBlob(processedBlob, `evrakfix-${suffix}.pdf`);
    } catch (err: any) {
      console.error('PDF protection/unlock error:', err);
      setError(err.message || 'PDF işlemi sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download again if auto-download failed or was closed
  const handleDownloadAgain = () => {
    if (!downloadedBlob) return;
    const suffix = operation === 'protect' ? 'sifreli' : 'sifresiz';
    downloadBlob(downloadedBlob, `evrakfix-${suffix}.pdf`);
  };

  // Reset workspace
  const handleClear = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setDownloadedBlob(null);
    setPassword('');
    setShowPassword(false);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Şifrele & Şifre Çöz</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF dökümanlarınıza şifre koyarak koruyun ya da şifreli PDF'lerinizin şifresini kaldırıp kaydedin.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Tüm işlemler tarayıcınızda yerel olarak gerçekleşir. Şifreleriniz ve dökümanlarınız asla hiçbir sunucuya yüklenmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!file ? (
          /* Dropzone */
          <Dropzone
            onFilesSelected={handleFileSelected}
            accept={{ 'application/pdf': ['.pdf'] }}
            multiple={false}
            title="Şifrelemek veya şifresini çözmek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
            description="Maksimum 50 MB, şifreleme ve çözme işlemleri tamamen tarayıcınızda yapılır."
          />
        ) : (
          /* Editor Panel */
          <div className="flex flex-col gap-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatFileSize(file.size)}
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

            {/* Error Message */}
            {error && (
              <Alert variant="error" icon={<AlertCircle className="h-5 w-5" />}>
                {error}
              </Alert>
            )}

            {/* Success Panel */}
            {success && downloadedBlob && (
              <Alert variant="success" icon={<Download className="h-5 w-5" />}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-800 text-sm">
                      {operation === 'protect' ? 'PDF Şifrelendi!' : 'PDF Şifresi Kaldırıldı!'}
                    </span>
                    <span className="text-xs text-emerald-650">
                      Yeni PDF belgeniz otomatik olarak indirildi.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-600/10 cursor-pointer self-start sm:self-center"
                    onClick={handleDownloadAgain}
                  >
                    Tekrar İndir
                  </Button>
                </div>
              </Alert>
            )}

            {/* Options Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/60">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-slate-700">Yapılacak İşlem</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setOperation('protect'); setSuccess(false); setError(null); }}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      operation === 'protect'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    Şifre Ekle
                  </button>
                  <button
                    onClick={() => { setOperation('unlock'); setSuccess(false); setError(null); }}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      operation === 'unlock'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Unlock className="h-4 w-4" />
                    Şifre Kaldır
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-slate-700">
                  {operation === 'protect' ? 'Belirlenecek Şifre' : 'Mevcut Şifre'}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={operation === 'protect' ? 'Güçlü bir şifre girin...' : 'PDF şifresini girin...'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isProcessing}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">
                  {operation === 'protect' 
                    ? 'Bu şifre, dosya açılırken istenecek olan kullanıcı şifresidir.'
                    : 'Korumalı PDF dosyasını yükleyip şifresini girdiğinizde koruma kaldırılır.'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5 gap-4">
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isProcessing}
                className="font-bold border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
              >
                Yeni Dosya Yükle
              </Button>
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={isProcessing || !password}
                className="font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/15 cursor-pointer min-w-44"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    İşleniyor...
                  </span>
                ) : operation === 'protect' ? (
                  'PDF\'i Şifrele'
                ) : (
                  'Şifreyi Kaldır'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* SEO Info section */}
      <ToolSEOInfo
        toolName="PDF Şifreleme ve Şifre Çözme"
        description="PDF Şifrele & Şifre Çöz (PDF Protect / Unlock) aracımız, belgelerinizin gizliliğini en üst düzeyde korumanızı veya mevcut şifre korumalarını kaldırmanızı sağlar. Tamamen tarayıcınızda yerel (client-side) çalışan bu modül sayesinde, PDF belgeleriniz ve girdiğiniz şifreler hiçbir uzak internet sunucusuna gönderilmez, gizliliğiniz tamamen korunur.

■ PDF Şifreleme Nedir?
PDF şifreleme, bir PDF belgesine yetkisiz erişimi engellemek amacıyla dökümana bir kullanıcı veya açılış şifresi eklenmesi işlemidir. Şifrelenmiş PDF dosyaları, doğru şifre girilmediği sürece hiçbir PDF okuyucu veya tarayıcıda görüntülenemez.

■ PDF Şifresi Nasıl Konulur?
EvrakFix PDF Şifreleme aracına belgenizi yükleyin. 'Şifre Ekle' modunu seçip güçlü bir şifre girin. 'PDF'i Şifrele' butonuna tıkladığınızda dökümanınız saniyeler içinde şifrelenir ve indirmeye hazır hale gelir.

■ PDF Şifresi Nasıl Kaldırılır (Şifre Çözme)?
Mevcut şifresini bildiğiniz bir PDF dosyasının korumasını kaldırmak için belgenizi yükleyin. 'Şifre Kaldır' modunu seçip dosyanın şifresini yazın. 'Şifreyi Kaldır' butonuna tıkladığınızda şifreleme kalıcı olarak kaldırılır ve döküman şifresiz olarak indirilir.

■ PDF Şifreleme ve Şifre Çözme Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Girdiğiniz şifreler, metinler veya PDF dosyaları internet üzerinden hiçbir sunucuya yüklenmez, depolanmaz ve paylaşılmaz. Tüm veri işleme süreci doğrudan kendi cihazınızın RAM belleğinde tamamlanır.

■ Şifrelenmiş PDF Dosyasını Açmak İçin Ne Gerekir?
Bir PDF dosyasının şifresini kaldırabilmek veya içeriğini okuyabilmek için dökümana konulmuş olan orijinal açılış (user) şifresini bilmeniz ve sisteme girmeniz gerekir. Şifresini bilmediğiniz dosyaların şifresini kırmak yasal ve teknik olarak mümkün değildir.

■ Mobil Cihazlardan PDF Şifrelenebilir veya Şifresi Çözülebilir mi?
Evet. EvrakFix mobil uyumlu tasarıma sahiptir. iOS ve Android işletim sistemli telefon veya tabletlerinizden ek uygulama indirmeden tarayıcınız üzerinden PDF belgelerinizi saniyeler içinde şifreleyebilir veya şifrelerini çözebilirsiniz.

■ EvrakFix ile PDF Şifreleme ve Çözmenin Avantajları
EvrakFix ile üyelik, kota veya ücret olmadan tamamen ücretsiz şifreleme ve şifre kaldırma işlemleri yapabilirsiniz. Sunucu yüklemesi olmadığı için internet hızından bağımsız olarak milisaniyeler içinde sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır."
        exampleUsage="İçerisinde şirket bilançoları veya kimlik bilgileri barındıran hassas bir PDF raporunu göndermeden önce şifreleyebilir; ya da bankadan aldığınız şifreli ekstre PDF dosyasının şifresini bir kereye mahsus kaldırarak arşivleyebilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Şifrelemek veya şifresini kaldırmak istediğiniz PDF dosyasını sürükleyip bırakarak yükleyin."
          },
          {
            title: "İşlem ve Şifre Belirleyin",
            description: "Yapmak istediğiniz işlemi (Şifre Ekle veya Şifre Kaldır) seçip kullanacağınız şifreyi girin."
          },
          {
            title: "İşleyin ve İndirin",
            description: "İşlem butonuna tıklayın; şifrelenmiş veya şifresi çözülmüş PDF belgeniz saniyeler içinde otomatik olarak insin."
          }
        ]}
        faqs={[
          {
            question: "PDF dosyam şifrelenirken veya şifresi çözülürken sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Dökümanlarınız hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde işlenir."
          },
          {
            question: "Şifresini bilmediğim bir PDF'in şifresini kaldırabilir miyim?",
            description: "Hayır. Hukuki ve teknik güvenlik standartları gereği, bir PDF'in şifresini kaldırabilmek için dosyanın mevcut şifresini bilmeniz ve sisteme girmeniz gerekmektedir."
          },
          {
            question: "PDF dosyam için belirleyeceğim şifre uzunluğu ne olmalıdır?",
            description: "Güvenliğiniz için en az 6 karakterli, büyük/küçük harf ve rakam içeren güçlü şifreler tercih etmenizi öneririz."
          },
          {
            question: "Bu işlem mobil tarayıcılarda çalışır mı?",
            description: "Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden ek uygulama indirmeden PDF şifreleyebilir veya şifresini çözebilirsiniz."
          },
          {
            question: "İşlem sonrasında dosyamı hemen indirebilir miyim?",
            description: "Evet. İşlem butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme saniyeler içinde başlar."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default PdfProtectUnlockPage;

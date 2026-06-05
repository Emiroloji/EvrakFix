import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { MergeFileList } from './components/MergeFileList';
import { mergePdfFiles } from './pdfMerge.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { Shield, FileCheck, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfMergePage = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = React.useState<Blob | null>(null);

  // Handle selected files
  const handleFilesSelected = (selectedFiles: File[]) => {
    setError(null);
    setMergedBlob(null);

    const validFiles: File[] = [];
    let validationError: string | null = null;

    for (const file of selectedFiles) {
      const validation = validatePdfFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        validationError = validation.error || 'Dosya geçersiz.';
      }
    }

    if (validationError) {
      setError(validationError);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Remove file from list
  const handleRemoveFile = (index: number) => {
    setError(null);
    setMergedBlob(null);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Change ordering of files
  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    setError(null);
    setMergedBlob(null);
    
    setFiles((prev) => {
      const nextList = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[targetIndex];
        nextList[targetIndex] = temp;
      }
      
      return nextList;
    });
  };

  // Clear all states
  const handleClear = () => {
    setFiles([]);
    setError(null);
    setMergedBlob(null);
    setIsLoading(false);
  };

  // Sum of all file sizes
  const totalSize = React.useMemo(() => {
    return files.reduce((acc, file) => acc + file.size, 0);
  }, [files]);

  // Execute PDF merge
  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Birleştirme işlemi için en az 2 PDF dosyası seçmelisiniz.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultBlob = await mergePdfFiles(files);
      setMergedBlob(resultBlob);
    } catch (err: any) {
      setError(err.message || 'Birleştirme işlemi sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger download of merged PDF
  const handleDownload = () => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, 'evrakfix-birlestirilmis.pdf');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Page Title & Desc */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Birleştirme</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Birden fazla PDF dosyasını yükleyin, dilediğiniz sıraya dizin ve hepsini tek bir döküman olarak indirin.
        </p>
      </div>

      {/* Secure Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosyalarınız tamamen tarayıcınızda işlenir. Hiçbir sunucuya veri aktarılmaz.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Main Working Card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!mergedBlob && (
          <>
            {/* Dropzone input */}
            <Dropzone
              onFilesSelected={handleFilesSelected}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={true}
              title="PDF dosyalarınızı buraya sürükleyin veya seçin"
              description="Birden fazla dosya yükleyebilirsiniz. Maksimum dosya boyutu limit: 50MB."
            />

            {/* Error alerts */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Merge list component */}
            {files.length > 0 && (
              <>
                <MergeFileList
                  files={files}
                  onRemoveFile={handleRemoveFile}
                  onMoveFile={handleMoveFile}
                />

                {/* Total info & actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                  <div className="flex flex-col gap-0.5 text-center sm:text-left">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Toplam Boyut</span>
                    <span className="text-sm font-extrabold text-slate-700">{formatFileSize(totalSize)}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto font-semibold">
                      Temizle
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleMerge}
                      isLoading={isLoading}
                      disabled={files.length < 2}
                      className="w-full sm:w-auto font-semibold shadow-md shadow-blue-600/10"
                    >
                      PDF'leri Birleştir
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Successful Merge Result */}
        {mergedBlob && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileCheck className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">İşlem Başarılı</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                PDF Dosyalarınız Birleştirildi!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                {files.length} adet dosya başarıyla birleştirilerek tek bir PDF dökümanına dönüştürüldü.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni Birleştirme Yap
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                leftIcon={<Download className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-blue-600/15"
              >
                Sonucu İndir
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ToolSEOInfo
        toolName="PDF Birleştirme"
        description="PDF Birleştirici aracımız, birden fazla PDF dökümanını tek bir belge haline getirmenizi kolaylaştırır. Resmi yazışmalar, e-kitaplar, faturalar veya ders notları gibi farklı PDF dosyalarını sıraya dizerek tek tıkla birleştirebilirsiniz. Tamamen yerel (client-side) çalışan bu araç sayesinde, hassas veriler içeren kişisel veya kurumsal PDF dosyalarınız hiçbir internet sunucusuna gönderilmez, gizliliğiniz tamamen korunur.

■ PDF Birleştirme Nedir?
PDF birleştirme, ayrı ayrı duran birden fazla PDF belgesinin (sayfa yapıları, yazı tipleri ve görsel kaliteleri korunarak) tek bir ardışık PDF dosyası halinde uç uca eklenmesi işlemidir.

■ PDF Dosyaları Nasıl Birleştirilir?
EvrakFix PDF Birleştirici'ye birleştirmek istediğiniz PDF belgelerini sürükleyip bırakın veya seçin. Yön tuşlarını kullanarak dosyaların sıralamasını dilediğiniz gibi ayarlayın. Ardından 'PDF'leri Birleştir' butonuna tıklayarak saniyeler içinde birleşik PDF dosyanızı indirin.

■ Hangi Durumlarda PDF Birleştirme Kullanılır?
İş başvurularında özgeçmiş, transkript ve sertifikaları tek döküman yapmak; mali belgeleri, faturaları veya sözleşme eklerini bir araya getirmek; ders notlarını veya e-kitap bölümlerini tek kitap haline getirmek gibi durumlarda sıklıkla kullanılır.

■ PDF Birleştirme Güvenli mi?
Evet. EvrakFix tamamen tarayıcı tabanlı (client-side) çalışır. Yüklediğiniz PDF dosyaları internetteki hiçbir uzak sunucuya aktarılmaz, kaydedilmez ve üçüncü taraflarla paylaşılmaz. Tüm süreç doğrudan sizin bilgisayarınızda veya telefonunuzda gerçekleştirilir.

■ Birleştirilen PDF Dosyasının Sırası Değiştirilebilir mi?
Evet. Dosyaları seçtikten sonra, listede yer alan yukarı ve aşağı taşı yön butonlarını kullanarak dökümanların birleşme sırasını işlem öncesinde dilediğiniz gibi serbestçe düzenleyebilirsiniz.

■ Mobil Cihazdan PDF Birleştirme Yapılabilir mi?
Evet, EvrakFix responsive mobil uyumlu tasarımı sayesinde Android veya iPhone/iPad cihazlarınızdan da ek uygulama indirmeden fotoğraflarınızı veya PDF belgelerinizi anında seçip birleştirebilirsiniz.

■ EvrakFix ile PDF Birleştirmenin Avantajları
EvrakFix ile üyelik, limit veya ücret olmadan tamamen ücretsiz PDF birleştirebilirsiniz. Sunucu yüklemesi olmadığı için internet hızınızdan bağımsız olarak anında sonuç alırsınız ve hassas belgeleriniz tamamen cihazınızda güvende kalır."
        exampleUsage="Üniversite veya iş başvurusu için hazırladığınız özgeçmiş, transkript ve sertifika PDF dosyalarını sırasıyla yükleyip tek bir döküman haline getirerek tek bir dosya şeklinde sisteme yükleyebilirsiniz."
        steps={[
          {
            title: "Dosyalarınızı Seçin",
            description: "PDF Birleştirme aracımıza sürükleyip bırakarak veya cihazınızdan seçerek dilediğiniz kadar PDF dosyası ekleyin."
          },
          {
            title: "Sıralamayı Düzenleyin",
            description: "Yukarı ve Aşağı Taşı yön butonlarını kullanarak dökümanların birleşme sırasını dilediğiniz gibi süratle düzenleyin."
          },
          {
            title: "Birleştirip İndirin",
            description: "'PDF'leri Birleştir' butonuna tıklayın, dökümanlarınız saniyeler içinde tarayıcınızda birleştirilip indirmeye hazır hale gelsin."
          }
        ]}
        faqs={[
          {
            question: "PDF dosyalarım sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde birleştirilir."
          },
          {
            question: "Birden fazla PDF’i tek dosya yapabilir miyim?",
            description: "Evet. Dilediğiniz sayıda PDF dosyasını aynı anda yükleyerek tek bir tuşla birleştirebilir ve tek bir PDF belgesi elde edebilirsiniz."
          },
          {
            question: "PDF sırasını değiştirebilir miyim?",
            description: "Evet. Dosyalarınızı yükledikten sonra, liste üzerindeki yön oklarını kullanarak birleşmesini istediğiniz sıralamayı kolayca belirleyebilirsiniz."
          },
          {
            question: "PDF birleştirme işlemi mobilde çalışır mı?",
            description: "Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden tarayıcınız üzerinden PDF'lerinizi anında birleştirebilirsiniz."
          },
          {
            question: "Birleştirilen PDF dosyasını hemen indirebilir miyim?",
            description: "Evet. PDF'leri Birleştir butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu saniyeler içinde görünür."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

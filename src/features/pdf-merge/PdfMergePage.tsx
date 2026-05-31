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
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600" />}>
        Dosyalarınız tamamen tarayıcınızda işlenir. Hiçbir sunucuya veri aktarılmaz.
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
        description="PDF Birleştirici aracımız, birden fazla PDF dökümanını tek bir belge haline getirmenizi kolaylaştırır. Resmi yazışmalar, e-kitaplar, faturalar veya ders notları gibi farklı PDF dosyalarını sıraya dizerek tek tıkla birleştirebilirsiniz. Tamamen yerel (client-side) çalışan bu araç sayesinde, hassas veriler içeren kişisel veya kurumsal PDF dosyalarınız hiçbir internet sunucusuna gönderilmez, gizliliğiniz %100 oranında korunur."
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
            question: "Bir kerede en fazla kaç PDF dökümanını birleştirebilirim?",
            description: "Herhangi bir dosya sayısı sınırı yoktur. Tarayıcınızın işlemci ve bellek sınırları dahilinde dilediğiniz sayıda PDF dökümanını birleştirebilirsiniz."
          },
          {
            question: "Birleştirilen PDF dosyalarında sayfa kaybı veya çözünürlük bozulması olur mu?",
            description: "Hayır. pdf-lib motoru ile sayfalar orijinal piksel kalitesiyle, yazı tipleri, vektör çizimleri ve tüm döküman detaylarıyla birebir kopyalanarak birleştirilir."
          },
          {
            question: "Yüklediğim PDF dosyaları sisteminize kaydedilir mi veya başkası görebilir mi?",
            description: "Kesinlikle hayır. EvrakFix sunucusuz çalışan (client-side) bir sistemdir. Dosyalarınız tamamen bilgisayarınızın veya telefonunuzun yerel belleğinde işlenir ve asla internete aktarılmaz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};

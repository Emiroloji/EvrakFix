import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { PageRangeInput } from './components/PageRangeInput';
import { splitPdfFile } from './pdfSplit.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { PDFDocument } from 'pdf-lib';
import { Shield, FileCheck, RefreshCw, Download, AlertCircle, FileText } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const PdfSplitPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [selectedPages, setSelectedPages] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [splitBlob, setSplitBlob] = React.useState<Blob | null>(null);

  // Read uploaded PDF and check total page count
  const handleFileSelected = async (selectedFiles: File[]) => {
    setError(null);
    setSplitBlob(null);
    setTotalPages(0);
    setSelectedPages([]);

    if (selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const validation = validatePdfFile(selectedFile);
    
    if (!validation.isValid) {
      setError(validation.error || 'Dosya geçersiz.');
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();
      
      if (count === 0) {
        throw new Error('PDF dökümanı boş veya okunabilir sayfa barındırmıyor.');
      }
      
      setFile(selectedFile);
      setTotalPages(count);
    } catch (err: any) {
      setError(err.message || 'PDF dökümanı okunurken hata oluştu. Lütfen dosyanın bozuk olmadığından emin olun.');
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // State update callback from PageRangeInput
  const handleRangeParsed = (indices: number[]) => {
    setSelectedPages(indices);
  };

  // Clear all states
  const handleClear = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
    setError(null);
    setSplitBlob(null);
    setIsLoading(false);
  };

  // Execute splitting PDF
  const handleSplit = async () => {
    if (!file || selectedPages.length === 0) {
      setError('Lütfen önce geçerli bir PDF dosyası yükleyin ve sayfa seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultBlob = await splitPdfFile(file, selectedPages);
      setSplitBlob(resultBlob);
    } catch (err: any) {
      setError(err.message || 'Bölme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download split PDF Blob
  const handleDownload = () => {
    if (splitBlob) {
      downloadBlob(splitBlob, 'evrakfix-bolunmus.pdf');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>PDF Bölme</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Tek bir PDF dökümanından dilediğiniz sayfaları seçerek veya belirli aralıklar girerek yeni bir PDF oluşturun.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Dosyanız tamamen tarayıcınızda işlenir. Sunucumuza herhangi bir veri gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Workspace card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!splitBlob && (
          <>
            {/* Show dropzone if no file is selected */}
            {!file && (
              <Dropzone
                onFilesSelected={handleFileSelected}
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="Bölmek istediğiniz PDF dosyasını buraya sürükleyin veya seçin"
                description="Tek dosya kabul edilir. Maksimum dosya boyutu limit: 50MB."
              />
            )}

            {/* Reading error */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* PDF Details & Page Range Configuration */}
            {file && totalPages > 0 && (
              <div className="flex flex-col gap-6">
                {/* File summary */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <FileText className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate pr-2">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        {formatFileSize(file.size)} • Toplam {totalPages} Sayfa
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleClear} className="font-semibold text-xs h-9 px-3.5">
                    Değiştir
                  </Button>
                </div>

                {/* Page range inputs */}
                <PageRangeInput totalPages={totalPages} onRangeParsed={handleRangeParsed} />

                {/* Execution bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                  <div className="flex flex-col gap-0.5 text-center sm:text-left">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Seçilen Sayfa</span>
                    <span className="text-sm font-extrabold text-slate-700">{selectedPages.length} / {totalPages} Sayfa</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto font-semibold">
                      İptal Et
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSplit}
                      isLoading={isLoading}
                      disabled={selectedPages.length === 0}
                      className="w-full sm:w-auto font-semibold shadow-md shadow-blue-600/10"
                    >
                      PDF'i Böl
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Successful Split Screen */}
        {splitBlob && file && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileCheck className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">İşlem Başarılı</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                PDF Dökümanınız Başarıyla Bölündü!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                "{file.name}" dosyasından seçtiğiniz {selectedPages.length} sayfa ayıklanarak yeni bir döküman oluşturuldu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni Bölme Yap
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
        toolName="PDF Bölme ve Sayfa Ayıklama"
        description="PDF Bölme aracımız, geniş sayfa sayısına sahip PDF belgelerinden ihtiyacınız olan sayfaları ayıklayarak yeni bir PDF dosyası üretmenizi sağlar.

■ PDF Bölme Nedir?
PDF bölme, tek bir büyük PDF dosyasının belirli sayfalarını veya sayfa aralıklarını seçerek, orijinal döküman kalitesini (yazı tipi, görsel çözünürlüğü ve mizanpaj) bozmadan yeni bir PDF dosyası halinde ayırma işlemidir.

■ PDF Dosyasından Sayfa Ayırma Nasıl Yapılır?
EvrakFix PDF Bölücü aracına ayırmak istediğiniz PDF dosyasını sürükleyip bırakın veya seçin. Ardından ayıklamak istediğiniz sayfa numaralarını veya sayfa aralıklarını girin. 'PDF'i Böl' butonuna tıklayarak saniyeler içinde yeni dökümanınızı indirin.

■ Hangi Durumlarda PDF Bölme Kullanılır?
Büyük e-kitaplardan veya ders notlarından sadece belirli bölümleri almak, çoklu fatura veya sözleşme içeren PDF'lerden tek bir sayfayı ayıklamak ya da büyük boyutlu tarama dosyalarından gereksiz sayfaları temizlemek için sıklıkla kullanılır.

■ Sayfa Aralığı Seçerek PDF Ayırmak Mümkün mü?
Evet. EvrakFix gelişmiş sayfa seçici motoru sayesinde '1-5', '8,12' veya '15-20' gibi virgülle ayrılmış özel sayfa aralıkları belirleyerek tek seferde karmaşık sayfaları kolayca ayıklayabilirsiniz.

■ PDF Bölme İşlemi Güvenli mi?
Evet, tamamen güvenlidir. EvrakFix sunucusuz (client-side) çalışır. Yüklediğiniz PDF dosyası hiçbir uzak internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcısında (RAM bellek) işlenir. Bu sayede gizli ve hassas belgeleriniz tamamen güvende kalır.

■ Mobil Cihazdan PDF Bölme Yapılabilir mi?
Evet. EvrakFix responsive mobil uyumlu yapısıyla Android, iPhone veya iPad cihazlarınızdan da ek uygulama kurmadan tarayıcınız aracılığıyla dilediğiniz PDF dökümanını anında bölebilmenizi sağlar.

■ EvrakFix ile PDF Bölmenin Avantajları
EvrakFix ile üyelik, limit veya hiçbir ücret olmadan tamamen ücretsiz PDF bölebilirsiniz. İşlemler yerel gerçekleştiği için internet hızınızdan bağımsız olarak anında tamamlanır ve verileriniz hiçbir zaman cihazınızdan dışarı çıkmaz."
        exampleUsage="100 sayfalık bir ders kitabından sadece sınavda sorumlu olduğunuz 15-25 arası sayfaları ayıklayıp, cihazınızda yer kaplamayan yeni ve küçük bir PDF belgesi elde edebilirsiniz."
        steps={[
          {
            title: "PDF Belgenizi Yükleyin",
            description: "Bölmek istediğiniz PDF dökümanını sürükleyip bırakarak veya cihazınızdan seçerek sisteme güvenle yükleyin."
          },
          {
            title: "Sayfa Seçimini Yapın",
            description: "Dilediğiniz sayfa aralığını yazın veya 'Tek Sayfalar', 'Çift Sayfalar' gibi hızlı preset tuşlarını kullanarak sayfaları belirleyin."
          },
          {
            title: "Bölün ve İndirin",
            description: "'PDF'i Böl' butonuna tıklayarak seçtiğiniz sayfalardan oluşan yeni PDF belgesini tarayıcı hızında anında indirin."
          }
        ]}
        faqs={[
          {
            question: "PDF dosyam sunucuya yükleniyor mu?",
            description: "Hayır. EvrakFix tamamen sunucusuz (client-side) çalışmaktadır. Yüklediğiniz dökümanlar hiçbir internet sunucusuna yüklenmez, doğrudan cihazınızın tarayıcı belleğinde bölünür."
          },
          {
            question: "PDF içinden sadece belirli sayfaları ayırabilir miyim?",
            description: "Evet. Dilediğiniz sayfa numarasını girerek veya aralık seçerek PDF dosyanızın içinden sadece ihtiyacınız olan sayfaları ayıklayıp yeni bir PDF olarak kaydedebilirsiniz."
          },
          {
            question: "1-3 veya 1,3,5 gibi sayfa aralıkları kullanabilir miyim?",
            description: "Evet. Sayfa seçici alanına '1-3' yazarak ilk 3 sayfayı veya '1,3,5' yazarak sadece 1., 3. ve 5. sayfaları ayıklayabilirsiniz. İkisini birleştirip '1-3, 5' şeklinde de kullanabilirsiniz."
          },
          {
            question: "PDF bölme işlemi mobilde çalışır mı?",
            description: "Evet. EvrakFix mobil tarayıcılarla tam uyumludur. Akıllı telefon veya tabletinizden ek uygulama indirmeden PDF'lerinizi anında bölebilirsiniz."
          },
          {
            question: "Bölünen PDF dosyasını hemen indirebilir miyim?",
            description: "Evet. PDF'i Böl butonuna bastığınız anda işlem tarayıcı hızında yerel olarak gerçekleşir ve indirme butonu saniyeler içinde görünür."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default PdfSplitPage;

import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Dropzone } from '../../components/ui/Dropzone';
import { Select } from '../../components/ui/Select';
import { SignatureCanvas } from './components/SignatureCanvas';
import { addSignatureToPdf, type SignatureOptions } from './pdfSign.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { validatePdfFile } from '../../lib/pdf/pdfValidation';
import { formatFileSize } from '../../lib/files/fileSize';
import { PDFDocument } from 'pdf-lib';
import { Shield, FileCheck, RefreshCw, Download, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';

export const PdfSignPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [signatureImage, setSignatureImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [signedBlob, setSignedBlob] = React.useState<Blob | null>(null);

  // Sign placement options
  const [options, setOptions] = React.useState<SignatureOptions>({
    pageNumber: 1,
    position: 'bottom-right',
    size: 'medium',
  });

  // Load and read PDF document
  const handleFileSelected = async (selectedFiles: File[]) => {
    setError(null);
    setSignedBlob(null);
    setTotalPages(0);

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
        throw new Error('PDF dökümanı boş.');
      }

      setFile(selectedFile);
      setTotalPages(count);
      setOptions((prev) => ({ ...prev, pageNumber: 1 }));
    } catch (err: any) {
      setError(err.message || 'PDF dökümanı okunurken hata oluştu. Lütfen dosyanın bozuk olmadığından emin olun.');
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback to capture base64 signature image
  const handleSaveSignature = (dataUrl: string) => {
    setSignatureImage(dataUrl);
    setError(null);
  };

  // Clear signature state
  const handleClearSignature = () => {
    setSignatureImage(null);
  };

  // Reset page state
  const handleClear = () => {
    setFile(null);
    setTotalPages(0);
    setSignatureImage(null);
    setOptions({
      pageNumber: 1,
      position: 'bottom-right',
      size: 'medium',
    });
    setError(null);
    setSignedBlob(null);
    setIsLoading(false);
  };

  // Execute PDF signing process
  const handleSign = async () => {
    if (!file) {
      setError('Lütfen önce geçerli bir PDF dosyası yükleyin.');
      return;
    }
    if (!signatureImage) {
      setError('Lütfen önce imzanızı çizin ve "İmza Olarak Kaydet" butonuna tıklayın.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultBlob = await addSignatureToPdf(file, signatureImage, options);
      setSignedBlob(resultBlob);
    } catch (err: any) {
      setError(err.message || 'İmzalama işlemi sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download signed PDF
  const handleDownload = () => {
    if (signedBlob && file) {
      downloadBlob(signedBlob, `evrakfix-imzalanmis-${file.name}`);
    }
  };

  const handleOptionChange = (field: keyof SignatureOptions, value: string | number) => {
    setSignedBlob(null);
    setError(null);
    setOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Belgeye İmza Ekle</span>
        </h1>
        <p className="text-slate-500 text-sm">
          PDF belgenizi yükleyin, imzanızı tarayıcınızda çizerek ekleyin ve istediğiniz sayfaya/konuma yerleştirin.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600" />}>
        Dosyalarınız tamamen tarayıcınızda imzalanır. Sunucumuza herhangi bir veri aktarılmaz.
      </Alert>

      {/* Workspace card */}
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {!signedBlob && (
          <>
            {/* Step 1: File drop */}
            {!file && (
              <Dropzone
                onFilesSelected={handleFileSelected}
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="İmzalamak istediğiniz PDF belgesini buraya sürükleyin veya seçin"
                description="Tek dosya kabul edilir. Maksimum dosya boyutu limit: 50MB."
              />
            )}

            {/* Errors */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Step 2: Document Config & signature drawing */}
            {file && totalPages > 0 && (
              <div className="flex flex-col gap-8">
                {/* PDF Summary Banner */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left: Signature Drawing Panel */}
                  <div className="flex flex-col gap-4">
                    {!signatureImage ? (
                      <SignatureCanvas
                        onSaveSignature={handleSaveSignature}
                        onClearSignature={handleClearSignature}
                      />
                    ) : (
                      <div className="flex flex-col gap-4.5 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>İmzanız Kaydedildi</span>
                        </div>
                        
                        <div className="flex items-center justify-center w-full h-[120px] rounded-xl bg-white border border-slate-100 p-4">
                          <img src={signatureImage} alt="Kaydedilen İmza" className="max-h-full max-w-full object-contain" />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearSignature}
                          className="text-xs font-semibold h-9 px-3 bg-white"
                        >
                          İmzayı Yeniden Çiz
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Right: Placement Configuration */}
                  <div className="flex flex-col gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                      Yerleşim Seçenekleri
                    </h3>

                    {/* Page selector */}
                    <Select
                      label="Uygulanacak Sayfa"
                      value={options.pageNumber}
                      onChange={(e) => handleOptionChange('pageNumber', parseInt(e.target.value, 10))}
                      options={Array.from({ length: totalPages }, (_, i) => ({
                        value: `${i + 1}`,
                        label: `Sayfa ${i + 1}`,
                      }))}
                    />

                    {/* Position selector */}
                    <Select
                      label="İmza Konumu"
                      value={options.position}
                      onChange={(e) => handleOptionChange('position', e.target.value)}
                      options={[
                        { value: 'bottom-left', label: 'Sol Alt Köşe' },
                        { value: 'bottom-center', label: 'Orta Alt Alan' },
                        { value: 'bottom-right', label: 'Sağ Alt Köşe' },
                      ]}
                    />

                    {/* Size selector */}
                    <Select
                      label="İmza Boyutu"
                      value={options.size}
                      onChange={(e) => handleOptionChange('size', e.target.value)}
                      options={[
                        { value: 'small', label: 'Küçük (100x50px)' },
                        { value: 'medium', label: 'Orta (150x75px)' },
                        { value: 'large', label: 'Büyük (200x100px)' },
                      ]}
                    />
                  </div>
                </div>

                {/* Final execute bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                  <div className="text-center sm:text-left">
                    <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase block">Seçilen Konum</span>
                    <span className="text-sm font-extrabold text-slate-700">Sayfa {options.pageNumber} • {options.position === 'bottom-right' ? 'Sağ Alt' : options.position === 'bottom-center' ? 'Orta Alt' : 'Sol Alt'}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto font-semibold">
                      İptal Et
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSign}
                      isLoading={isLoading}
                      disabled={!signatureImage}
                      className="w-full sm:w-auto font-semibold shadow-md shadow-blue-600/10"
                    >
                      Belgeyi İmzala
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Successful signing display */}
        {signedBlob && file && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileCheck className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">İşlem Başarılı</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Belgeniz Başarıyla İmzalandı!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                "{file.name}" belgesi, oluşturduğunuz imza ile belirlenen sayfaya eklenerek hazır hale getirildi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni Belge İmzala
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
        toolName="PDF Belge İmzalama"
        description="PDF İmzalama aracımız; sözleşmeler, teklifler, dilekçeler ve onay formları gibi resmi belgelerinizi tarayıcı ortamında kolayca imzalamanızı sağlar. Cihazınızın dokunmatik ekranını veya farenizi kullanarak imzanızı çizebilir, imza görselini dökümanın istediğiniz sayfasına, dilediğiniz konum ve boyutta yerleştirebilirsiniz. Islak imzanız da dahil olmak üzere hiçbir belgeniz veya çizim veriniz internete aktarılmaz; işlemler tamamen yerel bilgisayarınızda derlenir."
        steps={[
          {
            title: "Belgenizi Yükleyin",
            description: "İmzalamak istediğiniz resmi veya özel PDF dökümanını sürükleyip bırakarak veya cihazınızdan seçerek sisteme yükleyin."
          },
          {
            title: "İmzanızı Çizin",
            description: "Çizim alanına farenizle veya dokunmatik ekranlı mobil cihazınızda parmağınızla imzanızı atın ve 'İmza Olarak Kaydet' butonuna tıklayın."
          },
          {
            title: "Konumu Seçip İndirin",
            description: "İmzanın uygulanacağı sayfa numarasını, konum açısını (Sol Alt, Orta Alt, Sağ Alt) ve boyutunu seçip 'Belgeyi İmzala' diyerek indirin."
          }
        ]}
        faqs={[
          {
            question: "Çizdiğim imza sunucunuzda veya sisteminizde saklanır mı?",
            description: "Kesinlikle hayır. EvrakFix bünyesinde çizdiğiniz ıslak imzalar hiçbir sunucuya yüklenmez ve kaydedilmez. İmza verileriniz sadece tarayıcınızın o anki bellek ortamında geçici olarak tutulur ve PDF'e gömüldüğü anda bellekten silinir."
          },
          {
            question: "Mobil telefon veya tabletten imza atabilir miyim?",
            description: "Evet! İmza çizim alanımız mobil dokunmatik hassasiyetle tam uyumlu kodlanmıştır. Telefon veya tabletinizden parmağınızla veya akıllı kalemle çok daha hassas ve pürüzsüz imzalar çizebilirsiniz."
          },
          {
            question: "İmza konumu ve boyutu üzerinde ince ayar yapabilir miyim?",
            description: "İmzanın dökümanda yer alacağı sayfa numarasını belirledikten sonra; Sol Alt Köşe, Orta Alt ve Sağ Alt Köşe olmak üzere 3 farklı hizalama konumu ile Küçük, Orta, Büyük ebat seçeneklerinden dilediğinizi seçebilirsiniz."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default PdfSignPage;

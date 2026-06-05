import * as React from 'react';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { TemplateSelector } from './components/TemplateSelector';
import { DocumentForm } from './components/DocumentForm';
import { generateDocumentPdf } from './documentGenerator.service';
import { downloadBlob } from '../../lib/files/downloadFile';
import { type DocumentTemplate } from './documentTemplates';
import { Shield, RefreshCw, Download, AlertCircle, Eye, FileSignature } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';

export const DocumentGeneratorPage = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<DocumentTemplate | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [docBlob, setDocBlob] = React.useState<Blob | null>(null);

  // Template select handler
  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormValues({});
    setDocBlob(null);
    setError(null);
  };

  // Check if all required fields are filled
  const isFormValid = React.useMemo(() => {
    if (!selectedTemplate) return false;
    
    return selectedTemplate.fields.every((field) => {
      if (field.required) {
        return !!formValues[field.id]?.trim();
      }
      return true;
    });
  }, [selectedTemplate, formValues]);

  // Compiled text preview
  const livePreviewText = React.useMemo(() => {
    if (!selectedTemplate) return '';
    try {
      return selectedTemplate.generateText(formValues);
    } catch (e) {
      console.error('Error generating template text preview:', e);
      return '';
    }
  }, [selectedTemplate, formValues]);

  // Execute A4 PDF generation
  const handleGenerate = async () => {
    if (!selectedTemplate || !isFormValid) {
      setError('Lütfen dilekçeyi oluşturmak için tüm zorunlu alanları doldurun.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await generateDocumentPdf(selectedTemplate.title, livePreviewText);
      setDocBlob(blob);
    } catch (err: any) {
      setError(err.message || 'PDF dökümanı üretilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF Blob
  const handleDownload = () => {
    if (docBlob && selectedTemplate) {
      downloadBlob(docBlob, `evrakfix-${selectedTemplate.id}.pdf`);
    }
  };

  // Clear / reset state
  const handleClear = () => {
    setSelectedTemplate(null);
    setFormValues({});
    setError(null);
    setDocBlob(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Dilekçe & Evrak Oluşturucu</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Resmi veya hukuki dilekçelerinizi hazır şablonlarla saniyeler içinde oluşturun, canlı önizleyin ve A4 standartlarında PDF olarak indirin.
        </p>
      </div>

      {/* Security alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Girdiğiniz hiçbir bilgi sunucuya gönderilmez. Dilekçeniz tamamen tarayıcınızda çizilir ve yerel olarak derlenir.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {/* Responsibility disclaimer note */}
      <Alert variant="warning" icon={<AlertCircle className="h-5 w-5 text-amber-600" />}>
        <span className="text-xs text-amber-900 font-semibold">
          Önemli Bilgilendirme: Bu araç genel dilekçe taslakları oluşturmak için hazırlanmıştır. Oluşturulan belgeler hukuki danışmanlık yerine geçmez. Resmi başvurular için ilgili kurumun güncel şartlarını kontrol ediniz.
        </span>
      </Alert>

      {/* Workspace */}
      <div className="flex flex-col gap-8 w-full">
        {!docBlob && (
          <>
            {/* Step 1: Select a template */}
            <TemplateSelector
              selectedId={selectedTemplate?.id || null}
              onSelect={handleSelectTemplate}
            />

            {/* Error alerts */}
            {error && (
              <Alert variant="error" title="İşlem Hatası" icon={<AlertCircle className="h-4 w-4" />}>
                {error}
              </Alert>
            )}

            {/* Step 2: Form & Live Preview */}
            {selectedTemplate && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form area (Left) */}
                <div className="lg:col-span-5 flex flex-col gap-6 w-full">
                  <DocumentForm
                    template={selectedTemplate}
                    values={formValues}
                    onChange={setFormValues}
                  />

                  {/* Desktop execute button block */}
                  <div className="flex items-center gap-3 w-full">
                    <Button variant="outline" onClick={handleClear} className="w-1/2 font-semibold">
                      Geri Dön
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleGenerate}
                      isLoading={isLoading}
                      disabled={!isFormValid}
                      className="w-1/2 font-semibold shadow-md shadow-blue-600/10"
                    >
                      Dökümanı Üret
                    </Button>
                  </div>
                </div>

                {/* Live Preview area (Right) */}
                <div className="lg:col-span-7 flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span>Dilekçe Canlı Önizleme</span>
                  </div>

                  {/* Styled A4 Sheet representation */}
                  <div className="w-full bg-white border border-slate-200 shadow-lg rounded-2xl p-8 sm:p-12 font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap min-h-[500px] overflow-y-auto max-h-[650px] relative border-t-4 border-t-blue-500">
                    {livePreviewText ? (
                      livePreviewText
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-sans text-xs">
                        Formu doldurdukça önizleme burada canlı olarak güncellenecektir.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Successful generation screen */}
        {docBlob && selectedTemplate && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 gap-6 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 animate-pulse">
              <FileSignature className="h-10 w-10 stroke-[1.5]" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Evrak Hazır</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                "{selectedTemplate.title}" Dilekçeniz Başarıyla Oluşturuldu!
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                Resmi evrakınız A4 standartlarında ve otomatik satır taşma ayarlarıyla başarıyla PDF formatına dönüştürüldü.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button
                variant="outline"
                onClick={handleClear}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Yeni Dilekçe Oluştur
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                leftIcon={<Download className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-blue-600/15"
              >
                PDF Olarak İndir
              </Button>
            </div>
          </div>
        )}
      </div>

      <ToolSEOInfo
        toolName="Dilekçe Oluştur"
        description="Resmi Dilekçe ve Evrak Oluşturucu aracımız; adliyeler, belediyeler, şirketler veya kamu kurumlarına sunacağınız yasal evraklarınızı A4 standartlarında ve otomatik satır taşma / sayfalama korumalı şekilde saniyeler içinde hazırlamanızı sağlar. Genel Dilekçe, İstifa Dilekçesi, Ürün İade Talebi, Demirbaş Teslim Tutanağı ve Borç Alacak Taahhütnamesi gibi hazır resmi şablonları form doldurarak düzenleyebilirsiniz. Girdiğiniz T.C. Kimlik, adres, IBAN veya telefon gibi hiçbir kişisel veri sunucularımıza gitmez.

■ Dilekçe Oluşturucu Nedir?
Dilekçe oluşturucu, resmi makamlara veya özel kurumlara iletmek istediğiniz dilekçeleri, hukuki standartlara uygun olarak tarayıcınızda doldurup A4 PDF formatında çıktı almanızı sağlayan dijital bir araçtır.

■ Online Dilekçe Nasıl Hazırlanır?
EvrakFix üzerinden hazırlamak istediğiniz dilekçe şablonunu seçin, interaktif formda sizden istenen alanları (ad soyad, adres, tarih ve açıklama gibi) doldurun. Sağ tarafta yer alan canlı önizleme ekranında dilekçenizin son halini anlık olarak izleyebilir ve anında PDF olarak indirebilirsiniz.

■ Hangi Dilekçe Şablonları Kullanılabilir?
Uygulamamızda Genel Dilekçe, İstifa Dilekçesi, İade Talep Dilekçesi, Teslim Tutanağı ve Borç Alacak Tutanağının yanı sıra; İzin Dilekçesi, Okul Dilekçesi, Şikayet Dilekçesi, İş Başvuru Dilekçesi ve Apartman Yönetimi Dilekçesi gibi geniş şablon seçenekleri bulunmaktadır.

■ PDF Dilekçe Oluşturmak Güvenli mi?
EvrakFix tamamen yerel (client-side) çalıştığı için son derece güvenlidir. Dilekçeye yazdığınız T.C. Kimlik No, telefon, adres veya kişisel detaylar hiçbir internet sunucusuna gönderilmez, veritabanımız yoktur. İşlemler tarayıcınızın kendi belleğinde gerçekleşir.

■ Dilekçe Hazırlarken Nelere Dikkat Edilmeli?
Dilekçe yazarken muhatap kurumun adının doğru belirtilmesi, konunun net ifade edilmesi, yasal sürelerin aşılmaması (örn: iade için 14 gün) ve iletişim bilgilerinin eksiksiz girilmesi gerekir. Ayrıca yazım kurallarına uygun, sade ve saygılı bir dil kullanılmalıdır.

■ Hazırlanan Dilekçe Resmi Belge Yerine Geçer mi?
EvrakFix ile hazırladığınız dilekçeler genel başvuru taslakları niteliğindedir. Bu dökümanlar yazdırılıp imzalandıktan veya e-imzalandıktan sonra ilgili kurumlara teslim edilebilir, ancak resmi veya hukuki geçerlilik kararı tamamen muhatap kurumun veya ilgili mevzuatın yetkisindedir.

■ EvrakFix ile Dilekçe Oluşturmanın Avantajları
EvrakFix ile üyelik veya ücret ödemeden hızlıca dilekçe oluşturabilirsiniz. Otomatik satır taşıma ve marj yönetimi sayesinde yazım düzeniniz asla bozulmaz. Gizliliğiniz tamamen korunur ve hazırladığınız evraklar anında cihazınıza indirilir."
        exampleUsage="Çalıştığınız iş yerinden ayrılmak istediğinizde 'İstifa Dilekçesi' şablonunu seçip kişisel bilgilerinizi doldurarak saniyeler içinde A4 boyutunda, resmi formata uygun dilekçenizi hazır edip yazdırabilirsiniz."
        steps={[
          {
            title: "Evrak Şablonunuzu Seçin",
            description: "Doldurmak istediğiniz döküman tipini (dilekçe, tutanak, taahhüt vb.) şablon kartlarından seçin."
          },
          {
            title: "Form Bilgilerini Doldurun",
            description: "Açılan interaktif formdaki zorunlu alanları doldurun. Sağ sütundaki A4 kağıt simülasyonunda canlı önizlemeyi (Live Preview) anlık izleyin."
          },
          {
            title: "Derleyin ve İndirin",
            description: "'Dökümanı Üret' butonuna tıklayarak A4 standartlarında PDF belgenizi tarayıcınızda saniyeler içinde derleyip indirin."
          }
        ]}
        faqs={[
          {
            question: "EvrakFix ile oluşturulan dilekçeler resmi belge midir?",
            description: "EvrakFix ile oluşturulan dilekçeler resmi başvurularda kullanılabilecek genel dilekçe taslaklarıdır. Ancak her kurumun belge formatı, ek evrak ve başvuru şartları farklı olabilir. Bu nedenle teslim etmeden önce ilgili kurumun güncel şartlarını kontrol etmeniz önerilir."
          },
          {
            question: "Dilekçe bilgilerim sunucuya yükleniyor mu?",
            description: "Kesinlikle hayır. EvrakFix tamamen yerel (client-side) çalışmaktadır. Formda yazdığınız T.C. Kimlik No, adres ve iletişim bilgileri gibi hassas veriler hiçbir sunucuya yüklenmez, doğrudan tarayıcınızın RAM belleğinde işlenir."
          },
          {
            question: "Dilekçeyi PDF olarak indirebilir miyim?",
            description: "Evet, formu doldurduktan sonra 'Dökümanı Üret' butonuna tıklayarak A4 sayfa boyutunda ve yazdırılmaya hazır, yüksek kaliteli PDF dökümanınızı tek tıkla cihazınıza indirebilirsiniz."
          },
          {
            question: "İstifa dilekçesi ve iade talep dilekçesi oluşturabilir miyim?",
            description: "Evet. Sistemimizde hazır bulunan İstifa Dilekçesi, İade Talebi, İzin Dilekçesi, Şikayet Dilekçesi gibi hazır şablonları kullanarak kendinize uygun resmi yazıları kolayca oluşturabilirsiniz."
          },
          {
            question: "Dilekçe şablonlarını düzenleyebilir miyim?",
            description: "Evet. Form alanlarındaki bilgileri istediğiniz zaman değiştirebilirsiniz. Sağ taraftaki canlı önizleme alanında yaptığınız tüm değişiklikler anında güncellenmektedir."
          }
        ].map(faq => ({ question: faq.question, answer: faq.description }))}
      />
    </div>
  );
};
export default DocumentGeneratorPage;

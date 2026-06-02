import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Shield, ChevronDown, HelpCircle, Lock, CheckCircle2 } from 'lucide-react';

export interface StepItem {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolSEOInfoProps {
  toolName: string;
  description: string;
  steps: StepItem[];
  faqs: FAQItem[];
  exampleUsage?: string;
}

export const ToolSEOInfo = ({ toolName, description, steps, faqs, exampleUsage }: ToolSEOInfoProps) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="flex flex-col gap-12 mt-12 pt-8 border-t border-slate-100 w-full text-slate-800">
      {faqs && faqs.length > 0 && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
        />
      )}
      
      {/* 3 Steps Guide - Nasıl Çalışır? */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center max-w-xl mx-auto">
          <Badge variant="primary" className="mx-auto bg-blue-50 text-blue-600 border-none font-bold px-3 py-1 text-xs">
            Kılavuz
          </Badge>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {toolName} Nasıl Kullanılır?
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Sadece 3 basit adımda dökümanlarınızı tarayıcınızda ücretsiz olarak işleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-2">
          {/* Connecting arrow line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10 -translate-y-6" />

          {steps.map((step, idx) => (
            <Card
              key={idx}
              className="flex flex-col items-center text-center gap-3.5 p-6 border-slate-100/70 bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/30 flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                {idx + 1}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content & Trust Box */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Long Descriptive SEO Text (Left) */}
        <div className="lg:col-span-7 flex flex-col gap-4.5 justify-center">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-slate-800">
              {toolName} Hakkında Detaylı Bilgi
            </h3>
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light whitespace-pre-line mb-2">
            {description}
          </p>

          {/* Örnek Kullanım Kutusu */}
          {exampleUsage && (
            <div className="p-4.5 rounded-2xl border border-blue-100 bg-blue-50/10 flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase flex items-center gap-1.5">
                💡 Örnek Kullanım Senaryosu
              </span>
              <p className="text-xs text-slate-650 leading-relaxed font-normal">
                {exampleUsage}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Trust Banner (Right) */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between border-blue-100 bg-blue-50/20 p-6 md:p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white text-blue-600 border border-blue-100/50 shadow-sm shrink-0">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Veri Güvenliği</span>
                  <h4 className="text-sm font-bold text-slate-800">Neden Tamamen Güvenli?</h4>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    <strong>Sıfır Sunucu Yüklemesi:</strong> Seçtiğiniz dosyalar internete gönderilmez. Uygulama kodları tarayıcınızda yerel çalışır.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    <strong>İnternetsiz Çalışma:</strong> İnternet bağlantınızı kesseniz dahi tüm PDF ve görsel işlemlerini yapmaya devam edebilirsiniz.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    <strong>Veritabanı Yok:</strong> Dosyalarınızı depolayan bir bulut sistemi, veri havuzu veya üyelik zorunluluğu yoktur.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-6 pt-4 border-t border-slate-100/50">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Gizliliğiniz Cihazınızda Korunur</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Accordion FAQ (Sıkça Sorulan Sorular) */}
      {faqs && faqs.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center max-w-xl mx-auto">
            <Badge variant="primary" className="mx-auto bg-blue-50 text-blue-600 border-none font-bold px-3 py-1 text-xs">
              Soru - Cevap
            </Badge>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Sıkça Sorulan Sorular
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              {toolName} aracı hakkında en çok merak edilen konular.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 max-w-3xl mx-auto w-full mt-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-white overflow-hidden transition-all duration-350 shadow-sm"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-slate-450 transition-transform duration-350 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {/* Body Content */}
                  <div
                    className={`transition-all duration-350 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-slate-50' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
export default ToolSEOInfo;

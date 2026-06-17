import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { 
  Shield, User, Briefcase, GraduationCap, Code, 
  Plus, Trash2, Download, RefreshCw, FileText, ChevronDown, Award
} from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { generateCvPdf } from './cvBuilder.service';
import { initialCVData } from './types';
import type { CVData } from './types';
import { openSecurityModal } from '../../lib/utils/security';

export const CvBuilderPage = () => {
  const [cvData, setCvData] = React.useState<CVData>(initialCVData);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Active accordion section
  const [activeSection, setActiveSection] = React.useState<string>('personal');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Helper to update personal info fields
  const handlePersonalChange = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  // Helper templates for array items
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Math.random().toString(), company: '', role: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Math.random().toString(), school: '', degree: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Math.random().toString(), name: '', description: '', link: '' }
      ]
    }));
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: Math.random().toString(), name: '', level: 'Orta' }
      ]
    }));
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item.id !== id)
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: Math.random().toString(), name: '', level: 'B2' }
      ]
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(item => item.id !== id)
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const fillSampleData = () => {
    setCvData({
      personal: {
        fullName: 'Ahmet Yilmaz',
        title: 'Kidemli Yazilim Gelistirici',
        email: 'ahmet@yilmaz.com',
        phone: '+90 555 123 45 67',
        website: 'ahmetyilmaz.dev',
        address: 'Kadikoy, Istanbul',
        summary: '8 yildir modern web teknolojileri (React, Node.js, TypeScript) ile yuksek performansli yazilimlar gelistiren ve micro-frontends konularinda deneyimli yazilim muhendisi.'
      },
      experience: [
        {
          id: '1',
          company: 'Tekno Holding A.S.',
          role: 'Team Lead / Tech Lead',
          startDate: '2022',
          endDate: 'Devam Ediyor',
          description: 'React ve Node.js kullanan 8 kisilik yazilim ekibine liderlik etme, sistem mimarisi tasarimi.'
        },
        {
          id: '2',
          company: 'Soft Yazilim Ltd.',
          role: 'Full Stack Developer',
          startDate: '2018',
          endDate: '2022',
          description: 'E-ticaret platformlarinin gelistirilmesi, RESTful API servislerinin tasarlanmasi.'
        }
      ],
      education: [
        {
          id: '1',
          school: 'Bogazici Universitesi',
          degree: 'Bilgisayar Muhendisligi (Lisans)',
          startDate: '2013',
          endDate: '2018',
          description: 'Ag ve veritabani yonetim sistemleri projeleri odakli lisans egitimi.'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'EvrakFix V3.0 Toolset',
          description: 'Tarayici tabanlı, sunucusuz calisan client-side PDF ve evrak manipulasyon platformu.',
          link: 'github.com/evrakfix'
        }
      ],
      skills: [
        { id: '1', name: 'JavaScript / TypeScript', level: 'Uzman' },
        { id: '2', name: 'React / Next.js', level: 'Uzman' },
        { id: '3', name: 'Node.js', level: 'Ileri' }
      ],
      languages: [
        { id: '1', name: 'Ingilizce', level: 'C1' },
        { id: '2', name: 'Almanca', level: 'A2' }
      ]
    });
    setActiveSection('personal');
  };

  const handleClear = () => {
    if (confirm('Tüm bilgileri temizlemek istediğinize emin misiniz?')) {
      setCvData(initialCVData);
      setActiveSection('personal');
    }
  };

  // Generate PDF and trigger download
  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      if (!cvData.personal.fullName) {
        throw new Error('Lütfen en azından "Ad Soyad" alanını doldurun.');
      }
      const blob = await generateCvPdf(cvData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = cvData.personal.fullName.replace(/\s+/g, '_').toLowerCase();
      a.download = `cv_${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('CV PDF generation error:', err);
      setError(err.message || 'Özgeçmiş PDF belgesi oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    {
      title: 'Bilgilerinizi Doldurun',
      description: 'Kişisel bilgiler, iş deneyimleri, eğitim, yetenekler, diller ve proje kategorilerini doldurun. Boş bırakılan alanlar PDF\'e eklenmez.'
    },
    {
      title: 'Şablonu Canlandırın',
      description: 'İsterseniz tek tıkla "Örnek Doldur" butonunu kullanarak profesyonel bir örnek üzerinden düzenleme yapmaya başlayın.'
    },
    {
      title: 'Güvenle İndirin',
      description: '"CV\'yi PDF Olarak İndir" butonuna tıklayarak A4 boyutunda hazırlanan resmi özgeçmiş belgenizi anında indirin.'
    }
  ];

  const faqs = [
    {
      question: 'Girdiğim kişisel veriler güvende mi?',
      answer: 'Kesinlikle evet. EvrakFix bir veritabanı veya üyelik sistemine sahip değildir. Girdiğiniz isim, telefon, iş deneyimi gibi hassas hiçbir veri sunucularımıza yüklenmez. Tüm PDF oluşturma işlemi doğrudan tarayıcınızın belleğinde (client-side) yapılır.'
    },
    {
      question: 'Hangi alanları boş bırakabilirim?',
      answer: 'Adınız soyadınız dışındaki dilediğiniz tüm alanları boş bırakabilirsiniz. Boş bırakılan kategoriler veya kutucuklar PDF şablonunda otomatik gizlenir ve belgede çirkin boşluklar oluşturmaz.'
    },
    {
      question: 'İngilizce karakter sınırı var mıdır?',
      answer: 'Yazıcı standartları gereği Helvetica yazı tipi kullanılmaktadır. Türkçe harfler (ı, ş, ğ vb.) PDF oluşturulurken otomatik olarak uyumlu muadillerine (i, s, g) dönüştürülerek bozuk sembollerin oluşması engellenir.'
    },
    {
      question: 'Hazırladığım CV\'yi daha sonra tekrar düzenleyebilir miyim?',
      answer: 'Verileriniz sunucuya kaydedilmediği için tarayıcı sekmesini kapattığınızda sıfırlanır. Ancak sekme açık kaldığı sürece dilediğiniz kadar düzenleme yapıp yeniden PDF indirebilirsiniz.'
    }
  ];

  const seoDescription = `Ücretsiz, üyeliksiz ve tamamen yerel çalışan CV oluşturucu ile kurumsal şablonlarda profesyonel özgeçmiş hazırlayın. Girdiğiniz hassas veriler hiçbir sunucuya yüklenmez, cihazınızda PDF olarak üretilir.`;

  const exampleUsage = `Hızlıca bir iş ilanına başvuracaksınız ve güncel bir özgeçmişiniz yok. Bu araca girip kişisel bilgilerinizi, çalıştığınız son 2 firmayı ve üniversitenizi yazarsınız. 'PDF Olarak İndir' butonuna bastığınızda, kurumsal standartlarda tasarlanmış, navy aksanlı, A4 dikey özgeçmiş PDF dosyanız 10 saniye içinde indirilir.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>CV / Özgeçmiş Oluşturucu</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Hiçbir sunucuya veri göndermeden, tarayıcınızda kurumsal standartta şık A4 PDF özgeçmişler hazırlayın.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Özgeçmiş verileriniz tamamen tarayıcınızın yerel belleğinde işlenir. İnternete veya buluta gönderilmez.</span>
          <button 
            onClick={openSecurityModal}
            className="text-xs font-bold text-emerald-750 hover:text-emerald-955 underline shrink-0 transition-colors text-left cursor-pointer"
          >
            Nasıl Güvende? Öğrenin
          </button>
        </div>
      </Alert>

      {error && (
        <Alert variant="error" icon={<Trash2 className="h-5 w-5" />}>
          {error}
        </Alert>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Forms (Accordion) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Quick Actions Header */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Veri Giriş Paneli</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={fillSampleData}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Örnek Doldur
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Temizle
              </button>
            </div>
          </div>

          {/* 1. Personal Info */}
          <div className="rounded-2xl border border-slate-150 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection('personal')}
              className="w-full flex items-center justify-between p-4.5 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="h-5 w-5 text-blue-600" />
                <span className="text-xs sm:text-sm">Kişisel Bilgiler & Özet</span>
              </div>
              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeSection === 'personal' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeSection === 'personal' && (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-4 bg-slate-50/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Ad Soyad *</label>
                    <input
                      type="text"
                      value={cvData.personal.fullName}
                      onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                      placeholder="Ahmet Yılmaz"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Mesleki Unvan</label>
                    <input
                      type="text"
                      value={cvData.personal.title}
                      onChange={(e) => handlePersonalChange('title', e.target.value)}
                      placeholder="Kıdemli Yazılım Geliştirici"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">E-posta Adresi</label>
                    <input
                      type="email"
                      value={cvData.personal.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      placeholder="isim@adres.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Telefon Numarası</label>
                    <input
                      type="text"
                      value={cvData.personal.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="+90 555 123 4567"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Web Sitesi / Portfolyo</label>
                    <input
                      type="text"
                      value={cvData.personal.website}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      placeholder="ahmetyilmaz.dev"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Adres / Şehir</label>
                    <input
                      type="text"
                      value={cvData.personal.address}
                      onChange={(e) => handlePersonalChange('address', e.target.value)}
                      placeholder="Kadıköy, İstanbul"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500">Kişisel Özet / Ön Yazı</label>
                  <textarea
                    rows={3}
                    value={cvData.personal.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    placeholder="Kendinizi, yetkinliklerinizi ve hedeflerinizi özetleyen kısa bir biyografi girin..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-xs sm:text-sm font-semibold transition resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Experience */}
          <div className="rounded-2xl border border-slate-150 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection('experience')}
              className="w-full flex items-center justify-between p-4.5 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="text-xs sm:text-sm">İş Deneyimi ({cvData.experience.length})</span>
              </div>
              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeSection === 'experience' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeSection === 'experience' && (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-5 bg-slate-50/10">
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-white rounded-xl border border-slate-150 flex flex-col gap-4 relative">
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-650 transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Şirket Adı</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Tekno Holding A.Ş."
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Görev / Rol</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Team Lead"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Başlangıç Tarihi (Yıl)</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="2022"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Bitiş Tarihi (veya Devam)</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="Devam Ediyor"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400">Açıklama / Sorumluluklar</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Yaptığınız işlerden, kazandığınız başarılardan kısaca bahsedin..."
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 resize-none"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addExperience}
                  className="border-dashed border-slate-300 text-slate-550 text-xs font-bold py-2 flex items-center justify-center gap-1 hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  İş Deneyimi Ekle
                </Button>
              </div>
            )}
          </div>

          {/* 3. Education */}
          <div className="rounded-2xl border border-slate-150 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection('education')}
              className="w-full flex items-center justify-between p-4.5 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="text-xs sm:text-sm">Eğitim Bilgileri ({cvData.education.length})</span>
              </div>
              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeSection === 'education' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeSection === 'education' && (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-5 bg-slate-50/10">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-white rounded-xl border border-slate-155 flex flex-col gap-4 relative">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-650 transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Okul Adı / Üniversite</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="Boğaziçi Üniversitesi"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Bölüm / Derece</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bilgisayar Mühendisliği (Lisans)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Başlangıç Tarihi (Yıl)</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="2013"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Mezuniyet Tarihi</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="2018"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400">Ek Açıklama / Derece (Varsa)</label>
                      <textarea
                        rows={1}
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        placeholder="Ortalama veya aldığınız önemli başarılar..."
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 resize-none"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addEducation}
                  className="border-dashed border-slate-300 text-slate-550 text-xs font-bold py-2 flex items-center justify-center gap-1 hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Eğitim Ekle
                </Button>
              </div>
            )}
          </div>

          {/* 4. Projects */}
          <div className="rounded-2xl border border-slate-150 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection('projects')}
              className="w-full flex items-center justify-between p-4.5 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-xs sm:text-sm">Projeler ({cvData.projects.length})</span>
              </div>
              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeSection === 'projects' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeSection === 'projects' && (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-5 bg-slate-50/10">
                {cvData.projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-white rounded-xl border border-slate-150 flex flex-col gap-4 relative">
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-650 transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Proje Adı</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="EvrakFix V3.0 Toolset"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400">Proje Bağlantısı (Link)</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          placeholder="github.com/proje"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400">Proje Açıklaması</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Projede hangi teknolojileri kullandınız, ne işe yarıyor..."
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 resize-none"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addProject}
                  className="border-dashed border-slate-300 text-slate-550 text-xs font-bold py-2 flex items-center justify-center gap-1 hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Proje Ekle
                </Button>
              </div>
            )}
          </div>

          {/* 5. Skills & Languages */}
          <div className="rounded-2xl border border-slate-150 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection('skills-lang')}
              className="w-full flex items-center justify-between p-4.5 font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Code className="h-5 w-5 text-blue-600" />
                <span className="text-xs sm:text-sm">Yetenekler & Yabancı Diller</span>
              </div>
              <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeSection === 'skills-lang' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeSection === 'skills-lang' && (
              <div className="p-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/10">
                {/* Skills subcolumn */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Yetenekler</span>
                    <button onClick={addSkill} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5 hover:underline cursor-pointer">
                      <Plus className="h-3 w-3" /> Ekle
                    </button>
                  </span>
                  {cvData.skills.map((sk) => (
                    <div key={sk.id} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-150 relative">
                      <input
                        type="text"
                        value={sk.name}
                        onChange={(e) => updateSkill(sk.id, 'name', e.target.value)}
                        placeholder="React / TypeScript"
                        className="w-2/3 px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <input
                        type="text"
                        value={sk.level}
                        onChange={(e) => updateSkill(sk.id, 'level', e.target.value)}
                        placeholder="Uzman"
                        className="w-1/3 px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <button onClick={() => removeSkill(sk.id)} className="text-slate-400 hover:text-red-650 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Languages subcolumn */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Yabancı Diller</span>
                    <button onClick={addLanguage} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5 hover:underline cursor-pointer">
                      <Plus className="h-3 w-3" /> Ekle
                    </button>
                  </span>
                  {cvData.languages.map((lang) => (
                    <div key={lang.id} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-150 relative">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                        placeholder="İngilizce"
                        className="w-2/3 px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <input
                        type="text"
                        value={lang.level}
                        onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                        placeholder="C1"
                        className="w-1/3 px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                      <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-650 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: PDF Output Action */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-md font-bold text-slate-100 border-b border-white/10 pb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-400" />
              <span>Dışa Aktar</span>
            </h3>

            <p className="text-xs text-slate-350 leading-relaxed font-light">
              Yazdığınız tüm bilgiler A4 boyutunda, kurumsal yazı biçimine uygun, lacivert detaylı şık bir PDF şablonuna yerleştirilecektir.
            </p>

            <Button
              variant="primary"
              disabled={isGenerating || !cvData.personal.fullName}
              onClick={handleGeneratePdf}
              className="bg-blue-600 hover:bg-blue-700 font-bold flex items-center justify-center gap-2 cursor-pointer w-full py-3 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>PDF Üretiliyor...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>CV'yi PDF Olarak İndir</span>
                </>
              )}
            </Button>
            
            {!cvData.personal.fullName && (
              <span className="text-[10px] text-red-300 text-center font-bold">
                * PDF oluşturmak için en azından Ad Soyad alanını girmelisiniz.
              </span>
            )}
          </Card>
        </div>
      </div>

      <ToolSEOInfo
        toolName="CV / Özgeçmiş Oluşturucu"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

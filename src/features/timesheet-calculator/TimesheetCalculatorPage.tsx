import * as React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { CalendarDays, Shield, Clock, Plus, Trash2, Download, RefreshCw, FileText } from 'lucide-react';
import { ToolSEOInfo } from '../../components/ui/ToolSEOInfo';
import { openSecurityModal } from '../../lib/utils/security';
import { processTimesheet, exportToCsv, generateTimesheetPdf, type TimesheetLogItem } from './timesheetCalculator.service';

export const TimesheetCalculatorPage = () => {
  const [logs, setLogs] = React.useState<TimesheetLogItem[]>([
    {
      id: '1',
      date: new Date().toISOString().substring(0, 10),
      startTime: '09:00',
      endTime: '18:00',
      breakMinutes: 60,
      hourlyRate: 200,
      overtimeMultiplier: 1.0,
      notes: 'Standart Gunluk Calisma'
    }
  ]);

  // Entry Form States
  const [date, setDate] = React.useState<string>(new Date().toISOString().substring(0, 10));
  const [startTime, setStartTime] = React.useState<string>('09:00');
  const [endTime, setEndTime] = React.useState<string>('18:00');
  const [breakMinutes, setBreakMinutes] = React.useState<number>(60);
  const [hourlyRate, setHourlyRate] = React.useState<number>(200);
  const [overtimeMultiplier, setOvertimeMultiplier] = React.useState<number>(1.0);
  const [notes, setNotes] = React.useState<string>('');
  
  const [currency, setCurrency] = React.useState<string>('₺');
  const [isProcessingPdf, setIsProcessingPdf] = React.useState<boolean>(false);

  // Process sheet outputs
  const { rows, summary } = React.useMemo(() => {
    return processTimesheet(logs);
  }, [logs]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TimesheetLogItem = {
      id: Date.now().toString(),
      date,
      startTime,
      endTime,
      breakMinutes,
      hourlyRate,
      overtimeMultiplier,
      notes
    };
    setLogs(prev => [...prev, newLog].sort((a, b) => b.date.localeCompare(a.date)));
    setNotes(''); // clear notes
  };

  const handleRemoveLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const handleDownloadCsv = () => {
    if (rows.length === 0) return;
    const csvContent = exportToCsv(rows, currency);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evrakfix_zaman_cizelgesi_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (rows.length === 0) return;
    setIsProcessingPdf(true);
    try {
      const pdfBlob = await generateTimesheetPdf(rows, summary, currency);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evrakfix_timesheet_${new Date().toISOString().substring(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Timesheet PDF raporu oluşturulurken bir sorun yaşandı.');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const formatCurrencyValue = (val: number) => {
    return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const steps = [
    {
      title: 'Maaş ve Para Birimi Tanımlayın',
      description: 'Hesaplamalara baz oluşturacak standart saatlik çalışma ücretinizi ve para biriminizi (₺, $, €, £) seçin.'
    },
    {
      title: 'Mesai Bilgilerini Ekle',
      description: 'Çalıştığınız tarihi, işe giriş ve çıkış saatlerini, mola süresini ve mesai notlarınızı formdan girerek listeye ekleyin.'
    },
    {
      title: 'Fazla Mesaileri Özelleştirin',
      description: 'Resmi tatil veya pazar mesaileri için fazla mesai katsayısını (1.5x, 2.0x, 2.5x) seçip hak edişlerinizi doğru hesaplatın.'
    },
    {
      title: 'Kazanç Raporlarınızı Dışa Aktarın',
      description: 'Zaman çizelgenizi ve kazanç dökümünüzü tek tıkla Excel uyumlu CSV veya kurumsal PDF dosyası olarak indirin.'
    }
  ];

  const faqs = [
    {
      question: 'Gece vardiyaları (ertesi güne sarkan mesailer) nasıl hesaplanır?',
      answer: 'EvrakFix mesai hesaplayıcısı akıllı saat algılama motoruna sahiptir. Çıkış saatini giriş saatinden daha erken yazarsanız (örneğin 22:00 giriş, 06:00 çıkış), sistem gece yarısını geçtiğinizi otomatik algılar ve vardiyayı 8 saatlik çalışma süresi olarak doğru şekilde hesaplar.'
    },
    {
      question: 'Zaman çizelgesi ve kazanç listem sunucuya gönderiliyor mu?',
      answer: 'Hayır, verileriniz tamamen yerel tarayıcınızda (RAM bellek düzeyinde) tutulur ve işlenir. İnternete hiçbir bilgi gönderilmez. Gizliliğiniz %100 koruma altındadır.'
    },
    {
      question: 'Fazla mesai çarpanları ne anlama gelir?',
      answer: 'Standart gün dışındaki (örneğin hafta sonu veya resmi tatiller) çalışmalar genellikle ek ücrete tabidir. 1.5 katsayısı %50 fazla ücret ödemesini, 2.0 katsayısı ise çift katı (yüzde 100 zamlı) saatlik ücret ödemesini hesaplar.'
    },
    {
      question: 'Çıktı PDF dosyasını şirketlere sunabilir miyim?',
      answer: 'Evet, üretilen PDF zaman çizelgesi (Timesheet) temiz, yapılandırılmış ve kurumsal bir tablo görünümündedir. Serbest çalışanlar (freelancer), danışmanlar veya ek mesai yapan personel hakediş ispatı olarak bunu sunabilir.'
    }
  ];

  const seoDescription = `Günlük mesailerinizi, mola kesintilerini ve saatlik ücret çarpanlarınızı tarayıcıda kolayca hesaplayın. Excel uyumlu CSV veya kurumsal PDF zaman çizelgesi indirin.`;
  const exampleUsage = `Ay boyunca her hafta yaptığınız ek mesaileri tarih tarih girerek, standart ve fazla mesai oranlarıyla toplam hak edişinizi kurumsal bir tablo haline getirip müşterinize fatura ekinde sunmak için PDF zaman çizelgesi üretebilirsiniz.`;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <span>Mesai & Kazanç Hesaplayıcı (Timesheet)</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Çalışma saatlerinizi, mola sürelerinizi ve saatlik kazanç katsayılarınızı girerek zaman çizelgesi raporunuzu anında oluşturun.
        </p>
      </div>

      {/* Security Alert */}
      <Alert variant="success" icon={<Shield className="h-5 w-5 text-emerald-600 animate-pulse" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <span>Zaman çizelgesi verileriniz ve saatlik ücretleriniz sunucularımıza yüklenmez. Tamamen yerel çalışır.</span>
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
        {/* Left column: Parameters & Shift Adder */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Settings Card */}
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-blue-600" />
              <span>Genel Ücret Ayarları</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="base-rate" className="text-xs font-bold text-slate-600">Saatlik Ücret</label>
                <input
                  id="base-rate"
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="currency-select" className="text-xs font-bold text-slate-600">Para Birimi</label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm bg-white font-semibold transition-all"
                >
                  <option value="₺">Türk Lirası (₺)</option>
                  <option value="$">Dolar ($)</option>
                  <option value="€">Euro (€)</option>
                  <option value="£">Sterlin (£)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Shift Form Card */}
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
              <span>Yeni Mesai Kaydı Ekle</span>
            </h2>
            <form onSubmit={handleAddLog} className="flex flex-col gap-4">
              {/* Date */}
              <div className="flex flex-col gap-1">
                <label htmlFor="shift-date" className="text-[11px] font-bold text-slate-500">Tarih</label>
                <input
                  id="shift-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs font-semibold"
                />
              </div>

              {/* Hours Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="shift-start" className="text-[11px] font-bold text-slate-500">Giriş Saati</label>
                  <input
                    id="shift-start"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="shift-end" className="text-[11px] font-bold text-slate-500">Çıkış Saati</label>
                  <input
                    id="shift-end"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="shift-break" className="text-[11px] font-bold text-slate-500">Mola (Dk)</label>
                  <input
                    id="shift-break"
                    type="number"
                    min="0"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs text-center font-semibold"
                  />
                </div>
              </div>

              {/* Multiplier */}
              <div className="flex flex-col gap-1">
                <label htmlFor="shift-multiplier" className="text-[11px] font-bold text-slate-500">Mesai Katsayısı (Çarpan)</label>
                <select
                  id="shift-multiplier"
                  value={overtimeMultiplier}
                  onChange={(e) => setOvertimeMultiplier(parseFloat(e.target.value) || 1.0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs bg-white font-semibold"
                >
                  <option value={1.0}>Normal Mesai (1.0x)</option>
                  <option value={1.5}>Fazla Mesai (1.5x)</option>
                  <option value={2.0}>Resmi Tatil / Pazar (2.0x)</option>
                  <option value={2.5}>Bayram Çalışması (2.5x)</option>
                </select>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label htmlFor="shift-notes" className="text-[11px] font-bold text-slate-500">Açıklama / Not</label>
                <input
                  id="shift-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="örn: Web Geliştirme Faz-3"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 text-xs"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 py-2.5 mt-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Listeye Mesai Ekle
              </Button>
            </form>
          </Card>
        </div>

        {/* Right column: Timesheet log table and summary */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          <Card className="p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Zaman Çizelgesi Raporu</h3>
              {logs.length > 0 && (
                <button
                  onClick={() => setLogs([])}
                  className="text-xs font-bold text-slate-500 hover:text-red-650 transition-colors cursor-pointer"
                >
                  Tümünü Sil
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                Kayıtlı mesai bulunamadı. Sol taraftaki formu kullanarak listenizi oluşturun.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Scrollable Table */}
                <div className="overflow-x-auto border border-slate-150 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-150">
                      <tr>
                        <th className="p-3">Tarih</th>
                        <th className="p-3">Saatler</th>
                        <th className="p-3">Mola</th>
                        <th className="p-3">Süre</th>
                        <th className="p-3">Kazanç</th>
                        <th className="p-3">Not</th>
                        <th className="p-3 text-center w-10">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rows.map((row) => (
                        <tr key={row.logId} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold">{row.date}</td>
                          <td className="p-3 font-mono">{row.startTime} - {row.endTime}</td>
                          <td className="p-3 text-slate-500">{row.breakMinutes} dk</td>
                          <td className="p-3 font-semibold text-slate-800">{row.totalHours.toFixed(1)} sa</td>
                          <td className="p-3 font-bold text-blue-650">{formatCurrencyValue(row.earnings)}</td>
                          <td className="p-3 truncate max-w-[120px]" title={row.notes}>{row.notes || '-'}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveLog(row.logId)}
                              className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Aggregate Summary Block */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-900 shadow-md">
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Toplam Çalışma</span>
                    <span className="text-lg font-black">{summary.totalHours.toFixed(1)} Saat</span>
                  </div>
                  <div className="flex flex-col gap-1 justify-end text-right border-l border-white/10 pl-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Toplam Hak Ediş</span>
                    <span className="text-xl font-black text-emerald-400">{formatCurrencyValue(summary.totalEarnings)}</span>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadCsv}
                    className="w-1/2 border-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 py-2.5 cursor-pointer text-slate-700"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    Excel (CSV) İndir
                  </Button>
                  <Button
                    variant="primary"
                    disabled={isProcessingPdf}
                    onClick={handleDownloadPdf}
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 py-2.5 cursor-pointer shadow-md"
                  >
                    {isProcessingPdf ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Zaman Çizelgesi PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* SEO Section */}
      <ToolSEOInfo
        toolName="Mesai & Kazanç Hesaplayıcı"
        description={seoDescription}
        steps={steps}
        faqs={faqs}
        exampleUsage={exampleUsage}
      />
    </div>
  );
};

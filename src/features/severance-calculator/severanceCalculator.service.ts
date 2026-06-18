import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface SeveranceCalculationOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  grossSalary: number; // monthly gross base salary
  socialBenefits: number; // monthly social benefits (road, food, etc. gross total)
  noticePayAction: 'paid' | 'worked' | 'none'; // notice pay action
  severanceCeiling?: number; // custom severance ceiling, defaults to 41828.42
}

export interface SeveranceCalculationResult {
  employmentDays: number;
  employmentYears: number;
  employmentRemainingDays: number;
  giydirilmisBrutSalary: number;
  severanceBaseSalary: number; // capped by tavan
  grossSeverance: number;
  stampTaxSeverance: number;
  netSeverance: number;
  
  noticeDays: number;
  grossNotice: number;
  incomeTaxNotice: number;
  stampTaxNotice: number;
  netNotice: number;
  
  netTotal: number;
}

function normalizeTurkish(text: string): string {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S');
}

export function calculateSeverancePay(options: SeveranceCalculationOptions): SeveranceCalculationResult {
  const start = new Date(options.startDate);
  const end = new Date(options.endDate);
  
  // Day difference (inclusive of both days)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const employmentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  const employmentYears = Math.floor(employmentDays / 365);
  const employmentRemainingDays = employmentDays % 365;
  
  const giydirilmisBrutSalary = options.grossSalary + options.socialBenefits;
  const tavan = options.severanceCeiling || 41828.42;
  const severanceBaseSalary = Math.min(giydirilmisBrutSalary, tavan);
  
  let grossSeverance = 0;
  let stampTaxSeverance = 0;
  let netSeverance = 0;
  
  // Must work at least 1 year (365 days) for severance pay eligibility
  if (employmentDays >= 365) {
    grossSeverance = (severanceBaseSalary * employmentDays) / 365;
    stampTaxSeverance = grossSeverance * 0.00759; // 0.759% stamp tax
    netSeverance = grossSeverance - stampTaxSeverance;
  }
  
  let noticeDays = 0;
  if (options.noticePayAction === 'paid') {
    if (employmentDays < 182) { // Less than 6 months
      noticeDays = 14;
    } else if (employmentDays < 547) { // 6 months to 1.5 years
      noticeDays = 28;
    } else if (employmentDays < 1095) { // 1.5 years to 3 years
      noticeDays = 42;
    } else { // More than 3 years
      noticeDays = 56;
    }
  }
  
  let grossNotice = 0;
  let incomeTaxNotice = 0;
  let stampTaxNotice = 0;
  let netNotice = 0;
  
  if (noticeDays > 0) {
    grossNotice = (giydirilmisBrutSalary / 30) * noticeDays;
    incomeTaxNotice = grossNotice * 0.15; // 15% income tax
    stampTaxNotice = grossNotice * 0.00759; // 0.759% stamp tax
    netNotice = grossNotice - incomeTaxNotice - stampTaxNotice;
  }
  
  const netTotal = netSeverance + netNotice;
  
  return {
    employmentDays,
    employmentYears,
    employmentRemainingDays,
    giydirilmisBrutSalary,
    severanceBaseSalary,
    grossSeverance,
    stampTaxSeverance,
    netSeverance,
    noticeDays,
    grossNotice,
    incomeTaxNotice,
    stampTaxNotice,
    netNotice,
    netTotal
  };
}

export async function generateSeveranceReportPdf(
  options: SeveranceCalculationOptions,
  result: SeveranceCalculationResult
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  
  pdfDoc.setTitle('Kideme ve Ihbar Tazminati Hesap Raporu');
  pdfDoc.setAuthor('EvrakFix Severance Calculator');
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - 60;
  const marginX = 50;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(val).replace('TRY', 'TL');
  };
  
  // Header Title
  page.drawText(normalizeTurkish('KIDEM VE IHBAR TAZMINATI HESAP RAPORU'), {
    x: marginX,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 10;
  
  // Subtitle decoration line
  page.drawLine({
    start: { x: marginX, y },
    end: { x: A4_WIDTH - marginX, y },
    thickness: 2,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 30;
  
  // Section: Calisan Bilgileri
  page.drawText(normalizeTurkish('1. CALISMA BILGILERI'), {
    x: marginX,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 20;
  
  const infoData = [
    { label: 'Ise Baslama Tarihi:', value: options.startDate },
    { label: 'Isten Cikis Tarihi:', value: options.endDate },
    { label: 'Toplam Calisma Suresi:', value: `${result.employmentYears} Yil, ${result.employmentRemainingDays} Gun (${result.employmentDays} Gun)` },
    { label: 'Brut Temel Maas:', value: formatCurrency(options.grossSalary) },
    { label: 'Ek Brut Sosyal Yardimlar:', value: formatCurrency(options.socialBenefits) },
    { label: 'Giydirilmis Brut Maas:', value: formatCurrency(result.giydirilmisBrutSalary) },
    { label: 'Kideme Esas Brut Maas (Tavan Sinirli):', value: formatCurrency(result.severanceBaseSalary) },
  ];
  
  infoData.forEach(row => {
    page.drawText(normalizeTurkish(row.label), { x: marginX, y, size: 9.5, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(normalizeTurkish(row.value), { x: marginX + 240, y, size: 9.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
    y -= 16;
  });
  
  y -= 14;
  
  // Section: Kidem Tazminati Detaylari
  page.drawText(normalizeTurkish('2. KIDEM TAZMINATI HESAP DETAYLARI'), {
    x: marginX,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 20;
  
  if (result.employmentDays < 365) {
    page.drawText(normalizeTurkish('* Calisanin hizmet suresi 1 yildan az oldugu icin Kidem Tazminatina hak kazanamamistir.'), {
      x: marginX,
      y,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.8, 0.2, 0.2)
    });
    y -= 20;
  } else {
    const sevData = [
      { label: 'Kidem Tazminati Brut Tutari:', value: formatCurrency(result.grossSeverance) },
      { label: 'Damga Vergisi Kesintisi (%0.759):', value: `- ${formatCurrency(result.stampTaxSeverance)}` },
      { label: 'NET KIDEM TAZMINATI:', value: formatCurrency(result.netSeverance), highlight: true }
    ];
    
    sevData.forEach(row => {
      page.drawText(normalizeTurkish(row.label), {
        x: marginX,
        y,
        size: 9.5,
        font: row.highlight ? fontBold : fontRegular,
        color: row.highlight ? rgb(0.12, 0.27, 0.58) : rgb(0.3, 0.3, 0.3)
      });
      page.drawText(normalizeTurkish(row.value), {
        x: marginX + 240,
        y,
        size: 9.5,
        font: row.highlight ? fontBold : fontRegular,
        color: row.highlight ? rgb(0.12, 0.27, 0.58) : rgb(0.1, 0.1, 0.1)
      });
      y -= 16;
    });
  }
  
  y -= 14;
  
  // Section: Ihbar Tazminati Detaylari
  page.drawText(normalizeTurkish('3. IHBAR TAZMINATI HESAP DETAYLARI'), {
    x: marginX,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 20;
  
  if (options.noticePayAction === 'none') {
    page.drawText(normalizeTurkish('* Ihbar tazminati hesaplanmamistir.'), {
      x: marginX,
      y,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    });
    y -= 20;
  } else if (options.noticePayAction === 'worked') {
    page.drawText(normalizeTurkish('* Calisan ihbar suresini fiilen calisarak doldurmustur, tazminat odenmeyecektir.'), {
      x: marginX,
      y,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.3, 0.5, 0.3)
    });
    y -= 20;
  } else {
    const notData = [
      { label: 'Ihbar Suresi (Gun):', value: `${result.noticeDays} Gun` },
      { label: 'Ihbar Tazminati Brut Tutari:', value: formatCurrency(result.grossNotice) },
      { label: 'Gelir Vergisi Kesintisi (%15):', value: `- ${formatCurrency(result.incomeTaxNotice)}` },
      { label: 'Damga Vergisi Kesintisi (%0.759):', value: `- ${formatCurrency(result.stampTaxNotice)}` },
      { label: 'NET IHBAR TAZMINATI:', value: formatCurrency(result.netNotice), highlight: true }
    ];
    
    notData.forEach(row => {
      page.drawText(normalizeTurkish(row.label), {
        x: marginX,
        y,
        size: 9.5,
        font: row.highlight ? fontBold : fontRegular,
        color: row.highlight ? rgb(0.12, 0.27, 0.58) : rgb(0.3, 0.3, 0.3)
      });
      page.drawText(normalizeTurkish(row.value), {
        x: marginX + 240,
        y,
        size: 9.5,
        font: row.highlight ? fontBold : fontRegular,
        color: row.highlight ? rgb(0.12, 0.27, 0.58) : rgb(0.1, 0.1, 0.1)
      });
      y -= 16;
    });
  }
  
  y -= 20;
  
  // Total Divider
  page.drawLine({
    start: { x: marginX, y },
    end: { x: A4_WIDTH - marginX, y },
    thickness: 1,
    color: rgb(0.8, 0.83, 0.9)
  });
  y -= 25;
  
  // Net Total Payout
  page.drawText(normalizeTurkish('NET ODENECEK TOPLAM TAZMINAT:'), {
    x: marginX,
    y,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  page.drawText(normalizeTurkish(formatCurrency(result.netTotal)), {
    x: marginX + 240,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.15, 0.58, 0.27) // Emerald green
  });
  
  y -= 60;
  
  // Disclaimer footer
  page.drawText(normalizeTurkish('* Isbu rapor bilgilendirme amacli olup hukuki veya resmi tebligat niteligi tasimaz.'), {
    x: marginX,
    y,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.6, 0.6)
  });
  
  page.drawText(normalizeTurkish('EvrakFix - Yerel Tarayici Uzerinde Guvenli Belge Yardimcilari'), {
    x: marginX,
    y: y - 12,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.6, 0.6)
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

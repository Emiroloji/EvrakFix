import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface TimesheetLogItem {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  breakMinutes: number;
  hourlyRate: number;
  overtimeMultiplier: number;
  notes: string;
}

export interface TimesheetResultRow {
  logId: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  earnings: number;
  notes: string;
}

export interface TimesheetSummary {
  totalHours: number;
  totalEarnings: number;
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

export function calculateLogHours(item: TimesheetLogItem): number {
  const [startH, startM] = item.startTime.split(':').map(Number);
  const [endH, endM] = item.endTime.split(':').map(Number);
  
  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  
  if (endMinutes < startMinutes) {
    // Overnight shift crossing midnight
    endMinutes += 24 * 60;
  }
  
  const diffMinutes = endMinutes - startMinutes;
  const netMinutes = diffMinutes - item.breakMinutes;
  
  return Math.max(0, netMinutes / 60);
}

export function processTimesheet(items: TimesheetLogItem[]): {
  rows: TimesheetResultRow[];
  summary: TimesheetSummary;
} {
  let totalHours = 0;
  let totalEarnings = 0;
  
  const rows = items.map(item => {
    const hours = calculateLogHours(item);
    const earnings = hours * item.hourlyRate * item.overtimeMultiplier;
    
    totalHours += hours;
    totalEarnings += earnings;
    
    return {
      logId: item.id,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      breakMinutes: item.breakMinutes,
      totalHours: hours,
      earnings,
      notes: item.notes
    };
  });
  
  return {
    rows,
    summary: {
      totalHours,
      totalEarnings
    }
  };
}

export function exportToCsv(rows: TimesheetResultRow[], currencySymbol: string): string {
  const headers = ['Tarih', 'Giris Saati', 'Cikis Saati', 'Mola (Dk)', 'Calisilan Sure (Saat)', 'Saatlik Ucret', 'Kazanc', 'Notlar'];
  
  const csvLines = [headers.join(',')];
  
  rows.forEach(r => {
    const hourly = r.totalHours > 0 ? (r.earnings / r.totalHours).toFixed(2) : '0';
    const line = [
      r.date,
      r.startTime,
      r.endTime,
      r.breakMinutes.toString(),
      r.totalHours.toFixed(2),
      `"${hourly} ${currencySymbol}"`,
      `"${r.earnings.toFixed(2)} ${currencySymbol}"`,
      `"${r.notes.replace(/"/g, '""')}"`
    ];
    csvLines.push(line.join(','));
  });
  
  return csvLines.join('\n');
}

export async function generateTimesheetPdf(
  rows: TimesheetResultRow[],
  summary: TimesheetSummary,
  currencySymbol: string
): Promise<Blob> {
  const pdfDoc = PDFDocument.create();
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  
  const pdfDocInstance = await pdfDoc;
  pdfDocInstance.setTitle('Mesai ve Kazanc Raporu');
  pdfDocInstance.setAuthor('EvrakFix Timesheet Generator');
  
  const fontRegular = await pdfDocInstance.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDocInstance.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDocInstance.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - 60;
  const marginX = 40;
  
  // Format currency representation
  const formatCurrency = (val: number) => {
    return `${val.toFixed(2)} ${currencySymbol}`;
  };

  // Header Title
  page.drawText(normalizeTurkish('MESAI VE KAZANC ZAMAN CIZELGESI (TIMESHEET)'), {
    x: marginX,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 10;
  
  page.drawLine({
    start: { x: marginX, y },
    end: { x: A4_WIDTH - marginX, y },
    thickness: 1.5,
    color: rgb(0.12, 0.27, 0.58)
  });
  y -= 30;
  
  // Table Headers
  const tableHeaders = ['Tarih', 'Baslangic', 'Bitis', 'Mola', 'Saat', 'Kazanc', 'Notlar'];
  const colWidths = [70, 60, 60, 45, 45, 75, 160];
  
  const drawTableRow = (cols: string[], isHeader = false) => {
    let currentX = marginX;
    cols.forEach((col, idx) => {
      page.drawText(normalizeTurkish(col), {
        x: currentX,
        y,
        size: isHeader ? 8.5 : 8,
        font: isHeader ? fontBold : fontRegular,
        color: isHeader ? rgb(0.1, 0.1, 0.1) : rgb(0.25, 0.25, 0.25)
      });
      currentX += colWidths[idx];
    });
    
    // Bottom border for the row
    page.drawLine({
      start: { x: marginX, y: y - 5 },
      end: { x: A4_WIDTH - marginX, y: y - 5 },
      thickness: isHeader ? 1 : 0.5,
      color: rgb(0.85, 0.87, 0.9)
    });
    
    y -= 18;
  };
  
  // Draw headers
  drawTableRow(tableHeaders, true);
  y -= 4;
  
  // Draw rows (cap at first 30 entries to keep it inside single page, normal for monthly timesheets)
  const maxRows = Math.min(rows.length, 32);
  for (let i = 0; i < maxRows; i++) {
    const r = rows[i];
    const rowValues = [
      r.date,
      r.startTime,
      r.endTime,
      `${r.breakMinutes} dk`,
      `${r.totalHours.toFixed(1)} sa`,
      formatCurrency(r.earnings),
      r.notes || '-'
    ];
    drawTableRow(rowValues);
    
    // Page break prevention
    if (y < 80 && i < maxRows - 1) {
      break; // stop drawing to prevent overflow (simplistic layout)
    }
  }
  
  y -= 20;
  
  // Draw summary block
  page.drawRectangle({
    x: marginX,
    y: y - 45,
    width: A4_WIDTH - 2 * marginX,
    height: 50,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.85, 0.87, 0.9),
    borderWidth: 1
  });
  
  page.drawText(normalizeTurkish('TOPLAM HESAPLAR:'), {
    x: marginX + 15,
    y: y - 18,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  page.drawText(normalizeTurkish(`Toplam Sure: ${summary.totalHours.toFixed(1)} Saat`), {
    x: marginX + 15,
    y: y - 35,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  page.drawText(normalizeTurkish(`Toplam Kazanc: ${formatCurrency(summary.totalEarnings)}`), {
    x: A4_WIDTH - marginX - 180,
    y: y - 26,
    size: 11,
    font: fontBold,
    color: rgb(0.15, 0.58, 0.27)
  });
  
  const pdfBytes = await pdfDocInstance.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

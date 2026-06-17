export interface InterestPeriod {
  start: Date;
  end: Date;
  rate: number; // annual rate percentage (e.g. 9 for 9%)
}

export interface CalculationRow {
  periodStart: string;
  periodEnd: string;
  rate: number;
  days: number;
  interest: number;
}

export interface CalculationResult {
  principal: number;
  totalInterest: number;
  totalAmount: number;
  totalDays: number;
  rows: CalculationRow[];
}

// Historical rates in Turkey
const YASAL_FAIZ_PERIODS: InterestPeriod[] = [
  { start: new Date('2006-01-01'), end: new Date('2024-05-31'), rate: 9 },
  { start: new Date('2024-06-01'), end: new Date('2030-12-31'), rate: 24 }
];

const TICARI_FAIZ_PERIODS: InterestPeriod[] = [
  { start: new Date('2006-01-01'), end: new Date('2022-12-31'), rate: 9.75 },
  { start: new Date('2023-01-01'), end: new Date('2023-12-31'), rate: 16.75 },
  { start: new Date('2024-01-01'), end: new Date('2024-05-20'), rate: 39 },
  { start: new Date('2024-05-21'), end: new Date('2030-12-31'), rate: 48 }
];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${d}.${m}.${y}`;
}

export function calculateInterest(
  principal: number,
  startDateStr: string,
  endDateStr: string,
  type: 'yasal' | 'ticari' | 'custom',
  customRatePercent?: number
): CalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || !startDateStr) throw new Error('Geçersiz başlangıç tarihi.');
  if (isNaN(end.getTime()) || !endDateStr) throw new Error('Geçersiz bitiş tarihi.');
  if (end < start) throw new Error('Bitiş tarihi başlangıç tarihinden önce olamaz.');

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const rows: CalculationRow[] = [];
  let totalInterest = 0;

  if (type === 'custom') {
    const rate = customRatePercent || 0;
    // Interest = Principal * (Rate / 100) * (Days / 365)
    const interest = (principal * (rate / 100) * totalDays) / 365;
    const roundedInterest = Math.round(interest * 100) / 100;
    
    rows.push({
      periodStart: formatDate(start),
      periodEnd: formatDate(end),
      rate,
      days: totalDays,
      interest: roundedInterest
    });
    totalInterest = roundedInterest;
  } else {
    // Day-by-day precision calculation to avoid interval boundary bugs
    let currentDate = new Date(start);
    let currentPeriodStart = new Date(start);
    let currentRate = -1;
    let periodDays = 0;

    while (currentDate <= end) {
      // Find rate for current date
      let rate = 0;
      if (type === 'yasal') {
        const found = YASAL_FAIZ_PERIODS.find(p => currentDate >= p.start && currentDate <= p.end);
        rate = found ? found.rate : YASAL_FAIZ_PERIODS[YASAL_FAIZ_PERIODS.length - 1].rate;
      } else {
        const found = TICARI_FAIZ_PERIODS.find(p => currentDate >= p.start && currentDate <= p.end);
        rate = found ? found.rate : TICARI_FAIZ_PERIODS[TICARI_FAIZ_PERIODS.length - 1].rate;
      }

      if (currentRate === -1) {
        currentRate = rate;
      }

      if (rate !== currentRate) {
        // End of previous rate period
        const periodEnd = new Date(currentDate);
        periodEnd.setDate(periodEnd.getDate() - 1);
        
        const interest = (principal * (currentRate / 100) * periodDays) / 365;
        const roundedInterest = Math.round(interest * 100) / 100;
        
        rows.push({
          periodStart: formatDate(currentPeriodStart),
          periodEnd: formatDate(periodEnd),
          rate: currentRate,
          days: periodDays,
          interest: roundedInterest
        });
        totalInterest += roundedInterest;

        // Start new period
        currentPeriodStart = new Date(currentDate);
        currentRate = rate;
        periodDays = 1;
      } else {
        periodDays++;
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add the final period
    if (periodDays > 0) {
      const interest = (principal * (currentRate / 100) * periodDays) / 365;
      const roundedInterest = Math.round(interest * 100) / 100;
      
      rows.push({
        periodStart: formatDate(currentPeriodStart),
        periodEnd: formatDate(end),
        rate: currentRate,
        days: periodDays,
        interest: roundedInterest
      });
      totalInterest += roundedInterest;
    }
  }

  totalInterest = Math.round(totalInterest * 100) / 100;
  const totalAmount = Math.round((principal + totalInterest) * 100) / 100;

  return {
    principal,
    totalInterest,
    totalAmount,
    totalDays,
    rows
  };
}

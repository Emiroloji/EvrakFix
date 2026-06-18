import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface CoverStampOptions {
  action: 'cover' | 'stamp'; // cover: add page 1, stamp: draw header/footer
  coverStyle: 'modern' | 'classic' | 'minimal';
  title: string;
  subtitle: string;
  author: string;
  date: string;
  archiveNo: string;
  stampPosition: 'top-right' | 'bottom-right' | 'bottom-center';
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

// Draw a realistic archival barcode using simple vertical line blocks
function drawArchiveBarcode(page: any, x: number, y: number, height = 20) {
  let currentX = x;
  // A pseudo barcode sequence representing varied line widths and spaces
  const pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 1, 3, 2, 2, 1, 4];
  pattern.forEach((w, idx) => {
    page.drawRectangle({
      x: currentX,
      y,
      width: w,
      height,
      color: rgb(0.1, 0.1, 0.1)
    });
    currentX += w + (idx % 3 === 0 ? 2 : 1); // add spacing
  });
}

export async function processPdfCoverStamp(
  arrayBuffer: ArrayBuffer,
  options: CoverStampOptions
): Promise<Blob> {
  const originalPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const fontRegular = await newPdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await newPdf.embedFont(StandardFonts.HelveticaBold);
  
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  if (options.action === 'cover') {
    // 1. Add Cover Page
    const coverPage = newPdf.addPage([A4_WIDTH, A4_HEIGHT]);
    
    if (options.coverStyle === 'modern') {
      // Modern Style: Nice navy left sidebar band & dark blue theme
      coverPage.drawRectangle({
        x: 0,
        y: 0,
        width: 60,
        height: A4_HEIGHT,
        color: rgb(0.09, 0.18, 0.36) // Dark blue bar
      });
      
      // Title
      coverPage.drawText(normalizeTurkish(options.title.toUpperCase()), {
        x: 90,
        y: A4_HEIGHT - 200,
        size: 20,
        font: fontBold,
        color: rgb(0.09, 0.18, 0.36)
      });
      
      // Subtitle
      if (options.subtitle) {
        coverPage.drawText(normalizeTurkish(options.subtitle), {
          x: 90,
          y: A4_HEIGHT - 230,
          size: 12,
          font: fontRegular,
          color: rgb(0.4, 0.45, 0.55)
        });
      }
      
      // Horizontal separation line
      coverPage.drawLine({
        start: { x: 90, y: A4_HEIGHT - 260 },
        end: { x: A4_WIDTH - 50, y: A4_HEIGHT - 260 },
        thickness: 1.5,
        color: rgb(0.8, 0.83, 0.9)
      });
      
      // Metadata Details Block
      let detailY = A4_HEIGHT - 320;
      const details = [
        { label: 'HAZIRLAYAN:', val: options.author || '-' },
        { label: 'TARIH:', val: options.date || '-' },
        { label: 'ARSIV NO:', val: options.archiveNo || '-' }
      ];
      
      details.forEach(item => {
        coverPage.drawText(normalizeTurkish(item.label), { x: 90, y: detailY, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
        coverPage.drawText(normalizeTurkish(item.val), { x: 220, y: detailY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
        detailY -= 20;
      });

      // Archival Barcode at bottom right
      if (options.archiveNo) {
        drawArchiveBarcode(coverPage, A4_WIDTH - 150, 80, 24);
        coverPage.drawText(normalizeTurkish(`*${options.archiveNo}*`), {
          x: A4_WIDTH - 150 + 20,
          y: 65,
          size: 8,
          font: fontRegular,
          color: rgb(0.3, 0.3, 0.3)
        });
      }
      
    } else if (options.coverStyle === 'classic') {
      // Classic Style: Double line borders, centered texts
      const borderOffset = 30;
      // Outer border
      coverPage.drawRectangle({
        x: borderOffset,
        y: borderOffset,
        width: A4_WIDTH - 2 * borderOffset,
        height: A4_HEIGHT - 2 * borderOffset,
        borderColor: rgb(0.1, 0.1, 0.1),
        borderWidth: 2,
        color: rgb(1, 1, 1) // transparent inside
      });
      
      // Inner border
      coverPage.drawRectangle({
        x: borderOffset + 4,
        y: borderOffset + 4,
        width: A4_WIDTH - 2 * (borderOffset + 4),
        height: A4_HEIGHT - 2 * (borderOffset + 4),
        borderColor: rgb(0.1, 0.1, 0.1),
        borderWidth: 0.75,
        color: rgb(1, 1, 1)
      });
      
      // Centered Title
      const titleClean = normalizeTurkish(options.title.toUpperCase());
      const titleWidth = fontBold.widthOfTextAtSize(titleClean, 18);
      coverPage.drawText(titleClean, {
        x: (A4_WIDTH - titleWidth) / 2,
        y: A4_HEIGHT - 220,
        size: 18,
        font: fontBold,
        color: rgb(0, 0, 0)
      });
      
      // Centered Subtitle
      if (options.subtitle) {
        const subClean = normalizeTurkish(options.subtitle);
        const subWidth = fontRegular.widthOfTextAtSize(subClean, 11);
        coverPage.drawText(subClean, {
          x: (A4_WIDTH - subWidth) / 2,
          y: A4_HEIGHT - 250,
          size: 11,
          font: fontRegular,
          color: rgb(0.3, 0.3, 0.3)
        });
      }
      
      // Metadata Details centered bottom
      let detailY = 240;
      const authorText = `Hazirlayan: ${options.author || '-'}`;
      const dateText = `Tarih: ${options.date || '-'}`;
      const archiveText = `Arsiv Referans No: ${options.archiveNo || '-'}`;
      
      [authorText, dateText, archiveText].forEach(txt => {
        const cleanTxt = normalizeTurkish(txt);
        const txtWidth = fontRegular.widthOfTextAtSize(cleanTxt, 10);
        coverPage.drawText(cleanTxt, {
          x: (A4_WIDTH - txtWidth) / 2,
          y: detailY,
          size: 10,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2)
        });
        detailY -= 20;
      });
      
    } else {
      // Minimalist Style: Sleek typography, simple black line
      coverPage.drawText(normalizeTurkish(options.title), {
        x: 60,
        y: A4_HEIGHT - 250,
        size: 24,
        font: fontBold,
        color: rgb(0.05, 0.05, 0.05)
      });
      
      if (options.subtitle) {
        coverPage.drawText(normalizeTurkish(options.subtitle), {
          x: 60,
          y: A4_HEIGHT - 280,
          size: 12,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
      
      coverPage.drawLine({
        start: { x: 60, y: A4_HEIGHT - 310 },
        end: { x: 160, y: A4_HEIGHT - 310 },
        thickness: 2,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      coverPage.drawText(normalizeTurkish(`Dosya Referansi: ${options.archiveNo || '-'}`), {
        x: 60,
        y: 180,
        size: 9.5,
        font: fontBold,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      coverPage.drawText(normalizeTurkish(`Hazirlayan: ${options.author || '-'}  |  Tarih: ${options.date || '-'}`), {
        x: 60,
        y: 160,
        size: 9,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5)
      });
    }
  }

  // 2. Process existing pages (either stamping headers/footers, or copying straight)
  const copiedPages = await newPdf.copyPages(originalPdf, originalPdf.getPageIndices());
  
  copiedPages.forEach((page, idx) => {
    if (options.action === 'stamp') {
      const { width, height } = page.getSize();
      
      // Stamp header/footer information
      const stampText = normalizeTurkish(`REF: ${options.archiveNo || 'BELGE'} | TARIH: ${options.date} | SAYFA: ${idx + 1}`);
      const textWidth = fontRegular.widthOfTextAtSize(stampText, 7.5);
      
      if (options.stampPosition === 'top-right') {
        // Draw barcode
        drawArchiveBarcode(page, width - 130, height - 35, 12);
        // Draw text
        page.drawText(stampText, {
          x: width - 130,
          y: height - 45,
          size: 7,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      } else if (options.stampPosition === 'bottom-right') {
        page.drawText(stampText, {
          x: width - textWidth - 30,
          y: 25,
          size: 7.5,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      } else {
        // bottom-center
        page.drawText(stampText, {
          x: (width - textWidth) / 2,
          y: 25,
          size: 7.5,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
    }
    newPdf.addPage(page);
  });

  const finalBytes = await newPdf.save();
  return new Blob([finalBytes as any], { type: 'application/pdf' });
}

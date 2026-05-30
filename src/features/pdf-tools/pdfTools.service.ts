import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export type TextOptions = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  fontSize: number;
};

export type WatermarkOptions = {
  opacity: number;
};

/**
 * Adds an overlay text (e.g. date, names, approvals) onto a specific position on the first page of a PDF.
 */
export async function addTextToPdf(
  file: File,
  text: string,
  options: TextOptions
): Promise<Blob> {
  if (!file) throw new Error('PDF dökümanı yüklenmedi.');
  if (!text.trim()) throw new Error('Eklenecek metin boş olamaz.');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Load font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    if (pages.length === 0) throw new Error('PDF belgesinde sayfa bulunamadı.');

    // Add text to the first page (or could be all, but first page is standard for date/approval)
    const page = pages[0];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    
    const textWidth = helveticaFont.widthOfTextAtSize(text, options.fontSize);
    const textHeight = options.fontSize;

    // Coordinate calculation based on borders (Note: origin is bottom-left)
    let x = 40;
    let y = pageHeight - textHeight - 40; // top-left default

    if (options.position === 'top-right') {
      x = pageWidth - textWidth - 40;
      y = pageHeight - textHeight - 40;
    } else if (options.position === 'bottom-left') {
      x = 40;
      y = 40;
    } else if (options.position === 'bottom-right') {
      x = pageWidth - textWidth - 40;
      y = 40;
    }

    // Draw text
    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.1), // slate-900 like
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('Metin ekleme hatası:', error);
    throw new Error(error.message || 'PDF\'e metin eklenirken beklenmedik bir hata oluştu.');
  }
}

/**
 * Adds a diagonal overlay watermark text across ALL pages of a PDF document with custom opacity.
 */
export async function addWatermarkToPdf(
  file: File,
  watermarkText: string,
  options: WatermarkOptions
): Promise<Blob> {
  if (!file) throw new Error('PDF dökümanı yüklenmedi.');
  if (!watermarkText.trim()) throw new Error('Filigran metni boş olamaz.');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Load standard bold Helvetica font for watermark
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      // Calculate font size dynamically based on page width to fit nicely diagonal
      const fitFontSize = Math.floor(pageWidth / 10);
      
      // Get text width
      const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fitFontSize);
      
      // Center coordinates calculation for rotating 45 degrees
      // Standard approximation to center a rotated line
      const x = (pageWidth - textWidth * Math.cos(Math.PI / 4)) / 2;
      const y = (pageHeight - textWidth * Math.sin(Math.PI / 4)) / 2;

      page.drawText(watermarkText, {
        x: x,
        y: y,
        size: fitFontSize,
        font: helveticaFont,
        color: rgb(0.7, 0.7, 0.7), // slate-300 like grey
        opacity: options.opacity,
        rotate: degrees(45),
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('Filigran ekleme hatası:', error);
    throw new Error(error.message || 'PDF\'e filigran eklenirken beklenmedik bir hata oluştu.');
  }
}

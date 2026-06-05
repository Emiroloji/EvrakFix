import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { PageNumberOptions } from './types';

/**
 * Adds page numbers to a PDF document on the client-side using pdf-lib.
 * 
 * @param file - The original PDF file
 * @param options - Options for page numbering formatting, position, font size, and start number
 * @returns A Promise resolving to a Blob of the numbered PDF
 */
export async function addPageNumbersToPdf(
  file: File,
  options: PageNumberOptions
): Promise<Blob> {
  if (!file) throw new Error('PDF dökümanı yüklenmedi.');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Embed standard Helvetica font (built-in, no internet connection required)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    const pageCount = pages.length;
    if (pageCount === 0) throw new Error('PDF belgesinde sayfa bulunamadı.');

    const margin = 30; // ~1 cm margins from edges

    for (let i = 0; i < pageCount; i++) {
      const page = pages[i];
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      const pageNum = i + options.startFrom;
      
      // Determine page number text format
      let text = '';
      if (options.format === 'number') {
        text = `${pageNum}`;
      } else if (options.format === 'page-number') {
        text = `Sayfa ${pageNum}`;
      } else if (options.format === 'number-total') {
        text = `${pageNum} / ${pageCount}`;
      } else if (options.format === 'page-number-total') {
        text = `Sayfa ${pageNum} / ${pageCount}`;
      }

      const textWidth = helveticaFont.widthOfTextAtSize(text, options.fontSize);
      const textHeight = options.fontSize; // height approximation using font size

      // Coordinate calculations based on position (Origin: bottom-left)
      let x = margin;
      let y = margin;

      switch (options.position) {
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-center':
          x = (pageWidth - textWidth) / 2;
          y = margin;
          break;
        case 'bottom-right':
          x = pageWidth - margin - textWidth;
          y = margin;
          break;
        case 'top-center':
          x = (pageWidth - textWidth) / 2;
          y = pageHeight - margin - textHeight;
          break;
        case 'top-right':
          x = pageWidth - margin - textWidth;
          y = pageHeight - margin - textHeight;
          break;
        default:
          // Default to bottom-center
          x = (pageWidth - textWidth) / 2;
          y = margin;
      }

      // Draw page number on the page
      page.drawText(text, {
        x,
        y,
        size: options.fontSize,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2), // Dark grey for elegant & readable text
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF page numbers service error:', error);
    throw new Error(
      error.message || 'PDF sayfalarına numara eklenirken bir hata oluştu. PDF şifreli veya bozuk olabilir.'
    );
  }
}

import { PDFDocument } from 'pdf-lib';

export interface SplitOptions {
  onlyLandscape: boolean; // Only split landscape pages
  splitDirection: 'vertical'; // Split vertically down the middle
}

/**
 * Splits side-by-side booklet pages into two separate pages natively using pdf-lib.
 * This preserves vector text quality and searchability by embedding the original pages.
 */
export async function splitBookletPdf(
  file: File,
  options: SplitOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (!file) throw new Error('PDF dosyası yüklenmedi.');

  const arrayBuffer = await file.arrayBuffer();
  const srcPdfDoc = await PDFDocument.load(arrayBuffer);
  const srcPages = srcPdfDoc.getPages();
  const numPages = srcPages.length;

  if (numPages === 0) throw new Error('PDF dökümanında sayfa bulunamadı.');

  const outPdfDoc = await PDFDocument.create();

  // Embed all original pages
  const embeddedPages = await outPdfDoc.embedPages(srcPages);

  for (let i = 0; i < numPages; i++) {
    const embPage = embeddedPages[i];
    const originalWidth = srcPages[i].getWidth();
    const originalHeight = srcPages[i].getHeight();

    const isLandscape = originalWidth > originalHeight;

    if (options.onlyLandscape && !isLandscape) {
      // Copy page as-is
      const newPage = outPdfDoc.addPage([originalWidth, originalHeight]);
      newPage.drawPage(embPage, {
        x: 0,
        y: 0,
        width: originalWidth,
        height: originalHeight
      });
    } else {
      // Split page down the middle vertically into two pages
      const halfWidth = originalWidth / 2;

      // 1. Left Page
      const leftPage = outPdfDoc.addPage([halfWidth, originalHeight]);
      leftPage.drawPage(embPage, {
        x: 0,
        y: 0,
        width: originalWidth,
        height: originalHeight
      });

      // 2. Right Page
      const rightPage = outPdfDoc.addPage([halfWidth, originalHeight]);
      rightPage.drawPage(embPage, {
        x: -halfWidth,
        y: 0,
        width: originalWidth,
        height: originalHeight
      });
    }

    if (onProgress) {
      onProgress(i + 1, numPages);
    }
  }

  const pdfBytes = await outPdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

import { PDFDocument } from 'pdf-lib';

export type PageSizePreset = 'A4' | 'Letter' | 'A3' | 'A5';

export interface ResizeOptions {
  preset: PageSizePreset;
  margin: number; // margin in points (e.g. 0 to 50)
}

// Map presets to dimensions in points (72 points = 1 inch)
export const PageSizes: Record<PageSizePreset, { width: number; height: number }> = {
  A4: { width: 595.27, height: 841.89 },
  Letter: { width: 612.00, height: 792.00 },
  A3: { width: 841.89, height: 1190.55 },
  A5: { width: 419.53, height: 595.27 }
};

/**
 * Resizes a PDF natively using pdf-lib by embedding original pages and drawing
 * them onto pages with the target dimensions. Preserves vector quality and text.
 */
export async function resizePdf(
  file: File,
  options: ResizeOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (!file) throw new Error('PDF dosyası yüklenmedi.');

  const arrayBuffer = await file.arrayBuffer();
  const srcPdfDoc = await PDFDocument.load(arrayBuffer);
  const srcPages = srcPdfDoc.getPages();
  const numPages = srcPages.length;

  if (numPages === 0) throw new Error('PDF dökümanında sayfa bulunamadı.');

  const outPdfDoc = await PDFDocument.create();

  // Embed all source pages into the new PDF
  const embeddedPages = await outPdfDoc.embedPages(srcPages);

  const targetSize = PageSizes[options.preset];
  const margin = options.margin;

  for (let i = 0; i < numPages; i++) {
    const embPage = embeddedPages[i];
    const originalWidth = srcPages[i].getWidth();
    const originalHeight = srcPages[i].getHeight();

    // Create a new page with target dimensions
    const newPage = outPdfDoc.addPage([targetSize.width, targetSize.height]);

    // Calculate maximum available area for drawing the embedded page
    const availableWidth = targetSize.width - 2 * margin;
    const availableHeight = targetSize.height - 2 * margin;

    if (availableWidth <= 0 || availableHeight <= 0) {
      throw new Error('Kenar boşluğu sayfa boyutunu aşıyor.');
    }

    // Determine scale factor preserving aspect ratio
    const scaleX = availableWidth / originalWidth;
    const scaleY = availableHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    const drawWidth = originalWidth * scale;
    const drawHeight = originalHeight * scale;

    // Calculate coordinates to center the original page in the available space
    const x = margin + (availableWidth - drawWidth) / 2;
    const y = margin + (availableHeight - drawHeight) / 2;

    newPage.drawPage(embPage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });

    if (onProgress) {
      onProgress(i + 1, numPages);
    }
  }

  const pdfBytes = await outPdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

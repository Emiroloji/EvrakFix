import { PDFDocument, degrees } from 'pdf-lib';
import type { OrganizedPdfPage } from './types';

/**
 * Creates a new PDF document from the original file based on the organized pages list.
 * Only copies non-deleted pages, in the specified order, with rotation applied.
 * All processing is done entirely in the client's browser using pdf-lib.
 * 
 * @param file - The original PDF file
 * @param pages - The organized page settings (order, rotation, deleted state)
 * @returns A Promise resolving to a Blob of the newly organized PDF
 */
export async function createOrganizedPdf(file: File, pages: OrganizedPdfPage[]): Promise<Blob> {
  const activePages = [...pages]
    .filter(p => !p.isDeleted)
    .sort((a, b) => a.currentOrder - b.currentOrder);

  if (activePages.length === 0) {
    throw new Error('PDF oluşturmak için en az bir sayfa seçilmelidir.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const originalPdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();

    // To copy pages, copy them one by one to respect the new ordered arrangement
    for (const pageSetting of activePages) {
      const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageSetting.originalPageIndex]);
      
      // Retrieve the original page's existing rotation (if any)
      const originalPage = originalPdfDoc.getPages()[pageSetting.originalPageIndex];
      const originalRotation = originalPage.getRotation().angle || 0;
      
      // Apply user-specified rotation relative to original rotation
      const targetRotation = (originalRotation + pageSetting.rotation) % 360;
      
      copiedPage.setRotation(degrees(targetRotation));
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newPdfDoc.save();
    return new Blob([newPdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF Düzenleme Hatası:', error);
    throw new Error(
      error.message || 'PDF dosyası düzenlenirken beklenmedik bir hata oluştu.'
    );
  }
}

import { PDFDocument, PDFName } from 'pdf-lib';

/**
 * Loads the original PDF document, copies its pages to a brand new PDF document,
 * clears standard metadata attributes (Title, Author, Subject, Keywords, Creator, Producer),
 * sets CreationDate and ModificationDate to a neutral Epoch 0 date,
 * and deletes underlying XMP Metadata streams and trailer Info dictionary for complete sanitization.
 * 
 * @param file - The original PDF file
 * @returns A Promise resolving to a Blob of the sanitized PDF
 */
export async function cleanPdfMetadata(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const originalPdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();

    // Copy all pages sequentially
    const pages = originalPdfDoc.getPages();
    const pageIndices = Array.from({ length: pages.length }, (_, i) => i);
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));

    // Clear standard metadata using high-level setter methods
    newPdfDoc.setTitle('');
    newPdfDoc.setAuthor('');
    newPdfDoc.setSubject('');
    newPdfDoc.setKeywords([]);
    newPdfDoc.setProducer('');
    newPdfDoc.setCreator('');

    // Set dates to a neutral Date object (Epoch 0)
    const neutralDate = new Date(0);
    newPdfDoc.setCreationDate(neutralDate);
    newPdfDoc.setModificationDate(neutralDate);

    // Deep clean by deleting catalog and context dictionary keys
    try {
      newPdfDoc.catalog.delete(PDFName.of('Metadata'));
      (newPdfDoc.context as any).trailer.delete(PDFName.of('Info'));
    } catch (err) {
      console.warn('Metadata deep clean warning:', err);
    }

    const newPdfBytes = await newPdfDoc.save();
    return new Blob([newPdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF Metadata clean service error:', error);
    throw new Error(
      error.message || 'PDF metadata temizlenirken beklenmedik bir hata oluştu. Dosya şifreli veya bozuk olabilir.'
    );
  }
}

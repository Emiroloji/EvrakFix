import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF files into a single PDF document in the specified order.
 * All processing is done entirely in the client's browser using pdf-lib.
 * 
 * @param files - Array of PDF File objects in the desired merge order
 * @returns A Promise that resolves to a Blob of the merged PDF
 */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Birleştirilecek dosya seçilmedi.');
  }

  try {
    // Create a new empty PDF document
    const mergedPdf = await PDFDocument.create();

    // Iterate through each selected file
    for (const file of files) {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Copy all pages from the loaded document to the merged document
      const pageIndices = pdfDoc.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
      
      // Add each copied page to the new document
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    // Save the merged PDF as a Uint8Array
    const mergedPdfBytes = await mergedPdf.save();

    // Create and return a Blob of the merged PDF file
    return new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF birleştirme hatası:', error);
    throw new Error(
      error.message || 'PDF dosyaları birleştirilirken beklenmedik bir hata oluştu. Lütfen dosyaların bozuk olmadığından emin olun.'
    );
  }
}

import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { PdfCompressorOptions } from './types';

/**
 * Helper to convert a Data URL (base64) to a Uint8Array
 */
function dataURLToUint8Array(dataUrl: string): Uint8Array {
  const base64Data = dataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compresses a PDF file client-side using pdfjs-dist and pdf-lib.
 * 
 * @param file - The original PDF file
 * @param options - Compression level parameters
 * @param onProgress - Optional callback for tracking page-by-page progress
 * @returns A Promise resolving to a Blob of the compressed PDF
 */
export async function compressPdf(
  file: File,
  options: PdfCompressorOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (!file) throw new Error('PDF dosyası yüklenmedi.');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    if (numPages === 0) throw new Error('PDF dökümanında sayfa bulunamadı.');

    // Create a new PDF document
    const outPdfDoc = await PDFDocument.create();

    // Map compression levels to scale and JPEG quality
    let scale = 1.5;
    let quality = 0.65; // Medium Quality
    
    if (options.level === 'low') {
      scale = 2.0;
      quality = 0.85; // Low compression / High quality
    } else if (options.level === 'high') {
      scale = 1.0;
      quality = 0.45; // High compression / Low quality
    }

    // Process each page sequentially to prevent memory overflow
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });

      // Create in-memory canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas 2D context oluşturulamadı.');
      }

      // Render page on canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };
      await page.render(renderContext).promise;

      // Get JPEG data URL from canvas at the selected compression quality
      const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
      const imgBytes = dataURLToUint8Array(imgDataUrl);

      // Add page to output document with the page's original dimensions (in points)
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPage = outPdfDoc.addPage([originalViewport.width, originalViewport.height]);

      // Embed the compressed JPEG image
      const jpegImage = await outPdfDoc.embedJpg(imgBytes);

      // Draw the image to fit the entire page
      newPage.drawImage(jpegImage, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });

      if (onProgress) {
        onProgress(i, numPages);
      }
    }

    const pdfBytes = await outPdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF Compressor service error:', error);
    throw new Error(
      error.message || 'PDF sıkıştırılırken bir hata oluştu. PDF şifreli veya bozuk olabilir.'
    );
  }
}

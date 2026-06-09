import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

export interface GrayscaleOptions {
  tonerSaver: boolean; // Clear light gray backgrounds to white
  contrastBoost: boolean; // Make dark text pure black
}

/**
 * Converts a base64 Data URL to a Uint8Array
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
 * Renders a PDF file page-by-page, applies grayscale and toner saver canvas filters,
 * and compiles them back into a print-friendly PDF file.
 */
export async function convertPdfToGrayscale(
  file: File,
  options: GrayscaleOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (!file) throw new Error('PDF dosyası yüklenmedi.');

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) throw new Error('PDF dökümanında sayfa bulunamadı.');

  const outPdfDoc = await PDFDocument.create();

  // Use a high rendering scale for high quality print output
  const scale = 2.0;

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

    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };
    await page.render(renderContext).promise;

    // Apply pixel-level filters
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const len = data.length;

    for (let j = 0; j < len; j += 4) {
      const r = data[j];
      const g = data[j + 1];
      const b = data[j + 2];

      // Convert to Grayscale (Luma formula)
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;

      if (options.tonerSaver && gray > 215) {
        // Clear light gray background shading to pure white
        gray = 255;
      } else if (options.contrastBoost && gray < 120) {
        // Boost dark gray text to pure black
        gray = Math.max(0, gray - 35);
      }

      data[j] = data[j + 1] = data[j + 2] = gray;
    }

    context.putImageData(imgData, 0, 0);

    // Get JPEG data URL
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const imgBytes = dataURLToUint8Array(imgDataUrl);

    // Get original page bounds
    const originalViewport = page.getViewport({ scale: 1.0 });
    const newPage = outPdfDoc.addPage([originalViewport.width, originalViewport.height]);

    // Embed and draw image page
    const jpegImage = await outPdfDoc.embedJpg(imgBytes);
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
}

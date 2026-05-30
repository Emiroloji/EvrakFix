import { PDFDocument } from 'pdf-lib';

export type ImageToPdfOptions = {
  pageSize: 'a4' | 'image';
  orientation: 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'medium';
};

/**
 * Loads a File object as an HTMLImageElement and automatically revokes the created Object URL to prevent leaks.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`"${file.name}" görseli okunamadı.`));
    };
    
    img.src = objectUrl;
  });
}

/**
 * Normalizes any browser-supported image (JPEG, PNG, WebP) by drawing it onto an offscreen canvas
 * and converting it into a standard JPEG ArrayBuffer.
 */
function convertImageToJpgBytes(img: HTMLImageElement): ArrayBuffer {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas render context oluşturulamadı.');
  }

  // Draw image on canvas
  ctx.drawImage(img, 0, 0);
  
  // Export to JPEG with 90% quality compression
  const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
  const base64 = dataUrl.split(',')[1];
  
  // Decode base64 to binary string
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  
  return bytes.buffer;
}

/**
 * Converts multiple image files into a single PDF document based on layout settings.
 * All formatting, canvas compression, and PDF embedding happens locally in the browser.
 * 
 * @param files - Array of image files in desired page order
 * @param options - Layout options (A4 vs original size, portrait vs landscape, margin)
 * @returns A Promise resolving to a Blob of the compiled PDF document
 */
export async function imagesToPdf(files: File[], options: ImageToPdfOptions): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('PDF oluşturmak için herhangi bir görsel seçilmedi.');
  }

  try {
    const pdfDoc = await PDFDocument.create();

    // Standard A4 dimensions in PDF points (1/72 inch)
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    // Margin mapping in points
    const margins = {
      none: 0,
      small: 15,
      medium: 30,
    };
    const margin = margins[options.margin];

    for (const file of files) {
      // 1. Load the image element
      const img = await loadImage(file);
      
      // 2. Convert to normalized JPEG bytes to feed pdf-lib
      const jpgBytes = convertImageToJpgBytes(img);
      const embeddedJpg = await pdfDoc.embedJpg(jpgBytes);

      // Original image dimensions
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      let pageWidth = A4_WIDTH;
      let pageHeight = A4_HEIGHT;
      let drawWidth = 0;
      let drawHeight = 0;
      let x = 0;
      let y = 0;

      if (options.pageSize === 'a4') {
        // Handle orientation
        if (options.orientation === 'landscape') {
          pageWidth = A4_HEIGHT;
          pageHeight = A4_WIDTH;
        } else {
          pageWidth = A4_WIDTH;
          pageHeight = A4_HEIGHT;
        }

        // Available area with margins
        const availWidth = pageWidth - 2 * margin;
        const availHeight = pageHeight - 2 * margin;

        // Proportional fit scale calculation
        const imgRatio = imgWidth / imgHeight;
        const availRatio = availWidth / availHeight;

        if (imgRatio > availRatio) {
          // Fit to width
          drawWidth = availWidth;
          drawHeight = availWidth / imgRatio;
        } else {
          // Fit to height
          drawHeight = availHeight;
          drawWidth = availHeight * imgRatio;
        }

        // Center on the page
        x = margin + (availWidth - drawWidth) / 2;
        y = margin + (availHeight - drawHeight) / 2;
      } else {
        // Orijinal görsel boyutu
        drawWidth = imgWidth;
        drawHeight = imgHeight;
        pageWidth = imgWidth + 2 * margin;
        pageHeight = imgHeight + 2 * margin;
        
        x = margin;
        y = margin;
      }

      // Add a new page with calculated dimensions
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Draw the image onto the page
      page.drawImage(embeddedJpg, {
        x: x,
        y: y,
        width: drawWidth,
        height: drawHeight,
      });
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('Görselden PDF oluşturma hatası:', error);
    throw new Error(
      error.message || 'Görseller PDF\'e dönüştürülürken beklenmedik bir hata oluştu.'
    );
  }
}

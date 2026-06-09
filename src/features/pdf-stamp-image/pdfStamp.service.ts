import { PDFDocument, degrees } from 'pdf-lib';
import type { StampOptions } from './types';

/**
 * Embeds an image (stamp/logo/signature) onto a specific page of a PDF document client-side.
 * 
 * @param pdfFile - The original PDF file
 * @param imageFile - The image File or Blob to stamp
 * @param options - Coordinate and rendering options
 * @returns A Promise resolving to the stamped PDF Blob
 */
export async function addStampToPdf(
  pdfFile: File,
  imageFile: File | Blob,
  options: StampOptions
): Promise<Blob> {
  if (!pdfFile) throw new Error('PDF dökümanı yüklenmedi.');
  if (!imageFile) throw new Error('Kaşe veya resim dosyası seçilmedi.');

  try {
    const pdfBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    const pages = pdfDoc.getPages();
    if (options.pageIndex < 0 || options.pageIndex >= pages.length) {
      throw new Error('Geçersiz sayfa seçimi.');
    }

    const page = pages[options.pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Determine mime-type or file extension to use correct embedding method
    const isPng = imageFile.type === 'image/png' || 
                  (imageFile instanceof File && imageFile.name.toLowerCase().endsWith('.png'));
                  
    const imageBuffer = await imageFile.arrayBuffer();
    let embeddedImage;

    if (isPng) {
      embeddedImage = await pdfDoc.embedPng(imageBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imageBuffer);
    }

    // Convert percentages (0-100) to actual PDF points (coordinate origin: bottom-left)
    // Adjust coordinates so that x and y point to the bottom-left of the image placement
    const pdfX = (options.x / 100) * pageWidth;
    const pdfY = (options.y / 100) * pageHeight;

    page.drawImage(embeddedImage, {
      x: pdfX,
      y: pdfY,
      width: options.width,
      height: options.height,
      opacity: options.opacity,
      rotate: degrees(options.rotation)
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF Stamp service error:', error);
    throw new Error(error.message || 'PDF üzerine kaşe eklenirken bir hata oluştu.');
  }
}

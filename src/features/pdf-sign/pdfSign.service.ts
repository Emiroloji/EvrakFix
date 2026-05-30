import { PDFDocument } from 'pdf-lib';

export type SignatureOptions = {
  pageNumber: number; // 1-indexed
  position: 'bottom-left' | 'bottom-center' | 'bottom-right';
  size: 'small' | 'medium' | 'large';
};

/**
 * Embeds a drawn signature PNG (base64) onto a specified page and position of a PDF document.
 * 
 * @param file - The original PDF file
 * @param signatureImage - Base64 encoded PNG data URL of the signature
 * @param options - Page placement, sizing, and alignment details
 * @returns A Promise resolving to a Blob of the signed PDF
 */
export async function addSignatureToPdf(
  file: File,
  signatureImage: string,
  options: SignatureOptions
): Promise<Blob> {
  if (!file) throw new Error('PDF dökümanı yüklenmedi.');
  if (!signatureImage) throw new Error('İmza görseli bulunamadı.');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Embed the base64 PNG signature
    const signaturePng = await pdfDoc.embedPng(signatureImage);
    
    const pages = pdfDoc.getPages();
    const pageIndex = options.pageNumber - 1;
    
    if (pageIndex < 0 || pageIndex >= pages.length) {
      throw new Error(`Geçersiz sayfa numarası. PDF ${pages.length} sayfadan oluşuyor.`);
    }

    const page = pages[pageIndex];
    const { width: pageWidth } = page.getSize();

    // Map sizing options to points
    const sizes = {
      small: { width: 100, height: 50 },
      medium: { width: 150, height: 75 },
      large: { width: 200, height: 100 },
    };
    
    const { width: sigWidth, height: sigHeight } = sizes[options.size];

    // Map coordinates (Note: pdf-lib coordinate origin is at bottom-left)
    let x = 40; // margin from left
    let y = 40; // margin from bottom

    if (options.position === 'bottom-center') {
      x = (pageWidth - sigWidth) / 2;
    } else if (options.position === 'bottom-right') {
      x = pageWidth - sigWidth - 40;
    }

    // Draw the signature
    page.drawImage(signaturePng, {
      x,
      y,
      width: sigWidth,
      height: sigHeight,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('İmza ekleme hatası:', error);
    throw new Error(error.message || 'PDF\'e imza yerleştirilirken beklenmedik bir hata oluştu.');
  }
}

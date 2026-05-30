import { PDFDocument } from 'pdf-lib';

/**
 * Parses user input for page ranges and maps it to a sorted, unique list of 0-indexed page indices.
 * Formats supported: "1-3", "5", "1,3,5", "1-3,5,7-9"
 * 
 * @param input - The raw string input from the user (e.g. "1-3, 5")
 * @param totalPages - Total pages of the uploaded PDF to validate bounds
 * @returns An array of sorted, unique 0-indexed page numbers
 * @throws Error with a user-friendly message if formatting or page limits are violated
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const cleanInput = input.trim();
  if (!cleanInput) {
    throw new Error('Lütfen sayfa aralığı girin.');
  }

  // Regex to validate that the input only contains digits, commas, hyphens, and spaces
  const allowedChars = /^[0-9,\-\s]+$/;
  if (!allowedChars.test(cleanInput)) {
    throw new Error('Geçersiz karakter girdiniz. Lütfen sadece rakam, virgül (,) ve tire (-) kullanın.');
  }

  const pagesSet = new Set<number>();
  const parts = cleanInput.split(',');

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    // Check if it's a range (e.g., "1-3")
    if (trimmedPart.includes('-')) {
      const rangeParts = trimmedPart.split('-');
      
      if (rangeParts.length !== 2) {
        throw new Error(`Geçersiz aralık formatı: "${trimmedPart}". Lütfen "Başlangıç-Bitiş" (örn: 1-3) şeklinde girin.`);
      }

      const startNum = parseInt(rangeParts[0].trim(), 10);
      const endNum = parseInt(rangeParts[1].trim(), 10);

      if (isNaN(startNum) || isNaN(endNum)) {
        throw new Error(`Geçersiz sayılar içeren aralık: "${trimmedPart}"`);
      }

      if (startNum < 1 || endNum < 1) {
        throw new Error('Sayfa numaraları 1\'den küçük olamaz.');
      }

      if (startNum > endNum) {
        throw new Error(`Aralık başlangıcı bitişinden büyük olamaz: "${trimmedPart}"`);
      }

      if (startNum > totalPages || endNum > totalPages) {
        throw new Error(`Sayfa numarası dökümanın toplam sayfa sayısını (${totalPages}) aşamaz.`);
      }

      for (let i = startNum; i <= endNum; i++) {
        pagesSet.add(i - 1); // Convert to 0-indexed
      }
    } else {
      // It's a single page (e.g., "5")
      const pageNum = parseInt(trimmedPart, 10);

      if (isNaN(pageNum)) {
        throw new Error(`Geçersiz sayfa numarası: "${trimmedPart}"`);
      }

      if (pageNum < 1) {
        throw new Error('Sayfa numarası 1\'den küçük olamaz.');
      }

      if (pageNum > totalPages) {
        throw new Error(`Girilen sayfa numarası (${pageNum}) toplam sayfa sayısını (${totalPages}) aşamaz.`);
      }

      pagesSet.add(pageNum - 1); // Convert to 0-indexed
    }
  }

  if (pagesSet.size === 0) {
    throw new Error('Hiçbir geçerli sayfa seçilmedi.');
  }

  // Convert Set to array, sort ascending
  return Array.from(pagesSet).sort((a, b) => a - b);
}

/**
 * Extracts specified pages from a PDF and returns a new PDF Blob.
 * 
 * @param file - The original PDF file
 * @param selectedPages - Array of 0-indexed page indices to copy
 * @returns A Promise resolving to a Blob containing only the selected pages
 */
export async function splitPdfFile(file: File, selectedPages: number[]): Promise<Blob> {
  if (selectedPages.length === 0) {
    throw new Error('Bölme işlemi için sayfa seçilmedi.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Create new PDF Document
    const subPdfDoc = await PDFDocument.create();
    
    // Copy the selected pages
    const copiedPages = await subPdfDoc.copyPages(pdfDoc, selectedPages);
    
    // Add pages to new document
    copiedPages.forEach((page) => {
      subPdfDoc.addPage(page);
    });

    const subPdfBytes = await subPdfDoc.save();
    return new Blob([subPdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('PDF bölme hatası:', error);
    throw new Error(
      error.message || 'PDF bölünürken beklenmedik bir hata oluştu. Lütfen dosyanın bozuk olmadığından emin olun.'
    );
  }
}

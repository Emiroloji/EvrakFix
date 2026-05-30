import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';

/**
 * Intelligent client-side word-wrapping algorithm.
 * Splits paragraphs into lines of words ensuring no line width exceeds maxWidth points.
 * Preserves empty paragraphs for paragraph spacing.
 * 
 * @param text - The raw generated text content
 * @param maxWidth - Printable area width in PDF points (1/72 inch)
 * @param font - PDFFont object from pdf-lib to accurately measure text width
 * @param fontSize - Font size in points
 * @returns An array of wrapped lines
 */
function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push(''); // Preserve blank line spacing
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Compiles plain text document content into an official, professionally-formatted A4 PDF document.
 * Features automated word wrapping, pagination, bold titles, and centered headers.
 * 
 * @param title - The title of the document type
 * @param content - Compiled template text content with all fields filled
 * @returns A Promise resolving to a Blob containing the official PDF file
 */
export async function generateDocumentPdf(title: string, content: string): Promise<Blob> {
  if (!content.trim()) {
    throw new Error('Döküman içeriği boş olamaz.');
  }

  try {
    const pdfDoc = await PDFDocument.create();
    
    // Set official metadata properties
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor('EvrakFix');
    pdfDoc.setSubject(`${title} Belgesi`);
    
    // Standard A4 sizes
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    // Load Helvetica and Helvetica-Bold
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Layout configuration (Left/Right margin: 55pt, Top/Bottom margin: 60pt)
    const marginX = 55;
    const marginY = 60;
    const printableWidth = A4_WIDTH - 2 * marginX;
    
    const bodyFontSize = 10.5;
    const titleFontSize = 13;

    // First wrap all the text before page allocation
    const wrappedLines = wrapText(content, printableWidth, helvetica, bodyFontSize);

    // Initial page allocation
    let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    let y = A4_HEIGHT - marginY;

    let isFirstNonEmptyLine = true;

    for (const line of wrappedLines) {
      // Check if page height exceeds limit, if so, allocate new page
      if (y < marginY + 20) {
        page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        y = A4_HEIGHT - marginY;
      }

      if (line === '') {
        y -= 14; // spacing between paragraphs
        continue;
      }

      // Format header: Bold & Centered if it is the first line or looks like a title
      const isTitleLine = isFirstNonEmptyLine || (line === line.toUpperCase() && line.length < 55);
      
      if (line.trim() !== '') {
        isFirstNonEmptyLine = false;
      }

      const font = isTitleLine ? helveticaBold : helvetica;
      const size = isTitleLine ? titleFontSize : bodyFontSize;
      
      let x = marginX;
      
      if (isTitleLine) {
        const textWidth = font.widthOfTextAtSize(line, size);
        x = (A4_WIDTH - textWidth) / 2; // Center titles
      }

      // Draw the text line
      page.drawText(line, {
        x: x,
        y: y,
        size: size,
        font: font,
        color: rgb(0.08, 0.08, 0.08), // dark grey / slate-900 look
      });

      y -= isTitleLine ? 22 : 16.5; // advance line height spacing
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (error: any) {
    console.error('Dilekçe PDF oluşturma hatası:', error);
    throw new Error(error.message || 'Resmi döküman oluşturulurken beklenmedik bir hata oluştu.');
  }
}

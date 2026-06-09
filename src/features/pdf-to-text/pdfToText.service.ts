import * as pdfjsLib from 'pdfjs-dist';

export interface PageTextResult {
  pageNumber: number;
  text: string;
}

/**
 * Extracts selectable text page-by-page from a PDF file using pdfjs-dist.
 * Reconstructs the original line endings based on Y-coordinate grouping.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PageTextResult[]> {
  if (!file) throw new Error('PDF dosyası bulunamadı.');

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) throw new Error('PDF dökümanında sayfa bulunamadı.');

  const results: PageTextResult[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];

    // Group text items by Y-coordinate (transform matrix index 5)
    // We allow a small vertical tolerance (e.g., 3.5 points) for items on the same line
    const linesMap: { [key: number]: any[] } = {};

    items.forEach((item) => {
      if (!item.str || item.str.trim() === '') return;

      const y = Math.round(item.transform[5] * 10) / 10; // Round to 1 decimal point

      // Find an existing Y coordinate that is close enough
      const matchingYStr = Object.keys(linesMap).find(
        (key) => Math.abs(parseFloat(key) - y) < 3.5
      );

      if (matchingYStr) {
        linesMap[parseFloat(matchingYStr)].push(item);
      } else {
        linesMap[y] = [item];
      }
    });

    // Sort lines from top of the page to bottom (descending Y)
    const sortedYCoords = Object.keys(linesMap)
      .map(Number)
      .sort((a, b) => b - a);

    let pageText = '';

    sortedYCoords.forEach((y) => {
      // Sort items within the same line from left to right (ascending X, matrix index 4)
      const lineItems = linesMap[y].sort((a, b) => a.transform[4] - b.transform[4]);
      
      // Join strings with a space
      const lineString = lineItems.map((item) => item.str).join(' ');
      
      // Append to page text
      pageText += lineString + '\n';
    });

    results.push({
      pageNumber: pageNum,
      text: pageText.trim(),
    });

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return results;
}

import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';

function normalizeTurkish(text: string): string {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S');
}

/**
 * A lightweight, client-side Markdown-to-HTML parser.
 * Avoids pulling in heavy dependencies while covering standard document-writing tags.
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let inList = false;
  let inOrderedList = false;
  let inBlockquote = false;
  let inCodeBlock = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // 1. Handle Code Blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        html += '</code></pre>\n';
        inCodeBlock = false;
      } else {
        html += '<pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;overflow-x:auto;"><code>';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      // Escape HTML tags inside code blocks
      html += trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') + '\n';
      continue;
    }

    // Close lists if we are not on a list item
    const isUnorderedItem = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    const isOrderedItem = /^\d+\.\s/.test(trimmed);

    if (inList && !isUnorderedItem) {
      html += '</ul>\n';
      inList = false;
    }
    if (inOrderedList && !isOrderedItem) {
      html += '</ol>\n';
      inOrderedList = false;
    }

    // Close blockquotes if we are not on a blockquote line
    const isBlockquote = trimmed.startsWith('>');
    if (inBlockquote && !isBlockquote) {
      html += '</div>\n';
      inBlockquote = false;
    }

    // 2. Headings
    if (trimmed.startsWith('# ')) {
      html += `<h1 style="font-size: 24px; font-weight: 850; color: #1e293b; margin-top: 18px; margin-bottom: 8px;">${parseInlineMarkdown(trimmed.substring(2))}</h1>\n`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html += `<h2 style="font-size: 20px; font-weight: 800; color: #334155; margin-top: 16px; margin-bottom: 6px;">${parseInlineMarkdown(trimmed.substring(3))}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      html += `<h3 style="font-size: 16px; font-weight: 750; color: #475569; margin-top: 14px; margin-bottom: 4px;">${parseInlineMarkdown(trimmed.substring(4))}</h3>\n`;
      continue;
    }

    // 3. Horizontal Rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      html += '<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />\n';
      continue;
    }

    // 4. Blockquotes
    if (isBlockquote) {
      const content = trimmed.substring(1).trim();
      if (!inBlockquote) {
        html += '<div style="border-left: 4px solid #3b82f6; padding-left: 12px; margin: 12px 0; color: #64748b; font-style: italic;">\n';
        inBlockquote = true;
      }
      html += `<p style="margin: 4px 0;">${parseInlineMarkdown(content)}</p>\n`;
      continue;
    }

    // 5. Unordered Lists
    if (isUnorderedItem) {
      const content = trimmed.substring(2).trim();
      if (!inList) {
        html += '<ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 12px;">\n';
        inList = true;
      }
      html += `<li style="margin-bottom: 4px; color: #334155;">${parseInlineMarkdown(content)}</li>\n`;
      continue;
    }

    // 6. Ordered Lists
    if (isOrderedItem) {
      const index = trimmed.indexOf(' ');
      const content = trimmed.substring(index + 1).trim();
      if (!inOrderedList) {
        html += '<ol style="list-style-type: decimal; margin-left: 20px; margin-bottom: 12px;">\n';
        inOrderedList = true;
      }
      html += `<li style="margin-bottom: 4px; color: #334155;">${parseInlineMarkdown(content)}</li>\n`;
      continue;
    }

    // 7. Paragraph or Empty Line
    if (trimmed === '') {
      html += '<p style="margin-bottom: 12px;"></p>\n';
    } else {
      html += `<p style="margin-bottom: 12px; line-height: 1.6; color: #334155;">${parseInlineMarkdown(trimmed)}</p>\n`;
    }
  }

  // Cleanup unclosed tags
  if (inList) html += '</ul>\n';
  if (inOrderedList) html += '</ol>\n';
  if (inBlockquote) html += '</div>\n';
  if (inCodeBlock) html += '</code></pre>\n';

  return html;
}

/**
 * Parses inline Markdown syntax: bold, italic, strikethrough, links
 */
function parseInlineMarkdown(text: string): string {
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold (**text**)
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 700; color: #0f172a;">$1</strong>');

  // Italic (*text* or _text_)
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>');
  escaped = escaped.replace(/_([^_]+)_/g, '<em style="font-style: italic;">$1</em>');

  // Strikethrough (~~text~~)
  escaped = escaped.replace(/~~([^~]+)~~/g, '<del style="text-decoration: line-through; color: #94a3b8;">$1</del>');

  // Links ([label](url))
  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-weight: 600; text-decoration: underline; hover:color: #1d4ed8;">$1</a>'
  );

  return escaped;
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      // Stripping inline markdown formatting tags before measuring width
      const cleanWord = word.replace(/\*\*|~~|\*|_/g, '');
      const testLine = currentLine ? `${currentLine} ${cleanWord}` : cleanWord;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = cleanWord;
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

export async function generateMarkdownPdf(markdown: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  
  pdfDoc.setTitle('Markdown Belgesi');
  pdfDoc.setAuthor('EvrakFix Markdown Editor');
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const marginX = 55;
  const marginY = 60;
  const printableWidth = A4_WIDTH - 2 * marginX;
  
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - marginY;
  
  const checkNewPage = (neededHeight: number) => {
    if (y - neededHeight < marginY) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - marginY;
      return true;
    }
    return false;
  };

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      checkNewPage(14);
      page.drawText(normalizeTurkish(trimmed), {
        x: marginX + 15,
        y,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3)
      });
      y -= 13;
      continue;
    }

    if (trimmed === '') {
      y -= 10;
      continue;
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      checkNewPage(30);
      y -= 10;
      const titleText = normalizeTurkish(trimmed.substring(2));
      page.drawText(titleText, {
        x: marginX,
        y,
        size: 18,
        font: fontBold,
        color: rgb(0.1, 0.15, 0.25)
      });
      y -= 22;
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      checkNewPage(24);
      y -= 8;
      const titleText = normalizeTurkish(trimmed.substring(3));
      page.drawText(titleText, {
        x: marginX,
        y,
        size: 14,
        font: fontBold,
        color: rgb(0.15, 0.2, 0.3)
      });
      y -= 18;
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      checkNewPage(20);
      y -= 6;
      const titleText = normalizeTurkish(trimmed.substring(4));
      page.drawText(titleText, {
        x: marginX,
        y,
        size: 11.5,
        font: fontBold,
        color: rgb(0.2, 0.25, 0.35)
      });
      y -= 15;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      checkNewPage(15);
      y -= 8;
      page.drawLine({
        start: { x: marginX, y },
        end: { x: A4_WIDTH - marginX, y },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8)
      });
      y -= 12;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const content = normalizeTurkish(trimmed.substring(1).trim());
      const wrapped = wrapText(content, printableWidth - 20, fontOblique, 10);
      
      checkNewPage(wrapped.length * 15 + 10);
      
      const startY = y;
      for (const wl of wrapped) {
        page.drawText(wl, {
          x: marginX + 15,
          y,
          size: 9.5,
          font: fontOblique,
          color: rgb(0.4, 0.4, 0.4)
        });
        y -= 14;
      }
      
      page.drawLine({
        start: { x: marginX + 5, y: startY + 8 },
        end: { x: marginX + 5, y: y + 4 },
        thickness: 2,
        color: rgb(0.23, 0.51, 0.96) // Blue accent line
      });
      y -= 8;
      continue;
    }

    // List Item
    const isUnordered = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    const isOrdered = /^\d+\.\s/.test(trimmed);

    if (isUnordered) {
      const content = normalizeTurkish(trimmed.substring(2).trim());
      const wrapped = wrapText(content, printableWidth - 15, fontRegular, 10);
      for (let wIdx = 0; wIdx < wrapped.length; wIdx++) {
        checkNewPage(15);
        if (wIdx === 0) {
          // Draw bullet dot
          page.drawCircle({
            x: marginX + 5,
            y: y + 3,
            size: 2,
            color: rgb(0.2, 0.2, 0.2)
          });
        }
        page.drawText(wrapped[wIdx], {
          x: marginX + 15,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15)
        });
        y -= 14.5;
      }
      continue;
    }

    if (isOrdered) {
      const index = trimmed.indexOf(' ');
      const numPrefix = trimmed.substring(0, index);
      const content = normalizeTurkish(trimmed.substring(index + 1).trim());
      const wrapped = wrapText(content, printableWidth - 18, fontRegular, 10);
      for (let wIdx = 0; wIdx < wrapped.length; wIdx++) {
        checkNewPage(15);
        if (wIdx === 0) {
          page.drawText(numPrefix, {
            x: marginX + 3,
            y,
            size: 9.5,
            font: fontBold,
            color: rgb(0.2, 0.2, 0.2)
          });
        }
        page.drawText(wrapped[wIdx], {
          x: marginX + 18,
          y,
          size: 10,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15)
        });
        y -= 14.5;
      }
      continue;
    }

    // Normal Paragraph
    const cleanParagraph = normalizeTurkish(trimmed);
    const wrapped = wrapText(cleanParagraph, printableWidth, fontRegular, 10);
    for (const wl of wrapped) {
      checkNewPage(15);
      page.drawText(wl, {
        x: marginX,
        y,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15)
      });
      y -= 15.5;
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

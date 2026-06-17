import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';
import type { CVData } from './types';

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

export async function generateCvPdf(cvData: CVData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  
  pdfDoc.setTitle(cvData.personal.fullName ? `${cvData.personal.fullName} - CV` : 'CV / Ozgecmis');
  pdfDoc.setAuthor('EvrakFix CV Builder');
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const marginX = 50;
  const marginY = 50;
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

  const drawSectionHeader = (title: string) => {
    checkNewPage(40);
    y -= 15;
    
    // Draw title
    page.drawText(normalizeTurkish(title.toUpperCase()), {
      x: marginX,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.12, 0.27, 0.58) // Navy blue
    });
    
    y -= 4;
    // Draw underline
    page.drawLine({
      start: { x: marginX, y },
      end: { x: A4_WIDTH - marginX, y },
      thickness: 1,
      color: rgb(0.8, 0.83, 0.9)
    });
    y -= 15;
  };
  
  // 1. Personal / Header Section
  if (cvData.personal.fullName) {
    checkNewPage(100);
    // Draw Name
    page.drawText(normalizeTurkish(cvData.personal.fullName), {
      x: marginX,
      y: y - 10,
      size: 22,
      font: fontBold,
      color: rgb(0.09, 0.18, 0.36)
    });
    y -= 25;
    
    // Title
    if (cvData.personal.title) {
      page.drawText(normalizeTurkish(cvData.personal.title), {
        x: marginX,
        y,
        size: 13,
        font: fontOblique,
        color: rgb(0.4, 0.45, 0.55)
      });
      y -= 18;
    }
    
    // Contact Info Grid
    const contacts: string[] = [];
    if (cvData.personal.email) contacts.push(cvData.personal.email);
    if (cvData.personal.phone) contacts.push(cvData.personal.phone);
    if (cvData.personal.website) contacts.push(cvData.personal.website);
    if (cvData.personal.address) contacts.push(cvData.personal.address);
    
    if (contacts.length > 0) {
      const contactText = contacts.map(c => normalizeTurkish(c)).join('  |  ');
      const wrappedContacts = wrapText(contactText, printableWidth, fontRegular, 9);
      for (const line of wrappedContacts) {
        checkNewPage(14);
        page.drawText(line, {
          x: marginX,
          y,
          size: 9,
          font: fontRegular,
          color: rgb(0.3, 0.3, 0.3)
        });
        y -= 13;
      }
    }
    y -= 10;
  }
  
  // 2. Summary
  if (cvData.personal.summary) {
    drawSectionHeader('Kisisel Ozet');
    const wrappedSummary = wrapText(normalizeTurkish(cvData.personal.summary), printableWidth, fontRegular, 10);
    for (const line of wrappedSummary) {
      checkNewPage(16);
      page.drawText(line, {
        x: marginX,
        y,
        size: 10,
        font: fontRegular,
        color: rgb(0.15, 0.15, 0.15),
        lineHeight: 14
      });
      y -= 15;
    }
    y -= 10;
  }
  
  // 3. Experience
  if (cvData.experience && cvData.experience.length > 0) {
    drawSectionHeader('Is Deneyimi');
    for (const exp of cvData.experience) {
      checkNewPage(60);
      
      // Role & Dates
      const roleStr = exp.role ? normalizeTurkish(exp.role) : '';
      const companyStr = exp.company ? normalizeTurkish(exp.company) : '';
      const datesStr = (exp.startDate || exp.endDate) 
        ? `(${normalizeTurkish(exp.startDate)} - ${normalizeTurkish(exp.endDate || 'Devam Ediyor')})`
        : '';
        
      page.drawText(`${roleStr}${companyStr ? ` - ${companyStr}` : ''}`, {
        x: marginX,
        y,
        size: 10.5,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      if (datesStr) {
        const dateWidth = fontRegular.widthOfTextAtSize(datesStr, 9.5);
        page.drawText(datesStr, {
          x: A4_WIDTH - marginX - dateWidth,
          y,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
      
      y -= 15;
      
      // Description
      if (exp.description) {
        const wrappedDesc = wrapText(normalizeTurkish(exp.description), printableWidth - 10, fontRegular, 9.5);
        for (const line of wrappedDesc) {
          checkNewPage(15);
          page.drawText(line, {
            x: marginX + 10,
            y,
            size: 9.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }
      }
      y -= 10;
    }
  }
  
  // 4. Education
  if (cvData.education && cvData.education.length > 0) {
    drawSectionHeader('Egitim');
    for (const edu of cvData.education) {
      checkNewPage(50);
      
      const degreeStr = edu.degree ? normalizeTurkish(edu.degree) : '';
      const schoolStr = edu.school ? normalizeTurkish(edu.school) : '';
      const datesStr = (edu.startDate || edu.endDate) 
        ? `(${normalizeTurkish(edu.startDate)} - ${normalizeTurkish(edu.endDate || 'Devam Ediyor')})`
        : '';
        
      page.drawText(`${degreeStr}${schoolStr ? ` - ${schoolStr}` : ''}`, {
        x: marginX,
        y,
        size: 10.5,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      if (datesStr) {
        const dateWidth = fontRegular.widthOfTextAtSize(datesStr, 9.5);
        page.drawText(datesStr, {
          x: A4_WIDTH - marginX - dateWidth,
          y,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
      
      y -= 15;
      
      if (edu.description) {
        const wrappedDesc = wrapText(normalizeTurkish(edu.description), printableWidth - 10, fontRegular, 9.5);
        for (const line of wrappedDesc) {
          checkNewPage(15);
          page.drawText(line, {
            x: marginX + 10,
            y,
            size: 9.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }
      }
      y -= 10;
    }
  }

  // 5. Projects
  if (cvData.projects && cvData.projects.length > 0) {
    drawSectionHeader('Projeler');
    for (const proj of cvData.projects) {
      checkNewPage(50);
      
      const nameStr = proj.name ? normalizeTurkish(proj.name) : '';
      const linkStr = proj.link ? normalizeTurkish(proj.link) : '';
      
      page.drawText(nameStr, {
        x: marginX,
        y,
        size: 10.5,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      if (linkStr) {
        const linkWidth = fontRegular.widthOfTextAtSize(linkStr, 9);
        page.drawText(linkStr, {
          x: A4_WIDTH - marginX - linkWidth,
          y,
          size: 9,
          font: fontRegular,
          color: rgb(0.15, 0.39, 0.73)
        });
      }
      
      y -= 15;
      
      if (proj.description) {
        const wrappedDesc = wrapText(normalizeTurkish(proj.description), printableWidth - 10, fontRegular, 9.5);
        for (const line of wrappedDesc) {
          checkNewPage(15);
          page.drawText(line, {
            x: marginX + 10,
            y,
            size: 9.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }
      }
      y -= 10;
    }
  }
  
  // 6. Skills & Languages (Side-by-side or stacked)
  const hasSkills = cvData.skills && cvData.skills.length > 0;
  const hasLanguages = cvData.languages && cvData.languages.length > 0;
  
  if (hasSkills || hasLanguages) {
    checkNewPage(80);
    
    if (hasSkills && hasLanguages) {
      // Draw side-by-side
      const colWidth = printableWidth / 2 - 10;
      
      // Skills Title
      y -= 15;
      const titleY = y;
      page.drawText(normalizeTurkish('YETENEKLER'), {
        x: marginX,
        y: titleY,
        size: 11,
        font: fontBold,
        color: rgb(0.12, 0.27, 0.58)
      });
      
      page.drawText(normalizeTurkish('YABANCI DILLER'), {
        x: marginX + colWidth + 20,
        y: titleY,
        size: 11,
        font: fontBold,
        color: rgb(0.12, 0.27, 0.58)
      });
      
      y -= 4;
      page.drawLine({ start: { x: marginX, y }, end: { x: marginX + colWidth, y }, thickness: 1, color: rgb(0.8, 0.83, 0.9) });
      page.drawLine({ start: { x: marginX + colWidth + 20, y }, end: { x: A4_WIDTH - marginX, y }, thickness: 1, color: rgb(0.8, 0.83, 0.9) });
      
      y -= 15;
      
      const skillStartY = y;
      let skillsY = skillStartY;
      for (const sk of cvData.skills) {
        if (skillsY < marginY + 20) break; // Don't overflow page
        const skName = normalizeTurkish(sk.name);
        const skLvl = sk.level ? `(${normalizeTurkish(sk.level)})` : '';
        page.drawText(`${skName} ${skLvl}`, {
          x: marginX,
          y: skillsY,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2)
        });
        skillsY -= 14;
      }
      
      let langsY = skillStartY;
      for (const lang of cvData.languages) {
        if (langsY < marginY + 20) break; // Don't overflow page
        const langName = normalizeTurkish(lang.name);
        const langLvl = lang.level ? `(${normalizeTurkish(lang.level)})` : '';
        page.drawText(`${langName} ${langLvl}`, {
          x: marginX + colWidth + 20,
          y: langsY,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.2, 0.2, 0.2)
        });
        langsY -= 14;
      }
      
      y = Math.min(skillsY, langsY) - 10;
    } else {
      // Stacked
      if (hasSkills) {
        drawSectionHeader('Yetenekler');
        const skillStrings = cvData.skills.map(sk => `${normalizeTurkish(sk.name)}${sk.level ? ` (${normalizeTurkish(sk.level)})` : ''}`);
        const skillsText = skillStrings.join(', ');
        const wrappedSkills = wrapText(skillsText, printableWidth, fontRegular, 9.5);
        for (const line of wrappedSkills) {
          checkNewPage(15);
          page.drawText(line, {
            x: marginX,
            y,
            size: 9.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }
        y -= 10;
      }
      
      if (hasLanguages) {
        drawSectionHeader('Yabanci Diller');
        const langStrings = cvData.languages.map(lang => `${normalizeTurkish(lang.name)}${lang.level ? ` (${normalizeTurkish(lang.level)})` : ''}`);
        const langsText = langStrings.join(', ');
        const wrappedLangs = wrapText(langsText, printableWidth, fontRegular, 9.5);
        for (const line of wrappedLangs) {
          checkNewPage(15);
          page.drawText(line, {
            x: marginX,
            y,
            size: 9.5,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2)
          });
          y -= 14;
        }
        y -= 10;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

import * as pdfjsLib from 'pdfjs-dist';
import type { PdfToImageOptions, PdfPageImageResult } from './types';

/**
 * Maps ImageQuality (low, medium, high) to a JPEG compression quality float (0.0 to 1.0)
 */
function getQualityValue(quality: 'low' | 'medium' | 'high'): number {
  switch (quality) {
    case 'low':
      return 0.5;
    case 'medium':
      return 0.75;
    case 'high':
    default:
      return 0.95;
  }
}

/**
 * Renders a single PDF page into an image Blob (PNG or JPEG).
 * All processing is done entirely in the client's browser.
 * 
 * @param file - The original PDF file
 * @param pageNumber - The 1-based page number to render
 * @param options - Format, quality and scale parameters
 */
export async function renderPdfPageToImage(
  file: File,
  pageNumber: number,
  options: PdfToImageOptions
): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
      throw new Error(`Geçersiz sayfa numarası: ${pageNumber}`);
    }

    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: options.scale });

    // Create an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context oluşturulamadı.');
    }

    // Render the page on canvas (with newer API requirements: canvas reference is required in RenderParameters)
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };
    await page.render(renderContext).promise;

    // Convert canvas to Blob
    const mimeType = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = options.format === 'jpg' ? getQualityValue(options.quality) : undefined;

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Görsel oluşturulamadı (Canvas toBlob null).'));
          }
        },
        mimeType,
        quality
      );
    });
  } catch (error: any) {
    console.error(`Page ${pageNumber} render error:`, error);
    throw new Error(
      error.message || `Sayfa ${pageNumber} görsele dönüştürülürken bir hata oluştu.`
    );
  }
}

/**
 * Renders multiple selected PDF pages into images sequentially to prevent browser OOM.
 * All processing is done entirely in the client's browser.
 * 
 * @param file - The original PDF file
 * @param pageNumbers - Array of 1-based page numbers to render
 * @param options - Format, quality and scale parameters
 */
export async function renderSelectedPdfPagesToImages(
  file: File,
  pageNumbers: number[],
  options: PdfToImageOptions
): Promise<PdfPageImageResult[]> {
  if (pageNumbers.length === 0) {
    return [];
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const results: PdfPageImageResult[] = [];

    // Render pages sequentially to avoid heavy parallel canvas allocation in browsers
    for (const pageNumber of pageNumbers) {
      if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
        continue;
      }

      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: options.scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas 2D context oluşturulamadı.');
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };
      await page.render(renderContext).promise;

      const mimeType = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = options.format === 'jpg' ? getQualityValue(options.quality) : undefined;
      const extension = options.format === 'jpg' ? 'jpg' : 'png';

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error('Görsel oluşturulamadı.'));
            }
          },
          mimeType,
          quality
        );
      });

      results.push({
        pageNumber,
        blob,
        fileName: `sayfa-${pageNumber}.${extension}`,
      });
    }

    return results;
  } catch (error: any) {
    console.error('Batch rendering error:', error);
    throw new Error(
      error.message || 'Seçilen sayfalar görsele dönüştürülürken bir hata oluştu.'
    );
  }
}

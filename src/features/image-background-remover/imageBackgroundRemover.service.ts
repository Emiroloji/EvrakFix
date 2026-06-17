export interface BackgroundRemoverOptions {
  tolerance: number; // 0 to 100
  boostContrast: boolean; // Makes dark colors pure black for high contrast text/signature
}

/**
 * Removes white or near-white backgrounds from an image canvas.
 * Applies color boosting for signatures (making ink darker and paper transparent).
 */
export function removeBackground(
  srcCanvas: HTMLCanvasElement,
  tgtCanvas: HTMLCanvasElement,
  options: BackgroundRemoverOptions
) {
  const width = srcCanvas.width;
  const height = srcCanvas.height;

  tgtCanvas.width = width;
  tgtCanvas.height = height;

  const srcCtx = srcCanvas.getContext('2d');
  const tgtCtx = tgtCanvas.getContext('2d');

  if (!srcCtx || !tgtCtx) return;

  // Copy source to target first
  tgtCtx.drawImage(srcCanvas, 0, 0);

  const imgData = tgtCtx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;

  // Max Euclidean distance in RGB is sqrt(255^2 + 255^2 + 255^2) = 441.67
  const threshold = (options.tolerance / 100) * 441.67;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Calculate Euclidean distance to pure white (255, 255, 255)
    const distToWhite = Math.sqrt(
      Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
    );

    if (distToWhite < threshold) {
      // Make transparent
      data[i + 3] = 0;
    } else if (options.boostContrast) {
      // Boost contrast for signature/text:
      // Calculate luminance: Y = 0.299R + 0.587G + 0.114B
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luma < 160) {
        // Darken text/ink significantly
        data[i] = Math.max(0, r - 80);
        data[i + 1] = Math.max(0, g - 80);
        data[i + 2] = Math.max(0, b - 80);
      }
    }
  }

  tgtCtx.putImageData(imgData, 0, 0);
}

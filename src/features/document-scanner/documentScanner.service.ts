export interface ScanOptions {
  mode: 'original' | 'grayscale' | 'mono' | 'magic';
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  threshold: number; // 0 to 255 (for mono mode)
}

/**
 * Apply scanning, contrast, and brightness filters to a canvas context
 */
export function applyScanFilters(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  options: ScanOptions
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // Reset target size and draw source image
  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;
  ctx.drawImage(sourceCanvas, 0, 0);

  if (options.mode === 'original' && options.brightness === 0 && options.contrast === 0) {
    return; // No processing needed
  }

  const imgData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const data = imgData.data;
  const len = data.length;

  // Calculate contrast factor
  const c = options.contrast;
  const factor = (259 * (c + 255)) / (255 * (259 - c));
  const b = options.brightness;

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let bVal = data[i + 2];

    // 1. Apply Mode Filter
    if (options.mode === 'grayscale') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * bVal;
      r = g = bVal = gray;
    } else if (options.mode === 'mono') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * bVal;
      const mono = gray >= options.threshold ? 255 : 0;
      r = g = bVal = mono;
    } else if (options.mode === 'magic') {
      // Magic Color: enhance contrast and remove gray shadows
      // Grayscale value for shadow detection
      const luma = 0.299 * r + 0.587 * g + 0.114 * bVal;
      if (luma > 160) {
        // Suppress shadows to white
        r = Math.min(255, r * 1.25);
        g = Math.min(255, g * 1.25);
        bVal = Math.min(255, bVal * 1.25);
      } else {
        // Boost dark colors slightly
        r = r * 0.95;
        g = g * 0.95;
        bVal = bVal * 0.95;
      }
    }

    // 2. Apply Brightness
    if (options.mode !== 'mono') {
      r += b;
      g += b;
      bVal += b;
    }

    // 3. Apply Contrast
    if (options.mode !== 'mono') {
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      bVal = factor * (bVal - 128) + 128;
    }

    // Clamp values
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, bVal));
  }

  ctx.putImageData(imgData, 0, 0);
}

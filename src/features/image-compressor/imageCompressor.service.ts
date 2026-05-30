import type { ImageCompressorOptions, CompressedImageResult } from './types';

/**
 * Maps ImageQuality to Quality Multiplier (0.0 to 1.0)
 */
function getQualityMultiplier(quality: 'low' | 'medium' | 'high'): number {
  switch (quality) {
    case 'low':
      return 0.45;
    case 'medium':
      return 0.7;
    case 'high':
    default:
      return 0.9;
  }
}

/**
 * Squeezes a single image file entirely in the client's browser using Canvas API.
 * Handles resizing, format translation, and quality compression.
 * 
 * @param file - Original Image File object
 * @param options - Squeeze properties (quality, output format, resize constraints)
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressorOptions
): Promise<CompressedImageResult> {
  let objectUrl = '';
  try {
    objectUrl = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`"${file.name}" dosyası görsel olarak yüklenemedi.`));
      el.src = objectUrl;
    });

    const originalWidth = img.naturalWidth || img.width;
    const originalHeight = img.naturalHeight || img.height;

    // Resolve target dimensions
    let targetWidth = originalWidth;
    
    if (options.resizeMode === '1920') {
      targetWidth = Math.min(1920, originalWidth);
    } else if (options.resizeMode === '1280') {
      targetWidth = Math.min(1280, originalWidth);
    } else if (options.resizeMode === '800') {
      targetWidth = Math.min(800, originalWidth);
    } else if (options.resizeMode === 'custom' && options.customWidth) {
      targetWidth = Math.max(100, Math.min(5000, options.customWidth));
    }

    // Keep original aspect ratio
    const targetHeight = Math.round((originalHeight * targetWidth) / originalWidth);

    // Canvas drawing
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context oluşturulamadı.');
    }

    context.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Resolve output format MIME
    let mimeType = file.type;
    if (options.outputFormat === 'jpg') {
      mimeType = 'image/jpeg';
    } else if (options.outputFormat === 'png') {
      mimeType = 'image/png';
    } else if (options.outputFormat === 'webp') {
      mimeType = 'image/webp';
    }

    const quality = getQualityMultiplier(options.quality);

    // Generate output blob
    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Görsel Blob formatına dönüştürülemedi.'));
          }
        },
        mimeType,
        mimeType === 'image/png' ? undefined : quality
      );
    });

    // Revoke load URL immediately to preserve memory
    URL.revokeObjectURL(objectUrl);
    objectUrl = '';

    // Calculate name and saving stats
    const originalFullName = file.name;
    const lastDotIndex = originalFullName.lastIndexOf('.');
    const originalNameWithoutExt = lastDotIndex !== -1 ? originalFullName.substring(0, lastDotIndex) : originalFullName;
    
    let extension = lastDotIndex !== -1 ? originalFullName.substring(lastDotIndex + 1).toLowerCase() : '';
    if (options.outputFormat === 'jpg') {
      extension = 'jpg';
    } else if (options.outputFormat === 'png') {
      extension = 'png';
    } else if (options.outputFormat === 'webp') {
      extension = 'webp';
    }
    const outputFileName = `evrakfix-${originalNameWithoutExt}.${extension}`;

    const originalSize = file.size;
    const compressedSize = outputBlob.size;
    const savingPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    // Create a new preview URL for the processed output (needs to be revoked on clear)
    const previewUrl = URL.createObjectURL(outputBlob);

    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      originalFile: file,
      outputBlob,
      outputFileName,
      originalSize,
      compressedSize,
      savingPercent: savingPercent > 0 ? savingPercent : 0,
      previewUrl,
    };
  } catch (error: any) {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    console.error('Image compress error:', error);
    throw new Error(error.message || `"${file.name}" sıkıştırılamadı.`);
  }
}

/**
 * Sequentially squeezes multiple image files to prevent memory peaks and OOM.
 */
export async function compressImageFiles(
  files: File[],
  options: ImageCompressorOptions
): Promise<CompressedImageResult[]> {
  const results: CompressedImageResult[] = [];
  
  for (const file of files) {
    try {
      const res = await compressImageFile(file, options);
      results.push(res);
    } catch (err) {
      console.error(`Skipped error compression for ${file.name}:`, err);
    }
  }

  return results;
}

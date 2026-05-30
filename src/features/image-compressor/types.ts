export type ImageQuality = 'low' | 'medium' | 'high';

export type ImageOutputFormat = 'original' | 'jpg' | 'png' | 'webp';

export type ResizeMode = 'original' | '1920' | '1280' | '800' | 'custom';

export type ImageCompressorOptions = {
  quality: ImageQuality;
  outputFormat: ImageOutputFormat;
  resizeMode: ResizeMode;
  customWidth?: number;
};

export type CompressedImageResult = {
  id: string; // React list keys
  originalFile: File;
  outputBlob: Blob;
  outputFileName: string;
  originalSize: number;
  compressedSize: number;
  savingPercent: number;
  previewUrl: string;
};

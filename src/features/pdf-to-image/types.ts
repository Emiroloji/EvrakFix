export type ImageOutputFormat = 'png' | 'jpg';

export type ImageQuality = 'low' | 'medium' | 'high';

export type PdfToImageOptions = {
  format: ImageOutputFormat;
  quality: ImageQuality;
  scale: number;
};

export type PdfPageImageResult = {
  pageNumber: number;
  blob: Blob;
  fileName: string;
};

export type SelectablePdfPage = {
  pageNumber: number; // 1-based page number
  isSelected: boolean;
};

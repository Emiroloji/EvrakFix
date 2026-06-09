export type GeneratorType = 'qr' | 'barcode';

export type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF';

export type QrBarcodeOptions = {
  type: GeneratorType;
  value: string;
  qrSize: number;
  barcodeFormat: BarcodeFormat;
  color: string;
  backgroundColor: string;
};

import { APP_CONFIG } from '../constants/appConfig';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePdfFile(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'Dosya bulunamadı.' };
  }

  // Check file type
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return { isValid: false, error: `"${file.name}" geçerli bir PDF dosyası olarak algılanamadı. Lütfen dosya uzantısının .pdf olduğundan emin olun.` };
  }

  // Check file size
  if (file.size > APP_CONFIG.maxFileSize) {
    return {
      isValid: false,
      error: `"${file.name}" dosyası çok büyük (${(file.size / (1024 * 1024)).toFixed(1)}MB). Bellek yetersizliği nedeniyle tarayıcınızın kilitlenmesini veya yavaşlamasını önlemek için maksimum limit olan ${APP_CONFIG.maxFileSize / (1024 * 1024)}MB'dan daha küçük bir dosya seçin.`
    };
  }

  return { isValid: true };
}

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
    return { isValid: false, error: `"${file.name}" bir PDF dosyası değil.` };
  }

  // Check file size
  if (file.size > APP_CONFIG.maxFileSize) {
    return {
      isValid: false,
      error: `Dosya boyutu çok büyük. Maksimum limit ${APP_CONFIG.maxFileSize / (1024 * 1024)}MB'dır.`
    };
  }

  return { isValid: true };
}

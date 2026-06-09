import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';
import type { PdfProtectUnlockOptions } from './types';

/**
 * Protects (encrypts) or unlocks (decrypts) a PDF file client-side.
 * 
 * @param file - The original PDF file
 * @param options - Options containing the operation mode and password
 * @returns A Promise resolving to a Blob of the processed PDF
 */
export async function processPdfProtectUnlock(
  file: File,
  options: PdfProtectUnlockOptions
): Promise<Blob> {
  if (!file) throw new Error('PDF dökümanı yüklenmedi.');
  if (!options.password) {
    throw new Error('Lütfen işlem için şifre girin.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    if (options.operation === 'protect') {
      // Encrypt PDF bytes
      const encryptedBytes = await encryptPDF(uint8Array, options.password);
      return new Blob([encryptedBytes as any], { type: 'application/pdf' });
    } else {
      // Decrypt PDF bytes
      const decryptedBytes = await decryptPDF(uint8Array, options.password);
      return new Blob([decryptedBytes as any], { type: 'application/pdf' });
    }
  } catch (error: any) {
    console.error('PDF Protect/Unlock service error:', error);
    
    // Check if the error is password-related
    const message = error.message || '';
    if (message.includes('password') || message.includes('decrypt') || message.includes('encrypted') || message.includes('invalid') || message.includes('auth')) {
      throw new Error(
        options.operation === 'protect'
          ? 'Bu PDF zaten şifreli olabilir. Lütfen şifresiz bir PDF yükleyin.'
          : 'Geçersiz şifre. Lütfen doğru şifreyi girdiğinizden emin olun.'
      );
    }
    
    throw new Error(
      error.message || 'PDF işlemi sırasında beklenmedik bir hata oluştu. PDF bozuk veya şifreli olabilir.'
    );
  }
}


export type ProtectUnlockOperation = 'protect' | 'unlock';

export type PdfProtectUnlockOptions = {
  operation: ProtectUnlockOperation;
  password?: string;
};

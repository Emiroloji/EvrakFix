import { saveAs } from 'file-saver';

export function downloadBlob(blob: Blob, fileName: string): void {
  saveAs(blob, fileName);
}

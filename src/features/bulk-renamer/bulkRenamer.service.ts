import JSZip from 'jszip';

export interface RenamerOptions {
  prefix: string;
  suffix: string;
  caseFormat: 'original' | 'upper' | 'lower' | 'title';
  replaceSpaces: 'none' | 'hyphen' | 'underscore' | 'remove';
  counterStart: number;
  counterPadding: number; // e.g., 3 for "001"
  includeCounter: boolean;
}

function toTitleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function padNumber(num: number, size: number): string {
  let s = num.toString();
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}

export function generateNewName(
  originalName: string,
  options: RenamerOptions,
  indexOffset: number
): string {
  const dotIndex = originalName.lastIndexOf('.');
  let baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';

  // 1. Spacing formatting
  if (options.replaceSpaces === 'hyphen') {
    baseName = baseName.replace(/\s+/g, '-');
  } else if (options.replaceSpaces === 'underscore') {
    baseName = baseName.replace(/\s+/g, '_');
  } else if (options.replaceSpaces === 'remove') {
    baseName = baseName.replace(/\s+/g, '');
  }

  // 2. Case formatting
  if (options.caseFormat === 'upper') {
    baseName = baseName.toUpperCase();
  } else if (options.caseFormat === 'lower') {
    baseName = baseName.toLowerCase();
  } else if (options.caseFormat === 'title') {
    baseName = toTitleCase(baseName);
  }

  // 3. Counter addition
  let counterStr = '';
  if (options.includeCounter) {
    const currentNum = options.counterStart + indexOffset;
    counterStr = padNumber(currentNum, options.counterPadding);
  }

  // 4. Combine parts
  const finalBase = `${options.prefix}${baseName}${counterStr}${options.suffix}`;
  return `${finalBase}${ext}`;
}

export async function packageRenamedFilesToZip(
  files: File[],
  options: RenamerOptions,
  onProgress?: (progress: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newName = generateNewName(file.name, options, i);
    
    if (onProgress) {
      onProgress(`İşleniyor: ${i + 1} / ${files.length}`);
    }

    // Add file to ZIP
    zip.file(newName, file);
  }

  if (onProgress) {
    onProgress('ZIP arşivi sıkıştırılıyor...');
  }

  return await zip.generateAsync({ type: 'blob' });
}

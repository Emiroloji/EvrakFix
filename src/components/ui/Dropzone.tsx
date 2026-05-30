import React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { UploadCloud, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { Alert } from './Alert';

export interface DropzoneProps extends Omit<DropzoneOptions, 'onDrop'> {
  onFilesSelected: (files: File[]) => void;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  maxSizeWarning?: number; // Size in bytes to show a warning (e.g. 20MB)
}

export const Dropzone = ({
  onFilesSelected,
  className,
  title = 'Dosyalarınızı buraya sürükleyin veya seçin',
  description = 'PDF veya görsel dosyaları yükleyebilirsiniz',
  icon = <UploadCloud className="h-10 w-10 text-blue-500 stroke-[1.5] animate-pulse" />,
  maxSizeWarning = 20 * 1024 * 1024, // 20 MB default warning
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  disabled,
  ...props
}: DropzoneProps) => {
  const [warning, setWarning] = React.useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: (acceptedFiles) => {
      setWarning(null);
      if (acceptedFiles.length > 0) {
        // Check if any file exceeds our warning size (non-blocking warning)
        const largeFiles = acceptedFiles.filter((f) => f.size > maxSizeWarning);
        if (largeFiles.length > 0) {
          const names = largeFiles.map((f) => f.name).join(', ');
          setWarning(
            `Bazı dosyalar büyük boyutta (${names}). İşlem tarayıcınızda yapıldığı için bilgisayarınız geçici olarak yavaşlayabilir.`
          );
        }
        onFilesSelected(acceptedFiles);
      }
    },
    accept,
    multiple,
    maxFiles,
    maxSize,
    disabled,
    ...props
  });

  // Handle errors / rejections
  const rejectionMessage = React.useMemo(() => {
    if (fileRejections.length === 0) return null;
    const errors = fileRejections[0].errors;
    const firstError = errors[0];

    if (firstError.code === 'file-invalid-type') {
      return 'Geçersiz dosya türü. Lütfen sadece istenilen uzantıda dosya yükleyin.';
    }
    if (firstError.code === 'file-too-large') {
      return `Dosya çok büyük. Maksimum dosya boyutu limitini aştınız.`;
    }
    if (firstError.code === 'too-many-files') {
      return `Çok fazla dosya seçtiniz. Limit: ${maxFiles || 'Sınırsız'}.`;
    }
    return firstError.message;
  }, [fileRejections, maxFiles]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragActive && 'border-blue-500 bg-blue-50/30 scale-[0.99]',
          disabled && 'opacity-50 pointer-events-none bg-slate-50',
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 shadow-sm mb-4">
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">{isDragActive ? 'Dosyaları buraya bırakın...' : title}</p>
        <p className="text-xs text-slate-400 font-normal leading-normal">{description}</p>
      </div>

      {rejectionMessage && (
        <Alert variant="error" title="Dosya Yüklenemedi" icon={<AlertTriangle className="h-4 w-4" />}>
          {rejectionMessage}
        </Alert>
      )}

      {warning && (
        <Alert variant="warning" title="Büyük Dosya Uyarısı" icon={<AlertTriangle className="h-4 w-4" />}>
          {warning}
        </Alert>
      )}
    </div>
  );
};

Dropzone.displayName = 'Dropzone';

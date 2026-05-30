import * as React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../../lib/files/fileSize';
import { Button } from '../../../components/ui/Button';

// Memory-efficient individual preview item that revokes object URLs on unmount
interface PreviewItemProps {
  file: File;
  index: number;
  totalItems: number;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const PreviewItem = ({ file, index, totalItems, onRemove, onMove }: PreviewItemProps) => {
  const [imgUrl, setImgUrl] = React.useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    
    // Revoke object URL on unmount to free memory
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-blue-100 transition-all shadow-sm group gap-4">
      {/* Thumbnail and Info */}
      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden shrink-0">
          {imgUrl ? (
            <img src={imgUrl} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[300px]">
            {file.name}
          </span>
          <span className="text-xs text-slate-400 font-normal">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
        {/* Move Up */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
          className="h-8 w-8 text-slate-400 hover:text-blue-600 disabled:opacity-30"
          title="Yukarı Taşı"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>

        {/* Move Down */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMove(index, 'down')}
          disabled={index === totalItems - 1}
          className="h-8 w-8 text-slate-400 hover:text-blue-600 disabled:opacity-30"
          title="Aşağı Taşı"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50/50"
          title="Listeden Çıkar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface ImagePreviewListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onMoveFile: (index: number, direction: 'up' | 'down') => void;
}

export const ImagePreviewList = ({ files, onRemoveFile, onMoveFile }: ImagePreviewListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Seçilen Görseller ({files.length})
        </h3>
        <span className="text-xs text-slate-400 font-medium">Sıralama Sayfa Sırasını Belirler</span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {files.map((file, index) => (
          <PreviewItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            totalItems={files.length}
            onRemove={onRemoveFile}
            onMove={onMoveFile}
          />
        ))}
      </div>
    </div>
  );
};

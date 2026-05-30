import { ArrowUp, ArrowDown, Trash2, FileText } from 'lucide-react';
import { formatFileSize } from '../../../lib/files/fileSize';
import { Button } from '../../../components/ui/Button';

interface MergeFileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onMoveFile: (index: number, direction: 'up' | 'down') => void;
}

export const MergeFileList = ({ files, onRemoveFile, onMoveFile }: MergeFileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Seçilen Dosyalar ({files.length})
        </h3>
        <span className="text-xs text-slate-400 font-medium">Sıralama Çıktı Sırasını Belirler</span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-blue-100 transition-all shadow-sm group"
          >
            {/* File Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <FileText className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate pr-2">
                  {file.name}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>

            {/* Actions (Reorder and Delete) */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Move Up */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMoveFile(index, 'up')}
                disabled={index === 0}
                className="h-8 w-8 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                title="Yukarı Taşı"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              {/* Move Down */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMoveFile(index, 'down')}
                disabled={index === files.length - 1}
                className="h-8 w-8 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400"
                title="Aşağı Taşı"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(index)}
                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50/50"
                title="Listeden Çıkar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

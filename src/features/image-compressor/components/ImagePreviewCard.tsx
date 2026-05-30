import React, { useEffect, useState } from 'react';
import { Download, Trash2, HelpCircle } from 'lucide-react';
import type { CompressedImageResult } from '../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatFileSize } from '../../../lib/files/fileSize';

interface ImagePreviewCardProps {
  file: File;
  result: CompressedImageResult | null;
  onRemove: () => void;
  onDownload: () => void;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  file,
  result,
  onRemove,
  onDownload,
}) => {
  const [originalPreview, setOriginalPreview] = useState<string>('');

  useEffect(() => {
    let active = true;
    let url = '';

    // Only create a temporary preview URL for the original file if there is no processed result yet
    if (!result) {
      url = URL.createObjectURL(file);
      if (active) {
        setOriginalPreview(url);
      }
    }

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file, result]);

  const previewSrc = result ? result.previewUrl : originalPreview;
  const originalSizeFormatted = formatFileSize(file.size);

  return (
    <Card className="relative flex flex-col justify-between overflow-hidden p-3 border border-slate-200 hover:border-slate-350 hover:shadow-md bg-white transition-all duration-300">
      {/* Top controls: remove file button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 rounded-full bg-slate-900/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-700 transition-all shadow-sm"
          title="Listeden Kaldır"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image Thumbnail Preview */}
      <div className="relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg h-36 overflow-hidden p-1">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 gap-1.5">
            <HelpCircle className="w-8 h-8 stroke-[1.2]" />
            <span className="text-[10px] font-semibold">Önizlenemiyor</span>
          </div>
        )}

        {/* Compression Saving percentage badge */}
        {result && result.savingPercent > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="success" className="bg-emerald-500 text-white border-none font-bold text-[10px] px-2 py-0.5 shadow-md">
              -{result.savingPercent}% Tasarruf
            </Badge>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="mt-3 flex flex-col gap-1.5 flex-1">
        <h4 
          className="text-xs font-bold text-slate-800 truncate" 
          title={file.name}
        >
          {file.name}
        </h4>
        
        <div className="flex flex-col gap-1 text-[10px] text-slate-500 border-t border-slate-50 pt-2">
          <div className="flex items-center justify-between">
            <span>Orijinal Boyut:</span>
            <span className="font-semibold text-slate-700">{originalSizeFormatted}</span>
          </div>

          {result ? (
            <>
              <div className="flex items-center justify-between">
                <span>İşlenmiş Boyut:</span>
                <span className="font-semibold text-blue-600">{formatFileSize(result.compressedSize)}</span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100/50">
                <span className="font-bold text-slate-400">Durum:</span>
                <Badge variant="success" className="font-bold text-[9px] px-1.5 py-0 border-emerald-100 bg-emerald-50 text-emerald-700">
                  Sıkıştırıldı
                </Badge>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100/50">
              <span className="font-bold text-slate-400">Durum:</span>
              <Badge variant="warning" className="font-bold text-[9px] px-1.5 py-0 border-amber-100 bg-amber-50 text-amber-700 animate-pulse">
                İşlem Bekliyor
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Action panel */}
      {result && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
          <Button
            size="sm"
            onClick={onDownload}
            className="w-full py-1.5 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Görseli İndir</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

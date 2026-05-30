import React from 'react';
import { RotateCw, RefreshCw, Undo2 } from 'lucide-react';
import type { OrganizedPdfPage } from '../types';
import { Button } from '../../../components/ui/Button';

interface PdfOrganizerToolbarProps {
  pages: OrganizedPdfPage[];
  onResetAll: () => void;
  onRestoreAllDeleted: () => void;
  onRotateAll: () => void;
}

export const PdfOrganizerToolbar: React.FC<PdfOrganizerToolbarProps> = ({
  pages,
  onResetAll,
  onRestoreAllDeleted,
  onRotateAll,
}) => {
  const totalPages = pages.length;
  const deletedCount = pages.filter((p) => p.isDeleted).length;
  const activeCount = totalPages - deletedCount;
  const rotatedCount = pages.filter((p) => p.rotation > 0 && !p.isDeleted).length;

  const hasChanges = pages.some(
    (p) => p.rotation !== 0 || p.isDeleted || p.currentOrder !== p.originalPageIndex
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
      {/* Statistics */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-800">{totalPages}</span> Toplam Sayfa
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
          <span className="font-semibold text-blue-600">{activeCount}</span> Aktif Sayfa
        </div>
        {deletedCount > 0 && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <span className="font-semibold text-red-500">{deletedCount}</span> Silinecek
          </div>
        )}
        {rotatedCount > 0 && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <span className="font-semibold text-indigo-600">{rotatedCount}</span> Döndürülmüş
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {deletedCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRestoreAllDeleted}
            className="h-9 px-3 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Undo2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Silinenleri Kurtar</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onRotateAll}
          className="h-9 px-3 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Hepsini Döndür (+90°)</span>
        </Button>

        {hasChanges && (
          <Button
            size="sm"
            variant="outline"
            onClick={onResetAll}
            className="h-9 px-3 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center gap-1.5 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-500" />
            <span>Değişiklikleri Sıfırla</span>
          </Button>
        )}
      </div>
    </div>
  );
};

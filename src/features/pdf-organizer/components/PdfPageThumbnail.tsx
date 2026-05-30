import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Trash2, Undo, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OrganizedPdfPage } from '../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface PdfPageThumbnailProps {
  pageSetting: OrganizedPdfPage;
  pdfDoc: any; // pdfjsLib.PDFDocumentProxy
  onRotate: (id: string) => void;
  onToggleDelete: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const PdfPageThumbnail: React.FC<PdfPageThumbnailProps> = ({
  pageSetting,
  pdfDoc,
  onRotate,
  onToggleDelete,
  onMoveLeft,
  onMoveRight,
  isFirst,
  isLast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      setLoading(true);
      setError(false);

      try {
        // Cancel the previous rendering task if it exists
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // pdfjs-dist page indexes are 1-based
        const page = await pdfDoc.getPage(pageSetting.originalPageIndex + 1);

        if (!active) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate a bounding box scaling (max 160px width/height)
        const unrotatedViewport = page.getViewport({ scale: 1.0 });
        const scale = 160 / Math.max(unrotatedViewport.width, unrotatedViewport.height);

        // Get viewport with page rotation applied
        const viewport = page.getViewport({ scale, rotation: pageSetting.rotation });

        // Account for High-DPI displays
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.scale(pixelRatio, pixelRatio);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;

        if (active) {
          setLoading(false);
        }
      } catch (err: any) {
        if (active && err.name !== 'RenderingCancelledException') {
          console.error('Canvas rendering error:', err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageSetting.originalPageIndex, pageSetting.rotation]);

  return (
    <Card className={`relative flex flex-col justify-between overflow-hidden p-3 border group transition-all duration-300 ${
      pageSetting.isDeleted 
        ? 'border-red-200 bg-red-50/20 shadow-none' 
        : 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white'
    }`}>
      {/* Thumbnail Container */}
      <div className={`relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg min-h-[180px] p-2 overflow-hidden transition-all duration-300 ${
        pageSetting.isDeleted ? 'opacity-40 filter grayscale blur-[1px]' : ''
      }`}>
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-medium text-slate-400">Yükleniyor...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-red-500">
            <span className="text-[10px] font-semibold">Önizleme Hatası</span>
          </div>
        )}

        <canvas ref={canvasRef} className="max-w-full max-h-[160px] object-contain transition-transform duration-300" />

        {/* Page Labels & Rotation indicator */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          <Badge variant="secondary" className="bg-slate-900/90 text-white border-none font-bold text-xs px-2 py-0.5 shadow-sm">
            {pageSetting.originalPageIndex + 1}
          </Badge>
          
          {pageSetting.rotation > 0 && !pageSetting.isDeleted && (
            <Badge variant="primary" className="bg-blue-600 text-white border-none font-semibold text-[10px] px-1.5 py-0 shadow-sm animate-pulse">
              +{pageSetting.rotation}°
            </Badge>
          )}
        </div>
      </div>

      {/* Deleted Overlay */}
      {pageSetting.isDeleted && (
        <div className="absolute inset-0 bg-red-950/5 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 transition-all duration-300 z-20">
          <Badge variant="error" className="bg-red-600 text-white border-none font-bold px-3 py-1 text-xs shadow-lg transform scale-105">
            Silindi
          </Badge>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onToggleDelete(pageSetting.id)}
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-md font-semibold text-xs py-1 px-2.5 flex items-center gap-1.5"
          >
            <Undo className="w-3.5 h-3.5" />
            Geri Al
          </Button>
        </div>
      )}

      {/* Page Actions Footer */}
      {!pageSetting.isDeleted && (
        <div className="flex flex-col gap-2 mt-3 z-10">
          {/* Order Actions */}
          <div className="flex items-center justify-between gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMoveLeft(pageSetting.id)}
              disabled={isFirst}
              className="flex-1 py-1 h-8 rounded-md hover:bg-slate-50 transition-colors border-slate-200 disabled:opacity-30"
              title="Sola Taşı"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMoveRight(pageSetting.id)}
              disabled={isLast}
              className="flex-1 py-1 h-8 rounded-md hover:bg-slate-50 transition-colors border-slate-200 disabled:opacity-30"
              title="Sağa Taşı"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Button>
          </div>

          {/* Edit Actions */}
          <div className="flex items-center justify-between gap-1.5 border-t border-slate-100 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRotate(pageSetting.id)}
              className="flex-1 py-1 h-8 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all border-slate-200 text-slate-600 text-xs font-medium flex items-center justify-center gap-1"
              title="90 Derece Döndür"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Döndür</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleDelete(pageSetting.id)}
              className="flex-1 py-1 h-8 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all border-slate-200 text-slate-600 text-xs font-medium flex items-center justify-center gap-1"
              title="Sayfayı Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sil</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

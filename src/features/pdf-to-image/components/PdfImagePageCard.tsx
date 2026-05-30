import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface PdfImagePageCardProps {
  pageNumber: number; // 1-based
  pdfDoc: any; // pdfjsLib.PDFDocumentProxy
  isSelected: boolean;
  onToggleSelect: (pageNumber: number) => void;
  onDownloadSingle: (pageNumber: number) => void;
}

export const PdfImagePageCard: React.FC<PdfImagePageCardProps> = ({
  pageNumber,
  pdfDoc,
  isSelected,
  onToggleSelect,
  onDownloadSingle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rendering, setRendering] = useState(false);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const renderThumbnail = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      setLoading(true);
      setError(false);

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(pageNumber);

        if (!active) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const unrotatedViewport = page.getViewport({ scale: 1.0 });
        // Scale to fit a bounding box of max 150px
        const scale = 150 / Math.max(unrotatedViewport.width, unrotatedViewport.height);
        const viewport = page.getViewport({ scale });

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
          console.error(`Page ${pageNumber} thumbnail error:`, err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderThumbnail();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNumber]);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering page select toggle
    setRendering(true);
    // Execute download
    Promise.resolve(onDownloadSingle(pageNumber)).finally(() => {
      setRendering(false);
    });
  };

  return (
    <Card 
      onClick={() => onToggleSelect(pageNumber)}
      className={`relative flex flex-col justify-between overflow-hidden p-3 border group cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-blue-500 bg-blue-50/5 ring-1 ring-blue-400 shadow-sm'
          : 'border-slate-200 hover:border-slate-350 hover:shadow-md bg-white'
      }`}
    >
      {/* Top selection checkbox and page index label */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(pageNumber)}
          onClick={(e) => e.stopPropagation()} // Avoid double toggle
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <Badge 
          variant={isSelected ? "primary" : "secondary"} 
          className="font-bold text-[10px] px-2 py-0.5 border-none shadow-sm"
        >
          Sayfa {pageNumber}
        </Badge>
      </div>

      {/* Render Canvas Container */}
      <div className={`relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg min-h-[170px] p-2 overflow-hidden transition-all duration-300 mt-5 ${
        !isSelected ? 'opacity-70 filter grayscale-[20%]' : ''
      }`}>
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-red-500">
            <span className="text-[10px] font-semibold">Önizleme Yok</span>
          </div>
        )}

        <canvas ref={canvasRef} className="max-w-full max-h-[150px] object-contain" />
      </div>

      {/* Bottom individual download action */}
      <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400">Tekil İndir</span>
        <Button
          size="sm"
          variant={isSelected ? "primary" : "outline"}
          onClick={handleDownloadClick}
          disabled={rendering}
          className={`h-7 px-2.5 rounded-md flex items-center gap-1 text-[10px] font-semibold ${
            isSelected 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
          title={`Sayfa ${pageNumber} görselini indir`}
        >
          {rendering ? (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>Görsel Al</span>
        </Button>
      </div>
    </Card>
  );
};

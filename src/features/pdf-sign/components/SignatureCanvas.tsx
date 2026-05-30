import * as React from 'react';
import { Button } from '../../../components/ui/Button';
import { Trash2, Check, Signature } from 'lucide-react';

interface SignatureCanvasProps {
  onSaveSignature: (dataUrl: string) => void;
  onClearSignature?: () => void;
}

export const SignatureCanvas = ({ onSaveSignature, onClearSignature }: SignatureCanvasProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(true);

  // Set up canvas properties
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-dpi support (retina display sharp canvas)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Style properties
    ctx.strokeStyle = '#0f172a'; // slate-900 line color
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Helper to get coordinates
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onClearSignature) onClearSignature();
  };

  // Save Signature
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    // Get base64 PNG data URL
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
          <Signature className="h-4 w-4 text-blue-500" />
          <span>İmzanızı Çizin</span>
        </label>
        <p className="text-xs text-slate-400 font-normal">
          Aşağıdaki alana fareyle veya mobil cihazınızda parmağınızla imzanızı atın.
        </p>
      </div>

      {/* Drawing Pad */}
      <div className="relative w-full h-[180px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
        
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-semibold select-none">
            İmza Çizim Alanı
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isEmpty}
          leftIcon={<Trash2 className="h-4 w-4" />}
          className="text-xs font-bold"
        >
          Temizle
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSave}
          disabled={isEmpty}
          leftIcon={<Check className="h-4 w-4 text-emerald-500" />}
          className="text-xs font-bold bg-blue-50 hover:bg-blue-100/75 text-blue-700 border border-blue-100"
        >
          İmza Olarak Kaydet
        </Button>
      </div>
    </div>
  );
};

import * as React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { parsePageRanges } from '../pdfSplit.service';
import { Hash } from 'lucide-react';

interface PageRangeInputProps {
  totalPages: number;
  onRangeParsed: (indices: number[]) => void;
}

export const PageRangeInput = ({ totalPages, onRangeParsed }: PageRangeInputProps) => {
  const [rangeStr, setRangeStr] = React.useState('1');
  const [error, setError] = React.useState<string | null>(null);
  const [parsedPages, setParsedPages] = React.useState<number[]>([0]);

  // Run parsing whenever input changes
  React.useEffect(() => {
    setError(null);
    if (!rangeStr.trim()) {
      setParsedPages([]);
      onRangeParsed([]);
      return;
    }

    try {
      const indices = parsePageRanges(rangeStr, totalPages);
      setParsedPages(indices);
      onRangeParsed(indices);
    } catch (err: any) {
      setError(err.message || 'Geçersiz aralık formatı.');
      setParsedPages([]);
      onRangeParsed([]);
    }
  }, [rangeStr, totalPages]);

  // Appends preset ranges
  const applyPreset = (presetType: 'all' | 'odd' | 'even' | 'first-half' | 'second-half') => {
    let pages: number[] = [];
    if (presetType === 'all') {
      const parts = [];
      if (totalPages > 0) parts.push(`1-${totalPages}`);
      setRangeStr(parts.join(','));
    } else if (presetType === 'odd') {
      for (let i = 1; i <= totalPages; i += 2) pages.push(i);
      setRangeStr(pages.join(','));
    } else if (presetType === 'even') {
      for (let i = 2; i <= totalPages; i += 2) pages.push(i);
      setRangeStr(pages.join(','));
    } else if (presetType === 'first-half') {
      const mid = Math.ceil(totalPages / 2);
      setRangeStr(totalPages > 1 ? `1-${mid}` : '1');
    } else if (presetType === 'second-half') {
      const mid = Math.ceil(totalPages / 2);
      setRangeStr(totalPages > mid ? `${mid + 1}-${totalPages}` : `${totalPages}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Sayfa Bölme Ayarları
        </h3>
        <p className="text-xs text-slate-400 font-normal">
          Dışarı aktarmak istediğiniz sayfaları aşağıdaki formatta girin.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => applyPreset('all')}
          className="text-xs h-8 px-3 rounded-lg"
        >
          Tüm Sayfalar
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => applyPreset('odd')}
          className="text-xs h-8 px-3 rounded-lg"
        >
          Tek Sayfalar
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => applyPreset('even')}
          className="text-xs h-8 px-3 rounded-lg"
        >
          Çift Sayfalar
        </Button>
        {totalPages > 2 && (
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => applyPreset('first-half')}
              className="text-xs h-8 px-3 rounded-lg"
            >
              İlk Yarısı
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => applyPreset('second-half')}
              className="text-xs h-8 px-3 rounded-lg"
            >
              İkinci Yarısı
            </Button>
          </>
        )}
      </div>

      {/* Input Field */}
      <div className="flex flex-col gap-2">
        <Input
          label="Sayfa Seçimi"
          placeholder="Örnek: 1-3, 5, 7-9"
          value={rangeStr}
          onChange={(e) => setRangeStr(e.target.value)}
          error={error || undefined}
          helperText="Örnek formatlar: '1-3' (1'den 3'e), '5' (Sadece 5), '1,3,5' (Seçili sayfalar)"
        />
      </div>

      {/* Dynamic Resolution Feedback */}
      {parsedPages.length > 0 && !error && (
        <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Hash className="h-3.5 w-3.5" />
            <span>Dışarı Aktarılacak Sayfalar ({parsedPages.length})</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {parsedPages.map((idx) => (
              <span
                key={idx}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-100/50 text-xs font-bold text-blue-600 shadow-sm"
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

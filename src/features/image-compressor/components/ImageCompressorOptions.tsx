import React from 'react';
import type { ImageCompressorOptions, ImageQuality, ImageOutputFormat, ResizeMode } from '../types';
import { Card } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';

interface ImageCompressorOptionsProps {
  options: ImageCompressorOptions;
  onChange: (options: ImageCompressorOptions) => void;
}

export const ImageCompressorOptionsPanel: React.FC<ImageCompressorOptionsProps> = ({
  options,
  onChange,
}) => {
  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...options, quality: e.target.value as ImageQuality });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...options, outputFormat: e.target.value as ImageOutputFormat });
  };

  const handleResizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const resizeMode = e.target.value as ResizeMode;
    onChange({
      ...options,
      resizeMode,
      customWidth: resizeMode === 'custom' ? options.customWidth || 1028 : undefined,
    });
  };

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onChange({
      ...options,
      customWidth: isNaN(val) ? undefined : val,
    });
  };

  const qualitySelectOptions = [
    { value: 'low', label: 'Düşük Kalite (Yüksek Sıkıştırma - %45)' },
    { value: 'medium', label: 'Orta Kalite (Önerilen - %70)' },
    { value: 'high', label: 'Yüksek Kalite (Kaypsıza Yakın - %90)' },
  ];

  const formatSelectOptions = [
    { value: 'original', label: 'Orijinal Formatı Koru' },
    { value: 'jpg', label: 'JPG formatına dönüştür' },
    { value: 'png', label: 'PNG formatına dönüştür' },
    { value: 'webp', label: 'WebP formatına dönüştür' },
  ];

  const resizeSelectOptions = [
    { value: 'original', label: 'Boyutu Koru (Ölçekleme Yok)' },
    { value: '1920', label: 'Genişlik Sınırı: 1920px (Full HD)' },
    { value: '1280', label: 'Genişlik Sınırı: 1280px (HD)' },
    { value: '800', label: 'Genişlik Sınırı: 800px (Küçük Boyut)' },
    { value: 'custom', label: 'Özel Genişlik Tanımla...' },
  ];

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Sıkıştırma & Dönüştürme Ayarları</h3>
        <p className="text-slate-400 text-xs">Görsellerinizin boyutunu küçültmek ve biçimlerini değiştirmek için ayarları seçin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Quality level */}
        <div className="flex flex-col gap-2">
          <label htmlFor="quality-select" className="text-xs font-bold text-slate-600">Sıkıştırma Kalitesi</label>
          <Select
            id="quality-select"
            value={options.quality}
            onChange={handleQualityChange}
            options={qualitySelectOptions}
            className="w-full h-11 text-xs font-medium border-slate-200"
          />
        </div>

        {/* Format select */}
        <div className="flex flex-col gap-2">
          <label htmlFor="format-select" className="text-xs font-bold text-slate-600">Çıktı Biçimi</label>
          <Select
            id="format-select"
            value={options.outputFormat}
            onChange={handleFormatChange}
            options={formatSelectOptions}
            className="w-full h-11 text-xs font-medium border-slate-200"
          />
        </div>

        {/* Resize select */}
        <div className="flex flex-col gap-2">
          <label htmlFor="resize-select" className="text-xs font-bold text-slate-600">Boyutlandırma</label>
          <Select
            id="resize-select"
            value={options.resizeMode}
            onChange={handleResizeChange}
            options={resizeSelectOptions}
            className="w-full h-11 text-xs font-medium border-slate-200"
          />
        </div>
      </div>

      {/* Conditional Custom Width input panel */}
      {options.resizeMode === 'custom' && (
        <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fadeIn max-w-sm">
          <label htmlFor="custom-width-input" className="text-xs font-bold text-slate-700">Özel Genişlik (px)</label>
          <Input
            id="custom-width-input"
            type="number"
            min={100}
            max={5000}
            value={options.customWidth !== undefined ? options.customWidth : ''}
            onChange={handleCustomWidthChange}
            placeholder="100 - 5000 arası değer girin"
            helperText="Yükseklik oran korunarak otomatik hesaplanacaktır."
            className="h-10 text-xs"
          />
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import type { PdfToImageOptions, ImageOutputFormat, ImageQuality } from '../types';
import { Card } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';

interface PdfToImageOptionsProps {
  options: PdfToImageOptions;
  onChange: (options: PdfToImageOptions) => void;
}

export const PdfToImageOptionsPanel: React.FC<PdfToImageOptionsProps> = ({
  options,
  onChange,
}) => {
  const handleFormatChange = (format: ImageOutputFormat) => {
    onChange({ ...options, format });
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...options, quality: e.target.value as ImageQuality });
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...options, scale: parseFloat(e.target.value) });
  };

  const scaleSelectOptions = [
    { value: '1', label: '1.0x (Normal - Hızlı)' },
    { value: '1.5', label: '1.5x (Net)' },
    { value: '2', label: '2.0x (Yüksek Çözünürlük - Önerilen)' },
    { value: '3', label: '3.0x (Ultra Çözünürlük - Yavaş)' },
  ];

  const qualitySelectOptions = [
    { value: 'low', label: 'Düşük Kalite (Küçük Dosya Boyutu)' },
    { value: 'medium', label: 'Orta Kalite (Dengeli)' },
    { value: 'high', label: 'Yüksek Kalite (Kaypsıza Yakın)' },
  ];

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Dönüştürme Ayarları</h3>
        <p className="text-slate-400 text-xs">Görsel biçimi, çözünürlüğü ve sıkıştırma kalitesini ayarlayın.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Output Format Tabs Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-600">Görsel Biçimi (Format)</label>
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => handleFormatChange('png')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                options.format === 'png'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PNG
            </button>
            <button
              type="button"
              onClick={() => handleFormatChange('jpg')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                options.format === 'jpg'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              JPG
            </button>
          </div>
        </div>

        {/* Resolution Scale Selector */}
        <div className="flex flex-col gap-2">
          <label htmlFor="scale-select" className="text-xs font-bold text-slate-600">Çözünürlük Ölçeği (Boyut)</label>
          <Select
            id="scale-select"
            value={options.scale.toString()}
            onChange={handleScaleChange}
            options={scaleSelectOptions}
            className="w-full h-11 text-xs font-medium border-slate-200"
          />
        </div>

        {/* Compression Quality Selector (only shown if JPG is selected) */}
        {options.format === 'jpg' ? (
          <div className="flex flex-col gap-2 animate-fadeIn">
            <label htmlFor="quality-select" className="text-xs font-bold text-slate-600">JPG Sıkıştırma Kalitesi</label>
            <Select
              id="quality-select"
              value={options.quality}
              onChange={handleQualityChange}
              options={qualitySelectOptions}
              className="w-full h-11 text-xs font-medium border-slate-200"
            />
          </div>
        ) : (
          <div className="hidden sm:flex flex-col justify-end pb-2">
            <span className="text-[10px] text-slate-400 font-medium italic">
              * PNG biçimi kayıpsız sıkıştırma kullanır, kalite ayarı gerekmez.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

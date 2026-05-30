import React from 'react';
import type { CompressedImageResult } from '../types';
import { ImagePreviewCard } from './ImagePreviewCard';

interface SqueezedItem {
  id: string;
  file: File;
  result: CompressedImageResult | null;
}

interface ImagePreviewGridProps {
  items: SqueezedItem[];
  onRemoveItem: (id: string) => void;
  onDownloadItem: (id: string) => void;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  items,
  onRemoveItem,
  onDownloadItem,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {items.map((item) => (
        <ImagePreviewCard
          key={item.id}
          file={item.file}
          result={item.result}
          onRemove={() => onRemoveItem(item.id)}
          onDownload={() => onDownloadItem(item.id)}
        />
      ))}
    </div>
  );
};
export type { SqueezedItem };

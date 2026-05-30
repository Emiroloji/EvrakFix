import React from 'react';
import type { OrganizedPdfPage } from '../types';
import { PdfPageThumbnail } from './PdfPageThumbnail';

interface PdfPageGridProps {
  pages: OrganizedPdfPage[];
  pdfDoc: any; // pdfjsLib.PDFDocumentProxy
  onRotate: (id: string) => void;
  onToggleDelete: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
}

export const PdfPageGrid: React.FC<PdfPageGridProps> = ({
  pages,
  pdfDoc,
  onRotate,
  onToggleDelete,
  onMoveLeft,
  onMoveRight,
}) => {
  // Sort pages by their currentOrder to render them in their active sequence
  const sortedPages = [...pages].sort((a, b) => a.currentOrder - b.currentOrder);
  
  // Identify the active (non-deleted) pages to accurately compute boundaries (first/last) for shifts
  const activePages = sortedPages.filter((p) => !p.isDeleted);
  const totalActivePages = activePages.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {sortedPages.map((pageSetting) => {
        // Calculate boundaries only against other active pages
        let isFirst = false;
        let isLast = false;
        
        if (!pageSetting.isDeleted) {
          const activeIndex = activePages.findIndex((p) => p.id === pageSetting.id);
          isFirst = activeIndex === 0;
          isLast = activeIndex === totalActivePages - 1;
        }

        return (
          <PdfPageThumbnail
            key={pageSetting.id}
            pageSetting={pageSetting}
            pdfDoc={pdfDoc}
            onRotate={onRotate}
            onToggleDelete={onToggleDelete}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            isFirst={isFirst}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
};

import React from 'react';
import { PdfImagePageCard } from './PdfImagePageCard';

interface PdfImagePageGridProps {
  pdfDoc: any; // pdfjsLib.PDFDocumentProxy
  numPages: number;
  selectedPages: number[];
  onToggleSelect: (pageNumber: number) => void;
  onDownloadSingle: (pageNumber: number) => void;
}

export const PdfImagePageGrid: React.FC<PdfImagePageGridProps> = ({
  pdfDoc,
  numPages,
  selectedPages,
  onToggleSelect,
  onDownloadSingle,
}) => {
  // Generate pages array from 1 to numPages
  const pages = Array.from({ length: numPages }, (_, index) => index + 1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {pages.map((pageNumber) => {
        const isSelected = selectedPages.includes(pageNumber);
        
        return (
          <PdfImagePageCard
            key={pageNumber}
            pageNumber={pageNumber}
            pdfDoc={pdfDoc}
            isSelected={isSelected}
            onToggleSelect={onToggleSelect}
            onDownloadSingle={onDownloadSingle}
          />
        );
      })}
    </div>
  );
};

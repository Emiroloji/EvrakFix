import React from 'react';
import { HomePage } from '../pages/HomePage';
import { ToolsPage } from '../pages/ToolsPage';
import { AboutPage } from '../pages/AboutPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PdfMergePage } from '../features/pdf-merge/PdfMergePage';
import { PdfSplitPage } from '../features/pdf-split/PdfSplitPage';
import { ImageToPdfPage } from '../features/image-to-pdf/ImageToPdfPage';
import { PdfSignPage } from '../features/pdf-sign/PdfSignPage';
import { PdfWatermarkPage } from '../features/pdf-tools/PdfWatermarkPage';
import { DocumentGeneratorPage } from '../features/document-generator/DocumentGeneratorPage';

import { PdfOrganizerPage } from '../features/pdf-organizer/PdfOrganizerPage';
import { PdfToImagePage } from '../features/pdf-to-image/PdfToImagePage';
import { ImageCompressorPage } from '../features/image-compressor/ImageCompressorPage';

export interface Route {
  path: string;
  component: React.ReactNode;
}

export const routes: Route[] = [
  { path: '/', component: <HomePage /> },
  { path: '/tools', component: <ToolsPage /> },
  { path: '/about', component: <AboutPage /> },
  { path: '/pdf-merge', component: <PdfMergePage /> },
  { path: '/pdf-split', component: <PdfSplitPage /> },
  { path: '/image-to-pdf', component: <ImageToPdfPage /> },
  { path: '/pdf-sign', component: <PdfSignPage /> },
  { path: '/pdf-watermark', component: <PdfWatermarkPage /> },
  { path: '/document-generator', component: <DocumentGeneratorPage /> },
  { path: '/pdf-organizer', component: <PdfOrganizerPage /> },
  { path: '/pdf-to-image', component: <PdfToImagePage /> },
  { path: '/image-compressor', component: <ImageCompressorPage /> }
];

export const useHashRouting = () => {
  const [currentHash, setCurrentHash] = React.useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const path = currentHash.replace('#', '') || '/';
  
  const matchedRoute = routes.find((route) => route.path === path);

  return matchedRoute ? matchedRoute.component : <NotFoundPage />;
};

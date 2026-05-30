export type OrganizedPdfPage = {
  id: string;
  originalPageIndex: number; // 0-indexed original page index
  currentOrder: number;
  rotation: 0 | 90 | 180 | 270;
  isDeleted: boolean;
};

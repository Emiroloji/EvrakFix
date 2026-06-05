export type PageNumberFormat = 'number' | 'page-number' | 'number-total' | 'page-number-total';

export type PageNumberPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-center';

export type PageNumberOptions = {
  format: PageNumberFormat;
  position: PageNumberPosition;
  fontSize: number;
  startFrom: number;
};

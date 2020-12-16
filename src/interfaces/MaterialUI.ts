export interface SnackbarInterface {
  open: boolean;
  vertical: 'bottom' | 'top';
  horizontal: 'left' | 'right' | 'center';
}

export interface InputInterface {
  placeholder?: string | number;
  type?: string;
  value?: string | number;
  readOnly?: boolean;
  label?: string;
  dir?: 'ltr' | 'rtl';
  rows?: number;
  required?: boolean;
  isMultiLine?: boolean;
  onClick?: () => void;
  onChange: (e: any) => void;
  error?: any;
  className?: any;
}

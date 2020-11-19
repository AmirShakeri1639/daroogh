export interface SnackbarInterface {
  open: boolean;
  vertical: 'bottom' | 'top';
  horizontal: 'left' | 'right' | 'center';
}

export interface InputInterface {
  type?: string;
  value?: string | number;
  label?: string;
  onChange: () => void;
}

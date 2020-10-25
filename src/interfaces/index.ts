export interface ActionInterface {
  type: string;
  value: any;
}

export interface LoginInitialStateInterface {
  email: string;
  password: string;
  isVisiblePassword: boolean;
}

export interface CircleProgressInterface {
  size?: number;
  color?: 'inherit' | 'primary' | 'secondary';
}

export interface ActionInterface {
  type: string;
  value: any;
}

export interface LoginInitialStateInterface {
  username: string;
  password: string;
  isVisiblePassword: boolean;
}

export interface CircleProgressInterface {
  size?: number;
  color?: 'inherit' | 'primary' | 'secondary';
}

export interface UserLoginInterface {
  username: string;
  password: string;
}

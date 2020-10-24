export interface ActionInterface {
  type: string;
  value: any;
}

export interface LoginInitialStateInterface {
  email: string;
  password: string;
  isVisiblePassword: boolean;
}

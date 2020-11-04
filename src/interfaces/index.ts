export interface ActionInterface {
  type: string;
  value?: any;
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

export interface ForgetPasswordDataInterface {
  mobile: string;
}

export interface DefaultAxiosConfigInterface {
  Authorization?: string;
}

export interface PermissionItemTableColumnInterface {
  id: string | number;
  label: string;
}

export class NewRoleData {
  public id?: number | string = 0;
  public name: string = '';
  public permissionItems: string[] = [];
}

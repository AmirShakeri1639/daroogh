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

export interface TableColumnInterface {
  field: string | number;
  title: string;
  type: string;
  headerStyle?: {} | undefined;
  cellStyle?: {} | undefined;
}

export class NewRoleData {
  public id?: number | string = 0;
  public name: string = '';
  public permissionItemes: string[] = [];
}
export interface PermissionItemInterface {
  order: number;
  permissionName: string;
  title: string;
}

export interface PermissionItemsInterface {
  category: string;
  permissionItems: PermissionItemInterface[];
}

export type { DrugInterface } from './DrugInterface';
export type { CategoryInterface } from './CategoryInterface';
export type { PharmacyInterface } from './PharmacyInterface';
export type { LabelValue } from './LabelValue';
export type { ConfirmParams } from './ConfirmParams';
export type { AccountingInterface } from './AccountingInterface';
export type { AllPharmacyDrugInterface } from './AllPharmacyDrugInterface';
export type { DrugI } from './AllPharmacyDrugInterface';
export type { PharmacyWithUserInterface } from './PharmacyWithUserInterface';
export type { CountryDivisionInterface } from './CountryDivisionInterface';
export type { LoggedInUserInterface } from './LoggedInUserInterface';
export type { TokenInterface } from './LoggedInUserInterface';
export type { MembershipRequestInterface } from './MembershipRequestInterface';
export type { ViewExchangeInterface, AddDrugInterface } from './ViewExchangeInterface';

export * from './component';
export * from './general';
export * from './comission';

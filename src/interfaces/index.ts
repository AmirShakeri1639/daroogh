import { RoleType } from 'enum';
import {PharmacyInterface} from './PharmacyInterface'
import {EmploymentApplicationInterface} from './EmploymentApplicationInterface'


export interface ActionInterface {
  type: string;
  value?: any;
}

export interface RreportSearch {
  fromDate: any;
  toDate: any;
  geoCode: string;
  remainExpDaysFromMinDate?: number;
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
  searchable?: boolean;
  type: string;
  render?: (item: any) => any;
  headerStyle?: {} | undefined;
  cellStyle?: {} | undefined;
}

export class NewRoleData {
  public id?: number | string = 0;
  public name: string = '';
  public permissionItemes: string[] = [];
  public type: RoleType = RoleType.OTHER;
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

export interface CommandInterface {
  title: string
  method: (e: any) => void
  color?: string
}

export interface FindJobInterface {
    items : finJobDetailInterface[]
}
export interface finJobDetailInterface{
  pharmacy : PharmacyInterface;
  minGradeOfReadingPrescriptionCertificate: string   | number ; //18.0,
  minWorkExperienceYear: string   | number ; //25,
  maxAge: string  | number ; //28,
  descriptions: string   ; //gtrfyhtfguyhftgu,
  hasReadingPrescriptionCertificateStr: string   ; //مهم نیست,
  livingInAreaStr: string   ; //مهم نیست,
  hasGuaranteeStr: string   ; //داشتن وثیقه مهم نیست,
  genderStr: string   ; //مرد,
  suggestedWorkShiftStr: string   ; //تایم آزاد,
  maritalStatusStr: string   ; //مجرد,
  pharmaceuticalSoftwareSkillStr: string   ; //ابتدایی,
  computerSkillStr: string   ; //ابتدایی,
  foreignLanguagesSkillStr: string   ; //ابتدایی,
  jobPositionStr: string   ; //سایر,
  educationStr: string   ; //بی‌سواد

}
export type { DrugInterface } from './DrugInterface';
export type { CategoryInterface } from './CategoryInterface';
export type { 
  PharmacyInterface,
  PharmacyFileInterface,
  FileForPharmacyInterface,
  FileForPharmacyGeneralInterface,
} from './PharmacyInterface';
export type { LabelValue } from './LabelValue';
export type { ConfirmParams } from './ConfirmParams';
export type {
  AccountingInterface,
  AccountingTransactionInterface,
} from './AccountingInterface';
export type { AllPharmacyDrugInterface } from './AllPharmacyDrugInterface';
export type { DrugI } from './AllPharmacyDrugInterface';
export type { PharmacyWithUserInterface } from './PharmacyWithUserInterface';
export type { CountryDivisionInterface } from './CountryDivisionInterface';
export type { LoggedInUserInterface } from './LoggedInUserInterface';
export type { MembershipRequestInterface } from './MembershipRequestInterface';
export type {
  ViewExchangeInterface,
  AddDrugInterface,
  CardInfo,
} from './ViewExchangeInterface';
export type { UserRoleInterface } from './user';
export type { SettingsInterface } from './SettingsInterface';
export type { SettingsAiInterface } from './SettingsAiInterface';
export type {
  PrescriptionInterface,
  PrescriptionResponseInterface,
} from './PrescriptionInterface';
export type { EmploymentApplicationInterface } from './EmploymentApplicationInterface';
export type { ProfileInterface } from './profile';
export type { JobInterface } from './JobInterface';
export type { JobApplicationInterface } from './JobApplicationInterface';
export type { WidgetInterface } from './WidgetInterface';
export type { DataTableColumns, LookupFilter } from './DataTableColumns';

export * from './component';
export * from './general';
export * from './comission';
export * from './user';

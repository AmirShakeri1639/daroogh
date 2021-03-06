export enum TextMessage {
  // TODO: move this items to 'fa' translation file
  REMOVE_TEXT_ALERT = 'آیا میخواهید حذف شود؟',
  SUCCESS_REMOVE_TEXT_MESSAGE = '',
  SUCCESS_EDIT_TEXT_MESSAGE = 'با موفقیت ویرایش شد',
  SUCCESS_CREATE_TEXT_MESSAGE = 'با موفقیت ایجاد شد',
  SUCCESS_SAVE_TEXT_MESSAGE = 'با موفقیت ذخیره شد',
  SUCCESS_DISABLE_TEXT_MESSAGE = '',
}

export enum DashboardPages {
  DASHBOARD = 'dashboard',
  CREATE_USER = 'createUser',
  CREATE_ROLE = 'createRole',
  USERS_LIST = 'usersList',
  CREATE_DRUG = 'createDrug',
  DRUGS_LIST = 'drugsList',
  CHANGE_USER_PASSWORD = 'changeUserPassword',
  MESSAGES_LIST = 'messagesList',
  CREATE_NEW_MESSAGE = 'createNewMessage',
  PHARMACY_CREATE = 'createPharmacy',
  PHARMACY_LIST = 'pharmaciesList',
  PHARMACY_MEMBERSHIP_REQUESTS = 'membershipRequestsList',
  CATEGORY_LIST = 'categoryList',
  EXCHANGE = 'exchange',
  EXCHANGE_LIST = 'exchangesList',
  ACCOUNTING_LIST = 'accounting',
  SUPPLY_LIST = 'supplyList',
}

export enum PharmacyTypeEnum {
  NonGovernmental = 1,
  Governmental,
  Hospital,
  Military
}

export enum WorkTimeEnum {
  PartTime = 1,
  FullTime,
  Nightly,
}

export enum CategoryTypeEnum {
  MEDICAL = 1,
  MAKEUP,
}

export enum PackStatusEnum {
  ARZESHODEH = 1,
  FOROOKHTEHSHODEH,
}

export enum MessageTypeEnum {
  PROFILE = 1,
  SMS,
  NOTIFICATION,
  SMS_AND_NOTIFICATION,
  SPECIAL,
}

type MessageOption = {
  val: number;
  text: string;
}

export const MessageTypeArray = (textArray: string[]): MessageOption[] => [
  { val: MessageTypeEnum.PROFILE, text: textArray[0] },
  { val: MessageTypeEnum.SMS, text: textArray[1] },
  { val: MessageTypeEnum.SPECIAL, text: textArray[2] },
  { val: MessageTypeEnum.NOTIFICATION, text: textArray[3] },
  { val: MessageTypeEnum.SMS_AND_NOTIFICATION, text: textArray[4] },
];

export enum RolesEnum {
  USERS = '1',
  ADMIN = '2',
  PHARMACY = '3',
  PUBLIC = '4',
  FDA = '500',
  PHARMACY_MEMBER_1 = '49',
  PHARMACY_MEMBER_2 = '50',
  PHARMACY_MEMBER_3 = '51',
  PHARMACY_MEMBER_4 = '52',
}

export enum PharmacyRoleEnum {
  PHARMACY_MEMBER_1 = '49',
  PHARMACY_MEMBER_2 = '50',
  PHARMACY_MEMBER_3 = '51',
  PHARMACY_MEMBER_4 = '52',
}

export * from './query';

export enum SortTypeEnum {
  ASC,
  DESC,
}

export enum TransactionTypeEnum {
  // بستانکار
  Creditor,
  // بدهکار
  Debtor,
}

export enum MaritalStatusType {
  Married = 0,
  Single = 1
}

export enum GenderType {
  Male = 0,
  Female = 1,
}

export const screenWidth = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
}

export const GetValuesOfEnum = (e: any): any => {
  const keys = Object.keys(e);
  return keys.map((k: string) => e[k as keyof typeof e]);
};

export * from './pharmacy';
export * from './role';
export * from './search';

export { 
  ExchangeStateEnum, 
  CancellerEnum,
  NeedSurvey, 
} from './ExchangeStateEnum';
export { ColorEnum } from './colors';
export { CardColors } from './colors';
export { UserColors } from './colors';
export { UserGrades } from './UserGrades';
export { PrescriptionResponseStateEnum } from './prescription';
export { UrlAddress } from './UrlAddress'

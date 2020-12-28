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
  NONGOVERNMENTAL = 1,
  GOVERNMENTAL,
}

export enum WorkTimeEnum {
  PART_TIME = 1,
  FULL_TIME,
  NIGHTLY,
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
}

export const MessageTypeArray = (textArray: string[]): any => [
  { val: MessageTypeEnum.PROFILE, text: textArray[0] },
  { val: MessageTypeEnum.SMS, text: textArray[1] },
  { val: MessageTypeEnum.NOTIFICATION, text: textArray[2] },
  { val: MessageTypeEnum.SMS_AND_NOTIFICATION, text: textArray[3] },
];

export enum RolesEnum {
  PHARMACY = '1',
  ADMIN = '2',
}

export * from './query';

export enum SortTypeEnum {
  ASC,
  DESC,
}

export { ExchangeStateEnum, CancellerEnum } from './ExchangeStateEnum';
export { ColorEnum } from './colors';
export { CardColors } from './colors';
export { UserColors } from './colors';
export { UserGrades } from './UserGrades';

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
}

export enum PharmacyTypeEnum {
  FIRST_PHARMACY_TYPE = 1,
  SECOND_PHARMACY_TYPE,
}

export enum WorkTimeEnum {
  FIRST_WORK_TIME = 1,
  SECOND_WORK_TIME,
  THIRD_WORK_TIME,
}

export enum CategoryTypeEnum {
  FIRST_CATEGORY_TYPE = 1,
  SECOND_CATEGORY_TYPE,
}

export enum PackStatusEnum {
  FIRST_PACK_STATUS = 1,
  SECOND_PACK_STATUS,
}

export enum MessageTypeEnum {
  PROFILE = 1,
  SMS,
  NOTIFICATION,
  SMS_AND_NOTIFICATION,
}

export const MessageTypeArray = (textArray: string[]) => [
  { val: MessageTypeEnum.PROFILE, text: textArray[0] },
  { val: MessageTypeEnum.SMS, text: textArray[1] },
  { val: MessageTypeEnum.NOTIFICATION, text: textArray[2] },
  { val: MessageTypeEnum.SMS_AND_NOTIFICATION, text: textArray[3] },
]

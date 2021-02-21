export interface SettingsInterface {
  passwordMinLength: number;
  passwordRequiredLetter: boolean;
  passwordRequiredSymbol: boolean;
  diffrenceAllowPercentageInExchange: number;
  smsNumber?: string;
  smsAPIkey?: string;
  notificationAPIkey?: string;
  notificationSenderkey?: string;
  applicationUrl?: string;
  messageExpireDayDefault: number;
  exchangeDeadline: number;
  debtAmountAllow: number;
  debtTimeAllow: number;
  ticketExireDuration: number;
  surveyTime?: number;
  drugExpireDay?: number;
}

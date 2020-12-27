export enum ExchangeStateEnum {
  // نامشخص
  UNKNOWN = 0,
  // ارسال نشده
  NOSEND = 1,
  // منتظر پاسخ داروخانه مقابل - طرف دوم
  WAITFORB = 2,
  // تایید داروخانه مقابل (طرف دوم) - در انتظار پاسخ شما
  CONFIRMB_AND_WAITFORA = 3,
  // تایید شده - در انتظار پرداخت
  CONFIRMA_AND_B = 4,
  // مخالفت شده توسط طرف دوم
  NOCONFIRMB = 5,
  // مخالفت شده توسط طرف اول
  CONFIRMB_AND_NOCONFIRMA = 6,
  // لغو شده
  CANCELLED = 7,
  // تایید شده - در انتظار پرداخت طرف اول
  CONFIRMA_AND_B_PAYMENTA = 8,
  // تایید شده - در انتظار پرداخت طرف دوم
  CONFIRMA_AND_B_PAYMENTB = 9,
  // تبادل کامل شده
  CONFIRMALL_AND_PAYMENTALL = 10,

  //// _FORB
  NOSEND_FORB = 11,
  // منتظر پاسخ داروخانه مقابل - طرف دوم
  WAITFORB_FORB = 12,
  // تایید داروخانه مقابل (طرف دوم) - در انتظار پاسخ شما
  CONFIRMB_AND_WAITFORA_FORB = 13,
  // تایید شده - در انتظار پرداخت
  CONFIRMA_AND_B_FORB = 14,
  // مخالفت شده توسط طرف دوم
  NOCONFIRMB_FORB = 15,
  // مخالفت شده توسط طرف اول
  CONFIRMB_AND_NOCONFIRMA_FORB = 16,
  // لغو شده
  CANCELLED_FORB = 17,
  // تایید شده - در انتظار پرداخت طرف اول
  CONFIRMA_AND_B_PAYMENTA_FORB = 18,
  // تایید شده - در انتظار پرداخت طرف دوم
  CONFIRMA_AND_B_PAYMENTB_FORB = 19,
  // تبادل کامل شده
  CONFIRMALL_AND_PAYMENTALL_FORB = 20,

}

export enum CancellerEnum {
  PHARMACYA_NOTRESPONSE = 1,
  PHARMACYB_NOTRESPONSE = 2,
  BYSUPPORUSER = 3,
  PHARMACYA_AFTERSEND = 4
}

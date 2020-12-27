import { isNullOrEmpty } from ".";
import { ExchangeStateEnum } from "../enum";
import moment from 'jalali-moment';

export const isExchangeCompletedOrCancelled = (state: number): boolean => {
  return ([
    ExchangeStateEnum.CONFIRMA_AND_B,
    ExchangeStateEnum.NOCONFIRMB,
    ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA,
    ExchangeStateEnum.CANCELLED,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
    ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
    ExchangeStateEnum.CONFIRMA_AND_B_FORB,
    ExchangeStateEnum.NOCONFIRMB_FORB,
    ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA_FORB,
    ExchangeStateEnum.CANCELLED_FORB,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
    ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
  ].indexOf(state) > -1);
};

export const isExchangeComplete = (state: number): boolean => {
  return (
    [
      ExchangeStateEnum.CONFIRMA_AND_B,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
      ExchangeStateEnum.CONFIRMA_AND_B_FORB,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
      ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
    ].indexOf(state) > -1
  )
};

export const getExpireDate = (item: any): string => {
  let expireDate: string = '';
  if (item?.currentPharmacyIsA) {
    expireDate = item?.expireDateA == null ? '' : item?.expireDateA;
  } else {
    expireDate = item?.expireDateB == null ? '' : item?.expireDateB;
  }
  if (isExchangeCompletedOrCancelled(item?.state)) {
    expireDate = expireDate > (
      item?.cancelDate == undefined ? '' : item?.cancelDate
    ) ? expireDate : item?.cancelDate;
  }
  expireDate = isNullOrEmpty(expireDate) ? ''
    : moment(expireDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
  return expireDate;
};

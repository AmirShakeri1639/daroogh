import { isNullOrEmpty } from ".";
import { ExchangeStateEnum } from "../enum";
import moment from 'jalali-moment';
import { LabelValue } from "../interfaces";

export const isExchangeCompleteddOrCancelled = (state: number): boolean => {
  return ([
    ExchangeStateEnum.NOCONFIRMB,
    ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA,
    ExchangeStateEnum.CANCELLED,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
    ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
    ExchangeStateEnum.NOCONFIRMB_FORB,
    ExchangeStateEnum.CONFIRMB_AND_NOCONFIRMA_FORB,
    ExchangeStateEnum.CANCELLED_FORB,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
    ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
    ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
  ].indexOf(state) > -1);
};

export const CompletedExchangeForAList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
];

export const CompletedExchangeForBList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
];

export const isExchangeCompleted = (
  state: number,
  isA: boolean | undefined = undefined
): boolean => {
  if (isA == undefined) {
    return (
      CompletedExchangeForAList.indexOf(state) > -1 ||
      CompletedExchangeForBList.indexOf(state) > -1
    );
  } else {
    return (
      isA
        ? CompletedExchangeForAList.indexOf(state) > -1
        : CompletedExchangeForBList.indexOf(state) > -1
    );
  }
};

export const getExpireDate = (item: any): string => {
  let expireDate: string = '';
  if (item?.currentPharmacyIsA) {
    expireDate = item?.expireDateA == null ? '' : item?.expireDateA;
  } else {
    expireDate = item?.expireDateB == null ? '' : item?.expireDateB;
  }
  if (isExchangeCompleteddOrCancelled(item?.state)) {
    expireDate = expireDate > (
      item?.cancelDate == undefined ? '' : item?.cancelDate
    ) ? expireDate : item?.cancelDate;
  }
  expireDate = isNullOrEmpty(expireDate) ? ''
    : moment(expireDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
  return expireDate;
};

/// Checks if a list of LavelValue has x value
export const hasLabelValue = (list: LabelValue[], x: any): boolean => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value == x) return true;
  }

  return false;
};

import { isNullOrEmpty } from ".";
import { ExchangeStateEnum } from "../enum";
import moment from 'jalali-moment';
import { LabelValue, ViewExchangeInterface } from "../interfaces";
import { Convertor } from './';

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

export const isStateCommon = (state: number): boolean => {
  return (
    [
      ExchangeStateEnum.UNKNOWN,
      ExchangeStateEnum.NOSEND,
      ExchangeStateEnum.CANCELLED,
      ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL
    ].indexOf(state) >= 0
  );
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

export const getExpireDateTitle = (state: number): string => {
  return (
    isExchangeCompleteddOrCancelled(state)
      ? 'exchange.completionDate' : 'exchange.expirationDate'
  );
};

/// Checks if a list of LavelValue has x value
export const hasLabelValue = (list: LabelValue[], x: any): boolean => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].value == x) return true;
  }

  return false;
};

export const ViewExchangeInitialState: ViewExchangeInterface = {
  id: 0,
  state: 1,
  currentPharmacyIsA: true,
  numberA: '',
  numberB: '',
  expireDateA: '',
  expireDateB: '',
  expireDate: '',
  canceller: 0,
  stateString: '',
  pharmacyKeyA: '',
  pharmacyKeyB: '',
  pharmacyCityA: '',
  pharmacyProvinceA: '',
  pharmacyCityB: '',
  pharmacyProvinceB: '',
  pharmacyGradeA: 0,
  pharmacyGradeB: 0,
  pharmacyStarA: 0,
  pharmacyStarB: 0,
  pharmacyWarrantyA: 0,
  pharmacyWarrantyB: 0,
  totalPourcentageA: 0,
  totalPourcentageB: 0,
  totalAmountA: 0,
  totalAmountB: 0,
  confirmA: false,
  confirmB: false,
  sendDate: '',
  confirmDateA: '',
  confirmDateB: '',
  paymentDateA: '',
  paymentDateB: '',
  cancelDate: '',
  description: '',
  lockSuggestion: false,
  allowShowPharmacyInfo: false,
  cartA: [],
  cartB: [],
};

export interface DifferenceCheckInterface {
  exchange: ViewExchangeInterface;
  // totalPriceA: number;
  // totalPriceB: number;
  percent: number
}

export interface DifferenceCheckOutputInterface {
  // amount of difference in prices
  difference: number;
  // Maximum between to diff percents
  diffPercent: number;
  // if the difference is less than allowed?
  isDiffOk: boolean;
  // Message to show to the user
  message: string;
}

/// Checks the difference between total price of two baskets 
/// and returns proper values and a suitable message
export const differenceCheck =
  (params: DifferenceCheckInterface): DifferenceCheckOutputInterface => {
    const { exchange, percent = 0.03 } = params;
    const { totalPriceA = 0, totalPriceB = 0 } = exchange;
    let difference: number = 0;
    let diffPercent: number = 0;
    let isDiffOk: boolean = true;
    let message: string = '';

    const { l } = Convertor;

    // const l = (v: string | number): string => {
    //   return v.toLocaleString('fa-IR');
    // };

    const lockMessage = 'از آنجا که طرف مقابل سبدها را قفل کرده است شما می‌توانید \
    تبادل را رد یا تایید نمایید. سبدها قابل ویرایش نیستند.';

    if (exchange.currentPharmacyIsA && totalPriceA === 0) {
      message = `اگر قصد دارید از سبد خود پیشنهادی ارائه دهید \
      حدود ${l(totalPriceB)} ریال از سبد خود انتخاب کنید تا اختلاف سبدها به حد مجاز برسد.\
      در غیر این صورت داروخانه مقابل از سبد شما انتخاب خواهد کرد.`;
    } else {
      // diff percent of each side
      const a3p = totalPriceA * percent;
      const b3p = totalPriceB * percent;

      difference = Math.abs(totalPriceA - totalPriceB);
      // setDifference(difference);
      diffPercent = Math.floor(
        difference * 100 / Math.max(totalPriceA, totalPriceB)
      );
      // Maximum between to diff percents
      const diffPercentValue = Math.max(a3p, b3p);
      //setDiffPercent(diffPercent);

      // if the difference is less than allowed?
      isDiffOk = difference < diffPercentValue;
      //if (setIs3PercentOk) setIs3PercentOk(isDiffOk);

      // difference to amend for A
      const diffA = totalPriceA > totalPriceB
        ? (totalPriceB + b3p) - totalPriceA
        : totalPriceB - (totalPriceA + b3p);

      // difference to amend for B
      const diffB = totalPriceA > totalPriceB
        ? totalPriceA - (totalPriceB + a3p)
        : (totalPriceA + a3p) - totalPriceB;

      // set messages:
      const diffAabs = l(Math.abs(diffA));
      const diffBabs = l(Math.abs(diffB));
      if (exchange.currentPharmacyIsA) {
        message = diffA > 0
          ? `لطفا ${diffAabs} ریال به سبد خود اضافه کنید `
          : `لطفا ${diffAabs} ریال از سبد خود کم کنید `
        message += diffB > 0
          ? `یا ${diffBabs} ریال به سبد طرف مقابل اضافه کنید `
          : `یا ${diffBabs} ریال از سبد طرف مقابل کم کنید `
      } else {
        message = diffB > 0
          ? `لطفا ${diffBabs} ریال به سبد خود اضافه کنید `
          : `لطفا ${diffBabs} ریال از سبد خود کم کنید `
        message += diffA > 0
          ? `یا ${diffAabs} ریال به سبد طرف مقابل اضافه کنید `
          : `یا ${diffAabs} ریال از سبد طرف مقابل کم کنید `
      }

      message += ' تا اختلاف قیمت سبدها به حد مجاز برسد.'

      if (exchange.lockSuggestion) {
        if (isDiffOk) {
          message = lockMessage;
        } else if (!exchange.currentPharmacyIsA) {
          message += `\n${lockMessage}`;
        }
      }

    }

    return {
      difference,
      diffPercent,
      isDiffOk,
      message
    }

    //setDifferenceMessage(message);
  };

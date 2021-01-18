import { isNullOrEmpty } from '.';
import { ExchangeStateEnum } from '../enum';
import moment from 'jalali-moment';
import {
  AllPharmacyDrugInterface,
  LabelValue,
  ViewExchangeInterface,
} from '../interfaces';
import { Convertor } from './';

export const isExchangeCompleteddOrCancelled = (state: number): boolean => {
  return (
    [
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
    ].indexOf(state) > -1
  );
};

export const CompletedExchangeForAList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTA_FORB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL_FORB,
];

export const CompletedExchangeForBList: ExchangeStateEnum[] = [
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB,
  ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL,
  ExchangeStateEnum.CONFIRMA_AND_B_PAYMENTB_FORB,
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
    return isA
      ? CompletedExchangeForAList.indexOf(state) > -1
      : CompletedExchangeForBList.indexOf(state) > -1;
  }
};

export const isStateCommon = (state: number): boolean => {
  return (
    [
      ExchangeStateEnum.UNKNOWN,
      ExchangeStateEnum.NOSEND,
      ExchangeStateEnum.CANCELLED,
      ExchangeStateEnum.CONFIRMA_AND_B,
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
    expireDate =
      expireDate > (item?.cancelDate == undefined ? '' : item?.cancelDate)
        ? expireDate
        : item?.cancelDate;
  }
  expireDate = isNullOrEmpty(expireDate)
    ? ''
    : moment(expireDate, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD');
  return expireDate;
};

export const getExpireDateTitle = (state: number): string => {
  return isExchangeCompleteddOrCancelled(state)
    ? 'exchange.completionDate'
    : 'exchange.expirationDate';
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
  totalPriceA: 0,
  totalPriceB: 0,
};

export interface DifferenceCheckInterface {
  exchange: ViewExchangeInterface;
  // totalPriceA?: number;
  // totalPriceB?: number;
  percent: number;
  cartA?: AllPharmacyDrugInterface[];
  cartB?: AllPharmacyDrugInterface[];
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
export const differenceCheck = (
  params: DifferenceCheckInterface
): DifferenceCheckOutputInterface => {
  const { exchange, percent, cartA = [], cartB = [] } = params;
  // let { totalPriceA = 0, totalPriceB = 0 } = params;
  let { totalPriceA = 0, totalPriceB = 0 } = exchange;

  // if (totalPriceA !== 0 ) {
  if (cartA.length > 0) {
    totalPriceA = cartA.map(i => {
      return (
        i.packID !== null
          ? i.totalAmount
          : isNullOrEmpty(i.confirmed) || i.confirmed
            ? i.currentCnt
              ? i.currentCnt * i.amount
              : i.cnt * i.amount
            : 0
      )
    }).reduce((sum, price) => sum + price);
  } else if (exchange.cartA && exchange.cartA.length > 0) {
    totalPriceA = exchange.cartA
      .map(i => {
        return (
          // i.packID !== null
          //   ? i.totalAmount :
          isNullOrEmpty(i.confirmed) || i.confirmed ? i.cnt * i.amount : 0
        )
      })
      .reduce((sum, price) => sum + price);
  }
  // }

  // if (totalPriceB !== 0) {
  if (cartB.length > 0) {
    totalPriceB = cartB.map(i => {
      return (
        i.packID !== null
          ? i.totalAmount
          : isNullOrEmpty(i.confirmed) || i.confirmed
            ? i.currentCnt
              ? i.currentCnt * i.amount
              : i.cnt * i.amount
            : 0
      )
    }).reduce((sum, price) => sum + price);
  } else if (exchange.cartB && exchange.cartB.length > 0) {
    totalPriceB = exchange.cartB
      .map(i => {
        return (
          // i.packID !== null
          //   ? i.totalAmount :
          isNullOrEmpty(i.confirmed) || i.confirmed ? i.cnt * i.amount : 0
        )
      })
      .reduce((sum, price) => sum + price);
  }
  // }

  let difference: number = 0;
  let diffPercent: number = 0;
  let isDiffOk: boolean = true;
  let message: string = '';

  const { l } = Convertor;

  // const l = (v: string | number): string => {
  //   return v.toLocaleString('fa-IR');
  // };

  // diff percent of each side
  const a3p = totalPriceA * percent;
  const b3p = totalPriceB * percent;

  difference = Math.abs(totalPriceA - totalPriceB);
  // setDifference(difference);
  diffPercent = Math.floor(
    (difference * 100) / Math.max(totalPriceA, totalPriceB)
  );
  // Maximum between to diff percents
  const diffPercentValue = Math.max(a3p, b3p);
  //setDiffPercent(diffPercent);

  // if the difference is less than allowed?
  isDiffOk = difference < diffPercentValue;
  //if (setIs3PercentOk) setIs3PercentOk(isDiffOk);

  // difference to amend for A
  const diffA =
    totalPriceA > totalPriceB
      ? totalPriceB + b3p - totalPriceA
      : totalPriceB - (totalPriceA + b3p);

  // difference to amend for B
  const diffB =
    totalPriceA > totalPriceB
      ? totalPriceA - (totalPriceB + a3p)
      : totalPriceA + a3p - totalPriceB;

  const lockMessage =
    'از آنجا که طرف مقابل سبدها را قفل کرده است شما می‌توانید \
    تبادل را رد یا تایید نمایید. سبدها قابل ویرایش نیستند.';

  if (exchange.currentPharmacyIsA && totalPriceA === 0 && totalPriceB !== 0) {
    message = `اگر قصد دارید از سبد خود پیشنهادی ارائه دهید \
      حدود ${l(
      totalPriceB
    )} ریال از سبد خود انتخاب کنید تا اختلاف سبدها به حد مجاز برسد.\
      در غیر این صورت داروخانه مقابل از سبد شما انتخاب خواهد کرد.`;
  } else {
    // TODO: if diffA or diffB === 0 hide message

    // set messages:
    const diffAabs = l(Math.abs(diffA));
    const diffBabs = l(Math.abs(diffB));
    if (diffA !== 0 && diffB !== 0) {
      message = '';
      if (exchange.currentPharmacyIsA) {
        if (diffA > 0) {
          message += `لطفا حدود ${diffAabs} ریال به سبد خود اضافه کنید `;
          message +=
            diffB < 0
              ? `یا حدود ${diffBabs} ریال از سبد طرف مقابل کم کنید `
              : `یا حدود ${diffBabs} ریال به سبد طرف مقابل اضافه کنید `;
        } else {
          message +=
            diffB > 0
              ? `لطفا حدود ${diffBabs} ریال به سبد طرف مقابل اضافه کنید `
              : `لطفا حدود ${diffBabs} ریال از سبد طرف مقابل کم کنید `;
          message += `یا حدود ${diffAabs} ریال از سبد خود کم کنید `;
        }
        // message = diffA > 0
        //   ? `لطفا حدود ${diffAabs} ریال به سبد خود اضافه کنید `
        //   : `لطفا حدود ${diffAabs} ریال از سبد خود کم کنید `
        // message += diffB > 0
        //   ? `یا حدود ${diffBabs} ریال به سبد طرف مقابل اضافه کنید `
        //   : `یا حدود ${diffBabs} ریال از سبد طرف مقابل کم کنید `
      } else {
        if (diffB > 0) {
          message += `لطفا حدود ${diffBabs} ریال به سبد خود اضافه کنید `;
          message +=
            diffA < 0
              ? `یا حدود ${diffAabs} ریال از سبد طرف مقابل کم کنید `
              : `یا حدود ${diffAabs} ریال به سبد طرف مقابل اضافه کنید `;
        } else {
          message +=
            diffA > 0
              ? `لطفا حدود ${diffAabs} ریال به سبد طرف مقابل اضافه کنید `
              : `لطفا حدود ${diffAabs} ریال از سبد طرف مقابل کم کنید `;
          message += `یا حدود ${diffBabs} ریال از سبد خود کم کنید `;
        }
        // message = diffB > 0
        //   ? `لطفا حدود ${diffBabs} ریال به سبد خود اضافه کنید `
        //   : `لطفا حدود ${diffBabs} ریال از سبد خود کم کنید `
        // message += diffA > 0
        //   ? `یا حدود ${diffAabs} ریال به سبد طرف مقابل اضافه کنید `
        //   : `یا حدود ${diffAabs} ریال از سبد طرف مقابل کم کنید `
      }
      message += ' تا اختلاف قیمت سبدها به حد مجاز برسد.';
    }

    if (exchange.lockSuggestion && !exchange.currentPharmacyIsA) {
      if (isDiffOk) {
        message = lockMessage;
      } else {
        message += `\n${lockMessage}`;
      }
    }
  }

  if (isDiffOk && exchange.currentPharmacyIsA) {
    message = '';
  }

  if (isNaN(diffPercent)) {
    diffPercent = 0;
  }

  return {
    difference,
    diffPercent,
    isDiffOk,
    message,
  };

  //setDifferenceMessage(message);
};

export interface CalcTotalPricesInterface {
  exchange: ViewExchangeInterface;
  uBasketCount?: AllPharmacyDrugInterface[];
  basketCount?: AllPharmacyDrugInterface[];
}

/// Calculates total price of two (A & B) baskets for an exchange
export const calcTotalPrices = (
  params: CalcTotalPricesInterface
): ViewExchangeInterface => {
  const { exchange, uBasketCount = [], basketCount = [] } = params;
  if (exchange.currentPharmacyIsA) {
    exchange.totalPriceA = (uBasketCount.length > 0)
      ? uBasketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
    exchange.totalPriceB = (basketCount.length > 0)
      ? basketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
  } else {
    exchange.totalPriceA = (basketCount.length > 0)
      ? basketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
    exchange.totalPriceB = (uBasketCount.length > 0)
      ? uBasketCount
        .map(b => isNullOrEmpty(b.confirmed) || b.confirmed ? b.currentCnt * b.amount : 0)
        .reduce((sum, price) => sum + price)
      : 0;
  }

  return exchange;
};

/// Reads max difference percent from localStorage (settings)
export const percentAllowed = (): number => {
  try {
    const settings = localStorage.getItem('settings') || '{}';
    const { diffrenceAllowPercentageInExchange } = JSON.parse(settings);
    return diffrenceAllowPercentageInExchange / 100;
  } catch (e) {
    return 0.03;
  }
};

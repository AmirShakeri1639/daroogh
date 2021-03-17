import { TransactionTypeEnum } from "../enum";

export interface GetAccountingForPaymentInterace {
  accountingForPayment: AccountingInterface[];
  bankGetwayes: BankGetwayesInterface[];
  debtAmountAllow: number;
  paymentExchangeByBestankari: PaymentExchangeByBestankari;
}

export interface PaymentExchangeByBestankari {
  isSuccess: boolean;
  message: string;
  data: {};
}

export interface AccountingInterface {
  id: number;
  date: string;
  description: string;
  amount: number;
  isChecked?: boolean;
  exchangeID: number | null;
  mandeh: number;
  currentPharmacyIsA?: boolean;
  numberA?: number;
  numberB?: number;
}

export interface AccountingCardInterface {
  data: AccountingInterface
  exchangeHandler: any
}

export interface BankGetwayesInterface {
  name: string;
  title: string;
}

export interface AccountingTransactionInterface {
  pharmacyId: number;
  amount: number;
  tarikh: string;
  description: string;
  transactionType?: TransactionTypeEnum;
}

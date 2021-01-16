import { TransactionTypeEnum } from "../enum";

export interface GetAccountingForPaymentInterace {
  accountingForPayment: AccountingInterface[];
  bankGetwayes: BankGetwayesInterface[];
  debtAmountAllow: number;
}

export interface AccountingInterface {
  id: number;
  date: string;
  description: string;
  amount: number;
  isChecked?: boolean;
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

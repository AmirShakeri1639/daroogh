import Api from './Api';
import { errorHandler } from "../../utils";
import { AccountingInterface, AccountingTransactionInterface } from "../../interfaces";

class Accounting extends Api {
  readonly urls = {
    all: '/Accounting/AllAccounting',
    add: '/Accounting/Add',
  }

  all = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  add = async (data: AccountingTransactionInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.add, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default Accounting;

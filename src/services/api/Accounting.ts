import Api from './Api';
import { errorHandler } from '../../utils';
import { AccountingTransactionInterface } from '../../interfaces';
import { DataTableColumns } from 'interfaces/DataTableColumns';

class Accounting extends Api {
  readonly urls = {
    all: '/Accounting/AllAccounting',
    add: '/Accounting/Add',
    isIndebtPharmacy: '/Accounting/IsIndebtPharmacy',
  };

  all = async (skip: number, top: number = 10,
    searchableColumns: DataTableColumns[] = [],
    searchText: string = ""): Promise<any> => {
      var filter = 'true';
    if (searchText.trim() != "") {
      filter = `(contains(cast(description,'Edm.String'),'${searchText}'))`
    }
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc&$filter=${filter}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  add = async (data: AccountingTransactionInterface): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.add}?pharmacyId=${data.pharmacyId}` +
        `&amount=${data.amount}&tarikh=${data.tarikh}` +
        `&description=${data.description}`,
      data
    );
    return result.data;
  };

  isIndebtPharmacy = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.isIndebtPharmacy);
    return result.data;
  };
}

export default Accounting;

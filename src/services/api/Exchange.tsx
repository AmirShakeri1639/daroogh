import Api from './Api';
import { errorHandler } from '../../utils';
import { DataTableColumns } from '../../interfaces/DataTableColumns';

class Exchange extends Api {
  readonly urls = {
    pharmacyInfo: '/Exchange/GetExchangePharmacyInfo?exchangeID=',
    dashboard: '/Exchange/Dashboard',
    allExchange: '/Exchange/AllExchange',
  };

  getPharmacyInfoOfExchange = async (
    exchangeId: string | number = ''
  ): Promise<any> => {
    const result = await this.postData(
      `${this.urls.pharmacyInfo}${exchangeId}`
    );
    return result.data;
  };

  getDashboard = async (e: any): Promise<any> => {
    try {
      e *= 10;
      const url = `${this.urls.dashboard}?&$top=10&$skip=${e}&$orderby=id desc`;
      console.log('Dashboard Url => ', url);
      const result = await this.postData(`${this.urls.dashboard}?&$top=10&$skip=${e}&$orderby=id desc`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getAllExchange = async (
    skip: number = 0,
    top: number = 100,
    searchableColumns: DataTableColumns[],
    searcheText: string = '',
    orderBy?: {
      orderByIndex: number;
      orderByName: string;
      orderDirection: string;
    }
  ): Promise<any> => {
    try {
      let query = `${this.urls.allExchange}`;
      query += `?&$top=${top}&$skip=${skip * top}`;
      if (searcheText !== '') {
        query += '&$filter=';
        searchableColumns.forEach((x: DataTableColumns, i: number) => {
          const openP = i === 0 ? '(' : '';
          const closeP = i === searchableColumns.length - 1 ? ')' : '';
          const orO = i < searchableColumns.length - 1 ? 'or ' : '';
          query += `${openP}contains(cast(${x.field}, 'Edm.String'),'${searcheText}')${orO}${closeP}`;
        });
      }
      if (orderBy) {
        query += `&$orderby=${orderBy.orderByName} ${orderBy.orderDirection}`;
      }
      const result = await this.postData(query);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default Exchange;

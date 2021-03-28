import Api from './Api';
import { errorHandler } from '../../utils';
import { DataTableColumns } from '../../interfaces/DataTableColumns';

class Exchange extends Api {
  readonly waitingFilter = `&$filter=` +
    `(contains(cast(state, 'Edm.String'), '3') and currentPharmacyIsA eq true) or ` +
    `(contains(cast(state, 'Edm.String'), '2') and currentPharmacyIsA eq false)`;
  readonly surveyFilter = '&$filter=needSurvey eq true';
  readonly urls = {
    pharmacyInfo: '/Exchange/GetExchangePharmacyInfo?exchangeID=',
    dashboard: '/Exchange/Dashboard',
    needSurvey: '/Exchange/Dashboard?$filter=needSurvey eq true',
    allExchange: '/Exchange/AllExchange',
    // state 3 = CONFIRMB_AND_WAITFORA
    // state 2 = WAITFORB (12 for B)
    getForWidget:
      `/Exchange/Dashboard?${this.waitingFilter}`,
    oneExchange: 'Exchange/ViewExchange?exchangeID=',
  };

  getExchangeTree = async (exchangeId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.oneExchange}${exchangeId}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getPharmacyInfoOfExchange = async (
    exchangeId: string | number = ''
  ): Promise<any> => {
    const result = await this.postData(
      `${this.urls.pharmacyInfo}${exchangeId}`
    );
    return result.data;
  };

  getDashboard = async (e: any, filter: any = ''): Promise<any> => {
    try {
      e *= 10;
      let url = `${this.urls.dashboard}?$top=10&$skip=${e}&$orderby=id desc`;
      switch (filter) {
        case 'waiting':
          url += this.waitingFilter
          break;
        case 'survey':
          url += this.surveyFilter
          break;
        default:
          break;
      }
      const result = await this.postData(url);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getForWidget = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.getForWidget);
    return result.data;
  };

  needSurvey = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.needSurvey);
    return result.data;
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

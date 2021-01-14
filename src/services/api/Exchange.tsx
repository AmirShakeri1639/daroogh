import Api from './Api';
import { errorHandler } from '../../utils';

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

  getDashboard = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.dashboard);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getAllExchange = async (
    skip: number = 0,
    top: number = 100
  ): Promise<any> => {
    try {
      const query = `${this.urls.allExchange}`;
      // query += `&$top=${top}&$skip=${skip * top}`;
      const result = await this.postJsonData(query);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default Exchange;

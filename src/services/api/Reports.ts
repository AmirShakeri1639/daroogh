import Api from './Api';
import { errorHandler } from '../../utils';

class Reports extends Api {
  readonly urls = {
    getBestPharmaciesList: '/Reports/GetBestPharmacyListScores2',
    getExchangeStatus: '/Reports/getExchangeStatus',
    getExchangeCount: '/Reports/GetExchangeCount',
    getWidgetInfo: '/Reports/GetWidgetInfo',
  };

  getWidgetInfo = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.getWidgetInfo);
    return result.data;
  }

  getBestPharmaciesList = async (for24Hour: boolean): Promise<any> => {
    try {
      const result = await this.postData(
        `${this.urls.getBestPharmaciesList}?for24Hour=${for24Hour}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
  getExchangeStatus = async (): Promise<any> => {
    try {
      const result = await this.getData(`${this.urls.getExchangeStatus}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
  getExchangeCount = async (): Promise<any> => {
    try {
      const result = await this.getData(`${this.urls.getExchangeCount}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default Reports;

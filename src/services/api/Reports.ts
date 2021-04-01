import Api from './Api';
import { errorHandler } from '../../utils';
import {
  PharmacyInterface,
  ConfirmParams,
  PharmacyWithUserInterface,
  RreportSearch,
} from '../../interfaces';

class Reports extends Api {
  readonly urls = {
    getBestPharmaciesList: '/Reports/GetBestPharmacyListScores2',
    getExchangeStatus: '/Reports/getExchangeStatus',
    getExchangeCount: '/Reports/GetExchangeCount',
    getSurplusDrugs: '/Reports/GetSurplusDrugs',
    getFavoriteDrugs: '/Reports/GetFavoriteDrugs',
    getSelectedDrugs: '/Reports/GetSelectedDrugs',
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
  getSurplusDrugs = async (
    skip: number,
    top: number = 10,
    data: RreportSearch
  ): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getSurplusDrugs}?top=${top}&$skip=${
          top * skip
        }&fromDate=${data.fromDate
          .convert('gregorian')
          .setLocale('en')
          .format('YYYY/MM/DD')}&toDate=${data.toDate
          .convert('gregorian')
          .setLocale('en')
          .format('YYYY/MM/DD')}&geoCode=${
          data.geoCode
        }&remainExpDaysFromMinDate=${data.remainExpDaysFromMinDate}`
      );
      return result.data.items;
    } catch (e) {
      errorHandler(e);
    }
  };

  getFavoriteDrugs = async (
    skip: number,
    top: number = 10,
    data: RreportSearch
  ): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getFavoriteDrugs}?top=${top}&$skip=${
          top * skip
        }&fromDate=${data.fromDate}&toDate=${data.toDate}&geoCode=${
          data.geoCode
        }&remainExpDaysFromMinDate=${data.remainExpDaysFromMinDate}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
  getSelectedDrugs = async (
    skip: number,
    top: number = 10,
    data: RreportSearch
  ): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getSelectedDrugs}?top=${top}&$skip=${
          top * skip
        }&fromDate=${data.fromDate.convert(
          'gregorian'
        )}&toDate=${data.toDate.convert('gregorian')}&geoCode=${
          data.geoCode
        }&remainExpDaysFromMinDate=${data.remainExpDaysFromMinDate}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default Reports;

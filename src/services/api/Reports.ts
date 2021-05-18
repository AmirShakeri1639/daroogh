import Api from './Api';
import { errorHandler } from '../../utils';
import {
  PharmacyInterface,
  ConfirmParams,
  PharmacyWithUserInterface,
  RreportSearch,
  LoginCountReportInterface,
} from '../../interfaces';
import moment from 'jalali-moment';

class Reports extends Api {
  readonly urls = {
    getBestPharmaciesList: '/Reports/GetBestPharmacyListScores2',
    getBestPharmacyListScoresInRegion: '/Reports/GetBestPharmacyListScoresInRegion',
    getExchangeStatus: '/Reports/getExchangeStatus',
    getExchangeCount: '/Reports/GetExchangeCount',
    getSurplusDrugs: '/Reports/GetSurplusDrugs',
    getFavoriteDrugs: '/Reports/GetFavoriteDrugs',
    getSelectedDrugs: '/Reports/GetSelectedDrugs',
    getWidgetInfo: '/Reports/GetWidgetInfo',
    getAddedValueOfPharmacy: '/Reports/GetAddedValueOfPharmacy',
    getAddedValue: '/Reports/GetAddedValue',
    getLoginCount: '/Reports/GetLoginCount',
    getAllPharmacyDrugs: '/Reports/AllPharmacyDrug',
  };

  getWidgetInfo = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.getWidgetInfo)
    return result?.data
  }

  getBestPharmaciesList = async (for24Hour: boolean): Promise<any> => {
    try {
      const result = await this.postData(
        `${this.urls.getBestPharmaciesList}?for24Hour=${for24Hour}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  getTopBestPharmacies = async (code: string): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.getBestPharmacyListScoresInRegion}?countryDivisionCode=${code}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  getExchangeStatus = async (): Promise<any> => {
    try {
      const result = await this.getData(`${this.urls.getExchangeStatus}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  SearchMap = async (term: string, lat: number, lng: number): Promise<any> => {
    debugger;
    try {
      const result = await this.getData(
        `/CountryDivision/SearchMap?term=${term}&lat=${lat}&lng=${lng}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  getExchangeCount = async (): Promise<any> => {
    try {
      const result = await this.getData(`${this.urls.getExchangeCount}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  getAddedValueOfPharmacy = async (): Promise<any> => {
    try {
      const now = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
      // const result = await this.getData(
      //   `${this.urls.getAddedValueOfPharmacy}?fromDate=${new Intl.DateTimeFormat(undefined, {
      //     year: 'numeric',
      //     day: '2-digit',
      //     month: '2-digit',
      //   }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))}`
      // );
      const result = await this.getData(`${this.urls.getAddedValueOfPharmacy}?fromDate=${now}`);
      return result?.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  getAddedValue = async (): Promise<any> => {
    try {
      const now = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
      const result = await this.getData(`${this.urls.getAddedValue}?fromDate=${now}`);
      return result?.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
  getSurplusDrugs = async (skip: number, top: number = 10, data: RreportSearch): Promise<any> => {
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
          .format('YYYY/MM/DD')}&geoCode=${data.geoCode}&remainExpDaysFromMinDate=${
          data.remainExpDaysFromMinDate
        }`
      );
      return result.data.items;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  getFavoriteDrugs = async (skip: number, top: number = 10, data: RreportSearch): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getFavoriteDrugs}?top=${top}&$skip=${top * skip}&fromDate=${
          data.fromDate
        }&toDate=${data.toDate}&geoCode=${data.geoCode}&remainExpDaysFromMinDate=${
          data.remainExpDaysFromMinDate
        }`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  getSelectedDrugs = async (skip: number, top: number = 10, data: RreportSearch): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getSelectedDrugs}?top=${top}&$skip=${
          top * skip
        }&fromDate=${data.fromDate.convert('gregorian')}&toDate=${data.toDate.convert(
          'gregorian'
        )}&geoCode=${data.geoCode}&remainExpDaysFromMinDate=${data.remainExpDaysFromMinDate}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  getLoginCount = async (params: LoginCountReportInterface): Promise<any> => {
    const { fromDate, toDate = null, geoCode = null, pharmacyID = null } = params;
    const url =
      this.urls.getLoginCount +
      `?fromDate=${fromDate}` +
      (toDate ? `&toDate=${toDate}` : '') +
      (geoCode ? `&geoCode=${geoCode}` : '') +
      (pharmacyID ? `&pharmacyID=${pharmacyID}` : '');
    const result = await this.getData(url);
    return result.data;
  };

  getAllPharmacyDrugs = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.getAllPharmacyDrugs);
    return result.data;
  };
}

export default Reports;

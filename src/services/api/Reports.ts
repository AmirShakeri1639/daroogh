import Api from './Api'
import { errorHandler } from "../../utils";
import { PharmacyInterface, ConfirmParams, PharmacyWithUserInterface } from '../../interfaces';

class Reports extends Api {
  readonly urls = {
    getBestPharmaciesList: '/Reports/GetBestPharmacyListScores',
    getExchangeStatus: '/Reports/getExchangeStatus'
  }


  getBestPharmaciesList = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getBestPharmaciesList}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }
  getExchangeStatus = async (): Promise<any> => {
    try {
      const result = await this.getData(
        `${this.urls.getExchangeStatus}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

}

export default Reports;

import { AddDrugInterface } from '../../interfaces/ExchangeInterface';
import { ViewExchangeInterface } from '../../interfaces/ViewExchangeInterface';
import { AddDrog1, AddPack1, RemovePack1, Send } from '../../model/exchange';
import { errorHandler } from '../../utils';
import Api from './Api';

class PharmacyDrug extends Api {
  readonly urls = {
    all: '/PharmacyDrug/AllPharmacyDrug',
    get: '',
    addDrug1: '/Exchange/AddDrug1',
    addPack1: '/Exchange/AddPack1',
    removePack1: '/Exchange/RemovePack1',
    addDrug2: '/Exchange/AddDrug2',
    addPack2: '/Exchange/AddPack2',
    removePack2: '/Exchange/RemovePack2',
    send: '/Exchange/Send',
    viewExchange: '/Exchange/ViewExchange',
  };

  getAllPharmacyDrug = async (
    id: string,
    skip: number = 0,
    top: number = 10
  ): Promise<any> => {
    try {
      let query = `${this.urls.all}?pharmacyKey=${id}&full=false`;
      query += `&$top=${top}&$skip=${skip * top}`;
      const result = await this.postJsonData(query);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getViewExchange = async (exchangeID: number): Promise<any> => {
    try {
      const query = `${this.urls.viewExchange}?exchangeID=${exchangeID}`;
      const result = await this.postJsonData(query);
      return result
    } catch (error) {
      errorHandler(error);
    }
  }

  addDrug1 = async (data: AddDrog1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addDrug1}?pharmacyDrugID=${data.pharmacyDrugID}&count=${data.count}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getRelatedPharmacyDrug = async (count = 10): Promise<any> => {
    const result = await this.postData(`/PharmacyDrug/GetRelatedPharmacyDrug?from=0&count=${count}`);
    return result.data;
  };

  addPack1 = async (data: AddPack1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addPack1}?packID=${data.packID}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  removePack1 = async (data: RemovePack1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.removePack1}?packID=${data.packID}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  addDrug2 = async (data: AddDrog1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addDrug2}?pharmacyDrugID=${data.pharmacyDrugID}&count=${data.count}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  addPack2 = async (data: AddPack1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addPack2}?packID=${data.packID}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  removePack2 = async (data: RemovePack1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.removePack2}?packID=${data.packID}&pharmacyKey=${data.pharmacyKey}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  send = async (data: Send): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.send}?exchangeID=${data.exchangeID}&lockSuggestion=${data.lockSuggestion}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default PharmacyDrug;

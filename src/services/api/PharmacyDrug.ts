import { AddDrugInterface, ViewExchangeInterface } from '../../interfaces';
import { PharmacyDrugSupplyList } from '../../model/pharmacyDrug';
import {
  AddDrog1,
  AddDrog2,
  AddPack1,
  AddPack2,
  Cancel,
  ConfirmOrNotExchange,
  Payment,
  RemovePack1,
  RemovePack2,
  Send,
} from '../../model/exchange';
import { errorHandler } from '../../utils';
import Api from './Api';
import { SaveSurvey } from '../../model/SaveSurvey';

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
    cancelExchange: '/Exchange/CancelExchange',
    removeExchange: '/Exchange/RemoveExchange',
    confirmOrNotExchange: '/Exchange/ConfirmExchange',
    getAccountingForPayment: '/Accounting/GetAccountingForPayment',
    payment: '/Accounting/Payment',
    pharmacyInfo: '/Exchange/GetExchangePharmacyInfo',
    getQuestionGroupOfExchange: '/QuestionGroups/GetQuestionGroupOfExchange/',
    detailPharmacyInfo: 'Pharmacy/Detail/',
    saveSurvey: 'Survey/Save/',
    getFavoritePharmacyDrugCount: '/PharmacyDrug/GetFavoritePharmacyDrugCount',
    getFavoritePharmacyDrug: '/PharmacyDrug/GetFavoritePharmacyDrug',
  };

  getAllPharmacyDrug = async (
    id: string,
    skip: number = 0,
    top: number = 100
  ): Promise<any> => {
    try {
      const query = `${this.urls.all}?pharmacyKey=${id}&full=false`;
      // query += `&$top=${top}&$skip=${skip * top}`;
      const result = await this.postJsonData(query);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  getViewExchange = async (exchangeID: number | string | undefined): Promise<any> => {
    try {
      const query = `${this.urls.viewExchange}?exchangeID=${exchangeID}`;
      const result = await this.postJsonData(query);
      return result;
    } catch (error) {
      errorHandler(error);
      return Promise.reject(error)
    }
  };

  getAccountingForPayment = async (exchangeId: number): Promise<any> => {
    try {
      const query = `${this.urls.getAccountingForPayment}${exchangeId > 0 ? '?exchangeId=' + exchangeId : ''
        }`;
      const result = await this.postJsonData(query);
      return result;
    } catch (error) {
      errorHandler(error);
      return Promise.reject(error)
    }
  };

  addDrug1 = async (data: AddDrog1): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addDrug1}?pharmacyDrugID=${data.pharmacyDrugID}&count=${data.count}&pharmacyKey=${data.pharmacyKey} `
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  getRelatedPharmacyDrug = async (
    count: string | number = '',
    from?: number,
  ): Promise<any> => {
    const result = await this.postData(
      `/PharmacyDrug/GetRelatedPharmacyDrug?from=${from ?? 0}&count=${count}`
    );
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
      return Promise.reject(e)
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
      return Promise.reject(e)
    }
  };

  addDrug2 = async (data: AddDrog2): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addDrug2}?pharmacyDrugID=${data.pharmacyDrugID}&count=${data.count}&exchangeID=${data.exchangeID}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  addPack2 = async (data: AddPack2): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addPack2}?packID=${data.packID}&exchangeID=${data.exchangeID}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  removePack2 = async (data: RemovePack2): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.removePack2}?packID=${data.packID}&exchangeID=${data.exchangeID}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  send = async (data: Send): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.send}?exchangeID=${data.exchangeID}&lockSuggestion=${data.lockSuggestion}`
      );
      return result;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  allPharmacyDrug = async (
    order: 'asc' | 'desc' = 'asc',
    orderBy: 'expireDate' | 'date' | 'cnt' = 'expireDate',
    isFull = true,
    pharmacyKey: string = '',
  ): Promise<any> => {
    const result = await this.postData(
      `/PharmacyDrug/AllPharmacyDrug?full=${isFull}&pharmacyKey=${pharmacyKey}&$orderby=${orderBy} ${order}`
    );
    return result.data;
  };

  removePharmacyDrug = async (id: string | number): Promise<any> => {
    const result = await this.postData(`/PharmacyDrug/Remove/${id} `);
    return result.data;
  };

  cancelExchange = async (data: Cancel): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.cancelExchange}?exchangeID=${data.exchangeID}&comment=${data.comment}`
      );
      return result;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  removeExchange = async (exchangeId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.removeExchange}?exchangeID=${exchangeId}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  confirmOrNotExchange = async (data: ConfirmOrNotExchange): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.confirmOrNotExchange}?exchangeID=${data.exchangeID}&confirm=${data.isConfirm}`
      );
      return result;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  savePharmacyDrug = async (data: PharmacyDrugSupplyList): Promise<any> => {
    const result = await this.postJsonData('/PharmacyDrug/Save', data);
    return result.data;
  };

  getPayment = async (data: Payment): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.payment} `, data);
    return result.data;
  };

  pharmacyInfo = async (exchangeID: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.pharmacyInfo}?exchangeID=${exchangeID} `
      );
      return result;
    } catch (e) {
      errorHandler(e);
    }
  };

  detailPharmacyInfo = async (id: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.detailPharmacyInfo} ${id} `
      );
      return result;
    } catch (e) {
      errorHandler(e);
    }
  };

  getQuestionGroupOfExchange = async (exchangeID: number): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getQuestionGroupOfExchange} ${exchangeID} `
    );
    return result;
  };

  saveSurvey = async (data: SaveSurvey): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.saveSurvey, data
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getFavoritePharmacyDrugCount = async (): Promise<any> => {
    const result = await this.postJsonData(this.urls.getFavoritePharmacyDrugCount);
    return result.data;
  }

  getFavoritePharmacyDrug = async (pharmacyKey = ''): Promise<any> => {
    const result = await this.postData(`${this.urls.getFavoritePharmacyDrug}?pharmacyKey=${pharmacyKey}`);
    return result.data;
  }

  getRelatedPharmacyDrugByDate = async (count: string | number = '', from?: number): Promise<any> => {
    const result = await this.postData(`/PharmacyDrug/GetRelatedPharmacyDrugByDate?count=${count}&from=${from}`);
    return result.data;
  }
}

export default PharmacyDrug;

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
    }
  };

  getViewExchange = async (exchangeID: number): Promise<any> => {
    try {
      const query = `${this.urls.viewExchange}?exchangeID=${exchangeID}`;
      const result = await this.postJsonData(query);
      return result;
    } catch (error) {
      errorHandler(error);
    }
  };

  getAccountingForPayment = async (): Promise<any> => {
    try {
      const query = `${this.urls.getAccountingForPayment}`;
      const result = await this.postJsonData(query);
      return result;
    } catch (error) {
      errorHandler(error);
    }
  };

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
    const result = await this.postData(
      `/PharmacyDrug/GetRelatedPharmacyDrug?from=0&count=${count}`
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

  addDrug2 = async (data: AddDrog2): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.addDrug2}?pharmacyDrugID=${data.pharmacyDrugID}&count=${data.count}&exchangeID=${data.exchangeID}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
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
    }
  };

  allPharmacyDrug = async (
    pharmacyKey: string = '',
    isFull = true
  ): Promise<any> => {
    const result = await this.postData(
      `/PharmacyDrug/AllPharmacyDrug?full=${isFull}&pharmacyKey=${pharmacyKey}`
    );
    return result.data;
  };

  removePharmacyDrug = async (id: string | number): Promise<any> => {
    const result = await this.postData(`/PharmacyDrug/Remove/${id}`);
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
    }
  };

  savePharmacyDrug = async (data: PharmacyDrugSupplyList): Promise<any> => {
    const result = await this.postJsonData('/PharmacyDrug/Save', data);
    return result.data;
  };

  getPayment = async (data: Payment): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.payment}`, data);
    return result.data;
  };

  pharmacyInfo = async (exchangeID: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.pharmacyInfo}?exchangeID=${exchangeID}`
      );
      return result;
    } catch (e) {
      errorHandler(e);
    }
  };

  getQuestionGroupOfExchange = async (exchangeID: number): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getQuestionGroupOfExchange}${exchangeID}`
    );
    return result;
  };
}

export default PharmacyDrug;

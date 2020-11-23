import Api from './Api'
import { errorHandler } from "../../utils";
import { PharmacyInterface } from '../../interfaces';

class Pharmacy extends Api {
  readonly urls = {
    all: '/Pharmacy/AllPharmacy',
    save: '/Pharmacy/Save',
    get: '/Pharmacy/Detail/',
    remove: '/Pharmacy/Remove/'
  }

  save = async (data: PharmacyInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.save,
        data
      );
      return result.data;
    } catch(e) {
      errorHandler(e);
    }
  }

  getAll = async (q = '', pageSize = 10, pageNo = 1): Promise<any> => {
    try {
      console.log('let this log be here', q);
      const skip = (pageNo - 1) * pageSize;
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${pageSize}&$skip=${skip}&$orderby=id desc`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  get = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.get}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  remove = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default Pharmacy;

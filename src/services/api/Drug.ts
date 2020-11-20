import Api from './Api'
import { errorHandler } from "../../utils";
import { DrugInterface } from '../../interfaces/DrugInterface'

class Drug extends Api {
  readonly urls = {
    all: '/Drugs/AllDrugs',
    save: '/Drugs/Save',
    get: '/Drugs/Detail/',
    remove: '/Drugs/Remove/'
  }

  saveDrug = async (data: DrugInterface): Promise<any> => {
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

  getAllDrugs = async (q = '', pageSize = 5, pageNo = 1): Promise<any> => {
    try {
      debugger;
      const skip = (pageNo - 1) * pageSize;
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${pageSize}&$skip=${skip}&$orderby=id desc`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  getDrug = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.get}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  removeDrug = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default Drug;

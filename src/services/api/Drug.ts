import Api from './Api'
import { errorHandler } from "../../utils";
import { DrugInterface } from '../../interfaces/DrugInterface'

class Drug extends Api {
  readonly apiUrls = {
    all: '/Drugs/AllDrugs',
    save: '/Drugs/Save',
    get: '/Drugs/Detail/',
    remove: '/Drugs/Remove/'
  }

  saveDrug = async (data: DrugInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.apiUrls.save,
        data
      );
      return result.data;
    } catch(e) {
      errorHandler(e);
    }
  }

  getAllDrugs = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.apiUrls.all);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  getDrug = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.apiUrls.get}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }

  removeDrug = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.apiUrls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default Drug;

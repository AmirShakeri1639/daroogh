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

  readonly pageSize = 15;

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

  getAllDrugs = async (q = '', pageNo = 1): Promise<any> => {
    try {
      console.log('q:', q)
      console.log('this.pagesuze:', this.pageSize);
      console.log('apageno:', pageNo);
      console.log('pNo - 1', pageNo - 1);
      const skip = (pageNo - 1) * this.pageSize;
      console.log('skiopppppppppp', skip);
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${this.pageSize}&$skip=${skip}`);
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

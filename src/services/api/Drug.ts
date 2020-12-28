import Api from './Api'
import { errorHandler } from "../../utils";
import { DrugInterface } from '../../interfaces'

class Drug extends Api {
  readonly urls = {
    all: '/Drugs/AllDrugs',
    save: '/Drugs/Save',
    get: '/Drugs/Detail/',
    remove: '/Drugs/Remove/',
    types: '/Drugs/AllDrugTypes'
  }

  save = async (data: DrugInterface): Promise<any> => {
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

  all = async (skip: number = 0, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`);
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

  types = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.types);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  searchDrug = async (name: string, searchType: string = '', count = 100): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchMedicalDrug?name=${name}&searchType=${searchType}&count=${count}`
    );
    return result.data;
  }
}

export default Drug;

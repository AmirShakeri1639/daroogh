import Api from './Api';
import { errorHandler } from '../../utils';
import { DrugInterface } from '../../interfaces';
import { SearchDrugInCategory, SearchDrugInMultiCategory } from '../../interfaces/search';
import { SearchTypeEnum } from '../../enum';
import { isUndefined, omit } from 'lodash';

class Drug extends Api {
  readonly urls = {
    all: '/Drugs/AllDrugs',
    save: '/Drugs/Save',
    get: '/Drugs/Detail/',
    remove: '/Drugs/Remove/',
    types: '/Drugs/AllDrugTypes',
  };

  save = async (data: DrugInterface): Promise<any> => {
    try {
      const result = await this.postFormData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  all = async (skip: number = 0, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  get = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.get}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  remove = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  types = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.types);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  };

  searchMedicalDrug = async (name: string, searchType: string = '', count = 100): Promise<any> => {
    const result = await this.getData(
      `/Search/SearchMedicalDrug?name=${name}&searchType=${searchType}&count=${count}`
    );
    return result.data;
  };

  seerchDrugInCategory = async (data: SearchDrugInCategory): Promise<any> => {
    let queryString = `/Search/SearchDrugInCategory?name=${data.name ?? ''}&searchType=${
      data.searchType ?? SearchTypeEnum.CONTAINS
    }&count=${data.count ?? 99}`;
    if (!isUndefined(data.categoryId)) {
      queryString += `&categoryId=${data.categoryId}`;
    }
    const result = await this.postData(queryString);

    return result.data;
  };

  searchDrugInMultipleCategory = async (data: SearchDrugInMultiCategory): Promise<any> => {
    const queryString = `/Search/SearchDrugInMultiCategory?name=${data.name ?? ''}&searchType=${
      data.searchType ?? SearchTypeEnum.CONTAINS
    }&count=${data.count ?? 99}&categoryId1=${data.categoryId}${
      !!data.secondCategory ? `&categoryId2=${data.secondCategory}` : ''
    }${!!data.thirdCategory ? `&categoryId3=${data.thirdCategory}` : ''}`;

    const result = await this.postData(queryString);
    return result.data;
  };
}

export default Drug;

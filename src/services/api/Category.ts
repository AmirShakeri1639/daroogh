import Api from './Api';
import { errorHandler } from "../../utils";
import { CategoryInterface } from '../../interfaces/CategoryInterface';

class Category extends Api {
  readonly urls = {
    all: '/Categories/AllCategories',
    get: '/Categories/Detail/',
    save: '/Categories/Save',
    remove: '/Categories/Remove/',
  }

  getAllCategories = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.all}?&top=${top}&$skip=${top * skip}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

  getCategory = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.get}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

  saveCategory = async (data: CategoryInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.save,
        data
      );
      return result.data;
    } catch(e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

  removeCategory = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e)
      return Promise.reject(e)
    }
  }
}

export default Category;

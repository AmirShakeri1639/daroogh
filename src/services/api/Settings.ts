import Api from './Api';
import { errorHandler } from '../../utils';
import { SettingsInterface } from '../../interfaces';

class Settings extends Api {
  readonly urls = {
    getPublic: '/Setting/ViewPublic',
    get: '/Setting/View',
    save: '/Setting/Save',
  }

  getPublic = async (token: any = null): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.getPublic, null, token);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

  get = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.get);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }

  save = async (data: SettingsInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e)
    }
  }
}

export default Settings;

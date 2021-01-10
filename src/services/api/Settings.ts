import Api from './Api';
import { errorHandler } from '../../utils';
import { SettingsInterface } from '../../interfaces';

class Settings extends Api {
  readonly urls = {
    get: '/Setting/ViewPublic',
    save: '/Setting/Save'
  }

  get = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.get);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  save = async (data: SettingsInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default Settings;

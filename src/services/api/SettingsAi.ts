import Api from './Api';
import { errorHandler } from '../../utils';
import { SettingsAiInterface } from '../../interfaces';

class SettingsAi extends Api {
  readonly urls = {
    get: 'Setting/GetAISettings',
    save: '/Setting/SaveAISettings',
  }


  get = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.get);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  save = async (data: SettingsAiInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default SettingsAi;

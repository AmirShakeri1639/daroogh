import { errorHandler } from '../../utils';
import Api from './Api';

class PharmacyDrug extends Api {
  readonly urls = {
    all: '/PharmacyDrug/AllPharmacyDrug',
    get: '',
    save: '',
    remove: '',
  };

  getAllPharmacyDrug = async (id: string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.all}`, `"${id}"`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };
}

export default PharmacyDrug;

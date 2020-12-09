import { AddDrugInterface } from '../../interfaces/ExchangeInterface';
import { errorHandler } from '../../utils';
import Api from './Api';

class PharmacyDrug extends Api {
  readonly urls = {
    all: '/PharmacyDrug/AllPharmacyDrug',
    get: '',
    addDrug1: '/Exchange/AddDrug1',
    remove: '',
  };

  getAllPharmacyDrug = async (id: string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.all}?pharmacyKey=${id}&full=false`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  addDrug1 = async (data: AddDrugInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.addDrug1,
        data
      );
      return result.data;
    } catch(e) {
      errorHandler(e);
    }
  }
}

export default PharmacyDrug;

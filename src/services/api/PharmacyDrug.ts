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

  getAllPharmacyDrug = async (id: string, skip: number = 0, top: number = 5): Promise<any> => {
    try {
      let query = `${this.urls.all}?pharmacyKey=${id}&full=false`;
      query += skip !== 0 ? `&$top=${top}&$skip=${skip * top}` : '';
      console.log('query: ', query);
      const result = await this.postJsonData(query);
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

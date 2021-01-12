import { PackCreation } from '../../model/pack';
import Api from './Api';

class Pack extends Api {
  getPharmacyPacks = async (): Promise<any> => {
    const result = await this.postData('/Pack/GetPharmacyPacks');
    return result.data;
  };

  getPackDetail = async (id: string | number): Promise<any> => {
    const result = await this.postData(`/Pack/Detail/${id}`);
    return result.data;
  };

  savePack = async (data: PackCreation): Promise<any> => {
    const result = await this.postJsonData('/Pack/SaveAll', data);
    return result.data;
  };

  removePack = async (id: string | number): Promise<any> => {
    const result = await this.postData(`/Pack/Remove?packID=${id}`);
    return result.data;
  };
}

export default Pack;

import Api from './Api';
import { errorHandler } from '../../utils';
import { CommisionInterface } from '../../interfaces';
import { isUndefined, omit } from 'lodash';

class Commision extends Api {
  readonly urls = {
    all: '/CommissionAmount/AllCommissionDiscountss',
    save: '/CommissionAmount/Save',

    remove: '/CommissionAmount/Remove/',
  };

  save = async (data: CommisionInterface): Promise<any> => {
    try {
      var $queryString =
        this.urls.save +
        `?commissionPercent=${data.commissionPercent}&id=${data.id}&remainedExpirationDays=${data.remainedExpirationDays}`;
      const result = await this.postJsonData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  all = async (skip: number = 0, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=remainedExpirationDays`
      );
      console.log(result);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };

  remove = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
      return Promise.reject(e);
    }
  };
}

export default Commision;

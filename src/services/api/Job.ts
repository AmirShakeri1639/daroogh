import Api from './Api';
import { errorHandler } from '../../utils';
import { JobInterface } from '../../interfaces';

class Job extends Api {
  readonly urls = {
    all: '/api/Job/CurrentPharmacyJobs',
    save: '/api/Job/Save',
    get: '/api/Job/Detail',
    cancel: '/api/Job/Cancel',
  };

  save = async (data: JobInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.save, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };


  all = async (skip: number, top: number = 10): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
      );
      console.log(result.data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  //   get = async (id: number | string): Promise<any> => {
  //     try {
  //       const result = await this.postJsonData(`${this.urls.get}${id}`);
  //       return result.data;
  //     } catch (e) {
  //       errorHandler(e)
  //     }
  //   }

    remove = async (id: number | string): Promise<any> => {
      // try {
      //   const result = await this.postJsonData(`${this.urls.remove}${id}`);
      //   return result.data;
      // } catch (e) {
      //   errorHandler(e)
      // }
    }

    confirm = async (id: number | string): Promise<any> => {
      // try {
      //   const result = await this.postJsonData(`${this.urls.remove}${id}`);
      //   return result.data;
      // } catch (e) {
      //   errorHandler(e)
      // }
    }

  //
}

export default Job;

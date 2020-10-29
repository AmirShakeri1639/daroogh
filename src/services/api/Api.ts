import axios, { AxiosInstance } from 'axios';
import { api } from '../../config/default.json';
import https from 'https';

class Api {
  protected axiosInstance: AxiosInstance = axios.create({
    baseURL: api.baseUrl,
    timeout: 0,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  // TODO: implement handlers for catch errors in axios config

  private authorizedUserRequest(): AxiosInstance {
    Object.assign(this.axiosInstance.defaults, {});
    return this.axiosInstance;
  }

  protected async postJsonData(url: string, data: any): Promise<any> {
    try {
      return await this.authorizedUserRequest().post(
        url,
        data
      );
    }
    catch (e) {
      console.log(e);
    }
  }

  protected async getData(url: string): Promise<any> {
    try {
      return await this.authorizedUserRequest().get(url);
    } catch (e) {

    }
  }
}

export default Api;

import axios, { AxiosInstance } from 'axios';
import { api } from '../../config/default.json';

class Api {
  protected axiosInstance: AxiosInstance = axios.create({
    baseURL: api.baseUrl,
    timeout: 0,
  });

  private authorizedUserRequest(): AxiosInstance {
    Object.assign(this.axiosInstance.defaults, {});
    return this.axiosInstance;
  }

  protected async postJsonData(url: string, data: any): Promise<any> {
    try {
      const response = await this.authorizedUserRequest().post(
        url,
        data
      );
      return response;
    }
    catch (e) {
      console.log(e);
    }
  }
}

export default Api;

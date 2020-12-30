import axios, { AxiosInstance } from 'axios';
import { api } from '../../config/default.json';
import { DefaultAxiosConfigInterface } from '../../interfaces';
import { errorHandler, errorSweetAlert } from '../../utils';

const axiosInstance = axios.create({
  baseURL: api.baseUrl,
  timeout: 0,
});

axiosInstance.interceptors.response.use(undefined, error => {
  console.log('erRRRRRRRR:', error)
  const { response } = error;
  if (!error.response) {
    console.error('Error in network');
    return Promise.reject(error);
  }

  if (error.response.data?.message) {
    console.error(error.response.data.message);
  }

  const { status } = response;
  if (status === 401) {
    (async (): Promise<any> => {
      await errorSweetAlert('خطای عدم دسترسی');
    })();
  } else if (status === 404) {
    (async (): Promise<any> => {
      await errorSweetAlert('پیدا نشد! - 404');
    })();
  } else if (status === 500) {
    (async (): Promise<any> => {
      await errorSweetAlert(
        error?.response?.data?.message == undefined
          ? 'خطایی رخ داده است.' : error?.response?.data?.message
      );
    })();
  }

  return Promise.reject(error);
});

class Api {
  protected axiosInstance: AxiosInstance = axiosInstance;

  private authorizedUserRequest(): AxiosInstance {
    const user = localStorage.getItem('user') || '{}';
    const { token } = JSON.parse(user);
    const defaultsAxiosHeaders: DefaultAxiosConfigInterface = {};

    if (token !== undefined) {
      defaultsAxiosHeaders.Authorization = `Bearer ${token}`;
    }
    Object.assign(this.axiosInstance.defaults, {
      headers: { ...defaultsAxiosHeaders, 'Content-Type': 'application/json' },
    });
    return this.axiosInstance;
  }

  protected async postJsonData(url: string, data: any = null): Promise<any> {
    // try {
    return await this.authorizedUserRequest().post(url, data);
    // } catch (e) {
    //   console.log('error in postjsondata:', e)
    //   throw new Error(e);
    // }
  }

  protected async postFormData(_url: string, _data: any): Promise<any> {
    const formData = new FormData();
    for (const key in _data) {
      const val = _data[key];
      if (val !== null) {
        formData.set(key, Array.isArray(val) ? `[${val}]` : val);
      }
    }
    try {
      return await this.authorizedUserRequest().post(_url, formData);
    } catch (e) {
      errorHandler(e);
    }
  }

  protected async getData(url: string): Promise<any> {
    try {
      return await this.authorizedUserRequest().get(url);
    } catch (e) {
      errorHandler(e);
    }
  }

  protected async postData(url: string): Promise<any> {
    try {
      return await this.authorizedUserRequest().post(url);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default Api;

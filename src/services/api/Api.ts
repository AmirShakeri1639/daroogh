import axios, { AxiosInstance } from 'axios';
import { api } from '../../config/default.json';
import { DefaultAxiosConfigInterface } from '../../interfaces';
import { errorHandler, errorSweetAlert } from '../../utils';

const axiosInstance = axios.create({
  baseURL: api.baseUrl,
  timeout: 0,
});

const CancelToken = axios.CancelToken;

axiosInstance.interceptors.response.use(undefined, (error) => {
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
      const message = error?.response?.data?.message;
      await errorSweetAlert(
        message === undefined
          ? 'شما مجوز دسترسی به این صفحه را ندارید!'
          : message
      );
    })();
  } else if (status === 404) {
    (async (): Promise<any> => {
      await errorSweetAlert('پیدا نشد! - 404');
    })();
  } else if (status === 500) {
    (async (): Promise<any> => {
      const message = error?.response?.data?.message;
      await errorSweetAlert(
        message === undefined ? 'خطایی رخ داده است.' : message
      );
    })();
  }

  return Promise.reject(
    error?.response?.data?.message == undefined
      ? error
      : error?.response?.data?.message
  );
});

class Api {
  protected axiosInstance: AxiosInstance = axiosInstance;
  protected axiosSource = CancelToken.source();

  private authorizedUserRequest(customToken: any = null): AxiosInstance {
    let token: any;
    if (customToken !== null) {
      token = customToken;
    } else {
      const user = localStorage.getItem('user') || '{}';
      token = JSON.parse(user).token;
    }
    const defaultsAxiosHeaders: DefaultAxiosConfigInterface = {};

    if (token !== undefined) {
      defaultsAxiosHeaders.Authorization = `Bearer ${token}`;
    }
    Object.assign(this.axiosInstance.defaults, {
      headers: { ...defaultsAxiosHeaders, 'Content-Type': 'application/json' },
    });
    return this.axiosInstance;
  }

  protected async postJsonData(url: string, data: any = null, token: any = null): Promise<any> {
    return await this.authorizedUserRequest(token).post(url, data, {
      cancelToken: this.axiosSource.token,
    });
  }

  protected async postFormData(_url: string, _data: any): Promise<any> {
    const formData = new FormData();
    for (const key in _data) {
      const val = _data[key];
      if (val !== null) {
        formData.append(key, Array.isArray(val) ? `[${val}]` : val);
      }
    }
    try {
      return await this.authorizedUserRequest().post(_url, formData, {
        cancelToken: this.axiosSource.token,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  protected async getData(url: string, options: any = {}): Promise<any> {
    try {
      return await this.authorizedUserRequest().get(url, {
        cancelToken: this.axiosSource.token,
        ...options,
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  protected async postData(url: string): Promise<any> {
    try {
      return await this.authorizedUserRequest().post(url, null, {
        cancelToken: this.axiosSource.token,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default Api;

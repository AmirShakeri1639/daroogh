import axios, { AxiosInstance } from 'axios';

class Api {
  protected axiosInstance: AxiosInstance = axios.create({
    baseURL: '',
    timeout: 0,
  });
}

export default Api;
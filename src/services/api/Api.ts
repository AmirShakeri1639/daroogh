import axios, { AxiosInstance } from 'axios'
import { DefaultAxiosConfigInterface } from '../../interfaces'
import { errorHandler, tError } from 'utils'
import i18n from 'i18n'
import { ToastDurationEnum } from 'utils/toast'
import { getBaseUrl } from 'config'

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 0,
})

const CancelToken = axios.CancelToken

export const ErrorToastId = {
  NETWORK: 'networkErrorToastId',
  ERR_400: 'error400',
  ERR_401: 'error401',
  ERR_404: 'error404',
  ERR_500: 'error500',
}

class Api {
  protected axiosInstance: AxiosInstance = axiosInstance
  protected axiosSource = CancelToken.source()

  private authorizedUserRequest(customToken: any = null): AxiosInstance {
    let token: any
    if (customToken !== null) {
      token = customToken
    } else {
      const user = localStorage.getItem('user') || '{}'
      token = JSON.parse(user).token
    }
    const defaultsAxiosHeaders: DefaultAxiosConfigInterface = {}

    if (token !== undefined) {
      defaultsAxiosHeaders.Authorization = `Bearer ${token}`
    }
    Object.assign(this.axiosInstance.defaults, {
      headers: { ...defaultsAxiosHeaders, 'Content-Type': 'application/json' },
    })
    return this.axiosInstance
  }

  protected async postJsonData(url: string, data: any = null, token: any = null): Promise<any> {
    return await this.authorizedUserRequest(token).post(url, data, {
      cancelToken: this.axiosSource.token,
    })
  }

  protected async postFormData(_url: string, _data: any): Promise<any> {
    const formData = new FormData()
    for (const key in _data) {
      const val = _data[key]
      if (val !== null) {
        formData.append(key, Array.isArray(val) ? `[${val}]` : val)
      }
    }
    try {
      return await this.authorizedUserRequest().post(_url, formData, {
        cancelToken: this.axiosSource.token,
      })
    } catch (e) {
      errorHandler(e)
    }
  }

  protected async getData(url: string, options: any = {}): Promise<any> {
    try {
      return await this.authorizedUserRequest().get(url, {
        cancelToken: this.axiosSource.token,
        ...options,
      })
    } catch (e) {
      errorHandler(e)
    }
  }

  protected async postData(url: string): Promise<any> {
    try {
      return await this.authorizedUserRequest().post(url, null, {
        cancelToken: this.axiosSource.token,
      })
    } catch (e) {
      throw new Error(e)
    }
  }
}

// THIS IS TEMPORARILY
const logError = async (error: any): Promise<any> => {
  const result = await fetch(
    `http://errdaroog.rahmanism.ir/errorlog_d.py?daroog=daroog_&err=${error}`
  )
  console.log('CMSMCMSMC:', result)
}

axiosInstance.interceptors.response.use(undefined, (error) => {
  const { response } = error

  if (!error.response) {
    tError(i18n.t('error.network'), {
      autoClose: ToastDurationEnum.VeryLong,
      position: 'top-center',
      toastId: ErrorToastId.NETWORK
    })
    logError(error)
    console.error('Error in network')
    return Promise.reject(error)
  }

  if (error.response.data?.message) {
    console.error(error.response.data.message)
  }

  const { status } = response
  if (status === 400) {
    ; (async (): Promise<any> => {
      const message = error?.response?.data?.message
      tError(
        message === undefined
          ? 'مشکلی در ارسال درخواست وجود دارد،' +
          ' در صورت تکرار لطفا با پشتیبانی تماس بگیرید!'
          : message,
        { toastId: ErrorToastId.ERR_400 }
      )
    })()
  } else if (status === 401) {
    ; (async (): Promise<any> => {
      const message = error?.response?.data?.message
      tError(
        message === undefined
          ? 'شما مجوز دسترسی به این صفحه را ندارید!'
          : message,
        { toastId: ErrorToastId.ERR_401 }
      )
    })()
  } else if (status === 404) {
    ; (async (): Promise<any> => {
      tError(
        'پیدا نشد! - 404', 
        { toastId: ErrorToastId.ERR_404 }
      )
    })()
  } else if (status === 500) {
    ; (async (): Promise<any> => {
      const message = error?.response?.data?.message
      tError(
        message === undefined ? 'خطایی رخ داده است.' : message,
        { toastId: ErrorToastId.ERR_500 }
      )
    })()
  }

  return Promise.reject(
    error?.response?.data?.message == undefined ? error : error?.response?.data?.message
  )
})

export default Api

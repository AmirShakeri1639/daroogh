import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const tSimple = (message: any = ''): any => toast(message)

export const tInfo = (message = ''): any => toast.info(message)

export const tSuccess = (message = ''): any => toast.success(message)

export const tWarn = (message = ''): any => toast.warn(message)

export const tError = (message = ''): any => toast.error(message)

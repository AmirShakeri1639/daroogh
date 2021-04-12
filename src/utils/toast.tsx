import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const tSimple = (message = '') => toast(message)

export const tInfo = (message = '') => toast.info(message)

export const tSuccess = (message = '') => toast.success(message)

export const tWarn = (message = '') => toast.warn(message)

export const tError = (message = '') => toast.error(message)

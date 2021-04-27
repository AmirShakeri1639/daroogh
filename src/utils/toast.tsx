import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faInfoCircle,
  faTimesCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export enum ToastDurationEnum {
  Short = 2000,
  Medium = 5000,
  Long = 12000,
  VeryLong = 20000
}

export const  ToastVibratePattern = {
  INFO: [300],
  SIMPLE: [200,200,200],
  SUCCESS: [500],
  WARN: [300,250,500],
  ERROR: [350,200,350,200,350],
}

export const TOAST_MESSAGE_MAX_LENGTH = 60

const getAutoClose = (message: string): number => {
  return (
    message.length > TOAST_MESSAGE_MAX_LENGTH
      ? ToastDurationEnum.Long
      : ToastDurationEnum.Medium
  )
}

export const tSimple = (message = '', options = {}) => {
  window.navigator.vibrate(ToastVibratePattern.SIMPLE)
  return toast(message, options)
}

export const tInfo = (message = '', options = {}) => {
  window.navigator.vibrate(ToastVibratePattern.INFO)
  return toast.info(
    <>
      <FontAwesomeIcon icon={ faInfoCircle } size="lg" />
      <span className="toast-message">
        { message }
      </span>
    </>,
    {
      autoClose: getAutoClose(message),
      ...options
    }
  )
}

export const tSuccess = (message = '', options = {}) =>  {
  window.navigator.vibrate(ToastVibratePattern.SUCCESS)
  return toast.success(
    <>
      <FontAwesomeIcon icon={ faCheckCircle } size="lg" />
      <span className="toast-message">
        { message }
      </span>
    </>,
    {
      autoClose: getAutoClose(message),
      ...options
    }
  )
}

export const tWarn = (message = '', options = {}) => {
  window.navigator.vibrate(ToastVibratePattern.WARN)
  return toast.warn(
    <>
      <FontAwesomeIcon icon={ faExclamationCircle } size="lg" />
      <span className="toast-message">
        { message }
      </span>
    </>,
    {
      autoClose: getAutoClose(message),
      ...options
    }
  )
}

export const tError = (message = '', options = {}) => {
  window.navigator.vibrate(ToastVibratePattern.ERROR)
  return toast.error(
    <>
      <FontAwesomeIcon icon={ faTimesCircle } size="lg" />
      <span className="toast-message">
        { message }
      </span>
    </>,
    {
      autoClose: getAutoClose(message),
      ...options
    }
  )
}

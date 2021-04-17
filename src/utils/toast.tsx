import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faInfoCircle,
  faTimesCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export const tSimple = (message = '', options = {}) => toast(message, options)

export const tInfo = (message = '', options = {}) => toast.info(
  <>
    <FontAwesomeIcon icon={ faInfoCircle } size="lg" />
    <span className="toast-message">
      { message }
    </span>
  </>,
  options
)

export const tSuccess = (message = '', options = {}) => toast.success(
  <>
    <FontAwesomeIcon icon={ faCheckCircle } size="lg" />
    <span className="toast-message">
      { message }
    </span>
  </>,
  options
)

export const tWarn = (message = '', options = {}) => toast.warn(
  <>
    <FontAwesomeIcon icon={ faExclamationCircle } size="lg" />
    <span className="toast-message">
      { message }
    </span>
  </>,
  options
)

export const tError = (message = '', options = {}) => toast.error(
  <>
    <FontAwesomeIcon icon={ faTimesCircle } size="lg" />
    <span className="toast-message">
      { message }
    </span>
  </>,
  options
)

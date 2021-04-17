import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export const tSimple = (message = '') => toast(message)

export const tInfo = (message = '') => toast.info(message)

export const tSuccess = (message = '') => toast.success(
  <>
    <FontAwesomeIcon icon={ faCheckCircle } size="lg" />
    <span className="toast-success-message">
      { message }
    </span>
  </>
)

export const tWarn = (message = '') => toast.warn(message)

export const tError = (message = '') => toast.error(message)

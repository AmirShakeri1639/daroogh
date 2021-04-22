import Swal from 'sweetalert2';
import withReactContent, { ReactElementOr } from 'sweetalert2-react-content';
import i18n from 'i18next'

interface SweetAlertProps {
  title?: any;
  text?: any;
  html?: ReactElementOr<'html'>;
  type?: 'info' | 'warning' | 'success' | 'error';
  toast?: boolean;
  position?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'center'
    | 'center-start'
    | 'center-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end';
  timer?: number;
  timerProgressBar?: boolean;
  showCancelButton?: boolean;
  focusConfirm?: boolean;
  focusCancel?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  showConfirmButton?: boolean;
}

const MySwal = withReactContent(Swal);

const sweetAlert = async (params: SweetAlertProps): Promise<any> => {
  const {
    title,
    text,
    type,
    html,
    toast,
    position,
    timer,
    timerProgressBar,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    cancelButtonColor,
    confirmButtonColor,
    focusCancel,
    focusConfirm,
    showConfirmButton,
  } = params;

  const sendingParams = {
    title,
    icon: type,
    toast,
    position,
    timer,
    timerProgressBar,
    confirmButtonText: confirmButtonText ?? i18n.t('alert.confirm'),
    cancelButtonText: cancelButtonText ?? i18n.t('alert.cancel'),
    showCloseButton: false,
    showCancelButton: showCancelButton,
    cancelButtonColor,
    confirmButtonColor,
    focusCancel: !!focusCancel,
    focusConfirm: !!!focusConfirm,
    showConfirmButton: showConfirmButton ?? true,
  }

  const res =
    html
      ? await MySwal.fire({
        ...sendingParams,
        html
      })
      : await MySwal.fire({
        ...sendingParams,
        text,
      });

  return res.isConfirmed;
};

export const infoSweetAlert = async (text: any): Promise<any> =>
  await sweetAlert({
    type: 'info',
    text,
  });

export const warningSweetAlert = async (text: any): Promise<any> =>
  await sweetAlert({
    type: 'warning',
    text,
  });

export const successSweetAlert = async (text: any): Promise<any> =>
  await sweetAlert({
    type: 'success',
    text,
  });

export const errorSweetAlert = async (text: any): Promise<any> =>
  await sweetAlert({
    type: 'error',
    text,
  });

export const confirmSweetAlert = async (text: any, params: any = null): Promise<any> => {
  const res = await
    sweetAlert({
      title: i18n.t('alert.attention'),
      text: text,
      type: 'warning',
      showCancelButton: true,
      ...params
    })
  return res
}

export default sweetAlert;

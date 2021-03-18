import Swal from 'sweetalert2';
import withReactContent, { ReactElementOr } from 'sweetalert2-react-content';

interface SweetAlertProps {
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

  const res =
  text ?
  await MySwal.fire({
    text,
    icon: type,
    toast,
    position,
    timer,
    timerProgressBar,
    confirmButtonText: confirmButtonText ?? 'باشه',
    cancelButtonText: cancelButtonText ?? 'انصراف',
    showCloseButton: false,
    showCancelButton: showCancelButton,
    cancelButtonColor: cancelButtonColor ?? '#aaa',
    confirmButtonColor: confirmButtonColor ?? '#3085d6',
    focusCancel: !!focusCancel,
    focusConfirm: !!!focusConfirm,
    showConfirmButton: showConfirmButton ?? true,
  }) :
  await MySwal.fire({
    html,
    icon: type,
    toast,
    position,
    timer,
    timerProgressBar,
    confirmButtonText: confirmButtonText ?? 'باشه',
    cancelButtonText: cancelButtonText ?? 'انصراف',
    showCloseButton: false,
    showCancelButton: showCancelButton,
    cancelButtonColor: cancelButtonColor ?? '#aaa',
    confirmButtonColor: confirmButtonColor ?? '#3085d6',
    focusCancel: !!focusCancel,
    focusConfirm: !!!focusConfirm,
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

export default sweetAlert;

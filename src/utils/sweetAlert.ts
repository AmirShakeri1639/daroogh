import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface SweetAlertProps {
  text: any;
  type?: 'info' | 'warning' | 'success' | 'error';
  showCancelButton?: boolean;
  focusConfirm?: boolean;
  focusCancel?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
}

const MySwal = withReactContent(Swal);

const SweetAlert = async (props: SweetAlertProps): Promise<any> => {
  const {
    text,
    type,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    cancelButtonColor,
    confirmButtonColor,
    focusCancel,
    focusConfirm,
  } = props;

  const res = await MySwal.fire({
    text,
    icon: type,
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

SweetAlert.defaultProps = {
  type: 'info',
};

export const infoSweetAlert = async (text: any): Promise<any> =>
  await SweetAlert({
    type: 'info',
    text,
  });

export const warningSweetAlert = async (text: any): Promise<any> =>
  await SweetAlert({
    type: 'warning',
    text,
  });

export const successSweetAlert = async (text: any): Promise<any> =>
  await SweetAlert({
    type: 'success',
    text,
  });

export const errorSweetAlert = async (text: any): Promise<any> =>
  await SweetAlert({
    type: 'error',
    text,
  });

export default SweetAlert;

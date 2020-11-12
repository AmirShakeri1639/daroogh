import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface SweetAlertProps {
  text: any;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const MySwal = withReactContent(Swal);

const SweetAlert = async (props: SweetAlertProps): Promise<any> => {
  const { text, type } = props;

  await MySwal.fire({
    text,
    icon: type,
    confirmButtonText: 'باشه',
  });
};

SweetAlert.defaultProps = {
  type: 'info',
};

export const infoSweetAlert = async (text: any): Promise<any> => await SweetAlert({
  type: 'info',
  text,
});

export const warningSweetAlert = async (text: any): Promise<any> => await SweetAlert({
  type: 'warning',
  text,
});

export const successSweetAlert = async (text: any): Promise<any> => await SweetAlert({
  type: 'success',
  text,
});

export const errorSweetAlert = async (text: any): Promise<any> => await SweetAlert({
  type: 'error',
  text,
});

export default SweetAlert;

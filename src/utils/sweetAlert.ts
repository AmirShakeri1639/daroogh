import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface SweetAlertProps {
  text: string;
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

export default SweetAlert;

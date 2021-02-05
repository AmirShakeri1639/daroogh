import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import { Prescription } from '../../../../services/api';
import CircleLoading from '../../../public/loading/CircleLoading';
import CloseIcon from '@material-ui/icons/Close';
import {
  errorHandler,
  isNullOrEmpty,
  successSweetAlert,
  warningSweetAlert,
} from '../../../../utils';
import { ActionInterface, PrescriptionInterface, PrescriptionResponseInterface } from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faUserCog,
  faFileInvoiceDollar,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';
import { PrescriptionEnum, PrescriptionResponseStateEnum } from '../../../../enum';
import { getJalaliDate } from '../../../../utils/jalali';
import FormContainer from '../../../public/form-container/FormContainer';
import routes from '../../../../routes';

const initialStatePrescriptionResponse: PrescriptionResponseInterface = {
  prescriptionID: 0,
  isAccept: false,
  pharmacyComment: '',
  state: PrescriptionResponseStateEnum.NotAccept,
}

function reducer(state = initialStatePrescriptionResponse, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'prescriptionID':
      return {
        ...state,
        prescriptionID: value,
      };
    case 'isAccept':
      return {
        ...state,
        isAccept: value,
      };
    case 'pharmacyComment':
      return {
        ...state,
        pharmacyComment: value,
      };
    case 'state':
      return {
        ...state,
        state: value,
      };
    case 'reset':
      return initialStatePrescriptionResponse;
    default:
      console.error('Action type note defined');
      break;
  }
}

const PrescriptionList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialStatePrescriptionResponse);
  const [isOpenEditModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const {
    container,
    root,
  } = useClasses();
  const queryCache = useQueryCache();
  const { getList, save, urls } = new Prescription();

  const [_save, { isLoading }] = useMutation(save, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(PrescriptionEnum.GET_LIST);
      await successSweetAlert(t('alert.successfulSave'));
      ref.current?.onQueryChange();
      dispatch({ type: 'reset' });
    },
  });

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'sendDate',
        title: t('prescription.sendDate'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>{getJalaliDate(row.sendDate)}</>
          );
        },
      },
      {
        field: 'contryDivisionName',
        title: t('countryDivision.city'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'comment',
        title: t('general.comment'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'expireDate',
        title: t('general.expireDate'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>{ !isNullOrEmpty(row.expireDate) && getJalaliDate(row.expireDate)}</>
          );
        },
      },
      {
        field: 'cancelDate',
        title: t('prescription.cancelDate'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>{ !isNullOrEmpty(row.cancelDate) && getJalaliDate(row.cancelDate)}</>
          );
        },
      },
    ]
  };

  const saveHandler = (item: PrescriptionInterface): void => {
    toggleIsOpenSaveModalForm();
    const {
      id, prescriptionResponse
    } = item;
    const {
      pharmacyComment,
    } = prescriptionResponse;
    const isAccept = prescriptionResponse.state == PrescriptionResponseStateEnum.Accept;

    dispatch({ type: 'prescriptionID', value: id });
    dispatch({ type: 'isAccept', value: isAccept });
    dispatch({ type: 'pharmacyComment', value: pharmacyComment });
    dispatch({ type: 'state', value: prescriptionResponse.state });
  };

  const submitSave = async (el: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el.preventDefault();

    const {
      prescriptionID,
      isAccept,
      pharmacyComment
    } = state;

    try {
      await _save({
        prescriptionID,
        isAccept,
        pharmacyComment,
        state
      });
      toggleIsOpenSaveModalForm();
      dispatch({ type: 'reset' });
      ref.current?.onQueryChange();
    } catch (e) {
      errorHandler(e);
    }
  }

  // TODO: edit Modal form
  const editModal= (): void => {

  }

  return (
    <FormContainer title={t('prescription.peoplePrescriptions')}>
      <DataTable
        tableRef={ref}
        columns={tableColumns()}
        editAction={(e: any, row: any): void => saveHandler(row)}
        queryKey={PrescriptionEnum.GET_LIST}
        queryCallback={getList}
        urlAddress={urls.getList}
        initLoad={false}
      />
      { isLoading && <CircleLoading /> }
      {isOpenEditModal && editModal()}
   </FormContainer>
  )
}

export default PrescriptionList;

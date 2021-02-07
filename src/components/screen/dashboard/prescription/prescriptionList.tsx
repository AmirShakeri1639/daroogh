import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import { Prescription } from '../../../../services/api';
import CircleLoading from '../../../public/loading/CircleLoading';
import {
  errorHandler,
  isNullOrEmpty,
  JwtData,
  successSweetAlert,
} from '../../../../utils';
import {
  ActionInterface,
  PrescriptionInterface,
  PrescriptionResponseInterface
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
} from '@fortawesome/free-regular-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';
import { ColorEnum, PrescriptionEnum, PrescriptionResponseStateEnum } from '../../../../enum';
import { getJalaliDate } from '../../../../utils/jalali';
import FormContainer from '../../../public/form-container/FormContainer';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, Grid,
  Switch, TextField, useMediaQuery, useTheme
} from '@material-ui/core';
import { PictureDialog } from '../../../public';

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
  const [isOpenPicture, setIsOpenPicture] = useState(false);
  const [fileKeyToShow, setFileKeyToShow] = useState('');
  const {
    container,
    root,
  } = useClasses();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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

  const [pharmacyName, setPharmacyName] = useState('');
  React.useEffect(() => {
    const jwtData = new JwtData();
    setPharmacyName(jwtData.userData.pharmacyName);
  }, []);

  const pictureDialog = (fileKey: string): JSX.Element => {
    return (
      <PictureDialog
        fileKey={ fileKey }
        title={ t('prescription.peoplePrescription') }
        onClose={ (): void => setIsOpenPicture(false) }
      />
    )
  }

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'sendDate',
        title: t('prescription.sendDate'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>{ getJalaliDate(row.sendDate) }</>
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
            <>{ !isNullOrEmpty(row.expireDate) && getJalaliDate(row.expireDate) }</>
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
            <>{ !isNullOrEmpty(row.cancelDate) && getJalaliDate(row.cancelDate) }</>
          );
        },
      },
      {
        field: 'fileKey',
        title: t('general.picture'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.fileKey) &&
                <Button onClick={ (): any => {
                  setFileKeyToShow(row.fileKey);
                  setIsOpenPicture(true);
                } }>
                  <FontAwesomeIcon icon={ faImage } />
                </Button>
              }
            </>
          )
        }
      },
      {
        field: 'responseDate',
        title: t('prescription.responseDate'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.prescriptionResponse) &&
                !isNullOrEmpty(row.prescriptionResponse[0].responseDate) &&
                getJalaliDate(row.prescriptionResponse[0].responseDate)
              }
            </>
          );
        },
      },
      {
        field: 'prescriptionResponse.state',
        title: t('general.state'),
        type: 'string',
        render: (row: any): any => {
          const responses = row.prescriptionResponse.filter((i: any) => {
            return i.pharmacy.name === pharmacyName
          });
          const thisState = PrescriptionResponseStateEnum[
            responses.length > 0
              ? responses[0].state
              : 1
          ];
          return (
            <span style={ {
              color:
                thisState == PrescriptionResponseStateEnum[PrescriptionResponseStateEnum.Accept]
                  ? ColorEnum.Green : ColorEnum.Gray
            } }>
              { !isNullOrEmpty(row.prescriptionResponse) &&
                t(`PrescriptionResponseStateEnum.${thisState}`)
              }
            </span>
          )
        }
      }
    ]
  };

  const saveHandler = (item: PrescriptionInterface): void => {
    toggleIsOpenSaveModalForm();
    const {
      id, prescriptionResponse
    } = item;
    let pharmacyComment: string = '';
    let accept: boolean = false;
    let thisState: number = 1;
    if (prescriptionResponse.length > 0) {
      const responses = prescriptionResponse.filter((i: any) => {
        return i.pharmacy.name === pharmacyName
      });
      if (responses.length > 0) {
        pharmacyComment = responses[0].pharmacyComment;
        accept = responses[0].state == PrescriptionResponseStateEnum.Accept;
        thisState = responses[0].state
      }
    }
    dispatch({ type: 'prescriptionID', value: id });
    dispatch({ type: 'isAccept', value: accept });
    dispatch({ type: 'pharmacyComment', value: pharmacyComment });
    dispatch({ type: 'state', value: thisState });
  };

  const submitSave = async (el?: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el?.preventDefault();

    const {
      prescriptionID,
      isAccept,
      pharmacyComment
    } = state;

    try {
      toggleIsOpenSaveModalForm();
      await _save({
        prescriptionID,
        isAccept,
        pharmacyComment,
        state
      });
      dispatch({ type: 'reset' });
      ref.current?.onQueryChange();
    } catch (e) {
      errorHandler(e);
    }
  }

  const editModal = (): JSX.Element => {
    return (
      <Dialog open={ isOpenEditModal } fullScreen={ fullScreen }>
        <DialogTitle>{ t('prescription.response') }</DialogTitle>
        <Divider />
        <DialogContent className={ root }>
          <Grid container>
            <Grid item xs={ 12 }>
              <FormControlLabel
                control={
                  <Switch
                    checked={ state.isAccept }
                    onChange={ (e): void => {
                      dispatch({ type: 'isAccept', value: e.target.checked });
                      dispatch({
                        type: 'state',
                        value: e.target.checked
                          ? PrescriptionResponseStateEnum.Accept
                          : PrescriptionResponseStateEnum.NotAccept
                      });
                    } }
                  />
                }
                label={ t('general.accept') }
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                variant="outlined"
                value={ state.pharmacyComment }
                label={ t('general.comment') }
                required
                onChange={ (e): void =>
                  dispatch({ type: 'pharmacyComment', value: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={ (): void => {
              submitSave();
              ref.current?.onQueryChange();
            } }
          >
            { t('general.save') }
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={ (): void => {
              setIsOpenSaveModal(false);
            } }
          >
            { t('general.cancel') }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <FormContainer title={ t('prescription.peoplePrescriptions') }>
      <DataTable
        tableRef={ ref }
        columns={ tableColumns() }
        editAction={ (e: any, row: any): void => saveHandler(row) }
        queryKey={ PrescriptionEnum.GET_LIST }
        queryCallback={ getList }
        urlAddress={ urls.getList }
        initLoad={ false }
      />
      { isLoading && <CircleLoading /> }
      { isOpenEditModal && editModal() }
      { isOpenPicture && pictureDialog(fileKeyToShow) }
    </FormContainer>
  )
}

export default PrescriptionList;

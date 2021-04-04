import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { PharmacyDrugEnum } from '../../../../../enum';
import {
  Favorite,
  Drug as DrugApi,
  Search,
  CountryDivision,
  Prescription as presApi,
} from '../../../../../services/api';
import { MaterialContainer, Modal } from '../../../../public';
import { errorHandler, successSweetAlert } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardContainer from './CardContainer';
import { PrescriptionSendInterface } from '../../../../../interfaces/PrescriptionInterface';
import { ActionInterface } from '../../../../../interfaces';
import { useLocation } from 'react-router';

const { getPrescriptionOfUser, send, cancel } = new presApi();

const durations = [
  {
    value: 1,
    label: '3 روز',
  },
  {
    value: 2,
    label: '5 روز',
  },
  {
    value: 3,
    label: '7 روز',
  },
];

const { getAllCities2, getAllProvinces2 } = new CountryDivision();
const useStyle = makeStyles((theme) =>
  createStyles({
    input: {
      display: 'none',
    },
    addButton: {
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 2),
      width: 500,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
  })
);

const initialState: PrescriptionSendInterface = {
  duration: 1,
  comment: '',
  contryDivisionCode: '*',
  file: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'duration':
      return {
        ...state,
        duration: value,
      };
    case 'comment':
      return {
        ...state,
        comment: value,
      };
    case 'contryDivisionCode':
      return {
        ...state,
        contryDivisionCode: value,
      };
    case 'file':
      return {
        ...state,
        file: value,
      };

    default:
      console.error('Action type not defined');
  }
}

const Prescription: React.FC = (props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const { t } = useTranslation();

  const { addButton, buttonContainer, input, fab } = useStyle();

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const { isLoading, data, isFetched, refetch } = useQuery(
    'getPrescriptionOfUser',
    getPrescriptionOfUser
  );

  useEffect(() => {
    (async (): Promise<any> => {
      try {
        const res = await getAllProvinces2();
        setProvinceList([]);
        res.items.forEach((i: any) => {
          setProvinceList((v: any) => [...v, { name: i.name, code: i.code }]);
        });
      } catch (e) {
        errorHandler(e);
      }
    })();
  }, []);

  const [_send, { isLoading: isLoadingSaveData }] = useMutation(send, {
    onSuccess: async (data) => {
      const { message } = data;
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      await successSweetAlert(message);
    },
  });
  const [_cancel, { isLoading: isLoadingCancelData }] = useMutation(cancel, {
    onSuccess: async (data) => {
      const { message } = data;
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      await successSweetAlert(message);
    },
  });

  const formHandler = async (): Promise<any> => {
    try {
      await _send(state).then((rec) => refetch());
    } catch (e) {
      errorHandler(e);
    }
  };
  const removeHandler = async (id: any): Promise<any> => {
    try {
      await _cancel(id).then((rec) => refetch());
    } catch (e) {
      errorHandler(e);
    }
  };

  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && data !== undefined && isFetched) {
      return data.items.map((item: any) => {
        if (item !== null) {
          return (
            <Grid key={item.id} item xs={12} sm={12} md={4} xl={4}>
              <CardContainer data={item} formHandler={removeHandler} />
            </Grid>
          );
        }

        return null;
      });
    }

    return null;
  };

  const changeprovince = (e: any): void => {
    const val = e.target.value as string;
    dispatch({ type: 'contryDivisionCode', value: e.target.value });
    setSelectedProvince(val);
    (async (): Promise<any> => {
      try {
        const res = await getAllCities2(val);
        setCityList([]);
        res.items.forEach((i: any) => {
          setCityList((v: any) => [...v, { name: i.name, code: i.code }]);
        });
      } catch (e) {
        errorHandler(e);
      }
    })();
  };
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <MaterialContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
            {t('alerts.PrescriptionAlert')}
        </Grid>
        <Grid item xs={12}>
          <h3>{t('peopleSection.listPrescription')}</h3>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <Paper className={addButton} onClick={toggleIsOpenModal}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('peopleSection.addPrescription')}</span>
            </Paper>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>

        {contentGenerator()}
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={isOpenModal}
        onClose={toggleIsOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'نسخه'}</DialogTitle>
        <DialogContent style={{ backgroundColor: '#FAFAFA', width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                id="outlined-full-width"
                label="اسامی داروها یا توضیحات"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.comment}
                onChange={(e): void =>
                  dispatch({ type: 'comment', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-select-currency-native"
                select
                fullWidth
                style={{ margin: 8 }}
                label="مدت اعتبار"
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.duration}
                onChange={(e): void =>
                  dispatch({ type: 'duration', value: e.target.value })
                }
              >
                {durations.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-select-currency-native"
                select
                fullWidth
                style={{ margin: 8 }}
                label="استان"
                onChange={changeprovince}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                value={state.contryDivisionCode}
              >
                {provinceList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-select-currency-native"
                select
                fullWidth
                style={{ margin: 8 }}
                label="شهر"
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
              >
                {cityList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid alignContent="center" item xs={12}>
              <input
                accept="image/*"
                className={input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e): void => {
                  if (e.target.files)
                    dispatch({ type: 'file', value: e.target.files[0] });
                }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  تصویر نسخه
                </Button>
              </label>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} className={buttonContainer}>
            <Button color="default" onClick={toggleIsOpenModal}>
              {t('general.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={formHandler}
              disabled={isLoadingSaveData}
            >
              {isLoadingSaveData ? t('general.pleaseWait') : t('general.add')}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </MaterialContainer>
  );
};

export default Prescription;

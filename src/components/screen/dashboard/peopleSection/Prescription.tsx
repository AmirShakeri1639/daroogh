import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { PharmacyDrugEnum } from '../../../../enum';
import {
  Favorite,
  Drug as DrugApi,
  Search,
  CountryDivision,
  Prescription as presApi,
} from '../../../../services/api';
import { MaterialContainer, Modal } from '../../../public';
import { errorHandler, successSweetAlert } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardContainer from './CardContainer';
import { PrescriptionSendInterface } from '../../../../interfaces/PrescriptionInterface';
import { ActionInterface } from '../../../../interfaces';

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
      display: 'flex',

      height: 167,
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #cecece',
      borderRadius: 10,
      flexDirection: 'column',
      '& button': {
        height: 'inherit',
        width: '100%',
        display: 'flex',
        color: '#707070',
        background: 'transparent',
        '& span:nth-child(2)': {
          marginLeft: 8,
        },
      },
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 500,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
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
const Prescription: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const { t } = useTranslation();

  const { addButton, modalContainer, buttonContainer, input } = useStyle();

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
            <Grid key={item.id} item xs={12} sm={6} md={4} xl={3}>
              <CardContainer data={item} formHandler={removeHandler} />
            </Grid>
          );
        }

        return null;
      });
    }

    return null;
  };

  const changeprovince = (e: any) => {
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

  return (
    <MaterialContainer>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h3>{t('peopleSection.listPrescription')}</h3>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3} className={addButton}>
          <Button onClick={toggleIsOpenModal} variant="text">
            <FontAwesomeIcon icon={faPlus} />
            <span>{t('peopleSection.addPrescription')}</span>
          </Button>
        </Grid>

        {contentGenerator()}
      </Grid>

      <Modal open={isOpenModal} toggle={toggleIsOpenModal}>
        <div className={modalContainer}>
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
          </Grid>
        </div>
      </Modal>
    </MaterialContainer>
  );
};

export default Prescription;

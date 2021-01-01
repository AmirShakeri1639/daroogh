import React, { useState, useReducer, useEffect } from 'react';
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  MaterialContainer,
  Modal,
  DatePicker,
  BackDrop,
} from '../../../public';
import MaterialSearchBar from '../../../public/material-searchbar/MaterialSearchbar';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AllPharmacyDrug } from '../../../../enum/query';
import { Drug, PharmacyDrug, Comission } from '../../../../services/api';
import CardContainer from './CardContainer';
import { debounce, has } from 'lodash';
import {
  ActionInterface,
  AllPharmacyDrugInterface,
  DrugInterface,
} from '../../../../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../../../public/input/Input';
import FieldSetLegend from '../../../public/fieldset-legend/FieldSetLegend';
import Button from '../../../public/button/Button';
import { PharmacyDrugSupplyList } from '../../../../model/pharmacyDrug';
import { useEffectOnce } from '../../../../hooks';
import { Convertor, errorHandler, successSweetAlert } from '../../../../utils';
import { utils } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import { jalali } from '../../../../utils';
import { Autocomplete } from '@material-ui/lab';

const { convertISOTime } = Convertor;

function reducer(state: PharmacyDrugSupplyList, action: ActionInterface): any {
  const { value, type } = action;
  switch (type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'drugID':
      return {
        ...state,
        drugID: value,
      };
    case 'expireDate':
      return {
        ...state,
        expireDate: value,
      };
    case 'offer1':
      return {
        ...state,
        offer1: value,
      };
    case 'offer2':
      return {
        ...state,
        offer2: value,
      };
    case 'amount':
      return {
        ...state,
        amount: value,
      };
    case 'cnt':
      return {
        ...state,
        cnt: value,
      };
    case 'batchNO':
      return {
        ...state,
        batchNO: value,
      };
    case 'reset':
      return new PharmacyDrugSupplyList();
    default:
      console.log(`Action type: ${type} not defined`);
  }
}

const useStyle = makeStyles((theme) =>
  createStyles({
    contentContainer: {
      marginTop: 15,
    },
    blankCard: {
      height: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2),
      maxWidth: 600,
    },
    offerInput: {
      width: 50,
    },
    expireDate: {
      display: 'flex',
      alignItems: 'center',
    },
    fieldset: {
      borderColor: '#f5f5f5',
      borderRadius: 10,
      color: '#6d6d6d',
      '& legend': {
        color: '#7e7e7e',
      },
    },
    buttonContainer: {
      marginTop: 15,
    },
    formControl: {
      width: '100%',
      margin: theme.spacing(1),
    },
    cancelButton: {
      marginRight: 10,
    },
    drugTitle: {
      marginBottom: theme.spacing(1),
    },
    formContent: {
      height: 450,
      overflow: 'hidden',
      overflowY: 'auto',
      display: 'flex',
    },
  })
);

const { all, searchDrug } = new Drug();

const { allPharmacyDrug, savePharmacyDrug } = new PharmacyDrug();

const { getComissionAndRecommendation } = new Comission();

const { numberWithZero } = Convertor;

const SupplyList: React.FC = () => {
  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [isOpenModalOfNewList, setIsOpenModalOfNewList] = useState<boolean>(
    false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, new PharmacyDrugSupplyList());
  const [drugList, setDrugList] = useState<DrugInterface[]>([]);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<any>('');
  const [daysDiff, setDaysDiff] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isoDate, setIsoDate] = useState<string>('');
  const [daroogRecommendation, setDaroogRecommendation] = useState<string>('');
  const [comissionPercent, setComissionPercent] = useState<string>('');
  const [selectDrugForEdit, setSelectDrugForEdit] = useState<{
    id: number;
    genericName: string;
  }>({
    id: -1,
    genericName: '',
  });
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);

  const { t } = useTranslation();
  const queryCache = useQueryCache();

  const {
    contentContainer,
    blankCard,
    modalContainer,
    expireDate,
    fieldset,
    buttonContainer,
    cancelButton,
    formContent,
  } = useStyle();

  useEffectOnce(() => {
    (async (): Promise<any> => {
      try {
        const result = await all(0, 10 ^ 3);
        setDrugList(result.items);
      } catch (e) {
        errorHandler(e);
      }
    })();
  });

  useEffect(() => {
    (async (): Promise<any> => {
      try {
        const { offer1, offer2, amount, cnt } = state;
        // @ts-ignore
        const { value: drugId } = selectedDrug;
        if (
          (offer1 !== '' && offer2 !== '' && Number(cnt) > 0) ||
          (drugId && Number(amount) > 0)
        ) {
          const result = await getComissionAndRecommendation({
            drugId: Number(selectedDrug),
            price: state?.amount,
            offer1: state?.offer1,
            offer2: state?.offer2,
            expireDate: isoDate,
            pharmacyId: '0',
          });
          const { data } = result;
          if (has(data, 'commissionPercent')) {
            setComissionPercent(data.commissionPercent);
          }
          if (has(data, 'suggestionStr')) {
            setDaroogRecommendation(data.suggestionStr);
          }
        }
      } catch (e) {
        errorHandler(e);
      }
    })();
  }, [
    selectedDrug,
    state?.amount,
    state?.offer1,
    state?.offer2,
    state?.cnt,
    // state?.expireDate,
    isoDate,
  ]);

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);
  const toggleIsOpenModalOfNewList = (): void => {
    if (isOpenModalOfNewList) {
      dispatch({ type: 'reset' });
      setSelectedDate('');
      setSelectedDrug('');
      setDaroogRecommendation('');
      setComissionPercent('');
      setDaysDiff('');
      setIsoDate('');
      setOptions([]);
    }
    setIsOpenModalOfNewList((v) => !v);
  };

  const {
    isLoading: isLoadingFetchData,
    data,
    isFetched,
  } = useQuery(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG, () => allPharmacyDrug());

  const [_savePharmacyDrug, { isLoading: isLoadingSave }] = useMutation(
    savePharmacyDrug,
    {
      onSuccess: async () => {
        toggleIsOpenModalOfNewList();
        await successSweetAlert(t('alert.successfulSave'));
        queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
      },
    }
  );

  const calculatDateDiference = (e: string, dateSeparator: string): void => {
    const date = new Date();
    const todayMomentObject = moment([
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ]);
    const convertedArray = e.split(dateSeparator).map((i) => Number(i));
    const selectedDate = jalali.toGregorian(
      convertedArray[0],
      convertedArray[1],
      convertedArray[2]
    );
    const selectedDateMomentObject = moment([
      selectedDate.gy,
      selectedDate.gm - 1,
      selectedDate.gd,
    ]);

    setDaysDiff(
      String(selectedDateMomentObject.diff(todayMomentObject, 'days'))
    );

    setIsoDate(
      `${selectedDate.gy}-${numberWithZero(selectedDate.gm)}-${numberWithZero(
        selectedDate.gd
      )}T00:00:00Z`
    );
  };

  const searchDrugs = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }
      setIsLoading(true);
      const result = await searchDrug(title);
      const items = result.map((item: any) => ({
        id: item.id,
        genericName: item.genericName,
      }));
      setSelectDrugForEdit(options.find((item) => item.id === selectedDrug));
      setIsLoading(false);
      setOptions(items);
    } catch (e) {
      errorHandler(e);
    }
  };

  const editHandler = async (item: any): Promise<any> => {
    const {
      offer1,
      offer2,
      drugID,
      batchNO,
      amount,
      cnt,
      expireDate,
      drug: { name },
      id,
    } = item;
    console.log(item);
    dispatch({ type: 'expireDate', value: expireDate });
    dispatch({ type: 'drugID', value: drugID });
    dispatch({ type: 'offer1', value: offer1 });
    dispatch({ type: 'offer2', value: offer2 });
    dispatch({ type: 'batchNO', value: batchNO });
    dispatch({ type: 'amount', value: amount });
    dispatch({ type: 'cnt', value: cnt });
    dispatch({ type: 'id', value: id });

    setIsOpenBackDrop(true);
    await searchDrugs(name);
    setSelectedDrug(Number(drugID));
    const shamsiDate = convertISOTime(expireDate);
    setSelectedDate(shamsiDate);
    calculatDateDiference(shamsiDate, '-');
    setIsOpenBackDrop(false);
    toggleIsOpenModalOfNewList();
  };

  const filteredItemsHandler = (e: any): void => {
    const _filteredItems = data.items.filter(
      (item: any) =>
        item.drug.name.includes(e) || item.drug.genericName.includes(e)
    );
    setFilteredItems(_filteredItems);
  };

  const displayHandler = (): JSX.Element[] => {
    let items;
    if (filteredItems.length > 0) {
      items = filteredItems.map((item: AllPharmacyDrugInterface) => {
        return (
          <Grid item xs={12} sm={6} md={4} xl={3} key={item.id}>
            <CardContainer
              editHandler={(): Promise<any> => editHandler(item)}
              drug={item}
            />
          </Grid>
        );
      });
    } else {
      if (isFetched) {
        items = data.items.map((item: AllPharmacyDrugInterface) => {
          return (
            <Grid item xs={12} sm={6} md={4} xl={3}>
              <CardContainer
                editHandler={(): Promise<any> => editHandler(item)}
                drug={item}
              />
            </Grid>
          );
        });
      }
    }
    return items;
  };

  const drugListGenerator = (): JSX.Element[] => {
    return drugList.map((item: DrugInterface) => {
      return (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };

  const formHandler = async (): Promise<any> => {
    try {
      state.expireDate = isoDate;
      //@ts-ignore
      state.drugID = selectedDrug;
      await _savePharmacyDrug(state);
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <MaterialContainer>
        <h1 className="txt-md">{t('drug.SuppliedDrugsList')}</h1>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <MaterialSearchBar onRequestSearch={filteredItemsHandler} />
          </Grid>
        </Grid>

        <Grid container spacing={1} className={contentContainer}>
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <Paper className={blankCard} onClick={toggleIsOpenModalOfNewList}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('pharmacy.addToTransferList')}</span>
            </Paper>
          </Grid>
          {displayHandler()}
        </Grid>
      </MaterialContainer>

      <Modal open={isOpenModalOfNewList} toggle={toggleIsOpenModalOfNewList}>
        <div className={modalContainer}>
          <Grid container spacing={1} className={formContent}>
            <Grid item xs={12}>
              <Autocomplete
                loading={isLoading}
                id="drug-list"
                noOptionsText={t('general.noData')}
                loadingText={t('general.loading')}
                options={options}
                onChange={(event, value, reason): void => {
                  setSelectedDrug(value?.id);
                }}
                getOptionLabel={(option: any) => option.genericName}
                // value={selectDrugForEdit}
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={t('drug.name')}
                    variant="outlined"
                    onChange={debounce(
                      (e): Promise<any> => searchDrugs(e.target.value),
                      500
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <label htmlFor="">{t('general.price')}</label>
                </Grid>

                <Grid item xs={12}>
                  <Input
                    numberFormat
                    value={state?.amount}
                    className="w-100"
                    label={t('general.price')}
                    onChange={(e): void =>
                      dispatch({ type: 'amount', value: Number(e) })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <label>{t('general.number')}</label>
                </Grid>

                <Grid item xs={12}>
                  <Input
                    numberFormat
                    className="w-100"
                    label={`${t('general.number')} ${t('drug.drug')}`}
                    onChange={(e): void =>
                      dispatch({ type: 'cnt', value: Number(e) })
                    }
                    value={state?.cnt}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <span>آفر</span>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Input
                    value={state?.offer1}
                    label={t('general.number')}
                    onChange={(e): void =>
                      dispatch({
                        type: 'offer1',
                        value: Number(e.target.value),
                      })
                    }
                  />
                </Grid>
                <span>به</span>
                <Grid item xs={12} sm={3}>
                  <Input
                    value={state?.offer2}
                    label={t('general.number')}
                    // className={offerInput}
                    onChange={(e): void =>
                      dispatch({
                        type: 'offer2',
                        value: Number(e.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm>
                  <span className="txt-sm text-muted">
                    (به ازای هر{' '}
                    <span className="txt-bold">{state?.offer2}</span> خرید،{' '}
                    <span className="txt-bold">{state?.offer1}</span> عدد
                    رایگان)
                  </span>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Input
                readOnly
                onClick={toggleIsOpenDatePicker}
                value={selectedDate}
                className="w-100 cursor-pointer"
                label={t('general.expireDate')}
              />
            </Grid>
            <Grid item xs={2} className={expireDate}>
              {daysDiff !== '' && <span>{daysDiff} روز</span>}
            </Grid>

            <Grid item xs={12}>
              <Input
                className="w-100"
                label={t('general.barcode')}
                value={state?.batchNO}
                onChange={(e): void =>
                  dispatch({ type: 'batchNO', value: e.target.value })
                }
              />
            </Grid>

            {comissionPercent !== '' && (
              <Grid item xs={12}>
                {`پورسانت: ${comissionPercent}%`}
              </Grid>
            )}

            {daroogRecommendation !== '' && (
              <Grid item xs={12}>
                <FieldSetLegend className={fieldset} legend="پیشنهاد داروگ">
                  <span>{daroogRecommendation}</span>
                </FieldSetLegend>
              </Grid>
            )}
          </Grid>

          <Grid
            container
            justify="flex-end"
            spacing={0}
            className={buttonContainer}
          >
            <Button
              color="pink"
              type="button"
              onClick={toggleIsOpenModalOfNewList}
              className={cancelButton}
            >
              {t('general.cancel')}
            </Button>
            <Button color="blue" type="button" onClick={formHandler}>
              {isLoadingSave ? t('general.pleaseWait') : t('general.submit')}
            </Button>
          </Grid>
        </div>
      </Modal>

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DatePicker
          minimumDate={utils('fa').getToday()}
          dateTypeIsSelectable
          selectedDateHandler={(e): void => {
            calculatDateDiference(e, '/');
            setSelectedDate(e);

            toggleIsOpenDatePicker();
          }}
        />
      </Modal>

      <BackDrop isOpen={isOpenBackDrop} />
    </>
  );
};

export default SupplyList;

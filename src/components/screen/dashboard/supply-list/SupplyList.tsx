import React, { useState, useReducer, useEffect, useRef, useMemo } from 'react';
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Container,
  Hidden,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  useMediaQuery,
  useTheme,
  Divider,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Modal, BackDrop, AutoComplete } from '../../../public';
import MaterialSearchBar from '../../../public/material-searchbar/MaterialSearchbar';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AllPharmacyDrug } from '../../../../enum/query';
import { Drug, PharmacyDrug, Comission } from '../../../../services/api';
import CardContainer from './CardContainer';
import { debounce, has } from 'lodash';
import { ActionInterface, AllPharmacyDrugInterface, DrugInterface } from '../../../../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../../../public/input/Input';
import FieldSetLegend from '../../../public/fieldset-legend/FieldSetLegend';
import { PharmacyDrugSupplyList } from '../../../../model/pharmacyDrug';
import { useEffectOnce } from '../../../../hooks';
import { Convertor, errorHandler, successSweetAlert } from '../../../../utils';
import moment from 'jalali-moment';
import { jalali } from '../../../../utils';
// @ts-ignore
import jalaali from 'jalaali-js';
import { DrugType } from '../../../../enum/pharmacyDrug';
import { ListOptions } from '../../../public/auto-complete/AutoComplete';
import styled from 'styled-components';

const GridCenter = styled((props) => <Grid item {...props} />)`
  text-align: center;
`;

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
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
    contentContainer: {
      marginTop: 15,
    },
    blankCard: {
      minHeight: 150,
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
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    drugTitle: {
      marginBottom: theme.spacing(1),
    },
    formContent: {
      height: 485,
      overflow: 'hidden',
      overflowY: 'auto',
      display: 'flex',
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

const { all, searchDrug } = new Drug();

const { allPharmacyDrug, savePharmacyDrug } = new PharmacyDrug();

const { getComissionAndRecommendation } = new Comission();

const { numberWithZero, convertISOTime } = Convertor;

const monthIsValid = (month: number): boolean => month < 13;
const dayIsValid = (day: number): boolean => day < 32;

const { drugExpireDay } = JSON.parse(localStorage.getItem('settings') ?? '{}');

const monthMinimumLength = 28;

const SearchButton = styled(Button)`
  color: #2e67e2;
`;

const SupplyList: React.FC = () => {
  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [isOpenModalOfNewList, setIsOpenModalOfNewList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, new PharmacyDrugSupplyList());
  const [drugList, setDrugList] = useState<DrugInterface[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<ListOptions | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [daysDiff, setDaysDiff] = useState<string>('');
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
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);
  const [isWrongDate, setIsWrongDate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMinimumDate, setHasMinimumDate] = useState(true);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    submitBtn,
    formContent,
    label,
    fab,
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
        if ((offer1 !== '' && offer2 !== '' && Number(cnt) > 0) || (drugId && Number(amount) > 0)) {
          const result = await getComissionAndRecommendation({
            drugId,
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
  }, [selectedDrug, state?.amount, state?.offer1, state?.offer2, state?.cnt, isoDate]);

  const resetDateState = (): void => {
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
  };

  const resetStates = (): void => {
    dispatch({ type: 'reset' });
    setSelectedDate('');
    resetDateState();
    setSelectedDrug(null);
    setDaroogRecommendation('');
    setComissionPercent('');
    setDaysDiff('');
    setIsoDate('');
    setOptions([]);
    setIsWrongDate(false);
    setHasMinimumDate(true);
  };

  const toggleIsOpenModalOfNewList = (): void => {
    if (isOpenModalOfNewList) {
      resetStates();
    }
    setIsOpenModalOfNewList((v) => !v);
  };

  const { data, isFetched } = useQuery(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG, () =>
    allPharmacyDrug('', true, 'desc')
  );

  const [_savePharmacyDrug, { isLoading: isLoadingSave }] = useMutation(savePharmacyDrug, {
    onSuccess: async () => {
      if (isCheckedNewItem) {
        resetStates();
      } else {
        toggleIsOpenModalOfNewList();
        resetStates();
      }
      await successSweetAlert(t('alert.successfulSave'));
      queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
    },
  });

  const isJalaliDate = (num: number): boolean => num < 2000;

  const calculatDateDiference = (): void => {
    const date = new Date();
    const todayMomentObject = moment([date.getFullYear(), date.getMonth(), date.getDate()]);

    const convertedArray = [
      Number(selectedYear),
      Number(selectedMonth),
      Number(selectedDay === '' ? monthMinimumLength : selectedDay),
    ];

    let selectedDate: any;
    if (isJalaliDate(convertedArray[0])) {
      selectedDate = jalali.toGregorian(convertedArray[0], convertedArray[1], convertedArray[2]);
    }

    const selectedDateMomentObject = moment(
      isJalaliDate(convertedArray[0])
        ? [selectedDate.gy, selectedDate.gm - 1, selectedDate.gd]
        : [
            Number(selectedYear),
            Number(selectedMonth) - 1,
            Number(selectedDay === '' ? monthMinimumLength : selectedDay),
          ]
    );

    const daysDiff = String(selectedDateMomentObject.diff(todayMomentObject, 'days'));

    if (Number(daysDiff) < drugExpireDay) {
      setHasMinimumDate(false);
    } else {
      setHasMinimumDate(true);
    }

    if (Number(daysDiff) < 0) {
      setIsWrongDate(true);
      setDaysDiff('');
    } else {
      setIsWrongDate(false);
      setDaysDiff(daysDiff);
    }

    setIsoDate(
      isJalaliDate(convertedArray[0])
        ? `${selectedDate.gy}-${numberWithZero(selectedDate.gm)}-${numberWithZero(
            selectedDate.gd
          )}T00:00:00Z`
        : `${[Number(selectedYear), Number(selectedMonth) - 1, Number(selectedDay)].join(
            '-'
          )}T00:00:00Z`
    );
  };

  useEffect(() => {
    if (selectedYear !== '' && selectedYear.length === 4 && selectedMonth !== '') {
      calculatDateDiference();
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  const typeHandler = (item: string): string => {
    let name = '';
    switch (item) {
      case DrugType.CAPSULE:
      case DrugType.PILL:
      case DrugType.SUPPOSITORY:
        name = t('general.box');
        break;
      case DrugType.AMPOULE:
      case DrugType.MILK_POWDER:
      case DrugType.SYRUP:
        name = t('general.num');
        break;
      default:
        name = '';
    }

    return name;
  };

  const searchDrugs = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }
      setIsLoading(true);
      const result = await searchDrug(title);

      const items = result.map((item: any) => ({
        value: item.id,
        label: `${item.name} (${item.genericName}) ${typeHandler(item.type)}`,
      }));

      setSelectDrugForEdit(options.find((item) => item.id === selectedDrug));
      setIsLoading(false);

      const optionsList = items.map((item: ListOptions) => ({
        item,
        el: <div>{item.label}</div>,
      }));

      setOptions(optionsList);
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
    dispatch({ type: 'expireDate', value: expireDate });
    dispatch({ type: 'drugID', value: drugID });
    dispatch({ type: 'offer1', value: offer1 });
    dispatch({ type: 'offer2', value: offer2 });
    dispatch({ type: 'batchNO', value: batchNO });
    dispatch({ type: 'amount', value: amount });
    dispatch({ type: 'cnt', value: cnt });
    dispatch({ type: 'id', value: id });

    const [year, month, day] = convertISOTime(expireDate).split('-');
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    setIsOpenBackDrop(true);
    await searchDrugs(name);
    setSelectedDrug({
      value: drugID,
      label: name,
    });
    const shamsiDate = convertISOTime(expireDate);
    setSelectedDate(shamsiDate);
    // calculatDateDiference(shamsiDate, '-');
    setIsOpenBackDrop(false);
    toggleIsOpenModalOfNewList();
  };

  const filteredItemsHandler = (e: any): void => {
    const _filteredItems = data.items.filter(
      (item: any) => item.drug.name.includes(e) || item.drug.genericName.includes(e)
    );
    setFilteredItems(_filteredItems);
  };

  const displayHandler = (): JSX.Element[] => {
    let items = [];
    if (filteredItems.length > 0) {
      items = filteredItems.map((item: AllPharmacyDrugInterface) => {
        return (
          <Grid item spacing={3} xs={12} sm={12} md={4} xl={4} key={item.id}>
            <CardContainer editHandler={(): Promise<any> => editHandler(item)} drug={item} />
          </Grid>
        );
      });
    } else {
      if (isFetched) {
        items = data.items.map((item: AllPharmacyDrugInterface) => {
          return (
            <Grid spacing={3} item xs={12} sm={12} md={4} xl={4} key={item.id}>
              <CardContainer editHandler={(): Promise<any> => editHandler(item)} drug={item} />
            </Grid>
          );
        });
      }
    }
    return items;
  };

  const memoItems = useMemo(() => displayHandler(), [data, filteredItems]);

  const formHandler = async (): Promise<any> => {
    try {
      if (
        selectedYear === '' ||
        selectedMonth === '' ||
        !monthIsValid(Number(selectedMonth)) ||
        !dayIsValid(Number(selectedDay)) ||
        selectedYear.length < 4 ||
        isWrongDate ||
        !hasMinimumDate
      ) {
        return;
      }

      const intSelectedYear = Number(selectedYear);
      const intSelectedMonth = Number(selectedMonth);
      const intSelectedDay = Number(selectedDay === '' ? monthMinimumLength : selectedDay);

      let date = '';
      if (!isJalaliDate(intSelectedYear)) {
        date = `${intSelectedYear}-${numberWithZero(intSelectedMonth)}-${numberWithZero(
          intSelectedDay
        )}T00:00:00Z`;
      } else {
        const jalail2Gregorian = jalaali.toGregorian(
          intSelectedYear,
          intSelectedMonth,
          intSelectedDay
        );

        date = `${jalail2Gregorian.gy}-${numberWithZero(jalail2Gregorian.gm)}-${numberWithZero(
          jalail2Gregorian.gd
        )}T00:00:00Z`;
      }
      state.expireDate = date;
      if (state.offer1 === '') {
        state.offer1 = 0;
      }
      if (state.offer2 === '') {
        state.offer2 = 0;
      }
      //@ts-ignore
      state.drugID = selectedDrug?.value;
      await _savePharmacyDrug(state);
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <Container>
        <h1 className="txt-md">{t('drug.SuppliedDrugsList')}</h1>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={9} md={5}>
            <MaterialSearchBar
              placeholder={t('exchange.searchDrugPlaceHolder')}
              onRequestSearch={filteredItemsHandler}
            />
          </Grid>
          {filteredItems.length > 0 && (
            <Grid item xs={3} md={2}>
              <SearchButton variant="text" onClick={(): void => setFilteredItems([])}>
                {t('general.displayList', { var: 'اولیه' })}
              </SearchButton>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3} className={contentContainer}>
          <Hidden xsDown>
            <Grid item xs={12} sm={12} md={4} xl={4}>
              <Paper className={blankCard} onClick={toggleIsOpenModalOfNewList}>
                <FontAwesomeIcon icon={faPlus} size="2x" />
                <span>{t('pharmacy.addToTransferList')}</span>
              </Paper>
            </Grid>
          </Hidden>

          {memoItems}
          <Hidden smUp>
            <Fab onClick={toggleIsOpenModalOfNewList} className={fab} aria-label="add">
              <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
            </Fab>
          </Hidden>
        </Grid>
      </Container>

      <Dialog
        fullScreen={fullScreen}
        open={isOpenModalOfNewList}
        onClose={toggleIsOpenModalOfNewList}
        fullWidth
      >
        <DialogTitle className="text-sm">{'افزودن به لیست عرضه'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1} className={formContent}>
              <Grid item xs={12}>
                <AutoComplete
                  ref={useRef()}
                  isLoading={isLoading}
                  onChange={debounce((e) => searchDrugs(e.target.value), 500)}
                  loadingText={t('general.loading')}
                  className="w-100"
                  placeholder={t('drug.name')}
                  options={options}
                  onItemSelected={(item: any[]): void => setSelectedDrug(item[0])}
                  defaultSelectedItem={selectedDrug?.label}
                />
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
                      onChange={debounce((e) => dispatch({ type: 'cnt', value: e }), 500)}
                      value={state?.cnt}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label htmlFor="">{`${t('general.price')} (${t(
                      'general.defaultCurrency'
                    )})`}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      numberFormat
                      value={state?.amount}
                      className="w-100"
                      label={t('general.price')}
                      onChange={debounce((e) => dispatch({ type: 'amount', value: e }), 500)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12}>
                    <span>هدیه</span>
                    <span className="text-succes txt-xs">
                      (داروسازان می توانند هدیه ای در قبال محصول خود به داروساز مقابل بدهند)
                    </span>
                  </Grid>
                  <Grid container alignItems="center" spacing={0}>
                    <GridCenter item xs={1}>
                      <span>به ازای</span>
                    </GridCenter>
                    <GridCenter item xs={2} className="w-100">
                      <Input
                        value={state?.offer2}
                        placeholder="تعداد"
                        onChange={(e): void =>
                          dispatch({
                            type: 'offer2',
                            value: e.target.value,
                          })
                        }
                      />
                    </GridCenter>
                    <GridCenter xs={1}>
                      <span>تا</span>
                    </GridCenter>
                    <Grid item xs={2}>
                      <Input
                        value={state?.offer1}
                        placeholder="تعداد"
                        onChange={(e): void =>
                          dispatch({
                            type: 'offer1',
                            value: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <GridCenter xs={1}>{t('general.gift')}</GridCenter>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <span style={{ marginBottom: 8 }}>{t('general.expireDate')}</span>{' '}
                    <span className="text-danger txt-xs">(وارد کردن روز اجباری نیست)</span>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={3}>
                    <Input
                      label={t('general.day')}
                      type="number"
                      value={selectedDay}
                      placeholder={'22'}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedDay.length < 2 || val.length < 2) {
                          setSelectedDay(e.target.value);
                        }
                      }}
                      error={Number(selectedDay) > 31}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={4} sm={3}>
                    <Input
                      type="number"
                      value={selectedMonth}
                      label={t('general.month')}
                      required
                      placeholder={'08'}
                      error={Number(selectedMonth) > 12}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedMonth.length < 2 || val.length < 2) {
                          setSelectedMonth(e.target.value);
                        }
                      }}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={4} sm={3}>
                    <Input
                      type="number"
                      value={selectedYear}
                      required
                      placeholder={'1401/2022'}
                      label={t('general.year')}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedYear.length < 4 || val.length < 4) {
                          setSelectedYear(val);
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={3} className={expireDate}>
                    {daysDiff !== '' && <span>{daysDiff} روز</span>}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {isWrongDate && <p className="text-danger txt-xs">{t('date.afterToday')}</p>}
                  {!hasMinimumDate && (
                    <p className="text-danger txt-xs">
                      {t('date.minimumDate', {
                        day: drugExpireDay,
                      })}
                    </p>
                  )}
                </Grid>
                <span className="txt-sm">فرمت تاریخ به صورت 0000 00 00 باشد</span>
              </Grid>

              {/* <Grid item xs={12}>
              <Input
                className="w-100"
                label={t('general.barcode')}
                value={state?.batchNO}
                onChange={(e): void =>
                  dispatch({ type: 'batchNO', value: e.target.value })
                }
              />
            </Grid> */}

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
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid container style={{ marginTop: 4, marginBottom: 4 }} xs={12}>
            <Grid item xs={12}>
              <label htmlFor="add" className={`${label} cursor-pointer`}>
                <input
                  id="add"
                  type="checkbox"
                  checked={isCheckedNewItem}
                  onChange={(e): void => setIsCheckedNewItem(e.target.checked)}
                />
                <span>صفحه بعد از اضافه کردن دارو٬ جهت افزودن داروی جدید بسته نشود</span>
              </label>
            </Grid>

            <Grid container xs={12}>
              <Grid item xs={7} sm={8} />
              <Grid item xs={2} sm={2}>
                <Button type="button" onClick={toggleIsOpenModalOfNewList} className={cancelButton}>
                  {t('general.close')}
                </Button>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button
                  className={submitBtn}
                  type="button"
                  disabled={isLoadingSave}
                  onClick={formHandler}
                >
                  {isLoadingSave ? t('general.pleaseWait') : t('general.submit')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <BackDrop isOpen={isOpenBackDrop} />
    </>
  );
};

export default SupplyList;

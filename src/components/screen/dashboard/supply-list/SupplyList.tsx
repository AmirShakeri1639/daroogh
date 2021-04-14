import React, { useState, useReducer, useEffect, useRef, useMemo } from 'react';
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Container,
  Hidden,
  Fab,
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
import { BackDrop, AutoComplete } from '../../../public';
import MaterialSearchBar from '../../../public/material-searchbar/MaterialSearchbar';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { faPlus, faCalculator } from '@fortawesome/free-solid-svg-icons';
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
import { ListOptions } from '../../../public/auto-complete/AutoComplete';
import styled from 'styled-components';
import CDialog from 'components/public/dialog/Dialog';
import { ColorEnum } from 'enum';
import Calculator from '../calculator/Calculator';

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
      borderColor: ColorEnum.DeepBlue,
      borderRadius: 10,
      color: 'red',
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
    formContent: {},
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
    sectionContainer: {
      background: 'white',
      borderLeft: `3px solid ${ColorEnum.DeepBlue}`,

      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    input: {
      width: 80,
      marginLeft: 8,
      marginRight: 8,
    },
  })
);

const { all, searchDrug } = new Drug();

const { allPharmacyDrug, savePharmacyDrug } = new PharmacyDrug();

const { getComissionAndRecommendation } = new Comission();

const { numberWithZero, convertISOTime } = Convertor;

const monthIsValid = (month: number): boolean => month < 13;
const dayIsValid = (day: number): boolean => day < 32 || day > 0;

const { drugExpireDay } = JSON.parse(localStorage.getItem('settings') ?? '{}');

const monthMinimumLength = 28;

const SearchButton = styled(Button)`
  color: #2e67e2;
`;

const StyledMaterialSearchBar = styled((props) => <MaterialSearchBar {...props} />)`
  .MuiInputBase-input {
    &::placeholder {
      font-size: 0.7rem !important;
    }
  }
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
  const [calculatedValue, setCalculatedValue] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);
  const [isWrongDate, setIsWrongDate] = useState(false);
  const [hasMinimumDate, setHasMinimumDate] = useState(true);
  const [showError, setShowError] = useState(false);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const queryCache = useQueryCache();

  const resetValues = (): void => {
    dispatch({ type: 'reset' });
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('s');
  };

  const [isOpenCalculator, setIsOpenCalculator] = useState<boolean>(false);
  const toggleIsOpenCalculator = (): void => {
    setIsOpenCalculator((v) => !v);
    if (isOpenCalculator) {
      window.history.back();
    }
  };

  const {
    contentContainer,
    blankCard,
    expireDate,
    fieldset,
    formContent,
    input,
    label,
    fab,
    sectionContainer,
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

  const containerRef = useRef<any>();
  console.log(containerRef);
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
    setShowError(false);
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

  const getDrugName = (item: any): string => {
    return `${item.name}${item.genericName !== null ? ` (${item.genericName}) ` : ''}${
      item.type !== null ? ` - ${item.type}` : ''
    }`;
  };

  const searchDrugs = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }
      setIsLoading(true);
      const result = await searchDrug(title);

      setSelectDrugForEdit(options.find((item) => item.id === selectedDrug));
      setIsLoading(false);

      const optionsList = result
        //.filter((_item: any) => _item.active === true)
        .map((_item: any) => ({
          item: {
            value: _item.id,
            label: getDrugName(_item),
          },
          el: (
            <div>
              <div>{getDrugName(_item)}</div>
              <div className="text-muted txt-sm">{`${
                _item.enName !== null ? `-${_item.enName}` : ''
              }${_item.companyName !== null ? ` - ${_item.companyName}` : ''}`}</div>
            </div>
          ),
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

  const selectedCalculaterValueHandler = (v: number): void => {
    setCalculatedValue(v);
  };

  const formHandler = async (): Promise<any> => {
    try {
      if (
        selectedYear.trim() === '' ||
        selectedMonth.trim() === '' ||
        !monthIsValid(Number(selectedMonth)) ||
        !dayIsValid(Number(selectedDay)) ||
        selectedYear.length < 4 ||
        isWrongDate ||
        !hasMinimumDate
      ) {
        setShowError(true);
        return;
      }
      setShowError(false);
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
      setCalculatedValue(0);
    } catch (e) {
      errorHandler(e);
    }
  };

  const autoCompleteRef = useRef<any>();

  return (
    <>
      <Container>
        <h1 className="txt-md">{t('drug.SuppliedDrugsList')}</h1>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={5}>
            <StyledMaterialSearchBar
              placeholder={t('exchange.searchDrugPlaceHolder')}
              onRequestSearch={filteredItemsHandler}
            />
          </Grid>
          {filteredItems.length > 0 && filteredItems.length < data.items.length && (
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

      <CDialog
        fullWidth={fullScreen}
        isOpen={isOpenCalculator}
        onCloseAlternate={(): void => setIsOpenCalculator(false)}
        onOpenAltenate={(): void => setIsOpenCalculator(true)}
        modalAlt={true}
        hideAll={false}
        hideSubmit={true}
        // canceleButtonTitle="درج نتیجه محاسبه"
        // formHandler={(): void => setIsOpenCalculator(false)}
      >
        <DialogContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              minWidth: `${fullScreen ? '0px' : '300px'}`,
            }}
          >
            <Calculator setCalculatedValue={selectedCalculaterValueHandler} />
          </div>
        </DialogContent>
      </CDialog>

      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModalOfNewList}
        onClose={(): void => {
          setIsOpenModalOfNewList(false);
          setCalculatedValue(0);
          resetValues();
          setSelectedDrug(null);
        }}
        onOpen={(): void => {
          setIsOpenModalOfNewList(true);
          setCalculatedValue(0);
        }}
        formHandler={formHandler}
        fullWidth
      >
        <DialogTitle className="text-sm">افزودن به لیست عرضه</DialogTitle>
        <DialogContent style={{ height: 'calc(100vh - 50px)' }}>
          <DialogContentText>
            <Grid container spacing={3} direction="column" className={formContent}>
              <Grid item container xs={12} className={sectionContainer}>
                <Grid item xs={12}>
                  <span style={{ color: '#17A2B8', fontSize: 12 }}>
                    {t('alerts.searchProduct')}
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <AutoComplete
                    disable={state?.id !== 0}
                    ref={autoCompleteRef}
                    isLoading={isLoading}
                    onChange={debounce((e) => searchDrugs(e.target.value), 500)}
                    loadingText={t('general.loading')}
                    className="w-100"
                    placeholder={t('drug.productName')}
                    options={options}
                    onItemSelected={(item: any[]): void => setSelectedDrug(item[0])}
                    defaultSelectedItem={selectedDrug?.label}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} className={sectionContainer}>
                <Input
                  numberFormat
                  placeholder={`${t('general.number')}`}
                  className="w-100"
                  valueLimit={(value) => {
                    if (value.value > 0 || value.value === '') {
                      return value;
                    }
                  }}
                  label={`${t('general.number')} ${t('drug.drug')}`}
                  onChange={(e): void => dispatch({ type: 'cnt', value: e })}
                  value={state?.cnt}
                />
              </Grid>

              <Grid item container xs={12} className={sectionContainer}>
                <Grid xs={12} item>
                  <span style={{ color: '#17A2B8', fontSize: 12 }}>
                    {t('alerts.priceTypeAlert')}
                  </span>
                </Grid>
                <Grid item xs={9}>
                  <Input
                    placeholder={`${t('general.pricePerUnit')} (${t('general.defaultCurrency')})`}
                    numberFormat
                    value={calculatedValue === 0 ? state?.amount : calculatedValue}
                    className="w-100"
                    valueLimit={(value) => {
                      if (value.value > 0 || value.value === '') {
                        return value;
                      }
                    }}
                    label={t('general.price')}
                    onChange={(e): void => {
                      dispatch({ type: 'amount', value: e });
                      setCalculatedValue(0);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={(): void => {
                      toggleIsOpenCalculator();
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: ColorEnum.DeepBlue, margin: 4 }}
                      icon={faCalculator}
                    />
                    {t('general.calculating')}
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} className={sectionContainer}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12}>
                    <span style={{ color: '#17A2B8', fontSize: 12 }}>
                      {t('alerts.offerDescriptions')}
                    </span>
                  </Grid>
                  <Grid container alignItems="center" spacing={0}>
                    <span>به ازای</span>

                    <Input
                      type="number"
                      className={input}
                      value={state?.offer2}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (Number(val) >= 1 || Number(state?.offer2) >= 1) {
                          dispatch({
                            type: 'offer2',
                            value: val,
                          });
                        }
                      }}
                    />
                    <span>تا</span>
                    <Input
                      type="number"
                      className={input}
                      value={state?.offer1}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (Number(val) >= 1 || Number(state?.offer1) >= 1) {
                          dispatch({
                            type: 'offer1',
                            value: val,
                          });
                        }
                      }}
                    />
                    {t('general.gift')}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container className={sectionContainer} xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <span style={{ marginBottom: 8, marginLeft: 6 }}>
                      {t('general.expireDate')}
                    </span>
                    <span style={{ color: '#17A2B8', fontSize: 10 }}>
                      ( سال وارد شده 4 رقمی و به صورت میلادی یا شمسی باشد )
                    </span>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={3}>
                    <Input
                      label={t('general.day')}
                      type="number"
                      value={selectedDay}
                      // placeholder={'22'}
                      required
                      error={(selectedDay === '' && showError) || !dayIsValid(Number(selectedDay))}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedDay.length < 2 || val.length < 2) {
                          setSelectedDay(e.target.value);
                        }
                      }}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={4} sm={3}>
                    <Input
                      type="number"
                      value={selectedMonth}
                      label={t('general.month')}
                      // required
                      error={(selectedMonth === '' && showError) || Number(selectedMonth) > 12}
                      // placeholder={'08'}
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
                      error={selectedYear === '' && showError}
                      // placeholder={'1401/2022'}
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
              </Grid>
              <Grid item container className={sectionContainer} xs={12}>
                <Grid item xs={12} style={{ marginBottom: 8 }}>
                  <span style={{ color: '#17A2B8', fontSize: 12 }}>
                    وارد کردن بچ نامبر برای ثبت محصول الزامی میباشد
                  </span>
                </Grid>
                <Grid xs={12}>
                  <Input
                    required
                    error={state?.batchNO === '' && showError}
                    className="w-100"
                    label={t('general.batchNumber')}
                    value={state?.batchNO}
                    onChange={(e): void => dispatch({ type: 'batchNO', value: e.target.value })}
                  />
                </Grid>
              </Grid>

              {comissionPercent !== '' && (
                <Grid item xs={12}>
                  <h3>{`پورسانت: ${comissionPercent}%`}</h3>
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
                <span>{t('alerts.reloadModalToEnterNewDrug')}</span>
              </label>
            </Grid>
          </Grid>
        </DialogActions>
      </CDialog>
      <BackDrop isOpen={isOpenBackDrop} />
    </>
  );
};

export default SupplyList;

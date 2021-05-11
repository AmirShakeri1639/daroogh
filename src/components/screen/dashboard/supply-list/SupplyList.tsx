import React, { useState, useReducer, useEffect, useRef, useMemo } from 'react';
import {
  Grid,
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
import { debounce, has, isNil } from 'lodash';
import { ActionInterface, AllPharmacyDrugInterface, DrugInterface } from '../../../../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../../../public/input/Input';
import FieldSetLegend from '../../../public/fieldset-legend/FieldSetLegend';
import { PharmacyDrugSupplyList } from '../../../../model/pharmacyDrug';
import { useEffectOnce } from '../../../../hooks';
import { Convertor, errorHandler, tError, tSuccess } from 'utils';
import moment from 'jalali-moment';
import { jalali } from '../../../../utils';
// @ts-ignore
import jalaali from 'jalaali-js';
import { ListOptions } from '../../../public/auto-complete/AutoComplete';
import styled from 'styled-components';
import CDialog from 'components/public/dialog/Dialog';
import { ColorEnum } from 'enum';
import Calculator from '../calculator/Calculator';
import SupplyListFilter, { Option } from './SupplyListFilter';
import { FilterItems } from './types';
import { StyledFilterWrapper } from './styles';
import { useStyle } from './style';
import { ToastDurationEnum } from 'utils/toast';
import { ErrorToastId } from 'services/api/Api';

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
      console.warn(`Action type: ${type} not defined`);
  }
}

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

const StyledTitle = styled.span`
  color: #17a2bb;
  font-size: 12px;
`;

const StyledDialogContent = styled((props) => <DialogContent {...props} />)`
  scroll-behavior: smooth;
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
  const [isCalculatingPrice, setIsCalculatingPrice] = useState<boolean>(false);

  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);
  const [isWrongDate, setIsWrongDate] = useState(false);
  const [hasMinimumDate, setHasMinimumDate] = useState(true);
  const [showError, setShowError] = useState(false);
  const [offerAlert, setOfferAlert] = useState<boolean>(false);
  const [selectedFilterItem, setSelectedFilterItem] = useState<string>(
    FilterItems.NEAREST_EXPIRE_DATE
  );

  const theme = useTheme();

  const monthRef = useRef<any>();
  const yearRef = useRef<any>();
  const batchRef = useRef<any>();
  const autoCompleteRef = useRef<any>();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const queryCache = useQueryCache();

  const [isOpenCalculator, setIsOpenCalculator] = useState<boolean>(false);
  const toggleIsOpenCalculator = (calculatingPrice: boolean): void => {
    setCalculatedValue(0);
    setIsCalculatingPrice(calculatingPrice);
    setIsOpenCalculator((v) => !v);
    // if (isOpenCalculator) {
    //   window.history.back();
    // }
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
    calculator,
    calcCloseBtn,
    calcContainer,
    importantMessage,
  } = useStyle();

  // useEffect(() => {
  //   const el = document.getElementById('scrollable-content') as HTMLElement;
  //   if (el !== null) {
  //     const scrollHeight = el.scrollHeight;
  //     const interval = setInterval(() => {
  //       if (el.scrollTop < scrollHeight) {
  //         el.scrollTop = el.scrollTop + 4;
  //       }

  //       if (el.scrollTop === scrollHeight) {
  //         clearInterval(interval);
  //       }
  //     }, 50);
  //   }
  // }, [comissionPercent, daroogRecommendation]);

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

  // useEffect(() => {
  //   (async (): Promise<any> => {
  //     try {
  //       const { offer1, offer2, amount, cnt } = state;
  //       // @ts-ignore
  //       const { value: drugId } = selectedDrug;
  //       if ((offer1 !== '' && offer2 !== '' && Number(cnt) > 0) || (drugId && Number(amount) > 0)) {
  //         if (Number(offer1) > 0 && Number(offer2) > 0) {
  //           setOfferAlert(true);
  //         }
  //         const result = await getComissionAndRecommendation({
  //           drugId,
  //           price: state?.amount,
  //           offer1: state?.offer1,
  //           offer2: state?.offer2,
  //           expireDate: isoDate,
  //           pharmacyId: '0',
  //         });
  //         const { data } = result;
  //         if (has(data, 'commissionPercent')) {
  //           setComissionPercent(data.commissionPercent);
  //         }
  //         if (has(data, 'suggestionStr')) {
  //           setDaroogRecommendation(data.suggestionStr);
  //         }
  //       }
  //     } catch (e) {
  //       errorHandler(e);
  //     }
  //   })();
  // }, [selectedDrug, state?.amount, state?.offer1, state?.offer2, state?.cnt, isoDate]);

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
    setOfferAlert(false);

    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setInputValue('');
    }
  };

  const toggleIsOpenModalOfNewList = (): void => {
    // if (isOpenModalOfNewList) {
    //   resetStates();
    // }
    setIsOpenModalOfNewList((v) => !v);
  };

  const callAllPharmacyDrugs = () => {
    if (selectedFilterItem === FilterItems.MAXIMUM_INVENTORY) {
      return allPharmacyDrug('desc', 'cnt');
    }

    if (selectedFilterItem === FilterItems.MINIMUM_INVENTORY) {
      return allPharmacyDrug('asc', 'cnt');
    }

    if (selectedFilterItem === FilterItems.NEAREST_EXPIRE_DATE) {
      return allPharmacyDrug('asc', 'expireDate');
    }

    if (selectedFilterItem === FilterItems.NEAREST_REGISTER_DATE) {
      return allPharmacyDrug('desc', 'date');
    }

    if (selectedFilterItem === FilterItems.FARTHEST_REGISTER_DATE) {
      return allPharmacyDrug('asc', 'date');
    }

    return allPharmacyDrug('desc', 'expireDate');
  };

  const { data, isFetched, isLoading: isLoadingPharmacyDrugs } = useQuery(
    [AllPharmacyDrug.GET_ALL_PHARMACY_DRUG, selectedFilterItem],
    () => callAllPharmacyDrugs()
  );

  const [_savePharmacyDrug] = useMutation(savePharmacyDrug, {
    onSuccess: () => {
      if (isCheckedNewItem) {
        resetStates();
      } else {
        toggleIsOpenModalOfNewList();
        resetStates();
      }
      // autoCompleteRef.current.setInputValue = '';
      tSuccess(t('alert.successfulSave'));
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
              <div className="text-muted txt-sm no-farsi-number">{`${
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
    // dispatch({ type: 'batchNO', value: batchNO })
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
    if (isFetched) {
      if (filteredItems.length > 0) {
        items = filteredItems.map((item: AllPharmacyDrugInterface) => {
          return (
            <Grid item spacing={3} xs={12} sm={12} md={4} xl={4} key={item.id}>
              <CardContainer editHandler={(): Promise<any> => editHandler(item)} drug={item} />
            </Grid>
          );
        });
      } else {
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

  const memoItems = useMemo(() => displayHandler(), [data, filteredItems, selectedFilterItem]);

  const selectedCalculaterValueHandler = (v: number): void => {
    setCalculatedValue(v);
  };

  const formHandler = async (): Promise<any> => {
    if (
      selectedYear.trim() === '' ||
      selectedMonth.trim() === '' ||
      !monthIsValid(Number(selectedMonth)) ||
      !dayIsValid(Number(selectedDay)) ||
      selectedYear.length < 4 ||
      isWrongDate ||
      !hasMinimumDate ||
      // state?.batchNO === ''
      state?.cnt === '' ||
      state?.amount === ''
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
    if (!isNil(selectedDrug)) {
      state.drugID = selectedDrug?.value;
      await _savePharmacyDrug(state);
      setCalculatedValue(0);
    } else {
      tError(t('error.save'), {
        autoClose: ToastDurationEnum.Long,
        position: 'bottom-right',
        toastId: ErrorToastId.ERR_500,
      });
    }
  };

  const filterListItems = (): Option[] => [
    {
      value: FilterItems.MAXIMUM_INVENTORY,
      text: `${t('general.maximum')} ${t('general.inventory')}`,
    },
    {
      value: FilterItems.MINIMUM_INVENTORY,
      text: `${t('general.minimum')} ${t('general.inventory')}`,
    },
    {
      value: FilterItems.NEAREST_EXPIRE_DATE,
      text: `${t('general.nearest')} ${t('general.expireDate')}`,
    },
    {
      value: FilterItems.FARTHEST_EXPIRE_DATE,
      text: `${t('general.farthest')} ${t('general.expireDate')}`,
    },
    {
      value: FilterItems.NEAREST_REGISTER_DATE,
      text: `${t('general.nearest')} ${t('date.registerDate')}`,
    },
    {
      value: FilterItems.FARTHEST_REGISTER_DATE,
      text: `${t('general.farthest')} ${t('date.registerDate')}`,
    },
  ];

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
            <Grid item xs={6} md={2}>
              <SearchButton variant="text" onClick={(): void => setFilteredItems([])}>
                {t('general.displayList', { var: t('general.primitive') })}
              </SearchButton>
            </Grid>
          )}

          <StyledFilterWrapper item xs={12} md={5} isSmallScreen={fullScreen}>
            <Grid container alignItems="center">
              <Grid item xs={4} sm={3} md={4} lg={3}>
                {t('general.sortWith')}
              </Grid>

              <Grid item xs={8} sm={9} md={8}>
                <SupplyListFilter
                  onChange={(e): void => setSelectedFilterItem(e.target.value as string)}
                  value={selectedFilterItem}
                  valuesArray={filterListItems()}
                  label={t('general.sortWith')}
                />
              </Grid>
            </Grid>
          </StyledFilterWrapper>
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

      {isOpenCalculator && (
        <div className={calculator}>
          <Grid container className={calcContainer}>
            <Grid item xs={12}>
              <Calculator setCalculatedValue={selectedCalculaterValueHandler} />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                background: 'white',
                padding: 8,
              }}
            >
              <Button
                variant="outlined"
                className={calcCloseBtn}
                type="button"
                disabled={isLoading ?? false}
                onClick={() => {
                  setIsOpenCalculator(false);
                }}
              >
                {t('general.close')}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}

      <CDialog
        fullScreen={fullScreen}
        isOpen={isOpenModalOfNewList}
        onClose={(): void => {
          setIsOpenModalOfNewList(false);
          setCalculatedValue(0);
          resetStates();
          setSelectedDrug(null);
          setIsOpenCalculator(false);
        }}
        onOpen={(): void => {
          setIsOpenModalOfNewList(true);
          setCalculatedValue(0);
        }}
        formHandler={formHandler}
        fullWidth
        disableBackdropClick={true}
      >
        <DialogTitle className="text-sm">
          <Grid container>
            <Grid item xs={12}>
              <span style={{ fontSize: '12px !important' }}>افزودن محصول به لیست عرضه</span>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* {comissionPercent !== '' && (
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <span
                    style={{
                      fontSize: '13px !important',
                      color: 'white',
                      background: 'green',
                      textAlign: 'center',
                    }}
                  >{`${t('general.daroogComission')}: ${comissionPercent}%`}</span>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            )} */}
          </Grid>
        </DialogTitle>
        <StyledDialogContent id="scrollable-content">
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
                    defaultSelectedItem={state.id === 0 ? '' : selectedDrug?.label}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} className={sectionContainer}>
                <Grid container>
                  <Grid item xs={12}>
                    <StyledTitle>{t('alerts.countAlert')}</StyledTitle>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={7} md={8}>
                      <Input
                        numberFormat
                        error={showError && state?.cnt === ''}
                        placeholder={`${t('general.number')} ${t('general.inNumber')}`}
                        className="w-100"
                        valueLimit={(value) => {
                          if (value.value > 0 || value.value === '') {
                            return value;
                          }
                        }}
                        label={`${t('general.number')} ${t('drug.drug')}`}
                        onChange={(e): void => dispatch({ type: 'cnt', value: e })}
                        value={
                          calculatedValue === 0
                            ? state?.cnt
                            : !isCalculatingPrice
                            ? calculatedValue
                            : state.cnt
                        }
                      />
                    </Grid>
                    <Grid item xs={2} md={1} className={importantMessage}>
                      <span>{t('general.num')}</span>
                    </Grid>
                    <Grid item xs={3}>
                      <Button onClick={() => toggleIsOpenCalculator(false)}>
                        <FontAwesomeIcon
                          style={{ color: ColorEnum.DeepBlue, margin: 4 }}
                          icon={faCalculator}
                        />
                        {t('general.calculating')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container xs={12} className={sectionContainer}>
                <Grid xs={12} item>
                  <StyledTitle>{t('alerts.priceTypeAlert')}</StyledTitle>
                </Grid>
                <Grid item container>
                  <Grid item xs={7} md={8}>
                    <Input
                      placeholder={`${t('general.pricePerUnit')} (${t('general.defaultCurrency')})`}
                      numberFormat
                      error={showError && state?.amount === ''}
                      value={
                        calculatedValue === 0
                          ? state?.amount
                          : isCalculatingPrice
                          ? calculatedValue
                          : state?.amount
                      }
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
                  <Grid item xs={2} md={1} className={importantMessage}>
                    <span>تومان</span>
                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={() => toggleIsOpenCalculator(true)}>
                      <FontAwesomeIcon
                        style={{ color: ColorEnum.DeepBlue, margin: 4 }}
                        icon={faCalculator}
                      />
                      {t('general.calculating')}
                    </Button>
                  </Grid>
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
                  {offerAlert && (
                    <Grid xs={12}>
                      <span style={{ color: '#17A2B8', fontSize: 12 }}>
                        {t('alerts.offerAlertFirstPart')}
                        <span style={{ color: 'red', fontSize: 13, fontWeight: 'bold' }}>
                          {Number(state?.cnt) +
                            Math.floor(
                              (Number(state?.cnt) / Number(state?.offer2)) * Number(state?.offer1)
                            )}
                        </span>
                        {t('alerts.offerAlertSecondPart')}
                      </span>
                    </Grid>
                  )}
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
                          setSelectedDay(val);
                        }
                        if (val.length === 2) {
                          monthRef.current.focus();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Input
                      type="number"
                      ref={monthRef}
                      value={selectedMonth}
                      label={t('general.month')}
                      required
                      error={(selectedMonth === '' && showError) || Number(selectedMonth) > 12}
                      // placeholder={'08'}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedMonth.length < 2 || val.length < 2) {
                          setSelectedMonth(val);
                        }
                        if (val.length === 2) {
                          yearRef.current.focus();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Input
                      type="number"
                      ref={yearRef}
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
                        // if (val.length === 4) {
                        //   batchRef.current.focus()
                        // }
                      }}
                    />
                  </Grid>

                  <Grid item xs={3} className={expireDate}>
                    {daysDiff !== '' && !isNaN(Number(daysDiff)) && <span>{daysDiff} روز</span>}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p className="text-danger txt-xs">
                    {isWrongDate && t('date.afterToday')}
                    {!hasMinimumDate &&
                      t('date.minimumDate', {
                        day: drugExpireDay,
                      })}
                    {isNaN(Number(daysDiff)) && t('date.wrongDate')}
                  </p>
                </Grid>
              </Grid>

              {/* <Grid item className={sectionContainer} xs={12}>
                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <span style={{ color: '#17A2B8', fontSize: 12 }}>
                      وارد کردن بچ نامبر برای ثبت محصول الزامی میباشد
                    </span>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      required
                      ref={batchRef}
                      error={state?.batchNO === '' && showError}
                      className="w-100"
                      label={t('general.batchNumber')}
                      value={state?.batchNO}
                      onChange={(e): void => dispatch({ type: 'batchNO', value: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid> */}

              {daroogRecommendation !== '' && (
                <Grid item xs={12}>
                  <FieldSetLegend className={fieldset} legend="پیشنهاد داروگ">
                    <span>{daroogRecommendation}</span>
                  </FieldSetLegend>
                </Grid>
              )}
            </Grid>
          </DialogContentText>
        </StyledDialogContent>
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
      <BackDrop isOpen={isOpenBackDrop || isLoadingPharmacyDrugs} />
    </>
  );
};

export default SupplyList;

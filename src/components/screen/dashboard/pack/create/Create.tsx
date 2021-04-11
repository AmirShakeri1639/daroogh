import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  makeStyles,
  createStyles,
  FormControl,
  Hidden,
  Fab,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
} from '@material-ui/core';
import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { faPlus, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Category, Comission, Drug, Pack } from '../../../../../services/api';
import { AutoComplete, BackDrop, DatePicker, MaterialContainer, Modal } from '../../../../public';
import { omit, remove, has, debounce, isUndefined } from 'lodash';
import Input from '../../../../public/input/Input';
import CardContainer from './CardContainer';
import { useEffectOnce } from '../../../../../hooks';
import { errorHandler, Convertor, jalali, warningSweetAlert } from '../../../../../utils';
import { utils } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import { PharmacyDrugSupplyList } from '../../../../../model/pharmacyDrug';
import { useParams } from 'react-router-dom';
import { DrugType } from '../../../../../enum/pharmacyDrug';
import Calculator from '../../calculator/Calculator';

// @ts-ignore
import jalaali from 'jalaali-js';
import FieldSetLegend from '../../../../public/fieldset-legend/FieldSetLegend';
import routes from '../../../../../routes';
import { SearchDrugInCategory, SearchDrugInMultiCategory } from '../../../../../interfaces/search';
import { PackCreation } from 'model/pack';
import { ListOptions } from '../../../../public/auto-complete/AutoComplete';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { ColorEnum } from 'enum';
import CDialog from 'components/public/dialog/Dialog';
import { setConstantValue } from 'typescript';

const GridCenter = styled((props) => <Grid item {...props} />)`
  text-align: center;
`;

const { searchDrugInMultipleCategory } = new Drug();

const { getAllCategories } = new Category();

const { savePack, getPackDetail } = new Pack();

const { getComissionAndRecommendation } = new Comission();

const { numberWithZero, thousandsSeperatorFa } = Convertor;

const { drugExpireDay } = JSON.parse(localStorage.getItem('settings') ?? '{}');

const useStyle = makeStyles((theme) =>
  createStyles({
    fieldset: {
      borderColor: '#f5f5f5',
      borderRadius: 10,
      color: '#6d6d6d',
      marginTop: 20,
      '& legend': {
        color: '#7e7e7e',
      },
    },
    addButton: {
      minHeight: 175,
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
    cancelButton: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2),
      maxWidth: 600,
    },
    expireDate: {
      display: 'flex',
      alignItems: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: 400,
      margin: theme.spacing(4),
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
    contentContainer: {
      marginTop: theme.spacing(2),
    },
    countContainer: {
      height: '100%',
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
    fab2: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: 'blue ',
    },
    formContainer: {
      padding: theme.spacing(2),
      borderLeft: '3px solid blue',
      height: '120px',
      backgroundColor: '#f4f3f7',
      paddingTop: '8px',
      margin: theme.spacing(3),
    },
    sectionContainer: {
      background: '#fafafa',
      borderLeft: `1px solid ${ColorEnum.Borders}`,

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

const monthMinimumLength = 28;

const monthIsValid = (month: number): boolean => month < 13;
const dayIsValid = (day: number): boolean => day < 32;

const StyledGrid = styled((props: any) => <Grid {...props} item xs={12} spacing={3} />)`
  margin: 24px 24px 0px 0px;
`;

const Create: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('-1');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState<any>('');
  const [amount, setAmount] = useState<string>('');
  const [number, setNumber] = useState<string | number>('');
  const [offer1, setOffer1] = useState<string>('');
  const [offer2, setOffer2] = useState<string>('');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [daysDiff, setDaysDiff] = useState<string>('');
  const [isoDate, setIsoDate] = useState<string>('');
  const [temporaryDrugs, setTemporaryDrugs] = useState<PharmacyDrugSupplyList[]>([]);
  const [isBackdropLoading, setIsBackdropLoading] = useState<boolean>(false);
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);
  const [packTotalItems, setPackTotalItems] = useState<number>(0);
  const [packStatus, setPackStatus] = useState<number>(1);
  const [packTotalPrice, setPackTotalPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isWrongDate, setIsWrongDate] = useState(false);
  const [daroogRecommendation, setDaroogRecommendation] = useState<string>('');
  const [comissionPercent, setComissionPercent] = useState<string>('');
  const [hasMinimumDate, setHasMinimumDate] = useState(true);
  const [drugsPack, setDrugsPack] = useState<PharmacyDrugSupplyList[]>([]);
  const [storedPackId, setStoredPackId] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();

  const [isOpenCalculator, setIsOpenCalculator] = useState<boolean>(false);
  const toggleIsOpenCalculator = (): void => {
    setIsOpenCalculator((v) => !v);
    if (isOpenCalculator) {
      window.history.back();
    }
  };

  const { packId } = useParams() as { packId: string };

  const autoCompleteRef = useRef<any>(null);

  const dayRef = useRef<HTMLInputElement>();
  const monthRef = useRef<HTMLInputElement>();
  const yearRef = useRef();

  const {
    addButton,
    expireDate,
    label,
    submitBtn,
    cancelButton,
    fieldset,
    fab,
    sectionContainer,
    input,
    formContainer,
  } = useStyle();

  const resetValues = (): void => {
    setAmount('');
    setNumber('');
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedDay('');
    setSelectedDrug('');
    setOffer1('');
    setOffer2('');
    setIsoDate('');
    setDaysDiff('');
    setSelectedDate('');
    setOptions([]);
    setIsWrongDate(false);
    setShowError(false);
    setHasMinimumDate(true);

    if (autoCompleteRef && autoCompleteRef.current) {
      autoCompleteRef.current.setInputValue('');
    }
  };

  const isJalaliDate = (num: number): boolean => num < 2000;

  const calculateDateDifference = (): void => {
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
      calculateDateDifference();
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    (async (): Promise<any> => {
      try {
        // @ts-ignore
        const { value: drugId } = selectedDrug;
        if (
          (Number(offer1) > 0 && Number(offer2) > 0 && Number(number) > 0) ||
          (drugId && Number(amount) > 0)
        ) {
          const result = await getComissionAndRecommendation({
            drugId,
            price: amount,
            offer1: offer1,
            offer2: offer2,
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
  }, [selectedDrug, amount, offer1, offer2, number, isoDate]);

  const toggleIsOpenModal = (): void => {
    console.log('category', selectedCategory);
    if (selectedCategory === '-1') {
      warningSweetAlert(t('alerts.SelectCategoryAlert'));
    } else {
      if (isOpenModal) {
        resetValues();
      }
      setIsOpenModal((v) => !v);
    }
  };

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);

  const mapApiDrugsToStandardDrugs = (items: any): PharmacyDrugSupplyList[] => {
    return items.map((item: any) => {
      return {
        ...omit(item, ['drug', 'packCategoryName', 'packID', 'packName']),
        drugID: {
          value: item.drug.id,
          label: item.drug.name,
        },
      };
    });
  };

  const getTotalPrice = (items: any[]): number => {
    let totalPrice = 0;
    items.forEach((item: any) => {
      totalPrice += item.amount * item.cnt;
    });
    return totalPrice;
  };

  async function getPackDrugs(_packId?: number): Promise<any> {
    if (packId !== undefined || _packId !== undefined) {
      try {
        setIsBackdropLoading(true);

        const result = await getPackDetail(packId !== undefined ? packId : _packId || 0);

        const { pharmacyDrug, status } = result;

        setPackTotalItems(pharmacyDrug.length);
        setPackStatus(status);
        setSelectedCategory(result.category !== null ? result.category.id : '-1');
        setDrugsPack([...mapApiDrugsToStandardDrugs(pharmacyDrug)]);

        setPackTotalPrice(getTotalPrice(pharmacyDrug));
        setIsBackdropLoading(false);
      } catch (e) {
        errorHandler(e);
      }
    }
  }

  useEffect(() => {
    if (packId !== undefined) {
      setStoredPackId(Number(packId));
    }
    getPackDrugs();
  }, [packId]);

  const [_savePack] = useMutation(savePack, {
    onSuccess: async (data) => {
      if (packId === undefined) {
        setSelectedCategory('');
      }
      if (storedPackId === null) {
        setStoredPackId(data.data.packID);
      }
      setIsBackdropLoading(false);

      if (isCheckedNewItem) {
        resetValues();
      } else {
        setIsOpenModal(false);
        resetValues();
      }

      await getPackDrugs(data.data.packID);
      enqueueSnackbar(t('alert.done'), {
        variant: 'success',
      });
    },
    onError: () => {
      setIsBackdropLoading(false);
    },
  });

  useEffectOnce(() => {
    (async (): Promise<any> => {
      try {
        const result = await getAllCategories(0, 99);
        setCategories(result.items);
      } catch (e) {
        errorHandler(e);
      }
    })();
  });

  const submition = async (data: any): Promise<void> => {
    const packData: PackCreation = {
      id: packId !== undefined ? packId : storedPackId !== null ? storedPackId : 0,
      categoryID: selectedCategory,
      // name: packTitle,
      name: '',
      pharmacyDrug: data as PharmacyDrugSupplyList[],
    };

    if (selectedCategory === '-1') {
      delete packData.categoryID;
    }

    await _savePack(packData);
  };

  const mapDrugsPackToApi = (_drugsPack: any[]): any[] => {
    let items: any[] = [];
    if (_drugsPack.length > 0) {
      items = _drugsPack.map((item) => {
        if (has(item.drugID, 'value')) {
          return {
            ...omit(item, 'id'),
            drugID: item.drugID.value,
          };
        }
        return item;
      });

      return items;
    }

    return [];
  };

  const removeHandler = async (drugId: number): Promise<void> => {
    if (window.confirm(t('alert.remove'))) {
      remove(drugsPack, (item) => item.drugID.value === drugId);
      try {
        await submition(mapDrugsPackToApi(drugsPack));
        setDrugsPack([...drugsPack]);
      } catch (e) {
        errorHandler(e);
      }
    }
  };

  const contentHandler = (): JSX.Element[] | null => {
    if (drugsPack.length > 0) {
      return drugsPack.map((item) => {
        return (
          <Grid item xs={12} md={4}>
            <CardContainer status={packStatus} item={item} removeHandler={removeHandler} />
          </Grid>
        );
      });
    }

    return null;
  };

  const memoContent = useMemo(() => contentHandler(), [drugsPack]);

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
      const data: SearchDrugInMultiCategory = {
        categoryId: 0,
        name: title,
      };

      if (selectedCategory !== '-1' && !isUndefined(selectedCategory)) {
        data.categoryId = Number(selectedCategory);
      }

      const result = await searchDrugInMultipleCategory(data);

      setIsLoading(false);

      const optionsList = result.map((_item: any) => ({
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

  const itemsGenerator = (): JSX.Element[] => {
    return categories.map((item) => {
      const { id, name } = item;
      return (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      );
    });
  };

  const isValidInputs = (): boolean => {
    return (
      amount !== '' &&
      number !== '' &&
      selectedDrug.hasOwnProperty('value') &&
      selectedYear !== '' &&
      selectedMonth !== '' &&
      selectedYear.length === 4
    );
  };

  const getNewDrugData = (): PharmacyDrugSupplyList => {
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

    const data: PharmacyDrugSupplyList = {
      amount: Number(amount),
      cnt: Number(number),
      drugID: selectedDrug,
      expireDate: date,
      offer1: offer1 !== '' ? Number(offer1) : 0,
      offer2: offer2 !== '' ? Number(offer2) : 0,
      id: 0,
      batchNO: '',
    };

    return data;
  };

  const selectedCalculaterValueHandler = (v: number): void => {
    setCalculatedValue(v);
  };
  const formHandler = async (): Promise<any> => {
    try {
      if (!isValidInputs() || selectedCategory === '' || isWrongDate || !hasMinimumDate) {
        setShowError(true);
        return;
      }

      setIsBackdropLoading(true);

      const items: any[] = mapDrugsPackToApi(drugsPack);

      const data: PharmacyDrugSupplyList[] = [
        ...items,
        {
          ...omit(getNewDrugData(), 'id'),
          drugID: getNewDrugData().drugID.value,
        },
      ];

      await submition(data);
      setCalculatedValue(0);
    } catch (e) {
      errorHandler(e);
    }
  };

  useEffect(() => {
    setPackTotalItems(temporaryDrugs.length);
    setPackTotalPrice(getTotalPrice(temporaryDrugs));
  }, [temporaryDrugs]);

  return (
    <MaterialContainer>
      <StyledGrid>
        <span>
          ابتدا یک دسته بندی برای پک انتخاب نمایید و سپس اقلام مورد نظر خود را اضافه نمایید . اقلامی
          که به صورت پک ثبت مینمایید در تبادل٬ با هم و با قیمت و تعداد غیر قابل تغییر توسط طرف مقابل
          عرضه میشود{' '}
        </span>
      </StyledGrid>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} className={formContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl variant="outlined" size="small" className="w-100">
                    <InputLabel id="category-pack">{t('pack.category')}</InputLabel>
                    <Select
                      labelId="category-pack"
                      id="category"
                      label={t('pack.category')}
                      placeholder={t('pack.category')}
                      className="w-100"
                      value={selectedCategory}
                      onChange={(e): void => {
                        setSelectedCategory(e.target.value as string);
                      }}
                      disabled={drugsPack.length > 0}
                    >
                      {/* <MenuItem value="-1">همه دسته ها</MenuItem> */}
                      {itemsGenerator()}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className="text-left">
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item spacing={1} xs={12} sm={12} md={6} lg={6}>
                      <TextWithTitle title="تعداد کل اقلام" body={packTotalItems} suffix="قلم" />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={12} md={6} lg={6}>
                      <TextWithTitle
                        title="مجموع قیمت اقلام"
                        body={thousandsSeperatorFa(packTotalPrice)}
                        suffix={t('general.defaultCurrency')}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {packStatus == 1 && (
          <Fragment>
            <Hidden xsDown>
              <Grid item xs={12} sm={12} md={4} xl={4}>
                <Paper className={addButton} onClick={toggleIsOpenModal}>
                  <FontAwesomeIcon icon={faPlus} size="2x" />
                  <span>{t('pack.add')}</span>
                </Paper>
              </Grid>
            </Hidden>

            <Hidden smUp>
              <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
                <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
              </Fab>
            </Hidden>
          </Fragment>
        )}

        {memoContent}
      </Grid>

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
        isOpen={isOpenModal}
        onClose={(): void => {
          setIsOpenModal(false);
          setCalculatedValue(0);
          resetValues();
          setSelectedDrug(null);
        }}
        onOpen={(): void => {
          setIsOpenModal(true);
          setCalculatedValue(0);
        }}
        formHandler={formHandler}
        fullWidth
      >
        <DialogTitle className="text-sm">{'افزودن دارو به پک'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12} className={sectionContainer}>
                <AutoComplete
                  ref={autoCompleteRef}
                  isLoading={isLoading}
                  options={options}
                  className="w-100"
                  placeholder={t('drug.name')}
                  loadingText={t('general.loading')}
                  onChange={debounce((e) => searchDrugs(e.target.value), 500)}
                  onItemSelected={(item): void => setSelectedDrug(item[0])}
                  defaultSelectedItem=""
                />
              </Grid>

              <Grid item container xs={12} className={sectionContainer}>
                <Input
                  placeholder={`${t('general.number')}`}
                  numberFormat
                  className="w-100"
                  label={`${t('general.number')} ${t('drug.drug')}`}
                  onChange={(e): void => {
                    setNumber(e);
                  }}
                  value={number}
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
                    value={calculatedValue === 0 ? amount : calculatedValue}
                    className="w-100"
                    label={t('general.price')}
                    onChange={(e): void => {
                      setAmount(e);
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
                      className={input}
                      type="number"
                      value={offer2}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (Number(val) >= 1 || Number(offer2) >= 1) {
                          setOffer2(e.target.value);
                        }
                      }}
                    />
                    <span>تا</span>

                    <Input
                      className={input}
                      type="number"
                      value={offer1}
                      placeholder="تعداد"
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (Number(val) >= 1 || Number(offer1) >= 1) {
                          setOffer1(e.target.value);
                        }
                      }}
                    />
                    {t('general.gift')}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container className={sectionContainer} xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <span style={{ marginBottom: 8 }}>{t('general.expireDate')}</span>{' '}
                    <span style={{ color: '#17A2B8', fontSize: 10 }}>
                      (وارد کردن روز اجباری نیست)
                    </span>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={3}>
                    <Input
                      ref={dayRef}
                      label={t('general.day')}
                      value={selectedDay}
                      error={!dayIsValid(Number(selectedDay))}
                      type="number"
                      placeholder={'22'}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedDay.length < 2 || val.length < 2) {
                          setSelectedDay(e.target.value);
                          if (selectedDay.length === 2) {
                            // TODO: under development
                            monthRef?.current?.focus();
                          }
                        }
                      }}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={4} sm={3}>
                    <Input
                      ref={monthRef}
                      value={selectedMonth}
                      label={t('general.month')}
                      required
                      placeholder={'08'}
                      type="number"
                      error={(selectedMonth === '' && showError) || Number(selectedMonth) > 12}
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
                      ref={yearRef}
                      value={selectedYear}
                      required
                      type="number"
                      label={t('general.year')}
                      error={selectedYear === '' && showError}
                      placeholder={'1401/2022'}
                      onChange={(e): void => {
                        const val = e.target.value;
                        if (selectedYear.length < 4 || val.length < 4) {
                          setSelectedYear(e.target.value);
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
                <span className="txt-sm">سال وارد شده 4 رقمی و به صورت میلادی یا شمسی باشد</span>
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
                <span>{t('alerts.reloadModalToEnterNewDrug')}</span>
              </label>
            </Grid>
            {/* 
            <Grid container xs={12}>
              <Grid item xs={7} sm={8} />
              <Grid item xs={2} sm={2}>
                <Button type="button" onClick={toggleIsOpenModal} className={cancelButton}>
                  {t('general.close')}
                </Button>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button
                  className={submitBtn}
                  type="button"
                  onClick={formHandler}
                  disabled={isBackdropLoading}
                >
                  {isBackdropLoading ? t('general.pleaseWait') : t('general.add')}
                </Button>
              </Grid>
</Grid>*/}
          </Grid>
        </DialogActions>
      </CDialog>

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DatePicker
          minimumDate={utils('fa').getToday()}
          dateTypeIsSelectable
          selectedDateHandler={(e): void => {
            // calculateDateDifference(e, '/');
            setSelectedDate(e);

            toggleIsOpenDatePicker();
          }}
        />
      </Modal>

      <BackDrop isOpen={isBackdropLoading} />
    </MaterialContainer>
  );
};

export default Create;

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
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { faPlus, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Category, Comission, Drug, Pack } from '../../../../../services/api';
import {
  AutoComplete,
  BackDrop,
  DatePicker,
  MaterialContainer,
  Modal,
} from '../../../../public';
import { omit, remove, has, debounce, isUndefined } from 'lodash';
import Input from '../../../../public/input/Input';
import CardContainer from './CardContainer';
import { useEffectOnce } from '../../../../../hooks';
import {
  errorHandler,
  Convertor,
  jalali,
  successSweetAlert,
} from '../../../../../utils';
import { utils } from 'react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import { PharmacyDrugSupplyList } from '../../../../../model/pharmacyDrug';
import { useHistory, useParams } from 'react-router-dom';
import { DrugType } from '../../../../../enum/pharmacyDrug';
// @ts-ignore
import jalaali from 'jalaali-js';
import FieldSetLegend from '../../../../public/fieldset-legend/FieldSetLegend';
import routes from '../../../../../routes';
import { SearchDrugInCategory } from '../../../../../interfaces/search';
import { PackCreation } from 'model/pack';
import { ListOptions } from '../../../../public/auto-complete/AutoComplete';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';

const { packsList } = routes;

const { seerchDrugInCategory } = new Drug();

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
      display: 'flex',
      height: 172,
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #cecece',
      borderRadius: 10,
      flexDirection: 'column',
      '& button': {},
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
      right: 20,
      bottom: 140,
      left: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
    fab2: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 40,
      left: 'auto',
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
  })
);

const monthMinimumLength = 28;

const monthIsValid = (month: number): boolean => month < 13;
const dayIsValid = (day: number): boolean => day < 32;

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
  const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);
  const [temporaryDrugs, setTemporaryDrugs] = useState<
    PharmacyDrugSupplyList[]
  >([]);
  const [isBackdropLoading, setIsBackdropLoading] = useState<boolean>(false);
  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);
  const [packTotalItems, setPackTotalItems] = useState<number>(0);
  const [packTotalPrice, setPackTotalPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isWrongDate, setIsWrongDate] = useState(false);
  const [daroogRecommendation, setDaroogRecommendation] = useState<string>('');
  const [comissionPercent, setComissionPercent] = useState<string>('');
  const [hasMinimumDate, setHasMinimumDate] = useState(true);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = useTranslation();
  const { push } = useHistory();

  const { packId } = useParams() as { packId: string };

  const {
    addButton,
    modalContainer,
    expireDate,
    buttonContainer,
    label,
    submitBtn,
    cancelButton,
    fieldset,
    countContainer,
    fab,
    fab2,
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
    setHasMinimumDate(true);
  };

  const isJalaliDate = (num: number): boolean => num < 2000;

  const calculatDateDiference = (): void => {
    const date = new Date();
    const todayMomentObject = moment([
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ]);

    const convertedArray = [
      Number(selectedYear),
      Number(selectedMonth),
      Number(selectedDay === '' ? monthMinimumLength : selectedDay),
    ];

    let selectedDate: any;
    if (isJalaliDate(convertedArray[0])) {
      selectedDate = jalali.toGregorian(
        convertedArray[0],
        convertedArray[1],
        convertedArray[2]
      );
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

    const daysDiff = String(
      selectedDateMomentObject.diff(todayMomentObject, 'days')
    );

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
        ? `${selectedDate.gy}-${numberWithZero(
            selectedDate.gm
          )}-${numberWithZero(selectedDate.gd)}T00:00:00Z`
        : `${[
            Number(selectedYear),
            Number(selectedMonth) - 1,
            Number(selectedDay),
          ].join('-')}T00:00:00Z`
    );
  };

  useEffect(() => {
    if (
      selectedYear !== '' &&
      selectedYear.length === 4 &&
      selectedMonth !== ''
    ) {
      calculatDateDiference();
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
    if (isOpenModal) {
      resetValues();
    }
    setIsOpenModal((v) => !v);
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

  useEffect(() => {
    async function getPackDrugs(): Promise<any> {
      try {
        setIsBackdropLoading(true);
        const result = await getPackDetail(packId);
        const { name, pharmacyDrug } = result;

        setPackTotalItems(pharmacyDrug.length);
        setSelectedCategory(
          result.category !== null ? result.category.id : '-1'
        );

        setTemporaryDrugs(mapApiDrugsToStandardDrugs(pharmacyDrug));

        // let totalPrice = 0;
        // pharmacyDrug.forEach((item: any) => {
        //   totalPrice += item.amount;
        // });

        setPackTotalPrice(getTotalPrice(pharmacyDrug));
        setIsBackdropLoading(false);
      } catch (e) {
        errorHandler(e);
      }
    }

    if (packId !== undefined) {
      getPackDrugs();
    }
  }, [packId]);

  const [_savePack] = useMutation(savePack, {
    onSuccess: async () => {
      if (packId === undefined) {
        setSelectedCategory('');
      }
      setIsBackdropLoading(false);
      await successSweetAlert(t('alert.successfulCreateTextMessage'));
      push({
        pathname: packsList,
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

  const removeHandler = (drugId: number): void => {
    if (window.confirm(t('alert.remove'))) {
      remove(temporaryDrugs, (item) => item.drugID.value === drugId);
      setTemporaryDrugs([...temporaryDrugs]);
    }
  };

  const contentHandler = (): JSX.Element[] | null => {
    if (temporaryDrugs.length > 0) {
      return temporaryDrugs.map((item) => {
        return (
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <CardContainer item={item} removeHandler={removeHandler} />
          </Grid>
        );
      });
    }

    return null;
  };

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
      const data: SearchDrugInCategory = {
        name: title,
      };
      if (selectedCategory !== '-1' && !isUndefined(selectedCategory)) {
        data.categoryId = selectedCategory;
      }
      const result = await seerchDrugInCategory(data);

      const items = result.map((item: any) => ({
        value: item.id,
        label: `${item.name} (${item.genericName}) ${typeHandler(item.type)}`,
      }));
      // setSelectDrugForEdit(options.find((item) => item.id === selectedDrug));
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

  const formHandler = async (): Promise<any> => {
    try {
      if (
        temporaryDrugs.length === 0 ||
        selectedCategory === '' ||
        isWrongDate ||
        !hasMinimumDate
      ) {
        return;
      }
      setIsBackdropLoading(true);

      const intSelectedYear = Number(selectedYear);
      const intSelectedMonth = Number(selectedMonth);
      const intSelectedDay = Number(
        selectedDay === '' ? monthMinimumLength : selectedDay
      );
      let date = '';
      if (!isJalaliDate(intSelectedYear)) {
        date = `${intSelectedYear}-${numberWithZero(
          intSelectedMonth
        )}-${numberWithZero(intSelectedDay)}T00:00:00Z`;
      } else {
        const jalail2Gregorian = jalaali.toGregorian(
          intSelectedYear,
          intSelectedMonth,
          intSelectedDay
        );

        date = `${jalail2Gregorian.gy}-${numberWithZero(
          jalail2Gregorian.gm
        )}-${numberWithZero(jalail2Gregorian.gd)}T00:00:00Z`;
      }

      const data = temporaryDrugs.map((item) => ({
        ...omit(item, 'id'),
        drugID: item.drugID.value,
      }));

      const packData: PackCreation = {
        id: packId !== undefined ? packId : 0,
        categoryID: selectedCategory,
        // name: packTitle,
        name: '',
        pharmacyDrug: data as PharmacyDrugSupplyList[],
      };

      if (selectedCategory === '-1') {
        delete packData.categoryID;
      }

      await _savePack(packData);
    } catch (e) {
      errorHandler(e);
    }
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

  useEffect(() => {
    setPackTotalItems(temporaryDrugs.length);
    setPackTotalPrice(getTotalPrice(temporaryDrugs));
  }, [temporaryDrugs]);

  const addTemporaryHandler = (): void => {
    if (!isValidInputs()) {
      return;
    }

    const intSelectedYear = Number(selectedYear);
    const intSelectedMonth = Number(selectedMonth);
    const intSelectedDay = Number(
      selectedDay === '' ? monthMinimumLength : selectedDay
    );

    let date = '';
    if (!isJalaliDate(intSelectedYear)) {
      date = `${intSelectedYear}-${numberWithZero(
        intSelectedMonth
      )}-${numberWithZero(intSelectedDay)}T00:00:00Z`;
    } else {
      const jalail2Gregorian = jalaali.toGregorian(
        intSelectedYear,
        intSelectedMonth,
        intSelectedDay
      );

      date = `${jalail2Gregorian.gy}-${numberWithZero(
        jalail2Gregorian.gm
      )}-${numberWithZero(jalail2Gregorian.gd)}T00:00:00Z`;
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

    setTemporaryDrugs((v) => [...v, data]);

    if (isCheckedNewItem) {
      resetValues();
    } else {
      toggleIsOpenModal();
      resetValues();
    }
  };

  return (
    <MaterialContainer>
      <Grid item xs={12} spacing={3} style={{ margin: ' 24px 24px 0px 0px' }}>
        <span>
          ابتدا یک دسته بندی برای پک انتخاب نمایید و سپس اقلام مورد نظر خود را
          اضافه نمایید و در نهایت ثبت نمایید. اقلامی که به صورت پک ثبت مینمایید
          در تبادل٬ با هم و با قیمت و تعداد غیر قابل تغییر توسط طرف مقابل عرضه
          میشود{' '}
        </span>
      </Grid>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} className={formContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="w-100"
                  >
                    <InputLabel id="category-pack">
                      {t('pack.category')}
                    </InputLabel>
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
                    >
                      <MenuItem value="-1">همه دسته ها</MenuItem>
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
                      <TextWithTitle
                        title="تعداد کل اقلام"
                        body={packTotalItems}
                        suffix="قلم"
                      />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={12} md={6} lg={6}>
                      <TextWithTitle
                        title="مجموع قیمت اقلام"
                        body={thousandsSeperatorFa(packTotalPrice)}
                        suffix="تومان"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Hidden xsDown>
                  <Grid item xs={3}>
                    <Button
                      type="button"
                      onClick={formHandler}
                      className={submitBtn}
                    >
                      {isLoadingSave
                        ? t('general.pleaseWait')
                        : t('general.submit')}
                    </Button>
                  </Grid>
                </Hidden>

                <Hidden smUp>
                  <Fab onClick={formHandler} className={fab2} aria-label="add">
                    {isLoadingSave ? (
                      <FontAwesomeIcon
                        size="2x"
                        icon={faSpinner}
                        color="white"
                      />
                    ) : (
                      <FontAwesomeIcon size="2x" icon={faSave} color="white" />
                    )}
                  </Fab>
                </Hidden>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Hidden xsDown>
          <Grid item xs={12} sm={12} md={4} xl={4} className={addButton}>
            <Button variant="text" onClick={toggleIsOpenModal}>
              <FontAwesomeIcon icon={faPlus} />
              <span>{t('pack.add')}</span>
            </Button>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>

        {contentHandler()}
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenModal}
        onClose={toggleIsOpenModal}
      >
        <DialogTitle className="text-sm">{'افزودن دارو به پک'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <AutoComplete
                  isLoading={isLoading}
                  options={options}
                  className="w-100"
                  placeholder={t('drug.name')}
                  loadingText={t('general.loading')}
                  onChange={debounce((e) => searchDrugs(e.target.value), 500)}
                  onItemSelected={(item): void => setSelectedDrug(item[0])}
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
                      onChange={(e): void => {
                        setNumber(e);
                      }}
                      value={number}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label htmlFor="">{`${t('general.price')} (${t(
                      'general.rial'
                    )})`}</label>
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      numberFormat
                      value={amount}
                      className="w-100"
                      label={t('general.price')}
                      onChange={(e): void => {
                        setAmount(e);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12}>
                    <span>هدیه</span>
                    <span className="text-succes txt-xs">
                      (داروسازان می توانند هدیه ای در قبال محصول خود به داروساز
                      مقابل بدهند)
                    </span>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={0}
                    style={{ textAlign: 'center' }}
                    xs={12}
                  >
                    <Grid item xs={2}>
                      <span>به ازای</span>
                    </Grid>
                    <Grid item xs={10} className="w-100">
                      <Input
                        value={offer2}
                        label={t('general.number')}
                        onChange={(e): void => {
                          setOffer2(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <span>تا</span>
                    </Grid>
                    <Grid item xs={2}>
                      <Input
                        value={offer1}
                        onChange={(e): void => {
                          setOffer1(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {t('general.gift')}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="space-between"
                  >
                    <Grid item xs={1}>
                      <span>تا</span>
                    </Grid>
                    <Grid item xs={9}>
                      <Input
                        value={offer1}
                        label={t('general.number')}
                        onChange={(e): void => {
                          setOffer1(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <div className="text-left">{t('general.gift')}</div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <span style={{ marginBottom: 8 }}>
                      {t('general.expireDate')}
                    </span>{' '}
                    <span className="text-danger txt-xs">
                      (وارد کردن روز اجباری نیست)
                    </span>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Input
                      label={t('general.day')}
                      value={selectedDay}
                      error={!dayIsValid(Number(selectedDay))}
                      type="number"
                      onChange={(e): void => setSelectedDay(e.target.value)}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={3}>
                    <Input
                      value={selectedMonth}
                      label={t('general.month')}
                      required
                      type="number"
                      error={!monthIsValid(Number(selectedMonth))}
                      onChange={(e): void => setSelectedMonth(e.target.value)}
                    />
                  </Grid>
                  {/* <span style={{ alignSelf: 'center' }}>/</span> */}
                  <Grid item xs={3}>
                    <Input
                      value={selectedYear}
                      required
                      type="number"
                      label={t('general.year')}
                      onChange={(e): void => setSelectedYear(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={3} className={expireDate}>
                    {daysDiff !== '' && <span>{daysDiff} روز</span>}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {isWrongDate && (
                    <p className="text-danger txt-xs">{t('date.afterToday')}</p>
                  )}
                  {!hasMinimumDate && (
                    <p className="text-danger txt-xs">
                      {t('date.minimumDate', {
                        day: drugExpireDay,
                      })}
                    </p>
                  )}
                </Grid>
                {/* <Input
                readOnly
                onClick={toggleIsOpenDatePicker}
                value={selectedDate}
                className="w-100 cursor-pointer"
                label={t('general.expireDate')}
              /> */}
              </Grid>
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
                <span>
                  صفحه بعد از اضافه کردن دارو٬ جهت افزودن داروی جدید بسته
                  نشود
                </span>
              </label>
            </Grid>

            <Grid container xs={12}>
              <Grid item xs={7} sm={8} />
              <Grid item xs={2} sm={2}>
                <Button
                  type="button"
                  onClick={toggleIsOpenModal}
                  className={cancelButton}
                >
                  {t('general.close')}
                </Button>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Button
                  className={submitBtn}
                  type="button"
                  onClick={addTemporaryHandler}
                >
                  {t('general.add')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      {/* 
      <Modal open={isOpenModal} toggle={toggleIsOpenModal}>
       
      </Modal> */}

      <Modal open={isOpenDatePicker} toggle={toggleIsOpenDatePicker}>
        <DatePicker
          minimumDate={utils('fa').getToday()}
          dateTypeIsSelectable
          selectedDateHandler={(e): void => {
            // calculatDateDiference(e, '/');
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

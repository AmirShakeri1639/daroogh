import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Category, Drug, Pack } from '../../../../../services/api';
import {
  BackDrop,
  Button,
  DatePicker,
  MaterialContainer,
  Modal,
} from '../../../../public';
import { omit, remove } from 'lodash';
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
import { useParams } from 'react-router-dom';
import { DrugType } from '../../../../../enum/pharmacyDrug';
// @ts-ignore
import jalaali from 'jalaali-js';

const { searchDrug } = new Drug();

const { getAllCategories } = new Category();

const { savePack, getPackDetail } = new Pack();

const { numberWithZero, thousandsSeperatorFa } = Convertor;

const useStyle = makeStyles((theme) =>
  createStyles({
    addButton: {
      display: 'flex',
      height: 152,
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
    cancelButton: {
      marginRight: 10,
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
      marginTop: 15,
    },
    submitBtn: {
      height: 50,
      width: 100,
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
    contentContainer: {
      marginTop: theme.spacing(2),
    },
  })
);

const monthMinimumLength = 28;

const monthIsValid = (month: number): boolean => month < 13;
const dayIsValid = (day: number): boolean => day < 32;

const Create: React.FC = () => {
  const [packTitle, setPackTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState<any>('');
  const [amount, setAmount] = useState<string>('');
  const [number, setNumber] = useState<string | number>('');
  const [offer1, setOffer1] = useState<number>(0);
  const [offer2, setOffer2] = useState<number>(0);
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

  const { t } = useTranslation();

  const { packId } = useParams() as { packId: string };

  const {
    addButton,
    modalContainer,
    expireDate,
    buttonContainer,
    label,
    submitBtn,
    cancelButton,
  } = useStyle();

  const resetValues = (): void => {
    setAmount('');
    setNumber('');
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedDay('');
    setSelectedDrug('');
    setOffer1(0);
    setOffer2(0);
    setIsoDate('');
    setDaysDiff('');
    setSelectedDate('');
    setOptions([]);
    setIsWrongDate(false);
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
          id: item.drug.id,
          drugName: item.drug.name,
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
        const {
          name,
          category: { id: categoryId },
          pharmacyDrug,
        } = result;

        setPackTitle(name);
        setPackTotalItems(pharmacyDrug.length);
        setSelectedCategory(categoryId);

        setTemporaryDrugs(mapApiDrugsToStandardDrugs(pharmacyDrug));

        let totalPrice = 0;
        pharmacyDrug.forEach((item: any) => {
          totalPrice += item.amount;
        });

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
        setPackTitle('');
        setSelectedCategory('');
      }
      setIsBackdropLoading(false);
      await successSweetAlert(t('alert.successfulCreateTextMessage'));
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
      remove(temporaryDrugs, (item) => item.drugID.id === drugId);
      setTemporaryDrugs([...temporaryDrugs]);
    }
  };

  const contentHandler = (): JSX.Element[] | null => {
    if (temporaryDrugs.length > 0) {
      return temporaryDrugs.map((item) => {
        return (
          <Grid item xs={12} sm={6} md={4} xl={3}>
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
      const result = await searchDrug(title);

      const items = result.map((item: any) => ({
        id: item.id,
        drugName: `${item.name} (${item.genericName}) ${typeHandler(
          item.type
        )}`,
      }));
      // setSelectDrugForEdit(options.find((item) => item.id === selectedDrug));
      setIsLoading(false);
      setOptions(items);
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
        packTitle === '' ||
        selectedCategory === ''
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
        drugID: item.drugID.id,
      }));

      await _savePack({
        id: packId !== undefined ? packId : 0,
        categoryID: selectedCategory,
        name: packTitle,
        pharmacyDrug: data as PharmacyDrugSupplyList[],
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const isValidInputs = (): boolean => {
    return (
      amount !== '' &&
      number !== '' &&
      selectedDrug.hasOwnProperty('id') &&
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
      offer1: Number(offer1),
      offer2: Number(offer2),
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
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justify="space-between"
          >
            <h3>{t('pack.create')}</h3>

            <Button
              color="blue"
              type="button"
              onClick={formHandler}
              className={submitBtn}
            >
              {isLoadingSave ? t('general.pleaseWait') : t('general.submit')}
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Input
            className="w-100"
            label={t('pack.title')}
            value={packTitle}
            onChange={(e): void => setPackTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <InputLabel id="category">{t('pack.category')}</InputLabel>
          <Select
            labelId="category-id"
            id="category"
            placeholder={t('pack.category')}
            className="w-100"
            value={selectedCategory}
            onChange={(e): void =>
              setSelectedCategory(e.target.value as string)
            }
          >
            <MenuItem value="" />
            {itemsGenerator()}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <span>تعداد کل اقلام: {packTotalItems}</span>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <span>مجموع قیمت اقلام: {thousandsSeperatorFa(packTotalPrice)}</span>
        </Grid>

        <Grid item xs={12} sm={6} md={4} xl={3} className={addButton}>
          <Button variant="text" onClick={toggleIsOpenModal}>
            <FontAwesomeIcon icon={faPlus} />
            <span>{t('pack.addDrug')}</span>
          </Button>
        </Grid>

        {contentHandler()}
      </Grid>

      <Modal open={isOpenModal} toggle={toggleIsOpenModal}>
        <div className={modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                loading={isLoading}
                id="drug-list"
                noOptionsText={t('general.noData')}
                loadingText={t('general.loading')}
                options={options}
                value={selectedDrug}
                onChange={(event, value, reason): void => {
                  setSelectedDrug(value);
                }}
                getOptionLabel={(option: any) => option.drugName}
                onInputChange={(e, newValue) => searchDrugs(newValue)}
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={t('drug.name')}
                    variant="outlined"
                  />
                )}
              />
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
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <span>آفر</span>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Input
                    value={offer1}
                    label={t('general.number')}
                    onChange={(e): void => {
                      setOffer1(Number(e.target.value));
                    }}
                  />
                </Grid>
                <span>به</span>
                <Grid item xs={12} sm={3}>
                  <Input
                    value={offer2}
                    label={t('general.number')}
                    // className={offerInput}
                    onChange={(e): void => {
                      setOffer2(Number(e.target.value));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm>
                  <span className="txt-sm text-muted">
                    (به ازای هر <span className="txt-bold">{offer2}</span> خرید،{' '}
                    <span className="txt-bold">{offer1}</span> عدد رایگان)
                  </span>
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

          <Grid
            container
            justify="flex-end"
            spacing={0}
            className={buttonContainer}
          >
            <Button
              color="pink"
              type="button"
              onClick={toggleIsOpenModal}
              className={cancelButton}
            >
              {t('general.close')}
            </Button>

            <label htmlFor="add" className={`${label} cursor-pointer`}>
              <input
                id="add"
                type="checkbox"
                checked={isCheckedNewItem}
                onChange={(e): void => setIsCheckedNewItem(e.target.checked)}
              />
              <span>ثبت داروی جدید</span>
            </label>

            <Button color="blue" type="button" onClick={addTemporaryHandler}>
              {t('general.add')}
            </Button>
          </Grid>
        </div>
      </Modal>

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

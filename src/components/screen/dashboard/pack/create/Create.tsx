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
import { useMutation, useQuery } from 'react-query';
import { AllPharmacyDrug } from '../../../../../enum';
import {
  PharmacyDrug,
  Category,
  Drug,
  Pack,
} from '../../../../../services/api';
import {
  Button,
  DatePicker,
  MaterialContainer,
  Modal,
} from '../../../../public';
import { debounce, omit } from 'lodash';
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

const { searchDrug } = new Drug();

const { allPharmacyDrug } = new PharmacyDrug();

const { getAllCategories } = new Category();

const { savePack, getPackDetail } = new Pack();

const { numberWithZero } = Convertor;

const useStyle = makeStyles((theme) =>
  createStyles({
    addButton: {
      display: 'flex',
      height: 139,
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
  const [updateDrugList, setUpdateDrugList] = useState<boolean>(false);

  const [isCheckedNewItem, setIsCheckedNewItem] = useState<boolean>(false);

  const { t } = useTranslation();

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
    setSelectedDrug('');
    setOffer1('');
    setOffer2('');
    setIsoDate('');
    setDaysDiff('');
    setSelectedDate('');
    setOptions([]);
  };

  const toggleIsOpenModal = (): void => {
    if (isOpenModal) {
      resetValues();
    }
    setIsOpenModal((v) => !v);
  };

  const toggleIsOpenDatePicker = (): void => setIsOpenDatePicker((v) => !v);
  const toggleUpdateDrugList = (): void => setUpdateDrugList((v) => !v);

  useEffect(() => {
    async function getPackDrugs(): Promise<any> {
      try {
        // const result = await getPackDetail();
      } catch (e) {
        //
      }
    }

    getPackDrugs();
  }, [updateDrugList]);

  const [_savePack, { isLoading: isLoadingSavePack }] = useMutation(savePack, {
    onSuccess: async () => {
      // setTemporaryDrugs([]);
      setPackTitle('');
      setSelectedCategory('');
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

  const removeHandler = (item: number): void => {};

  const contentHandler = (): JSX.Element[] | null => {
    if (temporaryDrugs.length > 0) {
      return temporaryDrugs.map((item) => {
        console.log(item);
        return (
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <CardContainer item={item} removeHandler={removeHandler} />
          </Grid>
        );
      });
    }

    // if (!isLoadingFetchData && isFetched) {
    //   return data.items.map((item: any) => {
    //     return (
    //       <Grid item xs={12} sm={6} md={4} xl={3}>
    //         <CardContainer editHandler={() => {}} drug={item} />
    //       </Grid>
    //     );
    //   });
    // }

    return null;
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
        drugName: item.name,
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

  const formHandler = async (): Promise<any> => {
    try {
      if (
        temporaryDrugs.length === 0 ||
        packTitle === '' ||
        selectedCategory === ''
      ) {
        return;
      }
      const data = temporaryDrugs.map((item) => ({
        ...omit(item, 'id'),
        drugID: item.drugID.id,
      }));

      await _savePack({
        categoryID: selectedCategory,
        name: packTitle,
        pharmacyDrug: data as PharmacyDrugSupplyList[],
      });
    } catch (e) {
      //
    }
  };

  const isValidInputs = (): boolean => {
    return (
      amount !== '' &&
      number !== '' &&
      selectedDrug.hasOwnProperty('id') &&
      offer1 !== '' &&
      offer2 !== '' &&
      isoDate !== ''
    );
  };

  const addTemporaryHandler = (): void => {
    if (!isValidInputs()) {
      return;
    }

    const data: PharmacyDrugSupplyList = {
      amount: Number(amount),
      cnt: Number(number),
      drugID: selectedDrug,
      expireDate: isoDate,
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
          <span>تعداد کل اقلام: {0}</span>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <span>مجموع قیمت اقلام: {0}</span>
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
                  <label htmlFor="">{t('general.price')}</label>
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
                      setOffer1(e.target.value);
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
                      setOffer2(e.target.value);
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

            <Grid item xs={6} className={buttonContainer}>
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

            <label htmlFor="add" className={label}>
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
            calculatDateDiference(e, '/');
            setSelectedDate(e);

            toggleIsOpenDatePicker();
          }}
        />
      </Modal>
    </MaterialContainer>
  );
};

export default Create;

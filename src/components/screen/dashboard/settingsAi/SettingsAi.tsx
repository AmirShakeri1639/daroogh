import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Container,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ActionInterface, SettingsAiInterface } from '../../../../interfaces';
import { SettingsAi } from '../../../../services/api';
import {
  errorHandler,
  errorSweetAlert,
  successSweetAlert,
} from '../../../../utils';
import { useMutation } from 'react-query';
import TextFieldDaroogh from 'components/public/TextField/TextFieldDaroogh';

export const useClasses = makeStyles((theme) =>
  createStyles({
    parent: {
      paddingTop: theme.spacing(2),
    },
    addButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    divider: {
      width: '100%',
      margin: '1em 0',
    },
    spacing1: {
      margin: theme.spacing(1),
    },
    spacing3: {
      margin: theme.spacing(3),
    },
    padding3: {
      padding: theme.spacing(3),
    },
    formItem: {
      display: 'flex',
      justifySelf: 'stretch',
      margin: theme.spacing(1),
    },
    rootFull: {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
    longItem: {
      width: '75%',
    },
    centerItem: {
      display: 'flex',
      margin: 'auto',
    },
  })
);

const initialState: SettingsAiInterface = {
  pharmacyDrugScore: 0,
  pharmacyDrugIsFavorite: 0,
  pharmacyDrugIsCategoryFavorite: 0,
  pharmacyDrugSearchCount: 0,
  pharmacyDrugAddToBasketCount: 0,
  pharmacyDrugOpenListCount: 0,
  pharmacyDrugIsSimilarFavorite: 0,
  pharmacyDrugExchangeBasketCount: 0,
  pharmacyDrugRemoveFromExchangeBasketCount: 0,
  pharmacyDrugCanceledExchangeBasketCount: 0,
  drugScore: 0,
  drugAdditionalCount: 0,
  drugFavoriteCount: 0,
  drugSearchCount: 0,
  drugExchangeCount: 0,
  pharmacyPharmacyScore: 0,
  pharmacyPharmacyAvgScore: 0,
  pharmacyPharmacyExchangeCount: 0,
  pharmacyPharmacyCanceledExchangeCount: 0,
  pharmacyPharmacyOpenListCount: 0,
  pharmacyPharmacyIsSameProvince: 0,
  pharmacyPharmacyIsSameCity: 0,
  pharmacyPharmacyIsCloseDistance: 0,
  pharmacyPharmacyNeighboringDistanceMeters: 0,
  pharmacyScore: 0,
  pharmacyAvgScore: 0,
  pharmacyExchangeCount: 0,
  pharmacyCanceledExchangeCount: 0,
  pharmacySumOfExchangePrice: 0,
  pharmacyFavoriteCount: 0,
  pharmacyOpenListCount: 0,
  pharmacyWarrantyAmount: 0,
  pharmacyPeopleResponseCount: 0,
  pharmacyEmployeeRequestCount: 0,
  pharmacyFillSurveyCount: 0,
  pharmacyActionCount: 0,
  pharmacyFillProfileInfo: 0,
  pharmacyPaymentDaleyCount: 0,
  pharmacySelectedForceDrugsInExchange: 0,
  pharmacyForceDrugDaysCount: 0,
  pharmacyOfferRatio: 0,
  pharmacyPriceDifAvg: 0,
  pharmacyExpRemainDays: 0,
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'pharmacyDrugScore':
      return {
        ...state,
        pharmacyDrugScore: value,
      };
    case 'pharmacyDrugIsFavorite':
      return {
        ...state,
        pharmacyDrugIsFavorite: value,
      };
    case 'pharmacyDrugIsCategoryFavorite':
      return {
        ...state,
        pharmacyDrugIsCategoryFavorite: value,
      };
    case 'pharmacyDrugSearchCount':
      return {
        ...state,
        pharmacyDrugSearchCount: value,
      };
    case 'pharmacyDrugAddToBasketCount':
      return {
        ...state,
        pharmacyDrugAddToBasketCount: value,
      };
    case 'pharmacyDrugOpenListCount':
      return {
        ...state,
        pharmacyDrugOpenListCount: value,
      };
    case 'pharmacyDrugIsSimilarFavorite':
      return {
        ...state,
        pharmacyDrugIsSimilarFavorite: value,
      };
    case 'pharmacyDrugExchangeBasketCount':
      return {
        ...state,
        pharmacyDrugExchangeBasketCount: value,
      };
    case 'pharmacyDrugRemoveFromExchangeBasketCount':
      return {
        ...state,
        pharmacyDrugRemoveFromExchangeBasketCount: value,
      };
    case 'pharmacyDrugCanceledExchangeBasketCount':
      return {
        ...state,
        pharmacyDrugCanceledExchangeBasketCount: value,
      };
    case 'drugScore':
      return {
        ...state,
        drugScore: value,
      };
    case 'drugAdditionalCount':
      return {
        ...state,
        drugAdditionalCount: value,
      };
    case 'drugFavoriteCount':
      return {
        ...state,
        drugFavoriteCount: value,
      };
    case 'drugSearchCount':
      return {
        ...state,
        drugSearchCount: value,
      };
    case 'drugExchangeCount':
      return {
        ...state,
        drugExchangeCount: value,
      };
    case 'pharmacyPharmacyScore':
      return {
        ...state,
        pharmacyPharmacyScore: value,
      };
    case 'pharmacyPharmacyAvgScore':
      return {
        ...state,
        pharmacyPharmacyAvgScore: value,
      };
    case 'pharmacyPharmacyExchangeCount':
      return {
        ...state,
        pharmacyPharmacyExchangeCount: value,
      };
    case 'pharmacyPharmacyCanceledExchangeCount':
      return {
        ...state,
        pharmacyPharmacyCanceledExchangeCount: value,
      };
    case 'pharmacyPharmacyOpenListCount':
      return {
        ...state,
        pharmacyPharmacyOpenListCount: value,
      };
    case 'pharmacyPharmacyIsSameProvince':
      return {
        ...state,
        pharmacyPharmacyIsSameProvince: value,
      };
    case 'pharmacyPharmacyIsSameCity':
      return {
        ...state,
        pharmacyPharmacyIsSameCity: value,
      };
    case 'pharmacyPharmacyIsCloseDistance':
      return {
        ...state,
        pharmacyPharmacyIsCloseDistance: value,
      };
    case 'pharmacyPharmacyNeighboringDistanceMeters':
      return {
        ...state,
        pharmacyPharmacyNeighboringDistanceMeters: value,
      };
    case 'pharmacyScore':
      return {
        ...state,
        pharmacyScore: value,
      };
    case 'pharmacyAvgScore':
      return {
        ...state,
        pharmacyAvgScore: value,
      };
    case 'pharmacyExchangeCount':
      return {
        ...state,
        pharmacyExchangeCount: value,
      };
    case 'pharmacyCanceledExchangeCount':
      return {
        ...state,
        pharmacyCanceledExchangeCount: value,
      };
    case 'pharmacySumOfExchangePrice':
      return {
        ...state,
        pharmacySumOfExchangePrice: value,
      };
    case 'pharmacyFavoriteCount':
      return {
        ...state,
        pharmacyFavoriteCount: value,
      };
    case 'pharmacyOpenListCount':
      return {
        ...state,
        pharmacyOpenListCount: value,
      };
    case 'pharmacyWarrantyAmount':
      return {
        ...state,
        pharmacyWarrantyAmount: value,
      };
    case 'pharmacyPeopleResponseCount':
      return {
        ...state,
        pharmacyPeopleResponseCount: value,
      };
    case 'pharmacyEmployeeRequestCount':
      return {
        ...state,
        pharmacyEmployeeRequestCount: value,
      };
    case 'pharmacyFillSurveyCount':
      return {
        ...state,
        pharmacyFillSurveyCount: value,
      };
    case 'pharmacyActionCount':
      return {
        ...state,
        pharmacyActionCount: value,
      };
    case 'pharmacyFillProfileInfo':
      return {
        ...state,
        pharmacyFillProfileInfo: value,
      };
    case 'pharmacyPaymentDaleyCount':
      return {
        ...state,
        pharmacyPaymentDaleyCount: value,
      };
    case 'pharmacySelectedForceDrugsInExchange':
      return {
        ...state,
        pharmacySelectedForceDrugsInExchange: value,
      };
    case 'pharmacyForceDrugDaysCount':
      return {
        ...state,
        pharmacyForceDrugDaysCount: value,
      };
    case 'pharmacyOfferRatio':
      return {
        ...state,
        pharmacyOfferRatio: value,
      };
    case 'pharmacyPriceDifAvg':
      return {
        ...state,
        pharmacyPriceDifAvg: value,
      };
    case 'pharmacyExpRemainDays':
      return {
        ...state,
        pharmacyExpRemainDays: value,
      };

    case 'full':
      return {
        ...state,
        ...value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
      break;
  }
}

const SettingsAiForm: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    parent,
    addButton,
    spacing3,
    padding3,
    formItem,
    rootFull,
    longItem,
    centerItem,
    divider,
  } = useClasses();

  const { get, save } = new SettingsAi();

  useEffect(() => {
    async function getData(): Promise<any> {
      const data = await get();
      dispatch({ type: 'full', value: data });
    }

    getData();
  }, []);

  const [_save] = useMutation(save, {
    onSuccess: async () => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(t('alert.successfulSave'));
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    try {
      await _save(state);
    } catch (e) {
      await errorSweetAlert(t('error.save'));
      errorHandler(e);
    }
  };

  return (
    <Container maxWidth="lg" className={parent}>
      <Paper className={padding3}>
        <Typography component="h2">
          <h2>{t('settingsAi.settingsAi')}</h2>
        </Typography>
        <Divider />
        <form
          autoComplete="off"
          id="myform"
          className={rootFull}
          onSubmit={submit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>{t('settingsAi.section1')}</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="وزن هر قلم دارو از دید داروخانه نسبت به آیتم‌های کلی دیگر برای محاسبه امتیاز کلی لیست عرضه در سیستم توصیه‌گر"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyDrugScore.length < 1 && showError}
                label={t('settingsAi.pharmacyDrugScore')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugScore',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای هر داروی موجود در لیست علاقمندی"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyDrugIsFavorite.length < 1 && showError}
                label={t('settingsAi.pharmacyDrugIsFavorite')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugIsFavorite}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugIsFavorite',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="وزن هر قلم دارو از دید داروخانه نسبت به آیتم‌های کلی دیگر برای محاسبه امتیاز کلی لیست عرضه در سیستم توصیه‌گر"
                error={state.pharmacyDrugIsFavorite.length < 1 && showError}
                label={t('settingsAi.pharmacyDrugIsFavorite')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugIsFavorite}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugIsFavorite',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای دارویی که در دسته دارویی مورد علاقه هست"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugIsCategoryFavorite.length < 1 && showError
                }
                label={t('settingsAi.pharmacyDrugIsCategoryFavorite')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugIsCategoryFavorite}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugIsCategoryFavorite',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help={
                  <p>
                    امتیاز برای داروهایی که سرچ کرده
                    <ul>
                      <li>
                        {' '}
                        ضریب 0.1 این مقدار برای داروهایی که در دسته دارویی سرچ
                        بودند
                      </li>
                      <li>
                        {' '}
                        ضریب 0.05 این مقدار برای سرچ داروهای آفر دار یا حداقل
                        مهلت تاریخ انقضا در فیلتر سرچ پیشرفته استفاده می‌شود
                      </li>
                    </ul>
                  </p>
                }
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyDrugSearchCount.length < 1 && showError}
                label={t('settingsAi.pharmacyDrugSearchCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugSearchCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugSearchCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد دفعاتی که این دارو را در سبد خرید خود (در پروسه تبادل) اضافه کرده اعم از تبادلات کنسل شده (که داروخانه فعلی کنسل‌کننده نبوده) و چه تبادلات موفق"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugAddToBasketCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyDrugAddToBasketCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugAddToBasketCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugAddToBasketCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد دفعاتی که لیست داروخانه‌های دیگر با این داروی شاخص (در بالای لیست) را باز کرده"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyDrugOpenListCount.length < 1 && showError}
                label={t('settingsAi.pharmacyDrugOpenListCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugOpenListCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugOpenListCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای داروی با نام جنریک مشابه با لیست علاقمندی"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugIsSimilarFavorite.length < 1 && showError
                }
                label={t('settingsAi.pharmacyDrugIsSimilarFavorite')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugIsSimilarFavorite}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugIsSimilarFavorite',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای داروی که در گذشته در تبادل دریافت کرده"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugExchangeBasketCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyDrugExchangeBasketCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugExchangeBasketCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugExchangeBasketCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای دارویی که از سبد پیشنهادی خودش حذف کرده"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugRemoveFromExchangeBasketCount.length < 1 &&
                  showError
                }
                label={t(
                  'settingsAi.pharmacyDrugRemoveFromExchangeBasketCount'
                )}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugRemoveFromExchangeBasketCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugRemoveFromExchangeBasketCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز به ازای دارویی که در سبد خریدش بوده و تبادل را کنسل کرده (به دلیل عدم علاقه به داروهای سبد تبادل)"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyDrugCanceledExchangeBasketCount.length < 1 &&
                  showError
                }
                label={t('settingsAi.pharmacyDrugCanceledExchangeBasketCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyDrugCanceledExchangeBasketCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyDrugCanceledExchangeBasketCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Divider className={divider} />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>{t('settingsAi.section2')}</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="وزن هر قلم نسبت به آیتم‌های کلی دیگر برای محاسبه امتیاز کلی لیست عرضه در سیستم توصیه‌گر"
                data-hintposition="top-left"
                data-position="left"
                error={state.drugScore.length < 1 && showError}
                label={t('settingsAi.drugScore')}
                required
                type="number"
                variant="outlined"
                value={state.drugScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({ type: 'drugScore', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای ضریب تعداد (درصد) داروخانه ارائه دهنده دارو در لیست عرضه"
                data-hintposition="top-left"
                data-position="left"
                error={state.drugAdditionalCount.length < 1 && showError}
                label={t('settingsAi.drugAdditionalCount')}
                required
                type="number"
                variant="outlined"
                value={state.drugAdditionalCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'drugAdditionalCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای تعداد داروخانه متقاضی این دارو"
                data-hintposition="top-left"
                data-position="left"
                error={state.drugFavoriteCount.length < 1 && showError}
                label={t('settingsAi.drugFavoriteCount')}
                required
                type="number"
                variant="outlined"
                value={state.drugFavoriteCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'drugFavoriteCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای تعداد دفعات جستجوی این دارو توسط کل داروخانه‌ها"
                data-hintposition="top-left"
                data-position="left"
                error={state.drugSearchCount.length < 1 && showError}
                label={t('settingsAi.drugSearchCount')}
                required
                type="number"
                variant="outlined"
                value={state.drugSearchCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({ type: 'drugSearchCount', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای تعداد دفعاتی که این دارو در سبد تبادلات شرکت داشته"
                data-hintposition="top-left"
                data-position="left"
                error={state.drugExchangeCount.length < 1 && showError}
                label={t('settingsAi.drugExchangeCount')}
                required
                type="number"
                variant="outlined"
                value={state.drugExchangeCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'drugExchangeCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Divider className={divider} />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>{t('settingsAi.section3')}</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="وزن نسبت به آیتم‌های کلی دیگر برای محاسبه امتیاز کلی لیست عرضه در سیستم توصیه‌گر"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyPharmacyScore.length < 1 && showError}
                label={t('settingsAi.pharmacyPharmacyScore')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyScore',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای متوسط امتیاز داروخانه‌ها بهم بعد از تبادل"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyPharmacyAvgScore.length < 1 && showError}
                label={t('settingsAi.pharmacyPharmacyAvgScore')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyAvgScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyAvgScore',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد تبادل موفق"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyExchangeCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyPharmacyExchangeCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyExchangeCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyExchangeCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد تبادل کنسل شده"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyCanceledExchangeCount.length < 1 &&
                  showError
                }
                label={t('settingsAi.pharmacyPharmacyCanceledExchangeCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyCanceledExchangeCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyCanceledExchangeCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد دفعاتی که لیست داروخانه را باز کرده
 دریافت امتیاز کامل منوط به باز نگه داشتن حداقل 5 ثانیه و اسکرول به اندازه مشاهده نصف لیست هست
                "
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyOpenListCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyPharmacyOpenListCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyOpenListCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyOpenListCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help={
                  <p>
                    ضریب برای داروخانه در داخل استان
                    <ul>
                      <li>
                        {' '}
                        به اندازه دوبرابر نسبت کسر جستجوهای پیشرفته که با فیلتر
                        هم‌استانی انجام شده (به کل جستجوهای آن داروخانه) به این
                        ضریب افزوده می‌شود
                      </li>
                      <li>
                        {' '}
                        به اندازه نصف تعداد تبادلاتی که به دلیل فاصله زیاد کنسل
                        کرده، به این ضریب افزوده می‌شود
                      </li>
                    </ul>
                  </p>
                }
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyIsSameProvince.length < 1 && showError
                }
                label={t('settingsAi.pharmacyPharmacyIsSameProvince')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyIsSameProvince}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyIsSameProvince',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help={
                  <p>
                    ضریب برای داروخانه در شهر خودش
                    <ul>
                      <li>
                        {' '}
                        به اندازه دوبرابر نسبت کسر جستجوهای پیشرفته که با فیلتر
                        هم‌شهری انجام شده (به کل جستجوهای آن داروخانه) به این
                        ضریب افزوده می‌شود
                      </li>
                      <li>
                        {' '}
                        به اندازه تعداد تبادلاتی که به دلیل فاصله زیاد کنسل
                        کرده، به این ضریب افزوده می‌شود
                      </li>
                    </ul>
                  </p>
                }
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyPharmacyIsSameCity.length < 1 && showError}
                label={t('settingsAi.pharmacyPharmacyIsSameCity')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyIsSameCity}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyIsSameCity',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help={
                  <p>
                    ضریب برای داروخانه‌های مجاور
                    <ul>
                      <li>
                        {' '}
                        به اندازه دوبرابر نسبت کسر جستجوهای پیشرفته که با فیلتر
                        فاصله در محدوده مجاور انجام شده (به کل جستجوهای آن
                        داروخانه) به این ضریب افزوده می‌شود
                      </li>
                      <li>
                        {' '}
                        به اندازه دو برابر تعداد تبادلاتی که به دلیل فاصله زیاد
                        کنسل کرده، به این ضریب افزوده می‌شود دقت شود که
                        داروخانه‌های که همجوار باشند از امتیازات هم‌استانی و
                        هم‌شهری نیز بهره‌مند هستند.
                      </li>
                    </ul>
                  </p>
                }
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyIsCloseDistance.length < 1 && showError
                }
                label={t('settingsAi.pharmacyPharmacyIsCloseDistance')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyIsCloseDistance}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyIsCloseDistance',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="معیار حداکثر فاصله (بر حسب متر) دو داروخانه که همجوار درنظر گرفته شوند"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPharmacyNeighboringDistanceMeters.length < 1 &&
                  showError
                }
                label={t(
                  'settingsAi.pharmacyPharmacyNeighboringDistanceMeters'
                )}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPharmacyNeighboringDistanceMeters}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPharmacyNeighboringDistanceMeters',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Divider className={divider} />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>{t('settingsAi.section4')}</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="وزن نسبت به آیتم‌های کلی دیگر برای محاسبه امتیاز کلی لیست عرضه در سیستم توصیه‌گر"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyScore.length < 1 && showError}
                label={t('settingsAi.pharmacyScore')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({ type: 'pharmacyScore', value: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای متوسط امتیاز کسب شده این داروخانه در نظرسنجی تبادلات "
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyAvgScore.length < 1 && showError}
                label={t('settingsAi.pharmacyAvgScore')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyAvgScore}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyAvgScore',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد تبادلات موفق"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyExchangeCount.length < 1 && showError}
                label={t('settingsAi.pharmacyExchangeCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyExchangeCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyExchangeCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب تعداد تبادل کنسل شده توسط این داروخانه"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyCanceledExchangeCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyCanceledExchangeCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyCanceledExchangeCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyCanceledExchangeCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب به ازای هر یک میلیون تومان ارزش تبادلات"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacySumOfExchangePrice.length < 1 && showError}
                label={t('settingsAi.pharmacySumOfExchangePrice')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacySumOfExchangePrice}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacySumOfExchangePrice',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب تعداد داروی مورد علاقه (تعداد لیست علاقمندی‌ها)"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyFavoriteCount.length < 1 && showError}
                label={t('settingsAi.pharmacyFavoriteCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyFavoriteCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyFavoriteCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد دفعاتی که لیست این داروخانه باز شده"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyOpenListCount.length < 1 && showError}
                label={t('settingsAi.pharmacyOpenListCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyOpenListCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyOpenListCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب به ازای هر هزارتومان گارانتی در سیستم"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyWarrantyAmount.length < 1 && showError}
                label={t('settingsAi.pharmacyWarrantyAmount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyWarrantyAmount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyWarrantyAmount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد نسخه مردمی پاسخ داده شده"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyPeopleResponseCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyPeopleResponseCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPeopleResponseCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPeopleResponseCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد درخواست استخدامی درج شده در سیستم داروگ"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacyEmployeeRequestCount.length < 1 && showError
                }
                label={t('settingsAi.pharmacyEmployeeRequestCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyEmployeeRequestCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyEmployeeRequestCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد نظرسنجی که شرکت کرده"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyFillSurveyCount.length < 1 && showError}
                label={t('settingsAi.pharmacyFillSurveyCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyFillSurveyCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyFillSurveyCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای هر واحد فعالیت در سیستم مثل لاگین"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyActionCount.length < 1 && showError}
                label={t('settingsAi.pharmacyActionCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyActionCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyActionCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای درصد اطلاعات اختیاری که در پروفایل خودش تکمیل کرده"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyFillProfileInfo.length < 1 && showError}
                label={t('settingsAi.pharmacyFillProfileInfo')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyFillProfileInfo}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyFillProfileInfo',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب جریمه برای تعداد روز تاخیر غیرمجاز در پرداخت پورسانت"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyPaymentDaleyCount.length < 1 && showError}
                label={t('settingsAi.pharmacyPaymentDaleyCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPaymentDaleyCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPaymentDaleyCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="ضریب برای تعداد انتخاب داروهای با تاریخ انقضای نزدیک یا بدون آفر (قیمت نامناسب) در سبد تبادل"
                data-hintposition="top-left"
                data-position="left"
                error={
                  state.pharmacySelectedForceDrugsInExchange.length < 1 &&
                  showError
                }
                label={t('settingsAi.pharmacySelectedForceDrugsInExchange')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacySelectedForceDrugsInExchange}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacySelectedForceDrugsInExchange',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="معیار فورس محسوب شدن یک دارو در لیست عرضه برحسب تعداد روز باقیمانده تا انقضای دارو"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyForceDrugDaysCount.length < 1 && showError}
                label={t('settingsAi.pharmacyForceDrugDaysCount')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyForceDrugDaysCount}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyForceDrugDaysCount',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Divider className={divider} />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>{t('settingsAi.section5')}</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای ضریب میانگین آفر به داروهای لیست عرضه"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyOfferRatio.length < 1 && showError}
                label={t('settingsAi.pharmacyOfferRatio')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyOfferRatio}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyOfferRatio',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز (مثبت یا منفی) برای درصد اختلاف قیمت با میانگین قیمت اعلام شده توسط داروخانه‌ها"
                data-hintposition="top-left"
                data-position="left"
                error={state.pharmacyPriceDifAvg.length < 1 && showError}
                label={t('settingsAi.pharmacyPriceDifAvg')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyPriceDifAvg}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyPriceDifAvg',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldDaroogh
                help="امتیاز برای میانه تعداد روز باقیمانده (مهلت زمانی) تا انقضا داروهای لیست مازاد Median( Max(0; 365-ExpRemainDays)/365.0 )"
                data-position="left"
                error={state.pharmacyExpRemainDays.length < 1 && showError}
                label={t('settingsAi.pharmacyExpRemainDays')}
                required
                type="number"
                variant="outlined"
                value={state.pharmacyExpRemainDays}
                className={formItem}
                onChange={(e): void =>
                  dispatch({
                    type: 'pharmacyExpRemainDays',
                    value: e.target.value,
                  })
                }
              />
            </Grid>
            <Divider className={divider} />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} className={spacing3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className={`${addButton} ${longItem} ${centerItem}`}
              >
                <span>{t('action.register')}</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SettingsAiForm;

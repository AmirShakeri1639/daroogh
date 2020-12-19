import React, { useContext, useState, useEffect } from 'react';
import {
  createStyles,
  Grid,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Typography,
} from '@material-ui/core';
import debounce from 'lodash/debounce';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '../../../../public/button/Button';
import DrugTransferContext from '../Context';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { PharmacyDrug } from '../../../../../services/api';
import { PharmacyDrugEnum } from '../../../../../enum/query';
import CircleLoading from '../../../../public/loading/CircleLoading';
import CardContainer from './CardContainer';
import FilterListIcon from '@material-ui/icons/FilterList';
import { PharmacyDrugInterface } from '../../../../../interfaces/pharmacyDrug';
import { makeStyles } from '@material-ui/core/styles';
import { County, MaterialDrawer, Province, Switch } from '../../../../public';
import CloseIcon from '@material-ui/icons/Close';
import ReactSelect from '../../../../public/react-select/ReactSelect';
import Input from '../../../../public/input/Input';
import { errorHandler, sanitizeReactSelect } from '../../../../../utils';
import Search from '../../../../../services/api/Search';
import { useEffectOnce } from '../../../../../hooks';
import { SelectOption } from '../../../../../interfaces';
import { AdvancedSearchInterface } from '../../../../../interfaces/search';

const { getRelatedPharmacyDrug } = new PharmacyDrug();
const { advancedSearch, searchDrug, searchCategory } = new Search();

const useStyle = makeStyles((theme) =>
  createStyles({
    searchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& > div': {
        flexGrow: 1,
      },
      '& > svg': {
        marginRight: theme.spacing(1),
      },
      '& button': {
        background: 'transparent',
        color: '#000',
      },
    },
    drawerContainer: {
      padding: theme.spacing(1, 0),
      '& > #titleContainer': {
        padding: theme.spacing(0, 1, 1),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& h6': {
          margin: 0,
          fontWeight: 'normal',
        },
      },
      '& > #content': {
        overflowY: 'auto',
        height: 'calc(100vh - 55px)',
        padding: theme.spacing(1),
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '& > #react-select': {
          width: '100%',
        },
      },
    },
    switchContainer: {
      marginTop: theme.spacing(2),
      width: '100%',
      position: 'relative',
      '& label': {
        right: 15,
      },
    },
    dateContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    monthInput: {
      width: 100,
    },
    divider: {
      margin: theme.spacing(3, 0),
    },
    distanceContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: 90,
      justifyContent: 'space-between',
      '& #slider-container': {
        padding: theme.spacing(0, 2),
      },
    },
    noContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }
  })
);

const FirstStep: React.FC = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isCheckedJustOffer, setIsCheckedJustOffer] = useState<boolean>(false);
  const [selectedCounty, setSelectedCounty] = useState<number>(0);
  const [selectedProvince, setSelectedProvince] = useState<number>(0);
  const [searchOptions, setSearchOptions] = useState<object[] | undefined>(
    undefined
  );
  const [searchedDrugs, setSearchedDrugs] = useState<SelectOption[]>([]);
  const [searchedDrugsReesult, setSearchedDrugsReesult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchedCategory, setSearchedCategory] = useState<
    SelectOption | undefined
  >(undefined);
  const [categoryOptions, setCategoryOptions] = useState<object[] | undefined>(
    undefined
  );
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [remainingExpireDays, setRemainingExpireDays] = useState<number | null>(
    null
  );
  const [isInSearchMode, setIsInSearchMode] = useState<boolean>(false);

  const { t } = useTranslation();

  const toggleIsOpenDrawer = (): void => setIsOpenDrawer(v => !v);

  const setDataOfSearch = (
    item: AdvancedSearchInterface
  ): AdvancedSearchInterface => {
    const drugsIdsArray = searchedDrugs.map((d) => ({ drugID: d.value }));

    if (drugsIdsArray.length > 0) {
      item.searchHistoryItems = drugsIdsArray as { drugID: number }[];
    }

    if (searchedCategory !== undefined) {
      item.categoryId = searchedCategory?.value as number;
    }

    if (maxDistance !== null) {
      item.maxDistance = maxDistance;
    }

    if (remainingExpireDays !== null) {
      item.minRemainExpDays = remainingExpireDays;
    }

    if (selectedProvince !== 0) {
      item.countryDivisionCode = String(selectedProvince);
    }

    return item;
  };

  async function advancedSearchItems(): Promise<any> {
    setIsLoading(true);
    setIsInSearchMode(true);

    const data: AdvancedSearchInterface = {};
    const searchData = setDataOfSearch(data);

    try {
      const result = await advancedSearch(
        Object.assign(searchData, {
          hasOffer: isCheckedJustOffer,
        })
      );

      setSearchedDrugsReesult(result);
    } catch (e) {
      errorHandler(e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (searchedDrugs.length > 0) {
      advancedSearchItems();
    }
  }, [searchedDrugs]);

  const drugSearch = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }
      const result = await searchDrug(title);
      const options = sanitizeReactSelect(result, 'id', 'genericName');
      setSearchOptions(options);
    } catch (e) {
      errorHandler(e);
    }
  };

  const categorySearch = async (): Promise<any> => {
    try {
      const result = await searchCategory();
      const options = sanitizeReactSelect(result, 'id', 'name');
      setCategoryOptions(options);
    } catch (e) {
      errorHandler(e);
    }
  };

  useEffectOnce(() => {
    categorySearch();
  });

  const {
    searchContainer,
    drawerContainer,
    switchContainer,
    dateContainer,
    monthInput,
    distanceContainer,
    divider,
    noContent,
  } = useStyle();

  const { data, isLoading: isLoadingRelatedDrugs } = useQuery(
    PharmacyDrugEnum.GET_RELATED_PHARMACY_DRUG,
    () => getRelatedPharmacyDrug(),
    {
      enabled: searchedDrugs.length === 0,
    },
  );

  const toggleCheckbox = (): void => {
    setIsCheckedJustOffer((v) => !v);
  }

  const contentHandler = (): JSX.Element => {
    if (isLoadingRelatedDrugs || isLoading) {
      return <CircleLoading />;
    }

    let items = [];

    if (isInSearchMode) {
      if (searchedDrugsReesult === null || searchedDrugsReesult.length === 0) {
        return (
          <div className={`${noContent} w-100`}>
            <p>اطلاعاتی موجود نیست</p>
            <Button
              variant="outlined"
              color="blue"
              type="button"
              onClick={(): void => {
                setSearchedDrugs([]);
                setIsInSearchMode(false);
              }}
            >
              نمایش کارت ها بدون فیلتر
            </Button>
          </div>
        )
      }
      else {
        items = searchedDrugsReesult.map((d: PharmacyDrugInterface) => {
          return (
            <>
              <Grid item xs={12} lg={6} xl={4}>
                <CardContainer data={d} />
              </Grid>
            </>
          );
        });
      }
    }
    else {
      items = data.map((d: PharmacyDrugInterface) => {
        return (
          <>
            <Grid item xs={12} lg={6} xl={4}>
              <CardContainer data={d} />
            </Grid>
          </>
        );
      });
    }

    return items;
  };

  function valuetext(value: number): string {
    return `${value}`;
  }

  return (
    <>
      <Grid item xs={12} lg={9}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={searchContainer}>
              <Button onClick={(): void => setIsOpenDrawer(true)}>
                <FilterListIcon fontSize="small" />
                {t('general.emal')} {t('general.filter')}
              </Button>

              <ReactSelect
                value={searchedDrugs}
                onChange={(e): void => {
                  if (Array.isArray(e)) {
                    setIsInSearchMode(true);
                  } else {
                    setIsInSearchMode(false);
                  }
                  setSearchedDrugs(e === null ? [] : e);
                }}
                noOptionsMessage={t('general.noData')}
                isMulti
                onInputChange={debounce(drugSearch, 250)}
                options={searchOptions}
              />
            </div>
          </Grid>

          {contentHandler()}
        </Grid>
      </Grid>

      {/* <Hidden smDown>
        <Grid lg={3} item>
          <Grid container justify="center" spacing={1}>
            <Grid item xs={12}>
              <Button onClick={(): void => setActiveStep(activeStep + 1)}>
                {t('general.nextLevel')}
                <KeyboardBackspaceIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Hidden> */}

      <MaterialDrawer
        onClose={toggleIsOpenDrawer}
        isOpen={isOpenDrawer}
      >
        <div className={drawerContainer}>
          <div id="titleContainer">
            <h6 className="txt-md">فیلترهای جستجو</h6>
            <Button
              onClick={advancedSearchItems}
              variant="outlined"
              type="button"
              color="pink"
            >
              {t('general.filter')}
            </Button>

            <CloseIcon
              onClick={(): void => setIsOpenDrawer(false)}
              className="cursor-pointer"
            />
          </div>

          <Divider />

          <div id="content">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="category-filter"
                id="category-filter"
              >
                افزودن دسته بندی به جست و جو
              </AccordionSummary>
              <AccordionDetails>
                <div id="react-select">
                  <ReactSelect
                    onChange={(e): void => {
                      setSearchedCategory(e);
                    }}
                    onInputChange={debounce(categorySearch, 250)}
                    options={categoryOptions}
                    value={searchedCategory}
                    noOptionsMessage={t('general.noData')}
                  />
                </div>
              </AccordionDetails>
            </Accordion>

            <div className={switchContainer}>
              <span>{t('general.justOffer')}</span>
              <Switch
                id="just-offer"
                checked={isCheckedJustOffer}
                onChange={toggleCheckbox}
              />
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('date.minDateAsMonth')}</span>
              <Input
                value={remainingExpireDays || ''}
                className={monthInput}
                onChange={(e): any =>
                  setRemainingExpireDays(Number(e.target.value))
                }
              />
            </div>

            <Divider className={divider} />

            <div className={distanceContainer}>
              <Typography id="discrete-slider" gutterBottom>
                حداکثر فاصله تا شما (برحسب کیلومتر)
              </Typography>
              <div id="slider-container">
                <Slider
                  defaultValue={60}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={60}
                  marks
                  min={60}
                  max={3000}
                  onChange={(e, val): any => setMaxDistance(Number(val))}
                />
              </div>
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('province.selectCounty')}</span>
              <County countyHandler={(e): void => setSelectedCounty(e || 0)} />
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('province.selectProvince')}</span>
              <Province
                countyId={selectedCounty}
                provinceHandler={(e): void => setSelectedProvince(e || 0)}
              />
            </div>
          </div>
        </div>
      </MaterialDrawer>
    </>
  );
};

export default FirstStep;

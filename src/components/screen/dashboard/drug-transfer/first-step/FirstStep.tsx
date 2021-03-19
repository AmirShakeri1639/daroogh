import React, { useState, useEffect, useRef } from 'react';
import {
  createStyles,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Typography,
  Hidden,
} from '@material-ui/core';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { PharmacyDrug } from 'services/api';
import { PharmacyDrugEnum } from 'enum/query';
import { CircleLoading, EmptyContent } from 'components/public';
import CardContainer from './CardContainer';
import FilterListIcon from '@material-ui/icons/FilterList';
import { PharmacyDrugInterface } from 'interfaces/pharmacyDrug';
import { makeStyles } from '@material-ui/core/styles';
import {
  County,
  MaterialDrawer,
  Province,
  Switch,
  Button,
  Input,
  ReactSelect,
  AutoComplete,
} from 'components/public';
import CloseIcon from '@material-ui/icons/Close';
import { errorHandler, sanitizeReactSelect } from 'utils';
import Search from 'services/api/Search';
import { SelectOption } from 'interfaces';
import { AdvancedSearchInterface } from 'interfaces/search';
import { useDispatch } from 'react-redux';
import { setTransferEnd } from 'redux/actions';
import { ListOptions } from 'components/public/auto-complete/AutoComplete';
import { useQueryString } from 'hooks';
import { useLocation } from 'react-router';

const { getRelatedPharmacyDrug, getFavoritePharmacyDrug } = new PharmacyDrug();
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
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 0 0',
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
        height: 'calc(100vh - 95px)',
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
      '& > div': {
        '& > p': {
          margin: '5px 0 0',
        },
      },
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
    },
    buttonWrapper: {
      borderTop: '1px solid #cecece',
      padding: 10,
      textAlign: 'center',
      '& button': {
        width: '100%',
        padding: 5,
      },
    },
  })
);

const isMultipleSelection = true;

const FirstStep: React.FC = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isCheckedJustOffer, setIsCheckedJustOffer] = useState<boolean>(false);
  const [selectedCounty, setSelectedCounty] = useState<string>('-2');
  const [selectedProvince, setSelectedProvince] = useState<string>('-2');
  const [searchOptions, setSearchOptions] = useState<object[] | undefined>(
    undefined
  );
  const [searchedDrugs, setSearchedDrugs] = useState<ListOptions[]>([]);
  const [searchedDrugsReesult, setSearchedDrugsReesult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  let minimumDrugExpireDay = 30;
  const { search: useLocationSearch } = useLocation();

  try {
    const localStorageSettings = JSON.parse(
      localStorage.getItem('settings') ?? '{}'
    );
    minimumDrugExpireDay = localStorageSettings.drugExpireDay;
  } catch (e) {
    errorHandler(e);
  }

  const shouldDisplayFavoriteList = useLocationSearch.includes('faves=true');

  const toggleIsOpenDrawer = (): void => setIsOpenDrawer((v) => !v);

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

    if (selectedCounty !== '-1' && selectedCounty !== '*') {
      if (selectedProvince !== '-2' && selectedProvince !== '*') {
        item.countryDivisionCode = String(selectedProvince);
      } else if (selectedCounty !== '-2') {
        item.countryDivisionCode = String(selectedCounty);
      }
    } else {
      // Display all card of all cities
      delete item.countryDivisionCode;
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
    dispatch(setTransferEnd());
  }, []);

  useEffect(() => {
    if (searchedDrugs.length > 0) {
      advancedSearchItems();
    }
  }, [searchedDrugs]);

  const getDrugName = (item: any): string => {
    return `${item.name}${
      item.genericName !== null ? ` (${item.genericName}) ` : ''
    }${item.type !== null ? ` - ${item.type}` : ''}`;
  };

  const drugSearch = async (title: string): Promise<void> => {
    try {
      if (title.length < 2) {
        return;
      }

      setIsLoadingSearch(true);
      const result = await searchDrug(title);
      const mappedItems = result.map((_item: any) => ({
        item: {
          value: _item.id,
          label: getDrugName(_item),
        },
        el: (
          <div>
            <div>{getDrugName(_item)}</div>
            <div className="text-muted txt-sm">{`${
              _item.enName !== null ? `-${_item.enName}` : ''
            }${
              _item.companyName !== null ? ` - ${_item.companyName}` : ''
            }`}</div>
          </div>
        ),
      }));
      setIsLoadingSearch(false);

      // const options = sanitizeReactSelect(mappedItems, 'id', 'genericName');
      setSearchOptions(mappedItems);
    } catch (e) {
      errorHandler(e);
    }
  };

  const categorySearch = async (title: string): Promise<any> => {
    if (title.length < 2) {
      return;
    }
    try {
      const result = await searchCategory(title);

      const options = sanitizeReactSelect(result, 'id', 'name');
      setCategoryOptions(options);
    } catch (e) {
      errorHandler(e);
    }
  };

  const {
    searchContainer,
    drawerContainer,
    switchContainer,
    dateContainer,
    monthInput,
    distanceContainer,
    divider,
    noContent,
    buttonWrapper,
  } = useStyle();

  const { data, isLoading: isLoadingRelatedDrugs } = useQuery(
    shouldDisplayFavoriteList
      ? PharmacyDrugEnum.GET_FAVORITE_EXCHANGE_LIST_OF_DRUGS
      : PharmacyDrugEnum.GET_RELATED_PHARMACY_DRUG,
    shouldDisplayFavoriteList
      ? () => getFavoritePharmacyDrug()
      : () => getRelatedPharmacyDrug(),
    {
      enabled: searchedDrugs.length === 0,
    }
  );

  const toggleCheckbox = (): void => {
    setIsCheckedJustOffer((v) => !v);
  };

  const contentHandler = (): JSX.Element => {
    if (isLoadingRelatedDrugs || isLoading) {
      return <CircleLoading />;
    }

    let items = [];

    if (isInSearchMode) {
      if (searchedDrugsReesult === null || searchedDrugsReesult.length === 0) {
        return (
          <div className={`${noContent} w-100`}>
            <EmptyContent />
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
        );
      } else {
        items = searchedDrugsReesult.map((d: PharmacyDrugInterface) => {
          return (
            <>
              <Grid item xs={12} sm={6} lg={6}>
                <CardContainer data={d} />
              </Grid>
            </>
          );
        });
      }
    } else {
      items = data.items.map((d: PharmacyDrugInterface) => {
        return (
          <>
            <Grid item xs={12} sm={6} lg={6}>
              <CardContainer data={d} />
            </Grid>
          </>
        );
      });
    }

    return items;
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Hidden xsDown>
            <Grid item xs={12}>
              <span>
                برای جستجو در لیست های عرضه شده توسط همکارانتان میتوانید نام
                دارو٬ دسته دارویی یا نام ژنریک را وارد کنید. همچنین میتوانید چند
                دارو را جستجو کنید و لیست هایی که بیشترین مطابقت با خواسته شما
                را داشته باشد به شما پیشنهاد داده میشود برای جستجوی دقیق تر
                میتوانید از گزینه جستجوی پیشرفته استفاده نمایید
              </span>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <div className={searchContainer}>
              <Button onClick={(): void => setIsOpenDrawer(true)}>
                <FilterListIcon fontSize="small" />
                {t('general.filter')}
              </Button>

              <AutoComplete
                ref={useRef()}
                isLoading={isLoadingSearch}
                onChange={debounce(
                  (e): Promise<void> => drugSearch(e.target.value),
                  500
                )}
                className="w-100"
                loadingText={t('general.loading')}
                options={searchOptions}
                placeholder="جستجو (نام دارو٬ دسته دارویی٬ نام ژنریک) "
                multiple={isMultipleSelection}
                onItemSelected={(arrayList): void => {
                  if (arrayList.length > 0) {
                    setIsInSearchMode(true);
                  } else {
                    setIsInSearchMode(false);
                  }
                  setSearchedDrugs(arrayList);
                }}
              />
            </div>
          </Grid>

          {contentHandler()}
        </Grid>
      </Grid>

      <MaterialDrawer onClose={toggleIsOpenDrawer} isOpen={isOpenDrawer}>
        <div className={drawerContainer}>
          <div id="titleContainer">
            <h6 className="txt-md">فیلترهای جستجو</h6>
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
              <div>
                <span>{t('date.minDateAsDay')}</span>
                <p className="txt-xs text-danger">
                  عدد انتخابی باید حداقل {minimumDrugExpireDay} باشد
                </p>
              </div>
              <Input
                value={remainingExpireDays || ''}
                className={monthInput}
                error={Number(remainingExpireDays) < minimumDrugExpireDay}
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
              <Input
                numberFormat
                value={maxDistance || ''}
                type="number"
                className={`${monthInput} w-100`}
                onChange={(e): any => setMaxDistance(Number(e))}
              />
              {/* <div id="slider-container">
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
              </div> */}
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('province.selectCounty')}</span>
              <County
                countyHandler={(e): void => {
                  setSelectedCounty(e ?? '');
                  setSelectedProvince('-2');
                }}
                value={selectedCounty}
              />
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('province.selectProvince')}</span>
              <Province
                countyId={selectedCounty}
                value={selectedProvince}
                provinceHandler={(e): void => setSelectedProvince(e ?? '')}
              />
            </div>
          </div>

          <Grid container spacing={0}>
            <Grid item xs={12} className={buttonWrapper}>
              <Button
                onClick={advancedSearchItems}
                variant="outlined"
                type="button"
                color="pink"
              >
                {t('general.emal')} {t('general.filter')}
              </Button>
            </Grid>
          </Grid>
        </div>
      </MaterialDrawer>
    </>
  );
};

export default FirstStep;

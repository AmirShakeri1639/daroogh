import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import {
  createStyles,
  Grid,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@material-ui/core';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryCache } from 'react-query';
import { Category, PharmacyDrug } from 'services/api';
import { PharmacyDrugEnum } from 'enum/query';
import { EmptyContent } from 'components/public';
import CardContainer from './card/CardContainer';
import FilterListIcon from '@material-ui/icons/FilterList';
import { PharmacyDrugInterface } from 'interfaces/pharmacyDrug';
import { makeStyles } from '@material-ui/core/styles';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import {
  County,
  MaterialDrawer,
  Province,
  Switch,
  Button,
  Input,
  AutoComplete,
} from 'components/public';
import CloseIcon from '@material-ui/icons/Close';
import { errorHandler } from 'utils';
import Search from 'services/api/Search';
import { AdvancedSearchInterface } from 'interfaces/search';
import { useDispatch } from 'react-redux';
import { setTransferEnd } from 'redux/actions';
import { ListOptions } from 'components/public/auto-complete/AutoComplete';
import { useLocation } from 'react-router';
import { ColorEnum } from 'enum';
import { CategoryQueryEnum } from 'enum/query';
import styled from 'styled-components';
import { useEffectOnce, useScrollRestoration } from 'hooks';
import DisplayType, { ListItem } from './DisplayType';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';

const { getRelatedPharmacyDrug, getFavoritePharmacyDrug, getRelatedPharmacyDrugByDate } = new PharmacyDrug();
const { advancedSearch, searchDrug } = new Search();
const { getAllCategories } = new Category();

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
    filterButton: {
      color: `${ColorEnum.White} !important`,
      fontSize: 14,
      width: 80,
      height: 36,
      marginRight: 16,
      background: `${ColorEnum.Green} !important`,
      borderRadius: 4,
    },
    countryDivision:{
      width:240,
    }
  })
);

const StyledTypo = styled(Typography)`
  margin-bottom: 10px;
`

const Container = styled.div``;

const isMultipleSelection = true;

type ServerResponse = {
  count: number;
  items: any[];
  nextPageLink: null;
}

const FirstStep: React.FC = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isCheckedJustOffer, setIsCheckedJustOffer] = useState<boolean>(false);
  const [selectedCounty, setSelectedCounty] = useState<string>('-2');
  const [selectedProvince, setSelectedProvince] = useState<string>('-2');
  const [searchOptions, setSearchOptions] = useState<object[] | undefined>(undefined);
  const [searchedDrugs, setSearchedDrugs] = useState<ListOptions[]>([]);
  const [searchedDrugsResult, setSearchedDrugsResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [remainingExpireDays, setRemainingExpireDays] = useState<string>('');
  const [isInSearchMode, setIsInSearchMode] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [drugsCategory, setDrugsCategory] = useState<any[]>([]);
  const [selectedDrugsCategory, setSelectedDrugsCategory] = useState('-1');
  const [currentPage, setCurrentPage] = useState(0);
  const [pharmacyList, setPharmacyList] = useState<any[]>([]);
  const [isLoadingRelatedDrugs, setIsLoadingRelatedDrugs] = useState(false);
  const [selectedDisplayType, setSelectedDisplayType] = useState<ListItem>('recommender');

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    activeStep,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const totalPharmacyCount = useRef<number>(1);

  const cache = useQueryCache();
  const { search } = useLocation();

  useEffectOnce(() => {
    let hash = window.location.hash;

    if (activeStep === 0 && !hash.includes('eid=')) {
      hash = hash.replace('step=0', '')
      if (hash.includes('step=2')) {
        window.location.hash = hash.replace('step=2', 'step=1')
      } else if (!window.location.hash.endsWith('step=1')) {
        const sign = window.location.hash.includes('?') ? '&' : '?'
        window.location.hash = `${hash}${sign}step=1`
      }
    }
  });

  let minimumDrugExpireDay = 30;
  const { search: useLocationSearch } = useLocation();
  const scrollRestoration = useScrollRestoration;

  scrollRestoration(window, PharmacyDrugEnum.GET_RELATED_PHARMACY_DRUG, setCurrentPage, cache, 0);

  try {
    const localStorageSettings = JSON.parse(localStorage.getItem('settings') ?? '{}');
    minimumDrugExpireDay = localStorageSettings.drugExpireDay;
  } catch (e) {
    errorHandler(e);
  }

  const shouldDisplayFavoriteList = useLocationSearch.includes('faves=true');

  const toggleIsOpenDrawer = (): void => setIsOpenDrawer((v) => !v);

  const setDataOfSearch = (item: AdvancedSearchInterface): AdvancedSearchInterface => {
    const drugsIdsArray = searchedDrugs.map((d) => ({ drugID: d.value }));

    if (drugsIdsArray.length > 0) {
      item.searchHistoryItems = drugsIdsArray as { drugID: number }[];
    }

    if (selectedDrugsCategory !== '-1') {
      item.categoryId = (selectedDrugsCategory as unknown) as number;
    }

    if (maxDistance !== null) {
      item.maxDistance = maxDistance;
    }

    if (remainingExpireDays !== '') {
      item.minRemainExpDays = Number(remainingExpireDays);
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
    setIsOpenDrawer(false);
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

      setSearchedDrugsResult(result);
    } catch (e) {
      errorHandler(e);
    }
    setIsLoading(false);
  }

  const getDrugsCategory = async (): Promise<void> => {
    try {
      const maximumAvailableDrug = 99;
      const result = await getAllCategories(0, maximumAvailableDrug);
      const { items } = result;
      setDrugsCategory(items);
    } catch (e) {
      errorHandler(e);
    }
  };

  useEffect(() => {
    if (isOpenDrawer && drugsCategory.length === 0) {
      getDrugsCategory();
    }
  }, [isOpenDrawer]);

  const {
    isLoading: isLoadingCategory,
    data: categoriesData,
  } = useQuery(
    CategoryQueryEnum.GET_ALL_CATEGORIES,
    () => getAllCategories(0, 99),
    {
      enabled: isOpenDrawer,
    }
  );

  useEffect(() => {
    dispatch(setTransferEnd());
  }, []);

  useEffect(() => {
    if (searchedDrugs.length > 0) {
      advancedSearchItems();
    }
  }, [searchedDrugs]);

  const getDrugName = (item: any): string => {
    return `${item.name}${item.genericName !== null ? ` (${item.genericName}) ` : ''}${
      item.type !== null ? ` - ${item.type}` : ''
    }`;
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
            <div className="text-muted txt-sm no-farsi-number">{ `${
              _item.enName !== null ? `-${_item.enName}` : ''
            }${_item.companyName !== null ? ` - ${_item.companyName}` : ''}`}</div>
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
    filterButton,
    countryDivision,
  } = useStyle();

  useEffect(() => {
    (async (): Promise<any> => {
      if (searchedDrugs.length === 0 && pharmacyList.length < totalPharmacyCount?.current) {
        setIsLoadingRelatedDrugs(true)

        let result: ServerResponse;
        if (shouldDisplayFavoriteList) {
          result = await getFavoritePharmacyDrug();
        } else if (selectedDisplayType === 'recommender') {
          result = await getRelatedPharmacyDrug(10, currentPage * 10);
        } else {
          result = await getRelatedPharmacyDrugByDate(10, currentPage * 10)
        }

        setPharmacyList((v) => [...v, ...result.items]);

        totalPharmacyCount.current = result.count;

        setIsLoadingRelatedDrugs(false);
      }
    })();
  }, [search, currentPage, selectedDisplayType]);


  const toggleCheckbox = (): void => {
    setIsCheckedJustOffer((v) => !v);
  };

  const contentHandler = () => {
    let items = [];

    if (isInSearchMode) {
      if (searchedDrugsResult === null || searchedDrugsResult.length === 0) {
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
                setSelectedDrugsCategory('-1');
              }}
            >
              نمایش کارت ها بدون فیلتر
            </Button>
          </div>
        );
      } else {
        items = React.Children.toArray(
          searchedDrugsResult.map((d: PharmacyDrugInterface) => {
            return (
              <>
                <Grid item xs={12} sm={6} lg={6}>
                  <CardContainer data={d} />
                </Grid>
              </>
            );
          })
        );
      }
    } else {
      items = React.Children.toArray(
        pharmacyList.map((d: PharmacyDrugInterface) => {
          return (
            <>
              <Grid item xs={12} sm={6} lg={6}>
                <CardContainer data={d} />
              </Grid>
            </>
          );
        })
      );
    }
    return items;
  };

  const memoContent = useMemo(() => contentHandler(), [
    isLoading,
    isLoadingRelatedDrugs,
    isInSearchMode,
    pharmacyList,
  ]);

  const drugsListGenerator = (): any => {
    if (!isLoadingCategory && categoriesData !== undefined) {
      return React.Children.toArray(
        categoriesData.items.map((item: any) => {
          return <MenuItem value={item.id}>{item.name}</MenuItem>;
        })
      );
    }
    return <MenuItem />;
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setSelectedDrugsCategory(event.target.value as string);
  };

  return (
    <>
      <Grid item xs={12}>
        <Container id="container">
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ marginTop: 16 }}>
              <span>{t('alerts.supplylistsAlert')}</span>
            </Grid>
            <Grid item xs={12} md={8}>
              <div className={searchContainer}>
                <Button className={filterButton} onClick={(): void => setIsOpenDrawer(true)}>
                  <FilterListIcon fontSize="small" />
                  {t('general.filter')}
                </Button>

                <AutoComplete
                  ref={useRef()}
                  isLoading={isLoadingSearch}
                  onChange={debounce((e): Promise<void> => drugSearch(e.target.value), 500)}
                  className="w-100"
                  loadingText={t('general.loading')}
                  options={searchOptions}
                  placeholder="جستجو ( نام محصول٬ نام ژنریک یا نام انگلیسی ) "
                  multiple={isMultipleSelection}
                  onItemSelected={(arrayList: any[]): void => {
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

            <Grid item xs={12} md={4}>
              <Grid container alignItems="center">
                <Grid item xs={3} sm={2} md={3}>
                  نحوه نمایش
                </Grid>
                <Grid item xs={9} sm={10} md={9}>
                  <DisplayType
                    selectedHandler={(val: ListItem): void => {
                      setSelectedDisplayType(val);
                      setCurrentPage(0);
                      setPharmacyList([]);
                    }}
                  value={selectedDisplayType}
                />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {selectedDrugsCategory !== '-1' && isInSearchMode && (
                <Chip
                  label={`${t('general.category')}:
                  ${drugsCategory.find((item) => item.id == selectedDrugsCategory).name}`}
                  onDelete={(): void => {
                    setIsInSearchMode(false);
                    setSelectedDrugsCategory('-1');
                  }}
                  color="default"
                />
              )}
            </Grid>

            {memoContent}
          </Grid>
        </Container>
      </Grid>

      <MaterialDrawer onClose={toggleIsOpenDrawer} isOpen={isOpenDrawer}>
        <div className={drawerContainer}>
          <div id="titleContainer">
            <h6 className="txt-md">فیلترهای جستجو</h6>
            <CloseIcon onClick={(): void => setIsOpenDrawer(false)} className="cursor-pointer" />
          </div>

          <Divider />

          <div id="content">
            <Grid container>
              <Grid item xs={12}>
                <Grid container item xs={12}>
                  <StyledTypo>
                  افزودن دسته بندی به جستجو
                  </StyledTypo>
                </Grid>
                <Grid container item xs={12}>
                  <FormControl variant="outlined" style={{ width: 500 }}>
                    <InputLabel id="drugs-list-id">{t('general.category')}</InputLabel>
                    <Select
                      labelId="drugs-list-id"
                      id="drugs-list"
                      value={selectedDrugsCategory}
                      onChange={handleChange}
                    >
                      <MenuItem value="-1">{t('general.noOne')}</MenuItem>
                      {drugsListGenerator()}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <div className={switchContainer}>
              <span>{t('general.justOffer')}</span>
              <Switch id="just-offer" checked={isCheckedJustOffer} onChange={toggleCheckbox} />
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
                value={remainingExpireDays}
                className={monthInput}
                error={
                  Number(remainingExpireDays) < minimumDrugExpireDay && remainingExpireDays !== ''
                }
                onChange={(e): any => setRemainingExpireDays(e.target.value)}
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
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('peopleSection.ostan')}</span>
              <County className={countryDivision}
                countyHandler={(e): void => {
                  setSelectedCounty(e ?? '');
                  setSelectedProvince('-2');
                }}
                value={selectedCounty}
              />
            </div>

            <Divider className={divider} />

            <div className={dateContainer}>
              <span>{t('peopleSection.city')}</span>
              <Province className={countryDivision}
                countyId={selectedCounty}
                value={selectedProvince}
                provinceHandler={(e): void => setSelectedProvince(e ?? '')}
              />
            </div>
          </div>

          <Grid container spacing={0}>
            <Grid item xs={12} className={buttonWrapper}>
              <Button onClick={advancedSearchItems} variant="outlined" type="button" color="pink">
                {t('general.emal')} {t('general.filter')}
              </Button>
            </Grid>
          </Grid>
        </div>
      </MaterialDrawer>

      <CircleBackdropLoading isOpen={isLoadingRelatedDrugs || isLoading} />
    </>
  );
};

export default FirstStep;

import React, { useContext, useEffect, useState } from 'react';
import {
  CardContent,
  CardHeader,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Hidden,
  makeStyles,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ToolBox from '../Toolbox';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SendIcon from '@material-ui/icons/Send';
import { useInfiniteQuery, useQuery, useQueryCache } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import { useIntersectionObserver } from '../../../../../hooks/useIntersectionObserver';

const style = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    stickyToolbox: {
      position: 'sticky',
      margin: 0,
      top: 70,
      zIndex: 999,
      backgroundColor: '#f3f3f3',
      boxShadow: '0px 0px 3px 3px silver',
    },
    stickyRecommendation: {
      position: 'sticky',
      margin: 0,
      top: 135,
      zIndex: 999,
    },
  })
);

const ThirdStep: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();

  const [isSelected, setIsSelected] = React.useState(false);

  const {
    activeStep,
    setActiveStep,
    uAllPharmacyDrug,
    setUAllPharmacyDrug,
    uBasketCount,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { paper, stickyToolbox, stickyRecommendation } = style();

  const queryCache = useQueryCache();

  const [listPageNo, setListPage] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dataInfo, setDataInfo] = useState<any>([]);

  const comparer = (otherArray: any): any => {
    return (current: any): any => {
      return (
        otherArray.filter((other: any) => {
          return other.id == current.id;
        }).length == 0
      );
    };
  };

  const {
    status,
    isLoading,
    error,
    data,
    isFetching,
    isFetchingMore,
    fetchMore,
    refetch,
    canFetchMore,
  } = useInfiniteQuery(
    'key',
    async (k) => {
      const data = await getAllPharmacyDrug('', listPageNo, pageSize);
      setListPage(listPageNo + 1);
      const allItemsTillNow = [...uAllPharmacyDrug, ...data.items];
      setUAllPharmacyDrug(allItemsTillNow);
      setListCount(data.count);
      setDataInfo(data.items);
      return data.items;
    },
    {
      getFetchMore: () => {
        return (
          uAllPharmacyDrug.length === 0 || uAllPharmacyDrug.length < listCount
        );
      },
      enabled: false,
    }
  );

  const loadMoreButtonRef = React.useRef<any>(null);

  useEffect(() => {
    setUAllPharmacyDrug([]);
  }, []);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  });

  const { t } = useTranslation();

  const cardListGenerator = (): JSX.Element[] | null => {
    if (dataInfo && dataInfo.length > 0) {
      const onlyA = dataInfo.filter(comparer(uBasketCount));
      if (uBasketCount.length > 0)
      uBasketCount.forEach((a) => {
          if (dataInfo.find((z: any) => z.id === a.id)) onlyA.unshift(a);
        });
      const packList = new Array<AllPharmacyDrugInterface>();
      return onlyA
        .sort((a: any, b: any) => (a.order > b.order ? 1 : -1))
        .map((item: AllPharmacyDrugInterface, index: number) => {
          if (!item.buttonName)
            Object.assign(item, {
              order: index + 1,
              buttonName: 'افزودن به تبادل',
              cardColor: 'white',
              currentCnt: item.cnt,
            });

          let isPack = false;
          let totalAmount = 0;
          let ignore = true;
          if (item.packID && !packList.find((x) => x.packID === item.packID)) {
            uAllPharmacyDrug
              .filter((x) => x.packID === item.packID)
              .forEach((p: AllPharmacyDrugInterface) => {
                packList.push(p);
                totalAmount += p.amount;
              });
            item.totalAmount = totalAmount;
            isPack = true;
            ignore = false;
            const basket = uBasketCount.find((x) => x.packID == item.packID);
            if (basket) {
              item.currentCnt = basket.currentCnt;
              // item.order = -1;
              item.buttonName = 'حذف از تبادل';
              item.cardColor = '#89fd89';
            }
          }
          if (ignore && item.packID && packList.find((x) => x.id === item.id)) {
            return;
          }
          return (
            <Grid item xs={12} sm={6} xl={4} key={index}>
              <div className={paper}>
                {isPack ? (
                  <CardContainer
                    basicDetail={
                      <ExCardContent formType={1} pharmacyDrug={item} />
                    }
                    isPack={true}
                    pharmacyDrug={item}
                    collapsableContent={
                      <ExCardContent formType={3} packInfo={packList} />
                    }
                  />
                ) : (
                  <CardContainer
                    basicDetail={
                      <ExCardContent formType={2} pharmacyDrug={item} />
                    }
                    isPack={false}
                    pharmacyDrug={item}
                  />
                )}
              </div>
            </Grid>
          );
        });
    }

    return null;
  };

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
    if (event.target.checked) refetch();
    else setUAllPharmacyDrug([]);
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container item spacing={3} xs={12} className={stickyToolbox}>
          <Grid item xs={12} sm={7} md={7} style={{ padding: 0 }}>
            <SearchInAList />
          </Grid>
          <Grid item xs={12} sm={5} md={5} style={{ padding: 0 }}>
            <ToolBox />
          </Grid>
        </Grid>
        <Grid container item spacing={3} xs={12}>
          <Grid
            item
            xs={12}
            md={12}
            style={{ marginBottom: -25, paddingBottom: 0 }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isSelected}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="انتخاب دارو از سبد عرضه خود"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {isLoading && <CircleLoading />}
            <Grid container spacing={1}>
              {cardListGenerator()}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Grid container className={stickyRecommendation}>
              <TextField
                style={{ width: '100%', marginTop: 15 }}
                label="توضیحات"
                multiline
                rows={15}
                defaultValue="توصیه ها"
                variant="outlined"
              />
              <Hidden smDown>
                <Grid container item xs={12} sm={12} style={{ marginTop: 5 }}>
                  <Grid item sm={6}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="pink"
                      onClick={(): void => setActiveStep(activeStep - 1)}
                    >
                      <ArrowRightAltIcon />
                      {t('general.prevLevel')}
                    </Button>
                  </Grid>
                  <Grid item sm={6} style={{ textAlign: 'left' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="blue"
                      onClick={(): void => setActiveStep(activeStep + 1)}
                    >
                      {t('general.sendExchange')}
                      <SendIcon style={{ transform: 'rotate(-180deg)' }} />
                    </Button>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ThirdStep;

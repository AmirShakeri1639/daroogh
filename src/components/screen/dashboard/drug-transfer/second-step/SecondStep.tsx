import React, { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Hidden,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { default as MatButton } from '@material-ui/core/Button';
import ToolBox from '../Toolbox';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useQuery } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import {
  useQueryCache,
  useInfiniteQuery,
  ReactQueryCacheProvider,
} from 'react-query';
import { useIntersectionObserver } from '../../../../../hooks/useIntersectionObserver';
import JwtData from '../../../../../utils/JwtData';
import { useClasses } from '../../classes';

const style = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: 0,
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
      padding: 10,
      paddingTop: 0,
      top: 135,
      zIndex: 999,
    },
  })
);

const SecondStep: React.FC = () => {
  const { getAllPharmacyDrug, getViewExchange } = new PharmacyDrug();
  const { t } = useTranslation();

  const [viewExhcnage, setViewExchange] = useState([]);

  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
    openDialog,
    setOpenDialog,
    recommendationMessage,
    setRecommendationMessage,
    exchangeId,
    setExchangeId,
    basketCount,
    selectedPharmacyForTransfer,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { userData } = new JwtData();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { paper, stickyToolbox, stickyRecommendation } = useClasses();

  const comparer = (otherArray: any): any => {
    return (current: any): any => {
      return (
        otherArray.filter((other: any) => {
          return other.id == current.id;
        }).length == 0
      );
    };
  };

  const queryCache = useQueryCache();

  const [listPageNo, setListPage] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dataInfo, setDataInfo] = useState<any>([]);

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
      const data = await getAllPharmacyDrug(
        selectedPharmacyForTransfer,
        listPageNo,
        pageSize
      );
      setListPage(listPageNo + 1);
      const allItemsTillNow = [...allPharmacyDrug, ...data.items];
      setAllPharmacyDrug(allItemsTillNow);
      setListCount(data.count);

      const onlyA = data.items.filter(comparer(basketCount));
      if (basketCount.length > 0)
        basketCount.forEach((a) => {
          if (data.items.find((z: any) => z.id === a.id)) onlyA.splice(0, 0, a);
        });
      console.log('data---> ', onlyA);
      setDataInfo(onlyA);
      return data.items;
    },
    {
      getFetchMore: () => {
        return (
          allPharmacyDrug.length === 0 || allPharmacyDrug.length < listCount
        );
      },
      enabled: false,
    }
  );

  const loadMoreButtonRef = React.useRef<any>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      if (exchangeId > 0) {
        const result = await getViewExchange(exchangeId);
        setViewExchange(result);
      }
    })();
  }, [exchangeId]);

  useEffect(() => {
    refetch();
  }, []);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  });

  const cardListGenerator = (): JSX.Element[] | null => {
    if (dataInfo && dataInfo.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return (
        dataInfo
          .sort((a: any, b: any) => (a.order > b.order ? 1 : -1))
          .map((item: AllPharmacyDrugInterface, index: number) => {
            if (!item.buttonName)
              Object.assign(item, {
                order: index + 1,
                buttonName: 'افزودن به تبادل',
                // cardColor: 'white',
                currentCnt: item.cnt,
              });

            let isPack = false;
            let totalAmount = 0;
            let ignore = true;
            if (
              item.packID &&
              !packList.find((x) => x.packID === item.packID)
            ) {
              allPharmacyDrug
                .filter((x) => x.packID === item.packID)
                .forEach((p: AllPharmacyDrugInterface) => {
                  packList.push(p);
                  totalAmount += p.amount;
                });
              item.totalAmount = totalAmount;
              isPack = true;
              ignore = false;
              const basket = basketCount.find((x) => x.packID == item.packID);
              if (basket) {
                item.currentCnt = basket.currentCnt;
                // item.order = -1;
                item.buttonName = 'حذف از تبادل';
                item.cardColor = '#89fd89';
              }
            }
            if (
              ignore &&
              item.packID &&
              packList.find((x) => x.id === item.id)
            ) {
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
          })
      );
    }

    return null;
  };

  const handleClickOpen = (): any => {
    setOpenDialog(true);
  };

  const handleClose = (): any => {
    setOpenDialog(false);
  };

  const handleAgree = (): any => {
    setActiveStep(activeStep + 1);
  };

  const ConfirmDialog = (): JSX.Element => {
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>{'انتخاب دارو از سبد خود'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              آیا تمایل دارید از لیست داروهای خود ، اقلامی را انتخاب نمایید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MatButton autoFocus onClick={handleClose} color="primary">
              خیر
            </MatButton>
            <MatButton onClick={handleAgree} color="primary" autoFocus>
              بلی
            </MatButton>
          </DialogActions>
        </Dialog>
      </div>
    );
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
        <Grid container item spacing={1} xs={12}>
          <Grid item xs={12} md={9}>
            {isLoading && <CircleLoading />}
            <Grid container spacing={1}>
              {status === 'loading' ? (
                <CircleLoading />
              ) : status === 'error' ? (
                <span>{t('error.loading-data')}</span>
              ) : (
                <>
                  {cardListGenerator()}
                  <div>
                    <button
                      className="MuiButton-outlined MuiButton-outlinedPrimary MuiButton-root"
                      ref={loadMoreButtonRef}
                      onClick={fetchMore}
                      disabled={!canFetchMore}
                    >
                      {isFetchingMore
                        ? t('general.loading')
                        : canFetchMore
                        ? t('general.more')
                        : t('general.noMoreData')}
                    </button>
                  </div>
                  <div>
                    {isFetching && !isFetchingMore ? <CircleLoading /> : null}
                  </div>
                </>
              )}
              <div>
                {isFetching && !isFetchingMore ? <CircleLoading /> : null}
              </div>
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
                value={recommendationMessage}
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
                      color="pink"
                      onClick={(): void => setActiveStep(activeStep + 1)}
                    >
                      {t('general.nextLevel')}
                      <KeyboardBackspaceIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ConfirmDialog />
    </>
  );
};

export default SecondStep;

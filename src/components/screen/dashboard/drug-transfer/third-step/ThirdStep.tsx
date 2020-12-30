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
    actionContainer: {
      display: 'flex',
      marginTop: 5,
      width: '100%',
    },
    cancelButton: {
      width: '100%',
    },
    cancelButton4: {
      width: '50%',
      marginRight: 10,
    },
    confirmButton4: {
      width: '50%',
      marginLeft: 10,
    },
  })
);

const ThirdStep: React.FC = () => {
  const { getAllPharmacyDrug, getViewExchange } = new PharmacyDrug();

  const [isSelected, setIsSelected] = React.useState(false);

  const {
    activeStep,
    setActiveStep,
    uAllPharmacyDrug,
    setUAllPharmacyDrug,
    uBasketCount,
    exchangeId,
    exchangeStateCode,
    messageOfExchangeState,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const {
    paper,
    stickyToolbox,
    stickyRecommendation,
    actionContainer,
    cancelButton,
    cancelButton4,
    confirmButton4,
  } = style();

  const queryCache = useQueryCache();

  const [listPageNo, setListPage] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dataInfo, setDataInfo] = useState<any>([]);
  const [viewExhcnage, setViewExchange] = useState([]);

  const comparer = (otherArray: any): any => {
    return (current: any): any => {
      if (current.packID)
        return (
          otherArray.filter((other: any) => {
            return other.packID == current.packID;
          }).length == 0
        );
      else
        return (
          otherArray.filter((other: any) => {
            return other.id == current.id;
          }).length == 0
        );
    };
  };

  const { isLoading, error, data, refetch } = useQuery(
    ['key'],
    () => getAllPharmacyDrug('', listPageNo, pageSize),
    {
      onSuccess: (data) => {
        const { items, count } = data;
        setUAllPharmacyDrug(items);
        setDataInfo(items);
      },
      enabled: false,
    }
  );

  // useEffect(() => {
  //   setUAllPharmacyDrug([]);
  // }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      if (exchangeId > 0) {
        const result = await getViewExchange(exchangeId);
        setViewExchange(result);
      }
    })();
  }, [exchangeId]);

  useEffect(() => {
    const onlyA = dataInfo.filter(comparer(uBasketCount));
    setUAllPharmacyDrug(onlyA);
  }, [uBasketCount]);

  const { t } = useTranslation();

  const cardListGenerator = (): JSX.Element[] | null => {
    if (uAllPharmacyDrug.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return uAllPharmacyDrug
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map((item: AllPharmacyDrugInterface, index: number) => {
          Object.assign(item, {
            order: index + 1,
            buttonName: 'افزودن به تبادل',
            cardColor: 'white',
          });

          let isPack = false;
          let totalAmount = 0;
          if (item.packID && !packList.find((x) => x.packID === item.packID)) {
            uAllPharmacyDrug
              .filter((x) => x.packID === item.packID)
              .forEach((p: AllPharmacyDrugInterface) => {
                packList.push(p);
                totalAmount += p.amount;
              });
            item.totalAmount = totalAmount;
            isPack = true;
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
                    pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
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
                    pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                  />
                )}
              </div>
            </Grid>
          );
        });
    }

    return null;
  };

  const basketCardListGenerator = (): any => {
    if (uBasketCount && uBasketCount.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return uBasketCount.map(
        (item: AllPharmacyDrugInterface, index: number) => {
          item.order = index + 1;
          item.buttonName = 'حذف از تبادل';
          item.cardColor = '#89fd89';

          let isPack = false;
          let totalAmount = 0;
          let ignore = true;
          if (item.packID && !packList.find((x) => x.packID === item.packID)) {
            dataInfo
              .filter((x: any) => x.packID === item.packID)
              .forEach((p: AllPharmacyDrugInterface) => {
                packList.push(p);
                totalAmount += p.amount;
              });
            item.totalAmount = totalAmount;
            isPack = true;
            ignore = false;
            item.buttonName = 'حذف از تبادل';
            item.cardColor = '#89fd89';
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
        }
      );
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
              {basketCardListGenerator()}
              {cardListGenerator()}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Grid container className={stickyRecommendation}>
              <TextField
                style={{ width: '100%', marginTop: 15 }}
                label="توضیحات"
                multiline
                rows={8}
                defaultValue="توصیه ها"
                variant="outlined"
              />
              {(exchangeStateCode === 2 || exchangeStateCode === 4) && (
                <>
                  <TextField
                    style={{ width: '100%', marginTop: 15 }}
                    multiline
                    rows={4}
                    defaultValue={messageOfExchangeState}
                    variant="outlined"
                  />
                  <div className={actionContainer}>
                    <Button
                      className={
                        exchangeStateCode !== 4 ? cancelButton : cancelButton4
                      }
                      type="button"
                      variant="outlined"
                      color="red"
                    >
                      لغو درخواست
                    </Button>
                    {exchangeStateCode === 4 && (
                      <Button
                        className={confirmButton4}
                        type="button"
                        variant="outlined"
                        color="green"
                      >
                        تایید نهایی
                      </Button>
                    )}
                  </div>
                </>
              )}
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
                  {exchangeStateCode !== 2 && exchangeStateCode !== 4 && (
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
                  )}
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

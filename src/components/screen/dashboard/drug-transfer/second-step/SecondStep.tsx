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
import { useMutation, useQuery } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import sweetAlert from '../../../../../utils/sweetAlert';
import DesktopCardContent from '../desktop/DesktopCardContent';
import ActionButtons from '../exchange/ActionButtons';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

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
      marginLeft: '10px !important',
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
      top: 60,
      zIndex: 999,
    },
    desktopCardContent: {
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: -87,
      },
    },
    actionContainer: {
      display: 'flex',
      marginTop: 5,
      width: '100%',
    },
    cancelButton: {
      width: '100%',
    },
    confirmButton: {
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

const SecondStep: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();
  const { t } = useTranslation();

  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
    openDialog,
    setOpenDialog,
    basketCount,
    selectedPharmacyForTransfer,
    exchangeStateCode,
    messageOfExchangeState,
    viewExhcnage,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [orginalPharmacyDrug, setOrginalPharmacyDrug] = useState<
    AllPharmacyDrugInterface[]
  >([]);
  const { cancelExchange } = new PharmacyDrug();

  const [] = useMutation(cancelExchange, {
    onSuccess: async (res) => {
      if (res) {
        await sweetAlert({
          type: 'success',
          text: res.message,
        });
      } else {
        await sweetAlert({
          type: 'error',
          text: 'عملیات ناموفق',
        });
      }
    },
  });

  const {
    paper,
    stickyToolbox,
    stickyRecommendation,
    desktopCardContent,
  } = style();

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

  const [listPageNo] = useState(0);
  const [] = useState(0);
  const [pageSize] = useState(100);

  const { isLoading, refetch } = useQuery(
    ['key'],
    () => {
      return getAllPharmacyDrug(
        selectedPharmacyForTransfer,
        listPageNo,
        pageSize
      );
    },
    {
      onSuccess: (data) => {
        const items: AllPharmacyDrugInterface[] = data.items;
        const newItems: AllPharmacyDrugInterface[] = [];
        const packList = new Array<AllPharmacyDrugInterface>();
        items.forEach((item) => {
          let ignore = false;
          if (item.packID) {
            let totalAmount = 0;
            if (!packList.find((x) => x.packID === item.packID)) {
              if (!item.packDetails) item.packDetails = [];
              items
                .filter((x) => x.packID === item.packID)
                .forEach((p: AllPharmacyDrugInterface) => {
                  item.packDetails.push(p);
                  packList.push(p);
                  totalAmount += p.amount * p.cnt;
                });
              item.totalAmount = totalAmount;
              newItems.push(item);
            } else {
              ignore = true;
            }
          } else {
            if (!ignore) newItems.push(item);
          }
        });
        setAllPharmacyDrug(newItems);
      },
      enabled: false,
    }
  );

  const location = useLocation();
  const params = queryString.parse(location.search);

  useEffect(() => {
    const id = params.eid == null ? undefined : params.eid;
    if (id !== undefined && !selectedPharmacyForTransfer) return;
    refetch();
  }, [selectedPharmacyForTransfer]);

  useEffect(() => {
    basketCount.forEach((x) => {
      if (!x.packID) {
        const pharmacyDrug = allPharmacyDrug.find((a) => a.id === x.id);
        if (pharmacyDrug) {
          x.cnt = pharmacyDrug.cnt;
        }
      }
    });
  }, [basketCount]);

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return allPharmacyDrug
        .filter(comparer(basketCount))
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map((item: AllPharmacyDrugInterface, index: number) => {
          Object.assign(item, {
            order: index + 1,
            buttonName: 'افزودن به تبادل',
            cardColor: 'white',
          });

          // let isPack = false;
          // let totalAmount = 0;
          // if (item.packID) {
          //   if (!packList.find((x) => x.packID === item.packID)) {
          //     allPharmacyDrug
          //       .filter((x) => x.packID === item.packID)
          //       .forEach((p: AllPharmacyDrugInterface) => {
          //         packList.push(p);
          //         totalAmount += p.amount * p.cnt;
          //       });
          //     item.totalAmount = totalAmount;
          //     isPack = true;
          //   } else {
          //     return <></>;
          //   }
          // }

          return (
            <Grid item xs={12} sm={6} xl={4} key={index}>
              <div className={paper}>
                {item.packID ? (
                  <CardContainer
                    basicDetail={
                      <ExCardContent formType={1} pharmacyDrug={item} />
                    }
                    isPack={true}
                    pharmacyDrug={Object.assign(item, { currentCnt: item.cnt })}
                    collapsableContent={
                      <ExCardContent formType={3} packInfo={item.packDetails} />
                    }
                  />
                ) : (
                  <CardContainer
                    basicDetail={
                      <ExCardContent formType={2} pharmacyDrug={item} />
                    }
                    isPack={false}
                    pharmacyDrug={Object.assign(item, {
                      currentCnt: item.currentCnt ? item.currentCnt : item.cnt,
                    })}
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
    if (basketCount && basketCount.length > 0) {
      // let packList = new Array<AllPharmacyDrugInterface>();
      return basketCount.map(
        (item: AllPharmacyDrugInterface, index: number) => {
          item.order = index + 1;
          item.buttonName = 'حذف از تبادل';
          if (item.cardColor === 'white') item.cardColor = '#33ff33';

          // let isPack = false;
          // let totalAmount = 0;
          // let ignore = true;
          // if (item.packID && !packList.find((x) => x.packID === item.packID)) {
          //   packList = new Array<AllPharmacyDrugInterface>();
          //   basketCount
          //     .filter((x: any) => x.packID === item.packID)
          //     .forEach((p: AllPharmacyDrugInterface) => {
          //       packList.push(p);
          //       totalAmount += p.amount * p.cnt;
          //     });

          //   item.totalAmount = totalAmount;
          //   isPack = true;
          //   ignore = false;
          // }
          // if (
          //   ignore &&
          //   item.packID &&
          //   packList.find((x) => x.packID === item.packID)
          // ) {
          //   return;
          // }
          return (
            <Grid item xs={12} sm={6} xl={4} key={index}>
              <div className={paper}>
                {item.packID ? (
                  <CardContainer
                    basicDetail={
                      <ExCardContent formType={1} pharmacyDrug={item} />
                    }
                    isPack={true}
                    pharmacyDrug={item}
                    collapsableContent={
                      <ExCardContent formType={3} packInfo={item.packDetails} />
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
        <Grid container item spacing={1} xs={12}>
          <Grid item xs={12} md={9}>
            <Grid container item spacing={1} xs={12} className={stickyToolbox}>
              <Grid item xs={12} sm={7} md={7} style={{ padding: 0 }}>
                <SearchInAList />
              </Grid>
              <Grid item xs={12} sm={5} md={5} style={{ padding: 0 }}>
                <ToolBox />
              </Grid>
            </Grid>
            {isLoading && <CircleLoading />}
            <Grid container spacing={1}>
              <>
                {basketCardListGenerator()}
                {cardListGenerator()}
              </>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3} className={desktopCardContent}>
            <Grid container className={stickyRecommendation}>
              <DesktopCardContent item={viewExhcnage} />
              {/* <TextField
                style={{ width: '100%', marginTop: 15, fontSize: 10 }}
                label="توضیحات"
                multiline
                rows={4}
                defaultValue="توصیه ها"
                variant="outlined"
                value={recommendationMessage}
              /> */}
              <>
                {exchangeStateCode !== 1 && (
                  <TextField
                    style={{ width: '100%', marginTop: 15 }}
                    multiline
                    defaultValue={messageOfExchangeState}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
                <ActionButtons />
                {/* {showApproveModalForm && <ExchangeApprove />} */}
              </>
              <Hidden smDown>
                <Grid container item xs={12} sm={12} style={{ marginTop: 5 }}>
                  {!viewExhcnage && (
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
                  )}
                  <Grid
                    item
                    sm={!viewExhcnage ? 6 : 12}
                    style={{ textAlign: 'left' }}
                  >
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

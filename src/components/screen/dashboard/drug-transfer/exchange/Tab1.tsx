import React, { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { default as MatButton } from '@material-ui/core/Button';
import NewCardContainer from '../exchange/NewCardContainer';
import NewExCardContent from '../exchange/NewExCardContent';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import sweetAlert from '../../../../../utils/sweetAlert';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { setTransferEnd } from '../../../../../redux/actions';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';

const style = makeStyles((theme) =>
  createStyles({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.1em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '2px solid slategrey',
      },
    },
    paper: {
      padding: 0,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    stickyToolbox: {
      position: 'sticky',
      marginTop: -15,
      marginBottom: 15,
      marginLeft: '1px !important',
      top: 128,
      zIndex: 999,
    },
    stickyRecommendation: {
      position: 'sticky',
      margin: 0,
      padding: 10,
      paddingTop: 0,
      top: 60,
      zIndex: 999,
    },
    stickySearch: {
      position: 'sticky',
      top: '0',
      zIndex: 999,
      marginBottom: 8,
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

const Tab1: React.FC = () => {
  const { getAllPharmacyDrug } = new PharmacyDrug();
  const { t } = useTranslation();

  const {
    activeStep,
    setActiveStep,
    allPharmacyDrug,
    setAllPharmacyDrug,
    setOrgAllPharmacyDrug,
    openDialog,
    setOpenDialog,
    basketCount,
    selectedPharmacyForTransfer,
    lockedAction,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { cancelExchange } = new PharmacyDrug();
  const dispatch = useDispatch();

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

  useEffect(() => {
    return (): void => {
      dispatch(setTransferEnd());
    };
  }, []);

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

  const { paper, stickySearch } = style();

  const [listPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoading, refetch } = useQuery(
    ['key'],
    () => {
      setLoading(true);
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
        setOrgAllPharmacyDrug(newItems);
        setLoading(false);
      },
      enabled: false,
    }
  );

  const location = useLocation();
  const params = queryString.parse(location.search);

  useEffect(() => {
    setActiveStep(1);
  }, []);

  useEffect(() => {
    const id = params.eid == null ? undefined : params.eid;
    if (id !== undefined && !selectedPharmacyForTransfer) return;
    if (lockedAction) refetch();
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

  const basketCardListGenerator = (): any => {
    if (basketCount && basketCount.length > 0) {
      return basketCount.map(
        (item: AllPharmacyDrugInterface, index: number) => {
          item.order = index + 1;
          item.buttonName = 'حذف از تبادل';
          if (item.cardColor === 'white') item.cardColor = '#dff4ff';

          return (
            <Grid item xs={12} sm={12} xl={12} key={index}>
              <div className={paper}>
                {item.packID ? (
                  <NewCardContainer
                    basicDetail={
                      <NewExCardContent
                        formType={1}
                        pharmacyDrug={item}
                        isPack={true}
                      />
                    }
                    isPack={true}
                    pharmacyDrug={item}
                    collapsableContent={
                      <NewExCardContent
                        formType={3}
                        packInfo={item.packDetails}
                      />
                    }
                  />
                ) : (
                  <NewCardContainer
                    basicDetail={
                      <NewExCardContent
                        formType={2}
                        pharmacyDrug={item}
                        isPack={false}
                      />
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

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug.length > 0) {
      return (
        allPharmacyDrug
          // .filter(comparer(basketCount))
          // .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((item: AllPharmacyDrugInterface, index: number) => {
            // Object.assign(item, {
            //   order: index + 1,
            //   buttonName: 'افزودن به تبادل',
            //   cardColor: item.cardColor,
            // });

            if (basketCount.findIndex((x) => x.id == item.id) !== -1)
              Object.assign(item, {
                order: index + 1,
                buttonName: 'حذف از تبادل',
                cardColor: '#dff4ff',
                cnt: basketCount.find((x) => x.id == item.id)?.cnt,
                // totalAmount:
                //   basketCount.find((x) => x.id == item.id)?.cnt ??
                //   1 * item.amount,
              });
            else {
              Object.assign(item, {
                order: index + 1,
                buttonName: 'افزودن به تبادل',
                cardColor: 'white',
              });
            }

            return (
              <Grid item xs={12} sm={12} xl={12} key={index}>
                <div className={paper}>
                  {item.packID ? (
                    <NewCardContainer
                      key={`CardContainer_${item.id}`}
                      basicDetail={
                        <NewExCardContent
                          key={`CardContent${item.id}`}
                          formType={1}
                          pharmacyDrug={item}
                          isPack={true}
                        />
                      }
                      isPack={true}
                      pharmacyDrug={Object.assign(item, {
                        currentCnt: item.cnt,
                      })}
                      collapsableContent={
                        <NewExCardContent
                          key={`CardContent${item.id}`}
                          formType={3}
                          packInfo={item.packDetails}
                          isPack={true}
                        />
                      }
                    />
                  ) : (
                    <NewCardContainer
                      key={`CardContainer_${item.id}`}
                      basicDetail={
                        <NewExCardContent
                          key={item.id}
                          formType={2}
                          pharmacyDrug={item}
                          isPack={false}
                        />
                      }
                      isPack={false}
                      pharmacyDrug={Object.assign(item, {
                        currentCnt: item.currentCnt
                          ? item.currentCnt
                          : item.cnt,
                      })}
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
          fullWidth={true}
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
      <Grid
        item
        xs={12}
        style={{
          maxHeight: `${
            fullScreen ? 'calc(100vh - 260px)' : 'calc(100vh - 230px)'
          }`,
          minHeight: `${
            fullScreen ? 'calc(100vh - 260px)' : 'calc(100vh - 230px)'
          }`,
          overflow: 'auto',
          marginTop: -20,
        }}
      >
        <Grid container item spacing={1} xs={12}>
          <Grid item xs={12} md={12}>
            <Grid container className={stickySearch}>
              <Grid item xs={12} style={{ padding: 0 }}>
                <SearchInAList />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <>
                {/* {basketCardListGenerator()} */}
                {cardListGenerator()}
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ConfirmDialog />
      <CircleBackdropLoading isOpen={loading} />
    </>
  );
};

export default Tab1;

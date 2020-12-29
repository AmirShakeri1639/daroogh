import React, { useContext, useEffect, useState } from 'react';
import {
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Hidden,
  IconButton,
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
import {
  useQueryCache,
  useInfiniteQuery,
  ReactQueryCacheProvider,
} from 'react-query';
import { useIntersectionObserver } from '../../../../../hooks/useIntersectionObserver';
import JwtData from '../../../../../utils/JwtData';
import ExchangeApprove from '../exchange/ExchangeApprove';
import Modal from '../../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import sweetAlert from '../../../../../utils/sweetAlert';
import { Cancel, ConfirmOrNotExchange } from '../../../../../model/exchange';
import { errorHandler } from '../../../../../utils';
import DesktopCardContent from '../desktop/DesktopCardContent';
import ActionButtons from '../exchange/ActionButtons';
import { ExchangeInterface } from '../../../../../interfaces/ExchangeInterface';
import { ViewExchangeInterface } from '../../../../../interfaces';

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
  const { getAllPharmacyDrug, getViewExchange } = new PharmacyDrug();
  const { t } = useTranslation();

  const [modalType, setModalType] = useState('');
  const [isOpenCancelExchangeModal, setIsOpenCancelExchangeModal] = useState(
    false
  );
  const toggleIsOpenCancelExchangeModalForm = (type: string): void => {
    setModalType(type);
    setIsOpenCancelExchangeModal((v) => !v);
  };

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
    setBasketCount,
    selectedPharmacyForTransfer,
    exchangeStateCode,
    messageOfExchangeState,
    showApproveModalForm,
    setShowApproveModalForm,
    viewExhcnage,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { userData } = new JwtData();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataInfo, setDataInfo] = useState<any>([]);
  const [isGetData, setIsGetData] = useState<boolean>(false);
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const { cancelExchange, confirmOrNotExchange } = new PharmacyDrug();

  const [_cancelExchange, { isLoading: isLoadingSend }] = useMutation(
    cancelExchange,
    {
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
    }
  );

  const [
    _confirmOrNotExchange,
    { isLoading: isLoadingConfirmOrNotExchange },
  ] = useMutation(confirmOrNotExchange, {
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

  const handleCancelExchange = async (): Promise<any> => {
    const inputmodel = new Cancel();
    inputmodel.exchangeID = exchangeId;
    inputmodel.comment = comment;
    try {
      await _cancelExchange(inputmodel);
    } catch (e) {
      errorHandler(e);
    }
    toggleIsOpenCancelExchangeModalForm(modalType);
  };

  const handleConfirmOrNotExchange = async (
    isConfirm: boolean
  ): Promise<any> => {
    const inputmodel = new ConfirmOrNotExchange();
    inputmodel.exchangeID = exchangeId;
    inputmodel.isConfirm = isConfirm;
    try {
      await _confirmOrNotExchange(inputmodel);
    } catch (e) {
      errorHandler(e);
    }
    toggleIsOpenCancelExchangeModalForm(modalType);
  };

  const {
    paper,
    stickyToolbox,
    stickyRecommendation,
    actionContainer,
    cancelButton,
    confirmButton,
    cancelButton4,
    confirmButton4,
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

  const [listPageNo, setListPage] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const { isLoading, error, data, refetch } = useQuery(
    ['key'],
    () => getAllPharmacyDrug(selectedPharmacyForTransfer, listPageNo, pageSize),
    {
      onSuccess: (data) => {
        const { items, count } = data;
        setAllPharmacyDrug(items);
        setDataInfo(items);
      },
      enabled: false,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const onlyA = dataInfo.filter(comparer(basketCount));
    setAllPharmacyDrug(onlyA);
  }, [basketCount]);

  const cardListGenerator = (): JSX.Element[] | null => {
    if (allPharmacyDrug.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return allPharmacyDrug
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
            allPharmacyDrug
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
    if (basketCount && basketCount.length > 0) {
      const packList = new Array<AllPharmacyDrugInterface>();
      return basketCount.map(
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

  const handleClickOpen = (): any => {
    setOpenDialog(true);
  };

  const handleClose = (): any => {
    setOpenDialog(false);
  };

  const handleAgree = (): any => {
    setActiveStep(activeStep + 1);
  };

  // const ActionButtons = (): JSX.Element => {
  //   let element: JSX.Element = <></>;
  //   if (!viewExhcnage) return element;
  //   const vx: ViewExchangeInterface | undefined = viewExhcnage;
  //   if (vx) {
  //     if (vx.currentPharmacyIsA) {
  //       if (exchangeStateCode !== 6 && exchangeStateCode !== 10)
  //         element = (
  //           <Button
  //             className={exchangeStateCode !== 4 ? cancelButton : cancelButton4}
  //             type="button"
  //             variant="outlined"
  //             color="red"
  //             onClick={() => toggleIsOpenCancelExchangeModalForm('cancel')}
  //           >
  //             لغو درخواست
  //           </Button>
  //         );

  //       if (exchangeStateCode === 4 || exchangeStateCode === 8)
  //         element = (
  //           <>
  //             <>{element}</>
  //             <Button
  //               className={
  //                 exchangeStateCode === 8 ? confirmButton : confirmButton4
  //               }
  //               type="button"
  //               variant="outlined"
  //               color="green"
  //               onClick={(): any => {
  //                 setShowApproveModalForm(true);
  //               }}
  //             >
  //               پرداخت
  //             </Button>
  //           </>
  //         );

  //       if (exchangeStateCode === 10)
  //         element = (
  //           <>
  //             <>{element}</>
  //             <Button
  //               className={confirmButton}
  //               type="button"
  //               variant="outlined"
  //               color="green"
  //             >
  //               نمایش آدرس
  //             </Button>
  //           </>
  //         );
  //     } else {
  //       if (
  //         exchangeStateCode === 2 ||
  //         exchangeStateCode === 3 ||
  //         exchangeStateCode === 4
  //       ) {
  //         element = (
  //           <Button
  //             className={exchangeStateCode !== 2 ? cancelButton : cancelButton4}
  //             type="button"
  //             variant="outlined"
  //             color="red"
  //             onClick={() => toggleIsOpenCancelExchangeModalForm('cancel')}
  //           >
  //             لغو درخواست
  //           </Button>
  //         );
  //       }
  //       if (exchangeStateCode === 2)
  //         element = (
  //           <>
  //             <>{element}</>
  //             <Button
  //               className={confirmButton4}
  //               type="button"
  //               variant="outlined"
  //               color="green"
  //               onClick={() => toggleIsOpenCancelExchangeModalForm('approve')}
  //             >
  //               تایید نهایی
  //             </Button>
  //           </>
  //         );
  //       if (exchangeStateCode === 4 || exchangeStateCode === 9)
  //         element = (
  //           <>
  //             <>{element}</>
  //             <Button
  //               className={
  //                 exchangeStateCode === 9 ? confirmButton : confirmButton4
  //               }
  //               type="button"
  //               variant="outlined"
  //               color="green"
  //               onClick={(): any => {
  //                 setShowApproveModalForm(true);
  //               }}
  //             >
  //               پرداخت
  //             </Button>
  //           </>
  //         );

  //       if (exchangeStateCode === 8 || exchangeStateCode === 10)
  //         element = (
  //           <>
  //             <>{element}</>
  //             <Button
  //               className={confirmButton}
  //               type="button"
  //               variant="outlined"
  //               color="green"
  //             >
  //               نمایش آدرس
  //             </Button>
  //           </>
  //         );
  //     }
  //   }

  //   return element;
  // };

  // // TODO : here to move Action Component
  // const exchangeModalApproveCancel = (type: string): JSX.Element => {
  //   return (
  //     <Modal
  //       open={isOpenCancelExchangeModal}
  //       toggle={() => toggleIsOpenCancelExchangeModalForm(type)}
  //     >
  //       <Card>
  //         <CardHeader
  //           style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
  //           title={type === 'approve' ? 'تایید تبادل' : 'لغو تبادل'}
  //           titleTypographyProps={{ variant: 'h6' }}
  //           action={
  //             <IconButton
  //               style={{ marginTop: 10 }}
  //               aria-label="settings"
  //               onClick={() => toggleIsOpenCancelExchangeModalForm(type)}
  //             >
  //               <CloseIcon />
  //             </IconButton>
  //           }
  //         />
  //         <Divider />
  //         <CardContent>
  //           <Grid container spacing={1}>
  //             {type === 'approve' ? (
  //               <div>
  //                 <span>آیا از انجام تبادل اطمینان دارید؟</span>
  //               </div>
  //             ) : (
  //               <div>
  //                 <span>لطفا در صورت تمایل علت لغو تبادل را توضیح دهید</span>
  //                 <TextField
  //                   style={{ width: '100%', marginTop: 10, fontSize: 10 }}
  //                   label="توضیحات"
  //                   multiline
  //                   rows={5}
  //                   variant="outlined"
  //                 />
  //               </div>
  //             )}
  //           </Grid>
  //         </CardContent>
  //         <CardActions>
  //           {type === 'approve' ? (
  //             <MatButton
  //               onClick={() => handleConfirmOrNotExchange(true)}
  //               variant="contained"
  //               color="primary"
  //               autoFocus
  //             >
  //               تایید
  //             </MatButton>
  //           ) : (
  //             <MatButton
  //               onClick={handleCancelExchange}
  //               variant="contained"
  //               color="primary"
  //               autoFocus
  //             >
  //               لغو تبادل
  //             </MatButton>
  //           )}
  //         </CardActions>
  //       </Card>
  //     </Modal>
  //   );
  // };

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
            <Grid container spacing={1}>
              <>
                {isLoading && <CircleLoading />}
                {basketCardListGenerator()}
                {cardListGenerator()}
              </>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Grid container className={stickyRecommendation}>
              {viewExhcnage && <DesktopCardContent item={viewExhcnage} />}
              <TextField
                style={{ width: '100%', marginTop: 15, fontSize: 10 }}
                label="توضیحات"
                multiline
                rows={4}
                defaultValue="توصیه ها"
                variant="outlined"
                value={recommendationMessage}
              />
              <>
                {(exchangeStateCode === 2 || exchangeStateCode === 4) && (
                  <TextField
                    style={{ width: '100%', marginTop: 15 }}
                    multiline
                    rows={4}
                    defaultValue={messageOfExchangeState}
                    variant="outlined"
                  />
                )}
                <div className={actionContainer}>
                  <ActionButtons />
                </div>
                {showApproveModalForm && <ExchangeApprove />}
              </>
              {/* {isOpenCancelExchangeModal &&
                exchangeModalApproveCancel(modalType)} */}
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

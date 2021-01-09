import {
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
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Switch,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useContext } from 'react';
import { ViewExchangeInterface } from '../../../../../interfaces/ViewExchangeInterface';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { default as MatButton } from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import errorHandler from '../../../../../utils/errorHandler';
import {
  Cancel,
  ConfirmOrNotExchange,
  Send,
} from '../../../../../model/exchange';
import { useMutation } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import sweetAlert from '../../../../../utils/sweetAlert';
import Modal from '../../../../public/modal/Modal';
import ExchangeApprove from './ExchangeApprove';
import { useTranslation } from 'react-i18next';
import routes from '../../../../../routes';
import { useHistory } from 'react-router-dom';
import { PharmacyInfo } from '../../../../../interfaces/PharmacyInfo';
import { Map, TextLine } from '../../../../public';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ExCalculator from './ExCalculator';
import { theme } from '../../../../../RTL';

const style = makeStyles((theme) =>
  createStyles({
    actionContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 5,
      width: '100%',
    },
    cancelButton: {
      width: '100%',
    },
    confirmButton: {
      width: '100%',
    },
    fullRow: {
      width: '100%',
      marginBottom: 5,
    },
    cancelButton4: {
      width: '50%',
      marginRight: 10,
    },
    confirmButton4: {
      width: '50%',
      marginLeft: 10,
    },
    pharmacyInfoStyle: {
      flexGrow: 1,
      maxWidth: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        width: 600,
      },
    },
  })
);

const ActionButtons = (): JSX.Element => {
  const { t } = useTranslation();
  const { desktop } = routes;
  const history = useHistory();
  const {
    cancelButton,
    confirmButton,
    cancelButton4,
    confirmButton4,
    actionContainer,
    fullRow,
    pharmacyInfoStyle,
  } = style();
  const {
    activeStep,
    setActiveStep,
    exchangeStateCode,
    setShowApproveModalForm,
    viewExhcnage,
    exchangeId,
    showApproveModalForm,
    is3PercentOk,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const [comment, setComment] = useState<string>('');
  const [modalType, setModalType] = useState('');
  const [
    pharmacyInfoState,
    setPharmacyInfoState,
  ] = useState<PharmacyInfo | null>(null);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openApproveModal, setOpenApproveModal] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);

  const [isOpenCancelExchangeModal, setIsOpenCancelExchangeModal] = useState(
    false
  );
  const toggleIsOpenCancelExchangeModalForm = (type: string): void => {
    setModalType(type);
    setIsOpenCancelExchangeModal((v) => !v);
  };

  const [isRemoveExchangeModal, setIsRemoveExchangeModal] = useState(false);
  const toggleIsRemoveExchangeModalForm = (): void => {
    setIsRemoveExchangeModal((v) => !v);
  };

  const [isShowPharmacyInfoModal, setIsShowPharmacyInfoModal] = useState(false);
  const toggleIsShowPharmacyInfoModalForm = (): void => {
    setIsShowPharmacyInfoModal((v) => !v);
  };

  const {
    cancelExchange,
    confirmOrNotExchange,
    removeExchange,
    pharmacyInfo,
    send,
  } = new PharmacyDrug();

  const [_cancelExchange, { isLoading: isLoadingCancel }] = useMutation(
    cancelExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.data.message,
          });
          history.push(desktop);
        }
      },
    }
  );

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(
    removeExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.message,
          });
          history.push(desktop);
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
        history.push(desktop);
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

  const handleRemoveExchange = async (): Promise<any> => {
    try {
      await _removeExchange(exchangeId);
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
      if (viewExhcnage && viewExhcnage.state === 3) {
        setShowApproveModalForm(true);
      }
    } catch (e) {
      errorHandler(e);
    }
    toggleIsOpenCancelExchangeModalForm(modalType);
  };

  const handlePharmacyInfo = async (): Promise<any> => {
    try {
      const res = await pharmacyInfo(exchangeId);
      const response: PharmacyInfo = res.data;
      setPharmacyInfoState(response);
      toggleIsShowPharmacyInfoModalForm();
    } catch (e) {
      errorHandler(e);
    }
  };

  const Map1 = (): JSX.Element => {
    return (
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  const [_send, { isLoading: isLoadingSend }] = useMutation(send, {
    onSuccess: async (res) => {
      if (res) {
        history.push(desktop);
      }
    },
  });

  const handleSend = async (): Promise<any> => {
    const inputmodel = new Send();
    inputmodel.exchangeID = exchangeId;
    inputmodel.lockSuggestion = isSelected;
    try {
      await _send(inputmodel);
    } catch (e) {
      errorHandler(e);
    }
    setOpenApproveModal(false);
  };

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
  };

  const ShowApproveModal = (): JSX.Element => {
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openApproveModal}
        onClose={() => {
          setOpenApproveModal(false);
        }}
      >
        <DialogTitle>{'تایید نهایی'}</DialogTitle>
        <DialogContent>
          <ExCalculator exchange={viewExhcnage} full={false} />
          {/* {console.log('is3%:', is3PercentOk)} */}
          {is3PercentOk && (
            <DialogContentText>
              آیا می خواهید سبد انتخابی شما قفل باشد یا خیر؟
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSelected}
                      onChange={handleChange}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={isSelected ? 'بله' : 'خیر'}
                />
              </Grid>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <MatButton
            autoFocus
            onClick={() => {
              setOpenApproveModal(false);
            }}
            color="primary"
          >
            بستن
          </MatButton>
          <MatButton onClick={handleSend} color="primary" autoFocus>
            ارسال
          </MatButton>
        </DialogActions>
      </Dialog>
    );
  };

  const ShowPharmacyInfo = (): JSX.Element => {
    return (
      <Modal
        open={isShowPharmacyInfoModal}
        toggle={toggleIsShowPharmacyInfoModalForm}
      >
        <Card className={pharmacyInfoStyle}>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="اطلاعات داروخانه مقابل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsShowPharmacyInfoModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <span>نام داروخانه : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.name}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>آدرس : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.address}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>تلفن : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.telphon}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>موبایل : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.mobile}
                </span>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card>
                  <CardContent>
                    <Map />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}></Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  const exchangeModalRemove = (): JSX.Element => {
    return (
      <Modal
        open={isRemoveExchangeModal}
        toggle={toggleIsRemoveExchangeModalForm}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="حذف تبادل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsRemoveExchangeModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>آیا از حذف تبادل اطمینان دارید؟</span>
              </div>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MatButton
                  onClick={async (): Promise<any> =>
                    await handleRemoveExchange()
                  }
                  variant="contained"
                  color="primary"
                  autoFocus
                >
                  بله
                </MatButton>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'left' }}>
                <MatButton
                  onClick={toggleIsRemoveExchangeModalForm}
                  variant="contained"
                  color="secondary"
                  autoFocus
                >
                  خیر
                </MatButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  const exchangeModalApproveCancel = (type: string): JSX.Element => {
    return (
      <Modal
        open={isOpenCancelExchangeModal}
        toggle={(): any => toggleIsOpenCancelExchangeModalForm(type)}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title={type === 'approve' ? 'تایید تبادل' : 'لغو تبادل'}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={(): any => toggleIsOpenCancelExchangeModalForm(type)}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              {type === 'approve' ? (
                <div>
                  <span>آیا از انجام تبادل اطمینان دارید؟</span>
                </div>
              ) : (
                <div>
                  <span>لطفا در صورت تمایل علت لغو تبادل را توضیح دهید</span>
                  <TextField
                    style={{ width: '100%', marginTop: 10, fontSize: 10 }}
                    label="توضیحات"
                    multiline
                    rows={5}
                    variant="outlined"
                  />
                </div>
              )}
            </Grid>
          </CardContent>
          <CardActions>
            {type === 'approve' ? (
              <MatButton
                onClick={async (): Promise<any> =>
                  handleConfirmOrNotExchange(true)
                }
                variant="contained"
                color="primary"
                autoFocus
              >
                تایید
              </MatButton>
            ) : (
              <MatButton
                onClick={async (): Promise<any> => await handleCancelExchange()}
                variant="contained"
                color="primary"
                autoFocus
              >
                لغو تبادل
              </MatButton>
            )}
          </CardActions>
        </Card>
      </Modal>
    );
  };

  let element: JSX.Element = <></>;
  if (!viewExhcnage) return element;
  const vx: ViewExchangeInterface | undefined = viewExhcnage;
  if (vx) {
    let state = vx.state;
    // The First Side ==========================================
    if (vx.currentPharmacyIsA) {
      // این دکمه در تولبار و در هنگام کلیک بر روی سبد هندل شده است
      // if (state === 1)
      //   element = (
      //     <Button
      //       className={fullRow}
      //       type="button"
      //       variant="outlined"
      //       color="red"
      //       onClick={toggleIsRemoveExchangeModalForm}
      //     >
      //       حذف تبادل
      //     </Button>
      //   );

      if (state === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => toggleIsOpenCancelExchangeModalForm('cancel')}
            >
              لغو درخواست
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
                        
          </>
        );

      if (state === 3)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('approve');
              }}
            >
              تایید و پرداخت
            </Button>

            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('cancel');
              }}
            >
              عدم تایید
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>

          </>
          
        );

      if (state === 4)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );

      if (state === 10 || state === 8)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );

        if (state === 9)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
          
        );

      if (state === 1 && activeStep === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={(): void => setOpenApproveModal(true)}
            >
              {t('general.sendExchange')}
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );
      // The Second Side ==========================================
    } else {
      if (state > 10) state = state - 10;
      if (state === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('approve');
              }}
            >
              تایید و پرداخت
            </Button>

            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('cancel');
              }}
            >
              عدم تایید
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>

          </>
          
        );

     
      if (state === 4)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );

      if (state === 9 || state === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={handlePharmacyInfo}

            >
              نمایش آدرس
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );
        if (state === 8)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
            
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => history.push(desktop)}
            >
              برگشت به کارتابل
            </Button>
          </>
        );
    }
  }

  element = (
    <>
      <>{element}</>
      {isOpenCancelExchangeModal && exchangeModalApproveCancel(modalType)}
      {isRemoveExchangeModal && exchangeModalRemove()}
      {showApproveModalForm && <ExchangeApprove />}
      {isShowPharmacyInfoModal && <ShowPharmacyInfo />}
      {<ShowApproveModal />}
    </>
  );

  return <div className={actionContainer}> {element} </div>;
};

export default ActionButtons;

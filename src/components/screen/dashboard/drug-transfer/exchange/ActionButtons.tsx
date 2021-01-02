import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useContext } from 'react';
import { ViewExchangeInterface } from '../../../../../interfaces/ViewExchangeInterface';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { default as MatButton } from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import errorHandler from '../../../../../utils/errorHandler';
import { Cancel, ConfirmOrNotExchange } from '../../../../../model/exchange';
import { useMutation } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import sweetAlert from '../../../../../utils/sweetAlert';
import Modal from '../../../../public/modal/Modal';
import ExchangeApprove from './ExchangeApprove';
import { useTranslation } from 'react-i18next';
import routes from '../../../../../routes';
import { useHistory } from 'react-router-dom';

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
  } = style();
  const {
    activeStep,
    setActiveStep,
    exchangeStateCode,
    setShowApproveModalForm,
    viewExhcnage,
    exchangeId,
    showApproveModalForm,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const [comment, setComment] = useState<string>('');
  const [modalType, setModalType] = useState('');

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

  const {
    cancelExchange,
    confirmOrNotExchange,
    removeExchange,
  } = new PharmacyDrug();

  const [_cancelExchange, { isLoading: isLoadingSend }] = useMutation(
    cancelExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.message,
          });
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
    if (vx.currentPharmacyIsA) {
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

      if (state === 2 || state === 10)
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
          </>
        );

      if (state === 4 || state === 8)
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
          </>
        );

      if (state === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
            >
              نمایش آدرس
            </Button>
          </>
        );

      if (state !== 2 && state !== 4 && activeStep === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={(): void => setActiveStep(activeStep + 1)}
            >
              {t('general.sendExchange')}
            </Button>
          </>
        );
    } else {
      if (state > 10) state = state - 10;
      if (state === 2 || state === 3) {
        element = (
          <Button
            className={fullRow}
            type="button"
            variant="outlined"
            color="red"
            onClick={(): any => toggleIsOpenCancelExchangeModalForm('cancel')}
          >
            لغو درخواست
          </Button>
        );
      }
      if (state === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any =>
                toggleIsOpenCancelExchangeModalForm('approve')
              }
            >
              تایید نهایی
            </Button>
          </>
        );
      if (state === 4 || state === 9)
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
          </>
        );

      if (state === 8 || state === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
            >
              نمایش آدرس
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
    </>
  );

  return <div className={actionContainer}> {element} </div>;
};

export default ActionButtons;

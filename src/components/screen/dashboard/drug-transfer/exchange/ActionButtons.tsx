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

const style = makeStyles((theme) =>
  createStyles({
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

const ActionButtons = (): JSX.Element => {
  const {
    cancelButton,
    confirmButton,
    cancelButton4,
    confirmButton4,
  } = style();
  const {
    exchangeStateCode,
    setShowApproveModalForm,
    viewExhcnage,
    exchangeId,
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
                onClick={(): any => handleConfirmOrNotExchange(true)}
                variant="contained"
                color="primary"
                autoFocus
              >
                تایید
              </MatButton>
            ) : (
              <MatButton
                onClick={handleCancelExchange}
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
    if (vx.currentPharmacyIsA) {
      if (exchangeStateCode !== 6 && exchangeStateCode !== 10)
        element = (
          <Button
            className={exchangeStateCode !== 4 ? cancelButton : cancelButton4}
            type="button"
            variant="outlined"
            color="red"
            onClick={(): any => toggleIsOpenCancelExchangeModalForm('cancel')}
          >
            لغو درخواست
          </Button>
        );

      if (exchangeStateCode === 4 || exchangeStateCode === 8)
        element = (
          <>
            <>{element}</>
            <Button
              className={
                exchangeStateCode === 8 ? confirmButton : confirmButton4
              }
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

      if (exchangeStateCode === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={confirmButton}
              type="button"
              variant="outlined"
              color="green"
            >
              نمایش آدرس
            </Button>
          </>
        );
    } else {
      if (
        exchangeStateCode === 2 ||
        exchangeStateCode === 3 ||
        exchangeStateCode === 4
      ) {
        element = (
          <Button
            className={exchangeStateCode !== 2 ? cancelButton : cancelButton4}
            type="button"
            variant="outlined"
            color="red"
            onClick={(): any => toggleIsOpenCancelExchangeModalForm('cancel')}
          >
            لغو درخواست
          </Button>
        );
      }
      if (exchangeStateCode === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={confirmButton4}
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
      if (exchangeStateCode === 4 || exchangeStateCode === 9)
        element = (
          <>
            <>{element}</>
            <Button
              className={
                exchangeStateCode === 9 ? confirmButton : confirmButton4
              }
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

      if (exchangeStateCode === 8 || exchangeStateCode === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={confirmButton}
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
    </>
  );

  return element;
};

export default ActionButtons;

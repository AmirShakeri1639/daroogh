import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  createStyles,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
} from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from '../../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import Button from '../../../../public/button/Button';
import {
  AccountingInterface,
  BankGetwayesInterface,
  GetAccountingForPaymentInterace,
  PaymentExchangeByBestankari,
} from '../../../../../interfaces/AccountingInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextLine from '../../../../public/text-line/TextLine';
import {
  faCalendarTimes,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { Select } from '@material-ui/core';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import moment from 'jalali-moment';
import Utils from '../../../../public/utility/Utils';
import { Payment } from '../../../../../model/exchange';
import routes from '../../../../../routes';
import { useHistory } from 'react-router-dom';
import Ribbon from '../../../../public/ribbon/Ribbon';
import sweetAlert from '../../../../../utils/sweetAlert';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        width: 600,
      },
    },
    cardDetail: {
      width: '100%',
      display: 'inline-block',
      position: 'relative',
      backgroundColor: '#E4E4E4',
      textAlign: 'center',
    },
    content: {
      display: 'contents',
    },
    paper: {
      textAlign: 'center',
      padding: theme.spacing(1),
      backgroundColor: '#E4E4E4',
    },
    card: {
      backgroundColor: 'silver',
      borderRadius: 5,
      boxShadow: '0 5px 8px',
      textAlign: 'center',
    },
    stickyCardAction: {
      backgroundColor: '#c6c5ffc7',
      position: 'fixed',
      width: '100%',
      bottom: 0,
    },
  })
);

interface ExchangeApprovePI {
  isModal?: boolean;
  exchangeId?: string;
}

const ExchangeApprove: React.FC<ExchangeApprovePI> = (props) => {
  const { isModal = true, exchangeId = "" } = props;
  const {
    root,
    paper,
    card,
    stickyCardAction,
    content,
    cardDetail,
  } = useClasses();
  const [accountingForPayment, setAccountingForPayment] = useState<
    AccountingInterface[]
  >([]);
  const [bankGetwayes, setBankGetwayes] = useState<BankGetwayesInterface[]>([]);

  const { desktop } = routes;
  const history = useHistory();
  const refFrom = useRef<any>();

  const { getAccountingForPayment, getPayment } = new PharmacyDrug();

  const [totalAmount, setTotoalAmount] = useState(0);
  const [debtAmountAllow, setDebtAmountAllow] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [mandeh, setMandeh] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [payment, setPayment] = useState<Payment>(new Payment());
  const [paymentExchangeByBestankari, setPaymentExchangeByBestankari] = useState<PaymentExchangeByBestankari | undefined>(undefined)

  const { showApproveModalForm, setShowApproveModalForm } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const toggleIsOpenModalForm = (): void =>
    setShowApproveModalForm(!showApproveModalForm);

  const handleChangeBank = (
    id: React.ChangeEvent<{ value: unknown }>
  ): void => {
    // const currentTarget: any = id.currentTarget;
    // const name = currentTarget.innerText;
    const pay = payment;
    pay.bankGetway = String(id.target.value);
    setPayment(pay);
  };

  const handleAccountingIds = (type: string, id: number): void => {
    const pay = payment;
    if (type === 'add') pay.accountingIds.push(id);
    else {
      const index = pay.accountingIds.indexOf(id);
      if (index > -1) {
        pay.accountingIds.splice(index, 1);
      }
    }
    setPayment(pay);
  };

  useEffect(() => {
    (async (): Promise<void> => {
      debugger;
      const result = await getAccountingForPayment(exchangeId);
      if (result) {
        const response: GetAccountingForPaymentInterace = result.data;
        setPaymentExchangeByBestankari(response.paymentExchangeByBestankari);
        if (response.paymentExchangeByBestankari && response.paymentExchangeByBestankari.isSuccess) {
          await sweetAlert({
            type: 'success',
            text: response.paymentExchangeByBestankari.message,
          });
          history.push(desktop);
        }
        setDebtAmountAllow(response.debtAmountAllow);
        const res: AccountingInterface[] = response.accountingForPayment.sort(
          (a: any, b: any) => (a > b ? 1 : -1)
        );
        setAccountingForPayment(res);
        if (res && res.length > 0) {
          setMandeh(res[0].mandeh);
          const amount = res[0].amount > 0 ? res[0].amount : 0;
          setPaymentAmount(amount);
        }
        const banks: BankGetwayesInterface[] = response.bankGetwayes;
        setBankGetwayes(banks);
      }
    })();
  }, []);

  const handleSubmit_temp = async (event: any): Promise<any> => {
    event.preventDefault();
    const res = await getPayment(payment);
    fetch(res.data.url, {
      method: 'POST',
      body: JSON.stringify({
        commandType: res.data.form.CommandType,
        trackingNumber: res.data.form.trackingNumber,
        amount: res.data.form.amount,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('123');
      })
      .then((data) => {
        console.log(data);
      });
  };

  const handleSubmit = async (): Promise<any> => {
    debugger;
    const res = await getPayment(payment);
    if (res.data.type === 1) {
      // history.push(res.data.url)
      window.location.href = res.data.url;
    } else {
      setPaymentAmount(res.data.form.amount);
      setTrackingNumber(res.data.form.trackingNumber);
      setRedirectUrl(res.data.form.redirectUrl);
      refFrom.current.submit();
    }
  };

  const PaymentPage = (): JSX.Element => {
    return (
      <>
        <form
          ref={refFrom}
          method="post"
          action="https://api.daroog.org/MyVirtualGateway"
        >
          <input type="hidden" value={paymentAmount} name="amount"></input>
          <input type="hidden" value={'request'} name="commandType"></input>
          <input
            type="hidden"
            value={trackingNumber}
            name="trackingNumber"
          ></input>
          <input type="hidden" value={redirectUrl} name="redirectUrl"></input>
          {/* <button type="submit" >
            <span style={{ width: 100 }}>پرداخت</span>
          </button> */}
        </form>
        <Button
          type="button"
          variant="outlined"
          color="green"
          onClick={async (): Promise<any> => handleSubmit()}
        >
          <span style={{ width: 100 }}>پرداخت</span>
        </Button>
      </>
    );
  };

  const cardDetailContent = (item: AccountingInterface): JSX.Element => {
    return (
      <Card className={cardDetail}>
        {item.amount <= 0 && <Ribbon text="بستانکار" isExchange={false} />}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li
            style={{
              textAlign: 'center',
              fontSize: 12,
              minHeight: 50,
              margin: 60,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {item.description}
          </li>
          <li>
            <Grid alignItems="flex-end" container spacing={1}>
              <Grid item xs={1} style={{ textAlign: 'left' }}>
                <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
              </Grid>
              <Grid item xs={11}>
                <TextLine
                  rightText={'مبلغ'}
                  leftText={Utils.numberWithCommas(item.amount)}
                />
              </Grid>
            </Grid>
          </li>
          {/* <li>{item.amount}</li> */}
          <li>
            <Grid alignItems="flex-end" container spacing={1}>
              <Grid item xs={1} style={{ textAlign: 'left' }}>
                <FontAwesomeIcon icon={faCalendarTimes} size="sm" />
              </Grid>
              <Grid item xs={11}>
                <TextLine
                  rightText={'تاریخ'}
                  leftText={moment(item.date, 'YYYY/MM/DD')
                    .locale('fa')
                    .format('YYYY/MM/DD')}
                />
              </Grid>
            </Grid>
          </li>
        </ul>
        <div
          style={{
            marginTop: item.amount <= 0 ? 0 : -10,
            padding: item.amount <= 0 ? 8 : 0,
          }}
        >
          {item.amount <= 0 ? (
            <span
              style={{
                fontWeight: 'bold',
                color: 'red',
                margin: 11,
              }}
            ></span>
          ) : (
              <Checkbox
                disabled={item.amount <= 0}
                checked={item.isChecked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): any => {
                  item.isChecked = e.target.checked;
                  let amount = 0;
                  if (e.target.checked) {
                    amount = totalAmount + item.amount;
                    setTotoalAmount(amount);
                    handleAccountingIds('add', item.id);
                  } else {
                    amount = totalAmount - item.amount;
                    setTotoalAmount(amount);
                    handleAccountingIds('remove', item.id);
                  }
                  if (amount > paymentAmount) setPaymentAmount(paymentAmount);
                  else setPaymentAmount(amount);
                }}
              />
            )}
        </div>
      </Card>
    );
  };

  const Content = (): JSX.Element => {
    return (
      <Card className={`${root} ${!isModal ? content : ''}`}>
        <CardHeader
          style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
          title="لیست موارد قابل پرداخت"
          titleTypographyProps={{ variant: 'h6' }}
          action={
            isModal && (
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsOpenModalForm}
              >
                <CloseIcon />
              </IconButton>
            )
          }
        />
        <Divider />
        <CardContent style={{ marginBottom: 110 }}>
          <div>
            {accountingForPayment && accountingForPayment.length > 0 ? (
              <span>
                با توجه به اینکه حداکثر بدهی در سیستم داروگ مبلغ
                <span style={{ marginRight: 5, marginLeft: 5, color: 'red' }}>
                  <b>{Utils.numberWithCommas(debtAmountAllow)}</b>
                </span>
                <span>
                  ریال می باشد لطفا از لیست ذیل موارد دلخواه خود را انتخاب و سپس
                  پرداخت نمایید
                </span>
              </span>
            ) : (
                <span>هیچ داده ای وجود ندارد</span>
              )}
          </div>
          <hr />
          <Grid container spacing={1}>
            {accountingForPayment.map(
              (item: AccountingInterface, index: number) => (
                <Grid
                  key={index}
                  item
                  //   className={card}
                  xs={12}
                  sm={4}
                >
                  {cardDetailContent(item)}
                </Grid>
              )
            )}
          </Grid>
        </CardContent>
        <CardActions className={stickyCardAction}>
          <Grid container spacing={1}>
            <Grid item xs={12} xl={12} md={12} style={{ marginBottom: -5 }}>
              <FormControl style={{ width: 120, marginTop: -10 }}>
                <InputLabel>درگاه پرداخت</InputLabel>
                <Select onChange={handleChangeBank}>
                  {bankGetwayes.map((item: BankGetwayesInterface) => (
                    <MenuItem value={item.name}>{item.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <ul style={{ display: 'inline-block', margin: 0 }}>
                {/* <li>
                  <b style={{ color: 'red' }}>
                    <span>مبلغ قابل پرداخت: </span>
                    <span>{paymentAmount}</span>
                  </b>
                </li> */}
              {/* <li>
                <b>
                  <span>مبلغ انتخابی: </span>
                  <span>{totalAmount}</span>
                </b>
              </li>
              </ul>  */}
            </Grid>
            <Grid container style={{ backgroundColor: '#8a88efc7', margin: 5, padding: 5 }}>
              <Grid item xs={6} xl={6} md={6}>
                <span>مبلغ انتخابی: </span>
                <span style={{ fontWeight: 'bold', color: 'green' }}>{Utils.numberWithCommas(totalAmount)}</span>
              </Grid>
              <Grid item xs={6} xl={6} md={6} style={{ textAlign: 'left' }}>
                <span>مبلغ قابل پرداخت: </span>
                <span style={{ fontWeight: 'bold', color: 'red' }}>{Utils.numberWithCommas(mandeh)}</span>
              </Grid>
            </Grid>
            <Grid item xs={6} xl={6} md={6}>
              <PaymentPage />
            </Grid>
            <Grid item xs={6} xl={6} md={6} style={{ textAlign: 'left' }}>
              <Button
                type="button"
                variant="outlined"
                color="red"
                onClick={(): any => history.push(desktop)}
              >
                بعدا پرداخت میکنم
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card >
    );
  };

  return (
    <>
      {((!exchangeId || exchangeId == "") &&
        (!paymentExchangeByBestankari || !paymentExchangeByBestankari.isSuccess)) &&
        isModal ? (
          <Modal open={showApproveModalForm} toggle={toggleIsOpenModalForm}>
            <Content />
          </Modal>
        ) : (
          <Content />
        )
      }
    </>
  );
};

export default ExchangeApprove;

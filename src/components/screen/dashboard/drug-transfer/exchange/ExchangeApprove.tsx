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
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';

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
    // paper: {
    //   textAlign: 'center',
    //   padding: theme.spacing(1),
    //   backgroundColor: '#E4E4E4',
    // },
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
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 0,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        borderLeft: '3px solid #f80501',
        height: '40px',
        backgroundColor: '#FEFFF2',
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },
    checkBoxContainer: {
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
    },
    cardContainer:{
      margin:theme.spacing(2)
    }
  })
);

interface ExchangeApprovePI {
  isModal?: boolean;
  // exchangeId?: string;
}

const ExchangeApprove: React.FC<ExchangeApprovePI> = (props) => {
  const { isModal = true } = props;
  const { t } = useTranslation();
  const {
    root,
    paper,
    card,
    stickyCardAction,
    content,
    cardDetail,
    container,
    checkBoxContainer,
    cardContainer
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
  const [
    paymentExchangeByBestankari,
    setPaymentExchangeByBestankari,
  ] = useState<PaymentExchangeByBestankari | undefined>(undefined);

  const {
    showApproveModalForm,
    setShowApproveModalForm,
    exchangeId,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

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
      const result = await getAccountingForPayment(exchangeId);
      if (result) {
        const response: GetAccountingForPaymentInterace = result.data;
        setPaymentExchangeByBestankari(response.paymentExchangeByBestankari);
        if (
          response.paymentExchangeByBestankari &&
          response.paymentExchangeByBestankari.isSuccess
        ) {
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
      <>
        <Grid container item xs={12}>
          <Paper className={paper} elevation={1} style={{width:'100%'}}>
            <Grid container spacing={0}>
              <Grid item container xs={10}>
                <div className={container}>
                  <Grid container spacing={0}>
                    <Grid container xs={12} className="drug-container">
                      <Grid item xs={1}>
                        <img src="pack.png" style={{ height: '25px' }} />
                      </Grid>
                      <Grid
                        item
                        xs={11}
                        style={{ alignItems: 'center', paddingRight: '8px' }}
                      >
                        <span>{item.description}</span>
                      </Grid>
                    </Grid>

                    <Grid item container xs={12} style={{ padding: '8px' }}>
                      <Grid item xs={12}>
                        <TextWithTitle
                          title={t('accounting.amount')}
                          body={Utils.numberWithCommas(Math.abs(item.amount))}
                          suffix={t('general.defaultCurrency')}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextWithTitle
                          title={t('general.date')}
                          body={moment(item.date, 'YYYY/MM/DD')
                            .locale('fa')
                            .format('YYYY/MM/DD')}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextWithTitle
                          title="نوع تراکنش"
                          body={item.amount <= 0 ? 'بستانکار' : 'بدهکار'}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={2} className={checkBoxContainer}>
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </>
      // <Card className={cardDetail}>
      //   {item.amount <= 0 && <Ribbon text="بستانکار" isExchange={false} />}
      //   <ul style={{ listStyleType: 'none', padding: 0 }}>
      //     <li
      //       style={{
      //         textAlign: 'center',
      //         fontSize: 12,
      //         minHeight: 50,
      //         margin: 60,
      //         marginTop: 0,
      //         marginBottom: 0,
      //       }}
      //     >
      //       {item.description}
      //     </li>
      //     <li>
      //       <Grid alignItems="flex-end" container spacing={1}>
      //         <Grid item xs={1} style={{ textAlign: 'left' }}>
      //           <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
      //         </Grid>
      //         <Grid item xs={11}>
      //           <TextLine
      //             rightText={'مبلغ'}
      //             leftText={Utils.numberWithCommas(item.amount)}
      //           />
      //         </Grid>
      //       </Grid>
      //     </li>
      //     {/* <li>{item.amount}</li> */}
      //     <li>
      //       <Grid alignItems="flex-end" container spacing={1}>
      //         <Grid item xs={1} style={{ textAlign: 'left' }}>
      //           <FontAwesomeIcon icon={faCalendarTimes} size="sm" />
      //         </Grid>
      //         <Grid item xs={11}>
      //           <TextLine
      //             rightText={'تاریخ'}
      //             leftText={moment(item.date, 'YYYY/MM/DD')
      //               .locale('fa')
      //               .format('YYYY/MM/DD')}
      //           />
      //         </Grid>
      //       </Grid>
      //     </li>
      //   </ul>
      //   <div
      //     style={{
      //       marginTop: item.amount <= 0 ? 0 : -10,
      //       padding: item.amount <= 0 ? 8 : 0,
      //     }}
      //   >
      //     {item.amount <= 0 ? (
      //       <span
      //         style={{
      //           fontWeight: 'bold',
      //           color: 'red',
      //           margin: 11,
      //         }}
      //       ></span>
      //     ) : (
      //       <Checkbox
      //         disabled={item.amount <= 0}
      //         checked={item.isChecked}
      //         onChange={(e: React.ChangeEvent<HTMLInputElement>): any => {
      //           item.isChecked = e.target.checked;
      //           let amount = 0;
      //           if (e.target.checked) {
      //             amount = totalAmount + item.amount;
      //             setTotoalAmount(amount);
      //             handleAccountingIds('add', item.id);
      //           } else {
      //             amount = totalAmount - item.amount;
      //             setTotoalAmount(amount);
      //             handleAccountingIds('remove', item.id);
      //           }
      //           if (amount > paymentAmount) setPaymentAmount(paymentAmount);
      //           else setPaymentAmount(amount);
      //         }}
      //       />
      //     )}
      //   </div>
      // </Card>
    );
  };

  const Content = (): JSX.Element => {
    return (
      <Grid container>

        { !isModal && <Grid  item xs={12} style={{marginTop:16}}>
          <span style={{fontSize:16}}>لیست موارد قابل پرداخت</span>
        </Grid>}
 
        <Grid item xs={12} style={{marginTop:8}}>
        {accountingForPayment && accountingForPayment.length > 0 ? (
                <span>
                  با توجه به اینکه حداکثر بدهی در سیستم داروگ مبلغ
                  <span style={{ marginRight: 5, marginLeft: 5, color: 'red' }}>
                    <b>{Utils.numberWithCommas(debtAmountAllow)}</b>
                  </span>
                  <span>
                    {t('general.defaultCurrency')} می باشد لطفا از لیست ذیل
                    موارد دلخواه خود را انتخاب و سپس پرداخت نمایید
                  </span>
                </span>
              ) : (
                <span>هیچ موردی برای ورداخت وجود ندارد</span>
              )}
        </Grid>
        <Grid item style={{margin:4}} xs={12}>
          <Divider/>
        </Grid>
        <Grid item container xs={12} spacing={2} className={cardContainer}>
        {accountingForPayment.map(
                (item: AccountingInterface, index: number) => (
                  <Grid
                    key={index}
                    item
                    //   className={card}
                    xs={isModal ? 12: 4}
                    
                  >
                    {cardDetailContent(item)}
                  </Grid>
                )
              )}
        </Grid>
        
      </Grid>
    );
  };

  return (
    <>
      {paymentExchangeByBestankari && paymentExchangeByBestankari.isSuccess ? (
        <></>
      ) : isModal && paymentExchangeByBestankari ? (
        <Modal open={showApproveModalForm} toggle={toggleIsOpenModalForm}>
          <Content />
        </Modal>
      ) : (
        <Container>
                  <Content />

        </Container>
      )}
    </>
  );
};

export default ExchangeApprove;

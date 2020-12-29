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
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import Button from '../../../../public/button/Button';
import { AccountingInterface } from '../../../../../interfaces/AccountingInterface';
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

const ExchangeApprove: React.FC = () => {
  const { root, paper, card, stickyCardAction } = useClasses();
  const [accountingForPayment, setAccountingForPayment] = useState<
    AccountingInterface[]
  >([]);

  const { getAccountingForPayment } = new PharmacyDrug();

  const [totalAmount, setTotoalAmount] = useState(0);
  const [maxDebt, setMaxDebt] = useState(2000000);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const { showApproveModalForm, setShowApproveModalForm } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const toggleIsOpenModalForm = (): void =>
    setShowApproveModalForm(!showApproveModalForm);

  useEffect(() => {
    (async (): Promise<void> => {
      const result = await getAccountingForPayment(10);
      if (result) {
        const res: AccountingInterface[] = result.data.accountingForPayment.sort(
          (a: any, b: any) => (a > b ? 1 : -1)
        );
        setAccountingForPayment(res);
        const amount = res[0].amount > 0 ? res[0].amount : 0;
        setPaymentAmount(amount);
      }
    })();
  }, []);

  const redirectPaymentPage = (): any => {
    fetch('https://api.sumon.ir/MyVirtualGateway', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commandType: 'request',
        trackingNumber: '1000',
        amount: '23500',
        redirectUrl: 'https://api.sumon.ir/payment/verify?paymentToken',
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log('error'));
  };

  const handleSubmit = (event: any): any => {
    event.preventDefault();
    redirectPaymentPage();
  };

  const PaymentPage = (): JSX.Element => {
    return (
      <form method="post" action="https://api.sumon.ir/MyVirtualGateway">
        <input type="hidden" value={paymentAmount} name="amount"></input>
        <input type="hidden" value={'request'} name="commandType"></input>
        <input type="hidden" value={'1000'} name="trackingNumber"></input>
        <input
          type="hidden"
          value={'https://api.sumon.ir/payment/verify?paymentToken'}
          name="redirectUrl"
        ></input>
        <Button type="submit" variant="outlined" color="green">
          <span style={{ width: 100 }}>پرداخت</span>
        </Button>
      </form>
    );
  };

  return (
    <Modal open={showApproveModalForm} toggle={toggleIsOpenModalForm}>
      <Card className={root}>
        <CardHeader
          style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
          title="لیست موارد قابل پرداخت"
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <IconButton
              style={{ marginTop: 10 }}
              aria-label="settings"
              onClick={toggleIsOpenModalForm}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent style={{ marginBottom: 90 }}>
          <Grid container spacing={1}>
            <div>
              <span>
                با توجه به اینکه حداکثر بدهی در سیستم داروگ مبلغ
                <span style={{ marginRight: 5, marginLeft: 5, color: 'red' }}>
                  <b>{maxDebt}</b>
                </span>
                <span>
                  تومان می باشد لطفا از لیست ذیل موارد دلخواه خود را انتخاب و
                  سپس پرداخت نمایید
                </span>
              </span>
            </div>
            {accountingForPayment.map(
              (item: AccountingInterface, index: number) => (
                <Grid
                  key={index}
                  item
                  //   className={card}
                  xs={12}
                  sm={4}
                >
                  <Paper className={paper}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li style={{ fontSize: 12, minHeight: 50 }}>
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
                        >
                          بستانکار
                        </span>
                      ) : (
                        <Checkbox
                          disabled={item.amount <= 0}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): any => {
                            item.isChecked = e.target.checked;
                            let amount = 0;
                            if (e.target.checked) {
                              amount = totalAmount + item.amount;
                              setTotoalAmount(amount);
                            } else {
                              amount = totalAmount - item.amount;
                              setTotoalAmount(amount);
                            }
                            if (amount > paymentAmount)
                              setPaymentAmount(paymentAmount);
                            else setPaymentAmount(amount);
                          }}
                        />
                      )}
                    </div>
                  </Paper>
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
                <Select>
                  <MenuItem value={1}>بانک پارسیان</MenuItem>
                  <MenuItem value={2}>بانک تست</MenuItem>
                </Select>
              </FormControl>
              <ul style={{ display: 'inline-block', margin: 0 }}>
                <li>
                  <b style={{ color: 'red' }}>
                    <span>مبلغ قابل پرداخت: </span>
                    <span>{paymentAmount}</span>
                  </b>
                </li>
                <li>
                  <b>
                    <span>مبلغ انتخابی: </span>
                    <span>{totalAmount}</span>
                  </b>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} xl={6} md={6}>
              <PaymentPage />
            </Grid>
            <Grid item xs={6} xl={6} md={6} style={{ textAlign: 'left' }}>
              <Button type="button" variant="outlined" color="red">
                بعدا پرداخت میکنم
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default ExchangeApprove;

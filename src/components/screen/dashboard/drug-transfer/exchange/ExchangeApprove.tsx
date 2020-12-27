import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
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

  const [totalAmount, setTotoalAmount] = useState(0);
  const [maxDebt, setMaxDebt] = useState(2000000);

  const { showApproveModalForm, setShowApproveModalForm } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const toggleIsOpenModalForm = (): void =>
    setShowApproveModalForm(!showApproveModalForm);

  useEffect(() => {
    const data: AccountingInterface[] = [
      {
        id: 1,
        amount: 250000,
        description: 'بابت فلان',
        date: '1399-10-05',
      },
      {
        id: 2,
        amount: 730000,
        description: '1بابت فلان',
        date: '1399-11-05',
      },
      {
        id: 2,
        amount: 780000,
        description: '2بابت فلان',
        date: '1399-11-10',
      },
      {
        id: 3,
        amount: 250000,
        description: 'بابت فلان',
        date: '1399-10-05',
      },
      {
        id: 5,
        amount: 730000,
        description: '1بابت فلان',
        date: '1399-11-05',
      },
      {
        id: 6,
        amount: 780000,
        description: '2بابت فلان',
        date: '1399-11-10',
      },
    ];
    setAccountingForPayment(data);
  }, []);

  const [isShowPaymentForm, setIsShowPaymentForm] = useState(false);

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
      <div>
        <form onSubmit={handleSubmit}>
          {/* <form method="post" action="https://api.sumon.ir/MyVirtualGateway" name="paytm">
            <script type="text/javascript"> {document.paytm.submit()} </script>
          </form> */}
          <input type="hidden" name="name" value={123} />
          <button type="submit">click</button>
        </form>
      </div>
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
        <CardContent style={{ marginBottom: 70 }}>
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
                      <li>{item.description}</li>
                      <li>
                        <Grid alignItems="flex-end" container spacing={1}>
                          <Grid item xs={1} style={{ textAlign: 'left' }}>
                            <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
                          </Grid>
                          <Grid item xs={11}>
                            <TextLine
                              rightText={'قیمت'}
                              leftText={item.amount}
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
                              leftText={item.date}
                            />
                          </Grid>
                        </Grid>
                      </li>
                    </ul>
                    <div style={{ marginTop: -10 }}>
                      <Checkbox
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ): any => {
                          item.isChecked = e.target.checked;
                          if (e.target.checked)
                            setTotoalAmount(totalAmount + item.amount);
                          else setTotoalAmount(totalAmount - item.amount);
                        }}
                      />
                    </div>
                  </Paper>
                </Grid>
              )
            )}
          </Grid>
        </CardContent>
        <CardActions className={stickyCardAction}>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              style={{ textAlign: 'center', marginBottom: -10 }}
            >
              <b>
                <span>مبلغ انتخابی : </span>
                <span>{totalAmount}</span>
              </b>
            </Grid>
            <Grid item xs={6} xl={6} md={6}>
              <Button
                type="button"
                variant="outlined"
                color="green"
                onClick={(): any => setIsShowPaymentForm(true)}
              >
                <span style={{ width: 100 }}>پرداخت</span>
              </Button>
            </Grid>
            <Grid item xs={6} xl={6} md={6} style={{ textAlign: 'left' }}>
              <Button type="button" variant="outlined" color="red">
                بعدا پرداخت میکنم
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      {isShowPaymentForm && <PaymentPage />}
    </Modal>
  );
};

export default ExchangeApprove;

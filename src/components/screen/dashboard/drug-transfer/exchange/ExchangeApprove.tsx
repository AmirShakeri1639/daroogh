import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import Button from '../../../../public/button/Button';

const ExchangeApprove: React.FC = () => {
  const [accountingForPayment, setAccountingForPayment] = useState([]);

  const { showApproveModalForm, setShowApproveModalForm } = useContext<
    TransferDrugContextInterface
  >(DrugTransferContext);

  const toggleIsOpenModalForm = (): void =>
    setShowApproveModalForm(!showApproveModalForm);

//   useEffect(()=>{},[])

  return (
    <Modal open={showApproveModalForm} toggle={toggleIsOpenModalForm}>
      <Card>
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
        <CardContent>
          <Container maxWidth="lg">
            <Grid container spacing={1} md={12}>
              <Grid item xs={12} sm={4}>sdfsdfsd</Grid>
            </Grid>
          </Container>
        </CardContent>
        <CardActions>
          <Button type="button" variant="outlined" color="green">
            پرداخت
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default ExchangeApprove;

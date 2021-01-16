import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  createStyles,
  Divider,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
} from '@material-ui/core';
import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExchangeEnum } from '../../../../enum/query';
import { UrlAddress } from '../../../../enum/UrlAddress';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { DataTableCustomActionInterface } from '../../../../interfaces/component';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { Exchange, PharmacyDrug } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';
import Modal from '../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import { Cancel } from '../../../../model/exchange';
import { useMutation } from 'react-query';
import { errorHandler, sweetAlert } from '../../../../utils';
import { PharmacyInfo } from '../../../../interfaces/PharmacyInfo';
import { Map } from '../../../public';

const useClasses = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
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

const ExchangeManagement: React.FC = () => {
  const { container, pharmacyInfoStyle } = useClasses();
  const ref = useDataTableRef();
  const [comment, setComment] = useState<string>('');
  const [exchangeId, setExchangeId] = useState<number>(0);
  const { t } = useTranslation();
  const [isOpenCancelExchangeModal, setIsOpenCancelExchangeModal] = useState(
    false
  );
  const toggleIsOpenCancelExchangeModalForm = (): void => {
    setIsOpenCancelExchangeModal((v) => !v);
  };

  const { cancelExchange, detailPharmacyInfo } = new PharmacyDrug();

  const [_cancelExchange, { isLoading: isLoadingCancel }] = useMutation(
    cancelExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.data.message,
          });
        }
      },
    }
  );

  const handleCancelExchange = async (): Promise<any> => {
    const inputmodel = new Cancel();
    inputmodel.exchangeID = exchangeId;
    inputmodel.comment = comment;
    try {
      await _cancelExchange(inputmodel);
    } catch (e) {
      errorHandler(e);
    }
    toggleIsOpenCancelExchangeModalForm();
  };

  const { getAllExchange } = new Exchange();

  const detailPanel = (row: any): JSX.Element => {
    return (
      <div style={{ height: 100, backgroundColor: '#e6ffee', padding: 5 }}>
        <ul>
          <li>
            <span>داروخانه طرف اول : </span>
            <span style={{ fontWeight: 'bold' }}>{row.pharmacyNameA}</span>
          </li>
          <li>
            <span>داروخانه طرف دوم : </span>
            <span style={{ fontWeight: 'bold' }}>{row.pharmacyNameB}</span>
          </li>
        </ul>
      </div>
    );
  };

  const [isShowPharmacyInfoModal, setIsShowPharmacyInfoModal] = useState(false);
  const toggleIsShowPharmacyInfoModalForm = (): void => {
    setIsShowPharmacyInfoModal((v) => !v);
  };
  const [
    pharmacyInfoState,
    setPharmacyInfoState,
  ] = useState<PharmacyInfo | null>(null);
  const handlePharmacyInfo = async (pharmacyId: number): Promise<any> => {
    try {
      const res = await detailPharmacyInfo(pharmacyId);
      const response: PharmacyInfo = res;
      setPharmacyInfoState(response);
      toggleIsShowPharmacyInfoModalForm();
    } catch (e) {
      errorHandler(e);
    }
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

  const exchangeModalCancel = (): JSX.Element => {
    return (
      <Modal
        open={isOpenCancelExchangeModal}
        toggle={(): any => toggleIsOpenCancelExchangeModalForm()}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="لغو تبادل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={(): any => toggleIsOpenCancelExchangeModalForm()}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>لطفا در صورت تمایل علت لغو تبادل را توضیح دهید</span>
                <TextField
                  onChange={(e: any): any => {
                    setComment(e.value);
                  }}
                  style={{ width: '100%', marginTop: 10, fontSize: 10 }}
                  label="توضیحات"
                  multiline
                  rows={5}
                  variant="outlined"
                />
              </div>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              onClick={async (): Promise<any> => await handleCancelExchange()}
              variant="contained"
              color="primary"
              autoFocus
            >
              لغو تبادل
            </Button>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  const cancelExchangeHandler = (event: any, rowData: any): any => {
    setExchangeId(rowData.id);
    toggleIsOpenCancelExchangeModalForm();
  };

  const actions: DataTableCustomActionInterface[] = [
    {
      icon: 'cancel',
      tooltip: t('action.cancleExchange'),
      color: 'secondary',
      action: cancelExchangeHandler,
    },
  ];

  const getColumns = (): DataTableColumns[] => {
    return [
      {
        title: 'شناسه تبادل',
        field: 'id',
        type: 'numeric',
        width: '150px',
        headerStyle: {
          textAlign: 'right',
          direction: 'ltr',
        },
        cellStyle: {
          textAlign: 'right',
          color: 'black',
          whiteSpace: 'nowrap',
        },
      },
      //   {
      //     title: 'وضعیت',
      //     field: 'state',
      //     type: 'number',
      //     headerStyle: { minWidth: 50 },
      //     cellStyle: { textAlign: 'right' },
      //   },
      {
        title: 'شرح وضعیت',
        field: 'stateString',
        type: 'string',
        width: '150px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
      },
      {
        title: 'داروخانه طرف اول',
        field: 'pharmacyNameA',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="جهت نمایش اطلاعات داروخانه کلیک نمایید">
              <Link
                href="#"
                onClick={(e: any): any => {
                  e.preventDefault();
                  handlePharmacyInfo(row.pharmacyIdA);
                }}
              >
                {row.pharmacyNameA}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: 'داروخانه طرف دوم',
        field: 'pharmacyNameB',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="جهت نمایش اطلاعات داروخانه کلیک نمایید">
              <Link
                href="#"
                style={{ color: '#c50000' }}
                onClick={(e: any): any => {
                  e.preventDefault();
                  handlePharmacyInfo(row.pharmacyIdB);
                }}
              >
                {row.pharmacyNameB}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: 'کد پیگیری طرف اول',
        field: 'numberA',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: false,
        render: (row: any): any => {
          return (
            <Tooltip title="جهت ورود به تبادل کلیک نمایید">
              <Link href="#" onClick={(e: any): any => e.preventDefault()}>
                {row.pharmacyNameA}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: 'کد پیگیری طرف دوم',
        field: 'numberB',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="جهت ورود به تبادل کلیک نمایید">
              <Link
                href="#"
                style={{ color: '#c50000' }}
                onClick={(e: any): any => e.preventDefault()}
              >
                {row.pharmacyNameB}
              </Link>
            </Tooltip>
          );
        },
      },
    ];
  };

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div style={{ backgroundColor: 'white' }}>لیست تبادلات</div>
          <hr />
          <Paper style={{ height: 500 }}>
            <DataTable
              ref={ref}
              columns={getColumns()}
              queryKey={ExchangeEnum.GET_ALL_EXCHANGE}
              queryCallback={getAllExchange}
              urlAddress={UrlAddress.getAllExchange}
              detailPanel={(row: any) => detailPanel(row)}
              customActions={actions}
              initLoad={false}
            />
          </Paper>
        </Grid>
      </Grid>
      {isOpenCancelExchangeModal && exchangeModalCancel()}
      {isShowPharmacyInfoModal && <ShowPharmacyInfo />}
    </Container>
  );
};

export default ExchangeManagement;

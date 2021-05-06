import React, { useState } from 'react';
import {
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
  Tooltip,
} from '@material-ui/core';
import { ExchangeEnum } from '../../../../enum/query';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { Exchange, PharmacyDrug } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';
import Modal from '../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation } from 'react-query';
import {
  errorHandler,
  sweetAlert,
} from '../../../../utils';
import { PharmacyInfo } from '../../../../interfaces/PharmacyInfo';
import { Map } from '../../../public';
import DetailExchange from '../exchange-management/DetailExchange';
import Utils from '../../../public/utility/Utils';

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

const Exchanges: React.FC = () => {
  const { container, pharmacyInfoStyle } = useClasses();
  const { cancelExchange, detailPharmacyInfo } = new PharmacyDrug();

  const [_cancelExchange] = useMutation(
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

  const { getAllSuccessExchanges, urls } = new Exchange()
  const detailPanel = (row: any): JSX.Element => {
    return (
      <Paper
        style={ {
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          boxShadow: 'inset 0px 0px 8px 0px'
        } }>
        <DetailExchange
          exchangeId={ row.id }
          pharmacyNameA={ row.pharmacyNameA }
          pharmacyNameB={ row.pharmacyNameB }
        />
      </Paper>
    )
  }

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
        open={ isShowPharmacyInfoModal }
        toggle={ toggleIsShowPharmacyInfoModalForm }
      >
        <Card className={ pharmacyInfoStyle }>
          <CardHeader
            style={ { padding: 0, paddingRight: 10, paddingLeft: 10 } }
            title="اطلاعات داروخانه مقابل"
            titleTypographyProps={ { variant: 'h6' } }
            action={
              <IconButton
                style={ { marginTop: 10 } }
                aria-label="settings"
                onClick={ toggleIsShowPharmacyInfoModalForm }
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={ 1 }>
              <Grid item xs={ 12 } sm={ 6 }>
                <span>نام داروخانه : </span>
                <span style={ { fontWeight: 'bold' } }>
                {`${pharmacyInfoState?.data.pharmacyProvince} ${pharmacyInfoState?.data.address}`}
                </span>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <span>آدرس : </span>
                <span style={ { fontWeight: 'bold' } }>
                  { pharmacyInfoState?.data.address }
                </span>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <span>تلفن : </span>
                <span style={ { fontWeight: 'bold' } }>
                  { pharmacyInfoState?.data.telphon }
                </span>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <span>موبایل : </span>
                <span style={ { fontWeight: 'bold' } }>
                  { pharmacyInfoState?.data.mobile }
                </span>
              </Grid>
              <Grid item xs={ 12 } sm={ 12 }>
                <Card>
                  <CardContent style={ { textAlign: 'center' } }>
                    { pharmacyInfoState?.data.x && pharmacyInfoState?.data.y ? (
                      <Map
                        draggable={ true }
                        editable={true}
                        defaultLatLng={ [
                          pharmacyInfoState?.data.x,
                          pharmacyInfoState?.data.y,
                        ] }
                      />
                    ) : (
                      <span style={ { color: 'red' } }>
                        مختصات جغرافیایی این داروخانه ثبت نشده است
                      </span>
                    ) }
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={ 1 }></Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

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
        searchable: true,
      },
      {
        title: 'وضعیت',
        field: 'stateString',
        fieldLookup: 'currentState',
        type: 'string',
        headerStyle: {
          textAlign: 'right',
          direction: 'ltr',
        },
        cellStyle: { textAlign: 'right' },
        lookupFilter: [
          { code: 0, name: 'نامشخص' },
          { code: 1, name: 'ارسال نشده' },
          { code: 2, name: 'منتظر تائید طرف دوم' },
          { code: 3, name: 'منتظر تائید طرف اول' },
          { code: 4, name: 'تائید هر دو طرف و منتظر پرداخت' },
          { code: 5, name: 'مخالفت توسط طرف دوم' },
          { code: 6, name: 'مخالفت توسط طرف اول' },
          { code: 7, name: 'لغو شده' },
          { code: 8, name: 'تائید طرفین و پرداخت طرف اول' },
          { code: 9, name: 'تائید طرفین و پرداخت طرف دوم' },
          { code: 10, name: 'تائید و پرداخت هر دو طرف' },
        ],
      },
      {
        title: 'تاریخ ارسال',
        field: 'sendDate',
        type: 'date',
        width: '150px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        render: (row: any): any => { return (<> {row.sendDate ? Utils.convertGeoToShamsi(row.sendDate) : 'نامشخص' }</>) }
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
                onClick={ (e: any): any => {
                  e.preventDefault();
                  handlePharmacyInfo(row.pharmacyIdA);
                } }
              >
                { row.pharmacyNameA }
              </Link>
            </Tooltip>
          );
        },
        // filterComponent: (props: any): any => <FilterInput {...props} />,
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
                style={ { color: '#c50000' } }
                onClick={ (e: any): any => {
                  e.preventDefault();
                  handlePharmacyInfo(row.pharmacyIdB);
                } }
              >
                { row.pharmacyNameB }
              </Link>
            </Tooltip>
          );
        },
      },
    ];
  };

  return (
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div style={ { backgroundColor: 'white' } }>لیست تبادلات</div>
          <hr />
          <Paper style={ { height: 500 } }>
            <DataTable
              // ref={ref}
              columns={ getColumns() }
              queryKey={ ExchangeEnum.GET_ALL_EXCHANGE }
              queryCallback={ getAllSuccessExchanges }
              urlAddress={ urls.allSuccessExchange }
              detailPanel={ (row: any): any => detailPanel(row) }
              initLoad={ false }
            />
          </Paper>
        </Grid>
      </Grid>
      {isShowPharmacyInfoModal && <ShowPharmacyInfo /> }
    </Container>
  );
};

export default Exchanges;

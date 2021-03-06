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
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExchangeEnum } from '../../../../enum/query';
import { UrlAddress } from '../../../../enum/UrlAddress';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { DataTableCustomActionInterface } from '../../../../interfaces/component';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { Exchange, PharmacyDrug, User } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';
import Modal from '../../../public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import { Cancel } from '../../../../model/exchange';
import { useMutation } from 'react-query';
import { errorHandler, Impersonation, sweetAlert } from '../../../../utils';
import { PharmacyInfo } from '../../../../interfaces/PharmacyInfo';
import { Map } from '../../../public';
import FilterInput from '../../../public/datatable/FilterInput';
import routes from '../../../../routes';
import { useHistory } from 'react-router-dom';
import { ViewExchangeInterface } from '../../../../interfaces/ViewExchangeInterface';
import ExCalculator from '../drug-transfer/exchange/ExCalculator';
import DetailExchange from './DetailExchange';
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

const ExchangeManagement: React.FC = () => {
  const { container, pharmacyInfoStyle } = useClasses();
  const ref = useDataTableRef();
  const [comment, setComment] = useState<string>('');
  const [exchangeId, setExchangeId] = useState<number>(0);
  const { t } = useTranslation();
  const [isOpenCancelExchangeModal, setIsOpenCancelExchangeModal] = useState(false);
  const toggleIsOpenCancelExchangeModalForm = (): void => {
    setIsOpenCancelExchangeModal((v) => !v);
  };

  const { cancelExchange, detailPharmacyInfo } = new PharmacyDrug();

  const [_cancelExchange, { isLoading: isLoadingCancel }] = useMutation(cancelExchange, {
    onSuccess: async (res) => {
      if (res) {
        await sweetAlert({
          type: 'success',
          text: res.data.message,
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
    toggleIsOpenCancelExchangeModalForm();
  };

  const { getAllExchange } = new Exchange();
  const { getViewExchange } = new PharmacyDrug();

  const [showExCalculator, setShowExCalculator] = useState(false);
  const toggleShowExCalculator = (): void => setShowExCalculator(!showExCalculator);

  const detailPanel = (row: any): JSX.Element => {
    return (
      <Paper
        style={{
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          boxShadow: 'inset 0px 0px 8px 0px',
        }}
      >
        <DetailExchange
          exchangeId={row.id}
          pharmacyNameA={row.pharmacyNameA}
          pharmacyNameB={row.pharmacyNameB}
        />
      </Paper>
    );
  };

  const [isShowPharmacyInfoModal, setIsShowPharmacyInfoModal] = useState(false);
  const toggleIsShowPharmacyInfoModalForm = (): void => {
    setIsShowPharmacyInfoModal((v) => !v);
  };
  const [pharmacyInfoState, setPharmacyInfoState] = useState<PharmacyInfo | null>(null);
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
      <Modal open={isShowPharmacyInfoModal} toggle={toggleIsShowPharmacyInfoModalForm}>
        <Card className={pharmacyInfoStyle}>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="?????????????? ???????????????? ??????????"
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
                <span>?????? ???????????????? : </span>
                <span style={{ fontWeight: 'bold' }}>{pharmacyInfoState?.data.name}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>???????? : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {`${pharmacyInfoState?.data.pharmacyProvince} ${pharmacyInfoState?.data.address}`}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>???????? : </span>
                <span style={{ fontWeight: 'bold' }}>{pharmacyInfoState?.data.telphon}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>???????????? : </span>
                <span style={{ fontWeight: 'bold' }}>{pharmacyInfoState?.data.mobile}</span>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card>
                  <CardContent style={{ textAlign: 'center' }}>
                    {pharmacyInfoState?.data.x && pharmacyInfoState?.data.y ? (
                      <Map
                        editable={true}
                        draggable={true}
                        defaultLatLng={[pharmacyInfoState?.data.y, pharmacyInfoState?.data.x]}
                      />
                    ) : (
                      <span style={{ color: 'red' }}>
                        ???????????? ?????????????????? ?????? ???????????????? ?????? ???????? ??????
                      </span>
                    )}
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

  const history = useHistory();
  const { impersonate } = new User();
  const getNewToken = async (
    pharmacyId: number | string,
    exNumber: string // numberA or numberB
  ): Promise<any> => {
    const result = await impersonate(pharmacyId);
    const impersonation = new Impersonation();
    impersonation.changeToken(result.data.token, result.data.pharmacyName);
    history.push(`${routes.transfer}?eid=${exNumber}`);
  };

  const getColumns = (): DataTableColumns[] => {
    return [
      {
        title: '?????????? ??????????',
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
        title: '??????????',
        field: 'stateString',
        fieldLookup: 'currentState',
        type: 'string',
        headerStyle: {
          textAlign: 'right',
          direction: 'ltr',
        },
        cellStyle: { textAlign: 'right' },
        lookupFilter: [
          { code: 0, name: '????????????' },
          { code: 1, name: '?????????? ????????' },
          { code: 2, name: '?????????? ?????????? ?????? ??????' },
          { code: 3, name: '?????????? ?????????? ?????? ??????' },
          { code: 4, name: '?????????? ???? ???? ?????? ?? ?????????? ????????????' },
          { code: 5, name: '???????????? ???????? ?????? ??????' },
          { code: 6, name: '???????????? ???????? ?????? ??????' },
          { code: 7, name: '?????? ??????' },
          { code: 8, name: '?????????? ?????????? ?? ???????????? ?????? ??????' },
          { code: 9, name: '?????????? ?????????? ?? ???????????? ?????? ??????' },
          { code: 10, name: '?????????? ?? ???????????? ???? ???? ??????' },
        ],
      },
      {
        title: '?????????? ??????????',
        field: 'sendDate',
        type: 'date',
        width: '150px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        render: (row: any): any => {
          return <> {row.sendDate ? Utils.convertGeoToShamsi(row.sendDate) : '????????????'}</>;
        },
      },
      {
        title: '???????????????? ?????? ??????',
        field: 'pharmacyNameA',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="?????? ?????????? ?????????????? ???????????????? ???????? ????????????">
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
        // filterComponent: (props: any): any => <FilterInput {...props} />,
      },
      {
        title: '???????????????? ?????? ??????',
        field: 'pharmacyNameB',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="?????? ?????????? ?????????????? ???????????????? ???????? ????????????">
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
        title: '???? ???????????? ?????? ??????',
        field: 'numberA',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: false,
        render: (row: any): any => {
          return (
            <Tooltip title="?????? ???????? ???? ?????????? ???????? ????????????">
              <Link
                href="#"
                onClick={async (e: any): Promise<any> => {
                  e.preventDefault();
                  await getNewToken(row.pharmacyIdA, row.numberA);
                }}
              >
                {row.numberA}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: '???? ???????????? ?????? ??????',
        field: 'numberB',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
        render: (row: any): any => {
          return (
            <Tooltip title="?????? ???????? ???? ?????????? ???????? ????????????">
              <Link
                href="#"
                style={{ color: '#c50000' }}
                onClick={async (e: any): Promise<any> => {
                  e.preventDefault();
                  await getNewToken(row.pharmacyIdB, row.numberB);
                }}
              >
                {row.numberB}
              </Link>
            </Tooltip>
          );
        },
      },
    ];
  };

  const memoDataTable = React.useMemo(
    () => (
      <DataTable
        // ref={ref}
        columns={getColumns()}
        queryKey={ExchangeEnum.GET_ALL_EXCHANGE}
        queryCallback={getAllExchange}
        urlAddress={UrlAddress.getAllExchange}
        detailPanel={(row: any): any => detailPanel(row)}
        customActions={actions}
        initLoad={false}
      />
    ),
    []
  );

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div style={{ backgroundColor: 'white' }}>???????? ??????????????</div>
          <hr />
          <Paper style={{ height: 500 }}>{memoDataTable}</Paper>
        </Grid>
      </Grid>
      {isShowPharmacyInfoModal && <ShowPharmacyInfo />}

      <Modal open={isOpenCancelExchangeModal} toggle={toggleIsOpenCancelExchangeModalForm}>
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="?????? ??????????"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsOpenCancelExchangeModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>???????? ???? ???????? ?????????? ?????? ?????? ?????????? ???? ?????????? ????????</span>
                <TextField
                  onChange={(e: any): any => {
                    setComment(e.value);
                  }}
                  style={{ width: '100%', marginTop: 10, fontSize: 10 }}
                  label="??????????????"
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
              ?????? ??????????
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </Container>
  );
};

export default ExchangeManagement;

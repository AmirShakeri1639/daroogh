import {
  Container,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Paper,
} from '@material-ui/core';
import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExchangeEnum } from '../../../../enum/query';
import { UrlAddress } from '../../../../enum/UrlAddress';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { Exchange } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';

const useClasses = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
    },
  })
);

const ExchangeManagement: React.FC = () => {
  const { container } = useClasses();
  const ref = useDataTableRef();
  const { t } = useTranslation();

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
            <Link href="#" onClick={(e: any): any => e.preventDefault()}>
              {row.pharmacyNameA}
            </Link>
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
            <Link
              href="#"
              style={{ color: '#c50000' }}
              onClick={(e: any): any => e.preventDefault()}
            >
              {row.pharmacyNameB}
            </Link>
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
        searchable: true,
      },
      {
        title: 'کد پیگیری طرف دوم',
        field: 'numberB',
        type: 'string',
        width: '170px',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        searchable: true,
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
              initLoad={false}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExchangeManagement;

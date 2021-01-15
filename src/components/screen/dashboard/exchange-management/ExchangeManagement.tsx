import {
  Container,
  createStyles,
  Grid,
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

  const getColumns = (): DataTableColumns[] => {
    return [
      {
        title: 'شناسه',
        field: 'id',
        type: 'numeric',
        headerStyle: { textAlign: 'right', direction: 'ltr' },
        cellStyle: { textAlign: 'right', color: 'red' },
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
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right' },
      },
      {
        title: 'داروخانه طرف اول',
        field: 'pharmacyNameA',
        type: 'string',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right' },
        searchable: true,
      },
      {
        title: 'داروخانه طرف دوم',
        field: 'pharmacyNameB',
        type: 'string',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right' },
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
              initLoad={false}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExchangeManagement;

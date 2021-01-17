import React, { useReducer } from 'react';
import { useQueryCache } from 'react-query';
import { Accounting } from '../../../../services/api';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import {
  ActionInterface,
  AccountingInterface,
  TableColumnInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { AccountingEnum } from '../../../../enum/query';
import { Container, Grid, Paper } from '@material-ui/core';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { getJalaliDate } from '../../../../utils/jalali';
import { Convertor } from '../../../../utils';

const initialState: AccountingInterface = {
  id: 0,
  date: '2020-12-07T21:43:46.103Z',
  description: '',
  amount: 0,
};

const AccountingList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const { container } = useClasses();

  const { all } = new Accounting();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'date',
        title: t('general.date'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>{ getJalaliDate(row.date) }</>
          );
        },
      },

      { field: 'description', title: t('general.description'), type: 'string' },
      {
        field: 'amount',
        title: t('accounting.creditor'),
        type: 'number',
        render: (row: any): any => {
          return (
            <>
              { row.amount < 0 &&
                Convertor.thousandsSeperatorFa(Math.abs(row.amount)) }
              { row.amount >= 0 && '' }
            </>
          );
        },
      },
      {
        field: 'amount',
        title: t('accounting.debtor'),
        type: 'number',
        render: (row: any): any => {
          return (
            <>
              { row.amount >= 0 &&
                Convertor.thousandsSeperatorFa(row.amount) }
              { row.amount < 0 && '' }
            </>
          );
        },
      },
    ];
  };

  return (
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('accounting.list') }</div>
          <Paper>
            <DataTable
              ref={ ref }
              columns={ tableColumns() }
              queryKey={ AccountingEnum.GET_ALL }
              queryCallback={ all }
              urlAddress={ UrlAddress.getAllAccounting }
              initLoad={ false }
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountingList;

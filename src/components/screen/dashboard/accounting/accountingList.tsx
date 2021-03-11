import React, { useReducer } from 'react';
import { useQueryCache } from 'react-query';
import { Accounting } from '../../../../services/api';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import {
  AccountingInterface,
  TableColumnInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { AccountingEnum } from '../../../../enum/query';
import { Container, createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { getJalaliDate } from '../../../../utils/jalali';
import { Convertor } from '../../../../utils';
import routes from '../../../../routes';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

const initialState: AccountingInterface = {
  id: 0,
  date: '2020-12-07T21:43:46.103Z',
  description: '',
  amount: 0,
  exchangeID: null,
  mandeh: 0
};

const AccountingList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const { container } = useClasses();

  const { all } = new Accounting();

  const useStyles = makeStyles((theme) =>
    createStyles({
      linkWrapper: {
        display: 'flex',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, .05)',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
        '& a': {
          color: 'rgba(0, 0, 0, 0.85)',
          textDecoration: 'none',
          width: '100%',
          display: 'flex',
          padding: '.2em .5em',
          alignItems: 'center',
          '& div:nth-child(2)': {
            display: 'inline-block',
          },
        },
      },
    })
  );

  const { linkWrapper } = useStyles();

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
            <>{getJalaliDate(row.date)}</>
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
                Convertor.thousandsSeperatorFa(Math.abs(row.amount))}
              { row.amount >= 0 && ''}
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
                Convertor.thousandsSeperatorFa(row.amount)}
              { row.amount < 0 && ''}
            </>
          );
        },
      },
      {
        field: 'exchangeID',
        title: t('exchange.exchange'),
        type: 'string',
        render: (row: any): any => {
          let exchangeUrl = '';
          if (row.exchangeID) {
            const { transfer } = routes;
            exchangeUrl = `${transfer}?eid=${row.currentPharmacyIsA ? row.numberA : row.numberB}`;
          }
          return (
            <>
              { exchangeUrl.length > 0 &&
                <div className={linkWrapper}>
                  <Link to={exchangeUrl}>
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    &nbsp;
                    {t('exchange.viewExchange')}
                  </Link>
                </div>
              }
            </>
          )
        }
      }
    ];
  };

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div>{t('accounting.list')}</div>
          <Paper>
            <DataTable
              ref={ref}
              columns={tableColumns()}
              queryKey={AccountingEnum.GET_ALL}
              queryCallback={all}
              urlAddress={UrlAddress.getAllAccounting}
              initLoad={false}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountingList;

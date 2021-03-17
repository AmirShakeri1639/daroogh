import React, { useReducer, useState } from 'react';
import { useQuery, useQueryCache } from 'react-query';
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
import {
  Container, createStyles, Grid, makeStyles, Paper, useMediaQuery,
  useTheme
} from '@material-ui/core';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { getJalaliDate } from '../../../../utils/jalali';
import { Convertor } from '../../../../utils';
import routes from '../../../../routes';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import CardContainer from './CardContainer'

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoading, data, isFetched, refetch } = useQuery(
    AccountingEnum.GET_ALL,

    () => all(pageRef.current, 10),
    {
      onSuccess: (result) => {
        if (result == undefined || result.count == 0) {
          setNoData(true);
        }
      },
    }
  );
  const [noData, setNoData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };
  const handleScroll = (e: any): any => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight === el.scrollHeight) {
      if (!noData) {
        const currentpage = pageRef.current + 1;
        setPageRef(currentpage);
        refetch()

      }
    }
  };

  React.useEffect(() => {
    // const res = (async (): Promise<any> => await getExchanges())
    // res();
    if (fullScreen) {
      window.addEventListener('scroll', (e) => handleScroll(e), {
        capture: true,
      });
    }
    return () => window.removeEventListener('scroll', (e) => handleScroll(e));
  }, []);
  const exchangeHandler = (row: AccountingInterface): JSX.Element | null => {

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
    return null;
  }




  const contentGenerator = (): JSX.Element[] | null => {

    if (!isLoading && data !== undefined && isFetched) {
      console.log(data)
      return data.items.map((item: any) => {
        //const { user } = item;
        //if (user !== null) {
        return (
          <Grid key={item.id} item xs={12}>
            <CardContainer data={item} exchangeHandler={exchangeHandler} />
          </Grid>
        );
        //}

        return null;
      });
    }

    return null;
  };
  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div>{t('accounting.list')}</div>
          <Paper>
            {!fullScreen && (
              <DataTable
                ref={ref}
                columns={tableColumns()}
                queryKey={AccountingEnum.GET_ALL}
                queryCallback={all}
                urlAddress={UrlAddress.getAllAccounting}
                initLoad={false}
              />
            )}
            {fullScreen && contentGenerator()}
            {fullScreen && <CircleBackdropLoading
              isOpen={isLoading} />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountingList;

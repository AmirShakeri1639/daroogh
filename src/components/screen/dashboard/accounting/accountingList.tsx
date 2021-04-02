import React, { useReducer, useState } from 'react';
import { useQuery, useQueryCache } from 'react-query';
import { Accounting } from '../../../../services/api';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import { AccountingInterface, TableColumnInterface } from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { AccountingEnum } from '../../../../enum/query';
import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { getJalaliDate } from '../../../../utils/jalali';
import { Convertor } from '../../../../utils';
import routes from '../../../../routes';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import CircleBackdropLoading from 'components/public/loading/CircleBackdropLoading';
import CardContainer from './CardContainer';
import SearchBar from 'material-ui-search-bar';
import { debounce } from 'lodash';

const initialState: AccountingInterface = {
  id: 0,
  date: '2020-12-07T21:43:46.103Z',
  description: '',
  amount: 0,
  exchangeID: null,
  mandeh: 0,
  exchangeNumber: '0',
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

      searchIconButton: {
        display: 'none',
      },

      contentContainer: {
        marginTop: 15,
      },
    })
  );

  const { linkWrapper, contentContainer, searchIconButton } = useStyles();

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
          return <>{getJalaliDate(row.date)}</>;
        },
      },

      {
        field: 'description',
        title: t('general.description'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'amount',
        title: t('accounting.creditor'),
        type: 'number',
        render: (row: any): any => {
          return (
            <>
              {row.amount < 0 && Convertor.thousandsSeperatorFa(Math.abs(row.amount))}
              {row.amount >= 0 && ''}
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
              {row.amount >= 0 && Convertor.thousandsSeperatorFa(row.amount)}
              {row.amount < 0 && ''}
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
            exchangeUrl = `${transfer}?eid=${row.exchangeNumber}`;
          }
          return (
            <>
              {exchangeUrl.length > 0 && (
                <div className={linkWrapper}>
                  <Link to={exchangeUrl}>
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    &nbsp;
                    {t('exchange.viewExchange')}
                  </Link>
                </div>
              )}
            </>
          );
        },
      },
    ];
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //const fullScreen = true;

  const [list, setList] = useState<any>([]);
  const listRef = React.useRef(list);
  const setListRef = (data: any, refresh: boolean = false) => {
    if (!refresh) {
      listRef.current = listRef.current.concat(data);
    } else {
      listRef.current = data;
    }
    setList(data);
  };
  const [search, setSearch] = useState<string>('');
  const searchRef = React.useRef(search);
  const setSearchRef = (data: any) => {
    searchRef.current = data;
    setSearch(data);
    getList(true);
  };

  const { isLoading, data, isFetched, refetch } = useQuery(
    AccountingEnum.GET_ALL,

    () => all(pageRef.current, 10, [], searchRef.current),
    {
      onSuccess: (result) => {
        if (result == undefined || result.count == 0) {
          setNoDataRef(true);
        } else {
          setListRef(result.items);
        }
      },
    }
  );

  
  const [page, setPage] = useState<number>(0);
  const pageRef = React.useRef(page);
  const setPageRef = (data: number) => {
    pageRef.current = data;
    setPage(data);
  };
  const [noData, setNoData] = useState<boolean>(false);
  const noDataRef = React.useRef(noData);
  const setNoDataRef = (data: boolean) => {
    noDataRef.current = data;
    setNoData(data);
  };
  const screenWidth = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    tablet: 640,
    laptop: 1024,
    desktop: 1280,
  };
  const handleScroll = (e: any): any => {
  
    const el = e.target;
    const pixelsBeforeEnd = 200;
    const checkDevice =
      window.innerWidth <= screenWidth.sm
        ? el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight
        : el.scrollTop + el.clientHeight === el.scrollHeight;
    if (!noDataRef.current && checkDevice) {
      const currentpage = pageRef.current + 1;
      setPageRef(currentpage);
      console.log(pageRef.current);
      getList();
    }
  };
  React.useEffect(() => {
    document.addEventListener('scroll', debounce(handleScroll, 100), {
      capture: true,
    });
    return (): void => {
      document.removeEventListener('scroll', debounce(handleScroll, 100), {
        capture: true,
      });
    };
  }, []);

  async function getList(refresh: boolean = false): Promise<any> {
    const result = await all(pageRef.current, 10, [], searchRef.current);
    if (result == undefined || result.items.length == 0) {
      setNoDataRef(true);
    }
    if (result != undefined) {
      setListRef(result.items, refresh);
      return result;
    }
  }

  const exchangeHandler = (row: AccountingInterface): JSX.Element | null => {
    let exchangeUrl = '';
    if (row.exchangeID) {
      const { transfer } = routes;
      exchangeUrl = `${transfer}?eid=${row.exchangeNumber}`;
    }
    return (
      <>
        {exchangeUrl.length > 0 && (
          <div className={linkWrapper}>
            <Link to={exchangeUrl}>
              <FontAwesomeIcon icon={faExchangeAlt} />
              &nbsp;
              {t('exchange.viewExchange')}
            </Link>
          </div>
        )}
      </>
    );
  };

  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && list !== undefined && isFetched) {
      return listRef.current.map((item: any) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <CardContainer data={item} exchangeHandler={exchangeHandler} />
          </Grid>
        );
      });
    }

    return null;
  };
  return (
    <Container maxWidth="lg" className={container}>
      <h1 className="txt-md">{t('accounting.list')}</h1>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          {false && (
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
          )}
          {true && (
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <SearchBar
                  classes={{ searchIconButton: searchIconButton }}
                  placeholder={t('general.search')}
                  onChange={(newValue) => setSearchRef(newValue)}
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={3} className={contentContainer}>
            {true && contentGenerator()}
          </Grid>
          {true && <CircleBackdropLoading isOpen={isLoading} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountingList;

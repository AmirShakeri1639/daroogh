import { Box, Button, Container, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import { ActionInterface, RreportSearch } from 'interfaces';
// @ts-ignore
import DatePicker, { DateObject } from 'react-multi-date-picker';
import React, { useEffect, useReducer, useState } from 'react';
import { errorHandler } from 'utils';
import { CountryDivision } from 'services/api';
import DataTable from 'components/public/datatable/DataTable';
import { DataTableColumns } from 'interfaces/DataTableColumns';
import useDataTableRef from 'hooks/useDataTableRef';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const initialState: RreportSearch = {
  fromDate: new DateObject(),
  toDate: new DateObject(),
  geoCode: '',
  remainExpDaysFromMinDate: 0,
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    case 'fromDate':
      return {
        ...state,
        fromDate: value,
      };
    case 'toDate':
      return {
        ...state,
        toDate: value,
      };
    case 'geoCode':
      return {
        ...state,
        geoCode: value,
      };
    case 'remainExpDaysFromMinDate':
      return {
        ...state,
        remainExpDaysFromMinDate: value,
      };

    default:
      console.error('Action type not defined');
  }
}

const getColumns = (): DataTableColumns[] => {
  return [
    {
      title: 'نام دارو',
      field: 'drugName',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
      searchable: true,
    },
    {
      title: 'نام ژنریک',
      field: 'drugGenericName',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'شرکت سازنده',
      field: 'drugCompanyName',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'نام انگلیسی',
      field: 'drugEnName',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'نوع دارو',
      field: 'drugType',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'دسته دارویی',
      field: 'categoryName',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'نوع دسته دارویی',
      field: 'categoryType',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'وضعیت فعال',
      field: 'isActive',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'امتیاز کلی',
      field: 'finalScore',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'حداقل قیمت عرضه شده',
      field: 'minPrice',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'حداکثر قیمت عرضه شده',
      field: 'maxPrice',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'میانگین قیمت عرضه شده',
      field: 'averagePrice',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'میانگین آفر',
      field: 'averageOfferRatio',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'تعداد تبادل',
      field: 'exchangeCount',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'تعداد جستجو',
      field: 'searchCount',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'تعداد داروخانه عرضه کننده',
      field: 'additionalCount',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'تعداد داروخانه علاقمند',
      field: 'favoriteCount',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
    {
      title: 'تعداد داروی مازاد',
      field: 'totalAdditionalCount',
      type: 'string',
      headerStyle: { minWidth: 150 },
      cellStyle: { textAlign: 'right' },
    },
  ];
};
const { getAllCities2, getAllProvinces2 } = new CountryDivision();
const SelectedDrugsForm: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [url, setUrl] = useState('/Reports/GetSelectedDrugs');
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const ref = useDataTableRef();
  useEffect(() => {
    (async (): Promise<any> => {
      try {
        const res = await getAllProvinces2();
        setProvinceList(
          res.items.map((item: any) => {
            return { name: item.name, code: item.code };
          })
        );
      } catch (e) {
        errorHandler(e);
      }
    })();
  }, []);
  const updateUrl = (): void => {
    setUrl(
      `/Reports/GetSelectedDrugs?fromDate=${state.fromDate
        .convert('gregorian')
        .setLocale('en')
        .format('YYYY/MM/DD')}&toDate=${state.toDate
        .convert('gregorian')
        .setLocale('en')
        .format('YYYY/MM/DD')}&geoCode=${state.geoCode}&remainExpDaysFromMinDate=${
        state.remainExpDaysFromMinDate
      }`
    );
  };

  if (url) ref.current?.onQueryChange();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper square>
            <Box p={2} m="2">
              <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                <Grid item xs={6} md={3}>
                  <DatePicker
                    value={state.fromDate}
                    calendar="persian"
                    locale="fa"
                    type="custom"
                    render={<DateComponent label="از تاریخ" />}
                    onChange={(e: any): void => {
                      dispatch({ type: 'fromDate', value: e });
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <DatePicker
                    value={state.toDate}
                    calendar="persian"
                    locale="fa"
                    type="custom"
                    render={<DateComponent label="تا تاریخ" />}
                    onChange={(e: any): void => {
                      dispatch({ type: 'toDate', value: e });
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    id="outlined-select-currency-native"
                    select
                    label="استان"
                    onChange={(e: any): void => {
                      dispatch({ type: 'geoCode', value: e.target.value });
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    placeholder="placeholder"
                    variant="outlined"
                    value={state.geoCode}
                  >
                    {provinceList.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label={'تعداد روز باقیمانده به انقضای دارو'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e: any): void => {
                      dispatch({
                        type: 'remainExpDaysFromMinDate',
                        value: e.target.value,
                      });
                    }}
                    variant="outlined"
                    value={state.remainExpDaysFromMinDate}
                  />
                </Grid>
                <Grid
                  item
                  direction="row"
                  alignContent="center"
                  alignItems="center"
                  justify="center"
                  xs={12}
                  style={{ display: 'flex' }}
                >
                  <Button variant="contained" onClick={(): void => updateUrl()} color="primary">
                    به روز رسانی
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper square>
            <div style={{ marginTop: '5px' }}>
              {' '}
              <DataTable tableRef={ref} columns={getColumns()} urlAddress={url} initLoad={false} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const DateComponent: React.FC<any> = (props) => {
  return (
    <TextField
      fullWidth
      label={props.label}
      onClick={props.openCalendar}
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      value={props.stringDate}
    />
  );
};
export default SelectedDrugsForm;

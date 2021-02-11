import React, {
  createRef,
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { DataTableProps } from '../../../interfaces';
import { usePaginatedQuery, useQueryCache } from 'react-query';
import { errorSweetAlert, sweetAlert } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import localization from './localization';
import { has } from 'lodash';
import {
  AppBar,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Slide,
  TablePagination,
  Toolbar,
  Typography,
} from '@material-ui/core';
import itemsSanitizer from './ItemsSanitizer';
import { DataTableColumns } from '../../../interfaces/DataTableColumns';
import { UrlAddress } from '../../../enum/UrlAddress';
import FilterInput from './FilterInput';
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Report from '../report/Report';
import ReportViewerContainer from '../report/ReportViewerContainer';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'jalali-moment';

type CountdownHandle = {
  loadItems: () => void;
};

const useStyles = makeStyles((theme) => ({
  table: {
    '& tbody>.MuiTableRow-root:hover': {
      background: '#ffb3b3',
    },
    '& tbody .MuiIconButton-root': {
      width: 30,
      height: 30,
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },
    '& tbody>.MuiTableRow-root:nth-child(even)': {
      background: '#ffe6e6',
    },
    '& tbody>.MuiTableRow-root>.MuiTableCell-paddingNone:first-child': {
      width: 15,
      maxWidth: 15,
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[700],
  },
}));

const Transition = React.forwardRef<
  TransitionProps,
  { children?: React.ReactElement<any, any> }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const DataTable: React.ForwardRefRenderFunction<
  CountdownHandle,
  DataTableProps
> = (props, forwardedRef) => {
  const { table, closeButton } = useStyles();
  const [page, setPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [entries, setEntries] = useState([]);
  const [isLoader, setLoader] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [filters, setFilters] = useState<DataTableFilterInterface[]>([]);

  const {
    editUser,
    columns,
    multiple = false,
    selection = false,
    tableRef = createRef(),
    isLoading,
    queryKey,
    queryCallback,
    editAction,
    pageSize = 10,
    removeAction,
    addAction,
    stateAction,
    onRowClick,
    customActions,
    extraMethods,
    urlAddress,
    defaultFilter,
    detailPanel,
  } = props;

  const { t } = useTranslation();

  const queryCache = useQueryCache();

  const materialTableProps = {
    onRowClick,
    onSelectionChange: (): any => void 0,
  };

  let tableActions: any[] = [
    {
      icon: 'find_replace',
      tooltip: 'فیلتر',
      isFreeAction: true,
      onClick: (): any => setShowFilter(!showFilter),
    },
    {
      icon: 'refresh',
      tooltip: 'بارگزاری مجدد',
      isFreeAction: true,
      onClick: (): any => tableRef.current.onQueryChange(),
    },
    // {
    //   icon: 'report',
    //   tooltip: 'گزارش',
    //   isFreeAction: true,
    //   onClick: (): any => setShowReport(true),
    // },
  ];

  if (addAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'add',
        tooltip: 'ایجاد',
        isFreeAction: true,
        onClick: (): void => addAction(),
      },
    ];
  }
  if (stateAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'check',
        position: 'row',
        tooltip: 'تغییر وضعیت',
        iconProps: {
          color: 'error',
        },
        onClick: (event: any, rowData: any): void =>
          rowData.active ? stateAction(rowData) : editUser?.(rowData),
      },
    ];
  }
  if (editAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'edit',
        position: 'row',
        tooltip: 'ویرایش',
        iconProps: {
          color: 'primary',
        },
        onClick: (event: any, rowData: any): void => editAction(event, rowData),
      },
    ];
  }
  if (removeAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'delete',
        position: 'row',
        tooltip: 'حدف',
        iconProps: {
          color: 'secondary',
        },
        onClick: (event: any, rowData: any): void => {
          removeAction(event, rowData);
        },
      },
    ];
  }
  if (customActions !== undefined && customActions.length > 0) {
    customActions.map((a: any) => {
      tableActions = [
        ...tableActions,
        {
          icon: a.icon,
          tooltip: a.tooltip ? a.tooltip : '',
          iconProps: {
            color: a.color ? a.color : 'primary',
          },
          onClick: (event: any, rowData: any): void => {
            if (a.action) a.action(event, rowData);
          },
        },
      ];
    });
  }

  useEffect(() => {
    tableRef.current.onQueryChange();
  }, [filters]);

  useEffect(() => {
    columns.forEach((element: DataTableColumns) => {
      element.filterComponent = (props: any): any => <FilterInput {...props} />;
    });
  }, [columns]);



  const ReportContainer = (): JSX.Element => (
    <Dialog
      onClose={(): any => setShowReport(false)}
      open={showReport}
      TransitionComponent={Transition}
      fullScreen={true}
    >
      <AppBar>
        <Toolbar
          variant="dense"
          style={{ backgroundColor: 'rgb(164, 191, 226)' }}
        >
          <DialogTitle
            disableTypography
            style={{
              margin: '1rem auto',
              padding: '0',
            }}
          >
            <Typography variant="h6" style={{ color: 'black' }}>
              جزئیات گزارش
            </Typography>
            <IconButton
              className={closeButton}
              edge="start"
              color="inherit"
              onClick={(): any => setShowReport(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <div style={{ marginTop: 70 }}>
          <ReportViewerContainer />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={table}>
      <ReportContainer />
      <MaterialTable
        tableRef={tableRef}
        localization={localization}
        icons={{
          PreviousPage: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          NextPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
          )),
        }}
        components={{
          Toolbar: (props: any): JSX.Element => <MTableToolbar {...props} />,
        }}
        columns={columns}
        data={(query): any =>
          new Promise((resolve, reject) => {
            let url = UrlAddress.baseUrl + urlAddress;

            url += `?&$top=${query.pageSize}&$skip=${query.page * query.pageSize
              }`;

            if (defaultFilter) {
              url += `&$filter= ${defaultFilter}`;
            }

            const qFilter = query.filters.filter(
              (x) => x.value.fieldValue !== ''
            );
            qFilter.forEach((x: any, i: number) => {
              if (i === 0) url += defaultFilter ? ' and ' : '&$filter=';
              const openP = i === 0 ? '(' : '';
              const closeP = i === qFilter.length - 1 ? ')' : '';
              const andO = i < qFilter.length - 1 ? 'and ' : '';
              url += `${openP} ${String(x.value.operator).replace(
                '$',
                x.value.fieldValue
              )} ${andO}${closeP}`;
            });
            if (query.search && query.search !== '') {
              const columnsFilter = columns.filter((x: any) => x.searchable);
              if (columnsFilter.length > 0) {
                url +=
                  defaultFilter || query.filters.length > 0
                    ? ' and '
                    : '&$filter=';
                columnsFilter.forEach((x: DataTableColumns, i: number) => {
                  const openP = i === 0 ? '(' : '';
                  const closeP = i === columnsFilter.length - 1 ? ')' : '';
                  const orO = i < columnsFilter.length - 1 ? 'or ' : '';
                  url += `${openP}contains(cast(${x.field},'Edm.String'),'${query.search}')${orO}${closeP}`;
                });
              }
            }
            if (query.orderBy) {
              url += `&$orderby=${query.orderBy.field?.toString()} ${query.orderDirection
                }`;
            } else {
              if (columns.findIndex((c: any) => c.field === 'id') !== -1) {
                url += `&$orderby=id desc`;
              }
            }
            debugger;
            const user = localStorage.getItem('user') || '{}';
            const { token } = JSON.parse(user);
            fetch(url, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => response.json())
              .then((result) => {
                // debugger;
                // result.items.forEach((a: any) => {
                //   if (a.sendDate)
                //     a.sendDate = moment(a.sendDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
                // })
                // debugger;
                resolve({
                  data: result.items,
                  page: query.page,
                  totalCount: result.count,
                });
              })
              .catch(
                async (error: any): Promise<any> => {
                  await sweetAlert({
                    type: 'error',
                    text:
                      'خطایی در اجرای درخواست رخ داده است. لطفا با واحد پشتیبانی تماس حاصل نمایید.',
                  });
                  resolve({
                    data: [],
                    page: 0,
                    totalCount: 0,
                  });
                }
              );
          })
        }
        detailPanel={
          detailPanel
            ? [
              {
                tooltip: 'نمایش جزئیات',
                render: (rowData): any => {
                  return detailPanel(rowData);
                },
              },
            ]
            : []
        }
        actions={tableActions}
        title=""
        // isLoading={isLoader || isLoading || isLoadingFetchData}
        options={{
          actionsColumnIndex: -1,
          actionsCellStyle: {
            borderRight: '1px solid silver',
            textAlignLast: 'center',
          },
          showSelectAllCheckbox: multiple,
          selection: selection,
          searchFieldAlignment: 'left',
          doubleHorizontalScroll: false,
          paginationType: 'stepped',
          filtering: showFilter,
          filterCellStyle: { paddingTop: 0, paddingBottom: 5 },
          pageSize,
          exportButton: true,
          padding: 'dense',
          showTitle: false,
          headerStyle: {
            fontWeight: 800,
            backgroundColor: 'rgb(215, 204, 255)',
          },
          columnsButton: true,
          maxBodyHeight: 400,
          minBodyHeight: 400,
          rowStyle: (rowData: any): {} => ({
            backgroundColor: rowData.tableData.checked ? '#37b15933' : '',
          }),
        }}
        onSearchChange={(text: string): any => setSearchText(text)}
        {...materialTableProps}
      />
    </div>
  );
};

export default forwardRef(DataTable);

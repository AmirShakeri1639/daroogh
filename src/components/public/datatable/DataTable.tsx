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
import { errorSweetAlert } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import localization from './localization';
import { has } from 'lodash';
import { createStyles, makeStyles, TablePagination } from '@material-ui/core';
import itemsSanitizer from './ItemsSanitizer';
import { DataTableColumns } from '../../../interfaces/DataTableColumns';
import { UrlAddress } from '../../../enum/UrlAddress';
import FilterInput from './FilterInput';
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface';

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
}));

const DataTable: React.ForwardRefRenderFunction<
  CountdownHandle,
  DataTableProps
> = (props, forwardedRef) => {
  const { table } = useStyles();
  const [page, setPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [entries, setEntries] = useState([]);
  const [isLoader, setLoader] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
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

  // React.useImperativeHandle(forwardedRef, () => ({
  //   loadItems(): any {
  //     debugger;
  //     tableRef.current && tableRef.current.onQueryChange();
  //   },
  // }));

  const { t } = useTranslation();

  const queryCache = useQueryCache();

  // const { isLoading: isLoadingFetchData } = usePaginatedQuery(
  //   [queryKey, page],
  //   () =>
  //     queryCallback(
  //       page,
  //       pageSize,
  //       columns.filter((x: DataTableColumns) => x.searchable),
  //       searchText,
  //       {
  //         orderByIndex: 0,
  //         orderByName: columns[0].field,
  //         orderDirection: 'desc',
  //       }
  //     ),
  //   {
  //     onSuccess: (data) => {
  //       const { items, count } = data;
  //       setEntries(itemsSanitizer(items, queryKey));
  //       setItemsCount(count);
  //       setLoader(false);
  //     },
  //     onError: async () => {
  //       await errorSweetAlert(t('error.loading-data'));
  //       setLoader(false);
  //     },
  //   }
  // );

  const materialTableProps = {
    onRowClick,
    onSelectionChange: (): any => void 0,
  };

  const reFetchData = (): any => queryCache.invalidateQueries(queryKey);

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

  useImperativeHandle(forwardedRef, () => ({
    loadItems(): void {
      reFetchData();
    },
  }));

  // function InitData(): JSX.Element {}

  useEffect(() => {
    debugger;
    tableRef.current.onQueryChange();
  }, [filters]);

  return (
    <div className={table}>
      <MaterialTable
        tableRef={tableRef}
        localization={localization}
        components={{
          Toolbar: (props: any): JSX.Element => <MTableToolbar {...props} />,
          FilterRow: (props): any => (
            <tr>
              <td style={{ width: '48px' }} />
              {columns.map((column: any) => (
                <td key={column.field}>
                  <FilterInput
                    name={column.title}
                    fieldName={column.field}
                    onChange={
                      (input: DataTableFilterInterface): any => {
                        //------
                        const array = filters;
                        if (array.length > 0) {
                          const found = array.some(
                            (el) => el.fieldName === column.field
                          );
                          if (!found) {
                            array.push(input);
                          } else {
                            const index = array.findIndex(
                              (el) => el.fieldName === column.field
                            );
                            array[index] = input;
                          }
                          setFilters(array);
                        } else {
                          setFilters([input]);
                        }
                      }
                      //------
                    }
                  />
                </td>
              ))}
            </tr>
          ),
          // Pagination: (props: any): any => (
          //   <TablePagination
          //     {...props}
          //     rowsPerPageOptions={[5, 10, 25, 50]}
          //     rowsPerPage={pageSize}
          //     count={itemsCount}
          //     page={page}
          //   />
          // ),
        }}
        columns={columns}
        data={(query): any =>
          new Promise((resolve, reject) => {
            console.log('query ==> ', query);
            console.log('filters ==> ', filters);
            let url = UrlAddress.baseUrl + urlAddress;

            url += `?&$top=${query.pageSize}&$skip=${
              query.page * query.pageSize
            }`;

            if (defaultFilter) {
              url += `&$filter= ${defaultFilter}`;
            }
            if (query.filters.length > 0) {
              url += defaultFilter ? ' and ' : '&$filter=';
              query.filters.forEach((x: any, i: number) => {
                const openP = i === 0 ? '(' : '';
                const closeP = i === query.filters.length - 1 ? ')' : '';
                const orO = i < query.filters.length - 1 ? 'and ' : '';
                url += `${openP}contains(cast(${x.column.field},'Edm.String'),'${x.value}')${orO}${closeP}`;
              });
            }
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
              url += `&$orderby=${query.orderBy.field?.toString()} ${
                query.orderDirection
              }`;
            } else {
              if (columns.findIndex((c: any) => c.field === 'id') !== -1) {
                url += `&$orderby=id desc`;
              }
            }
            console.log('QueryParam ==> ', url);
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
                resolve({
                  data: result.items,
                  page: query.page,
                  totalCount: result.count,
                });
              });
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

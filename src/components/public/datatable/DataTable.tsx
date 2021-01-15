import React, {
  createRef,
  useImperativeHandle,
  useState,
  forwardRef,
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
import { TablePagination } from '@material-ui/core';
import itemsSanitizer from './ItemsSanitizer';

type CountdownHandle = {
  loadItems: () => void;
};

const DataTable: React.ForwardRefRenderFunction<
  CountdownHandle,
  DataTableProps
> = (props, forwardedRef) => {
  const [page, setPage] = useState<number>(0);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [entries, setEntries] = useState([]);
  const [isLoader, setLoader] = useState(true);

  const {
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
  } = props;

  const { t } = useTranslation();

  const queryCache = useQueryCache();

  const editUser = has(extraMethods, 'editUser') ? extraMethods.editUser : null;

  const { isLoading: isLoadingFetchData } = usePaginatedQuery(
    [queryKey, page],
    () => queryCallback(page, pageSize),
    {
      onSuccess: (data) => {
        const { items, count } = data;
        setEntries(itemsSanitizer(items, queryKey));
        setItemsCount(count);
        setLoader(false);
      },
      onError: async () => {
        await errorSweetAlert(t('error.loading-data'));
        setLoader(false);
      },
    }
  );

  const materialTableProps = {
    onRowClick,
    onSelectionChange: (): any => void 0,
  };

  const reFetchData = (): any => queryCache.invalidateQueries(queryKey);

  let tableActions: any[] = [
    {
      icon: 'refresh',
      tooltip: 'بارگزاری مجدد',
      isFreeAction: true,
      onClick: (): Promise<any> => reFetchData(),
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

  function InitData(): JSX.Element {
    return (
      <MaterialTable
        tableRef={tableRef}
        localization={localization}
        components={{
          Toolbar: (props: any): JSX.Element => <MTableToolbar {...props} />,
          Pagination: (props: any): any => (
            <TablePagination
              {...props}
              rowsPerPageOptions={[5, 10, 25, 50]}
              rowsPerPage={pageSize}
              count={itemsCount}
              page={page}
            />
          ),
        }}
        columns={columns}
        data={entries}
        actions={tableActions}
        title=""
        isLoading={isLoader || isLoading || isLoadingFetchData}
        options={{
          actionsColumnIndex: -1,
          showSelectAllCheckbox: multiple,
          selection: selection,
          searchFieldAlignment: 'left',
          doubleHorizontalScroll: false,
          paginationType: 'stepped',
          filtering: false,
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
        onChangePage={(pageNumber: any): any => {
          setPage(pageNumber);
        }}
        {...materialTableProps}
      />
    );
  }

  return (
    <div>
      <InitData />
    </div>
  );
};

export default forwardRef(DataTable);

import React, {
  createRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import MaterialTable, {
  MTableToolbar,
} from "./material-table-master/src";
import { DataTableProps } from '../../../interfaces';
import { usePaginatedQuery, useQueryCache } from "react-query";
import { errorSweetAlert } from "../../../utils";
import { useTranslation } from "react-i18next";
import localization from './localization';
import { TablePagination } from "@material-ui/core";

type CountdownHandle = {
  loadItems: () => void;
}

const DataTable: React.ForwardRefRenderFunction<CountdownHandle, DataTableProps> = (props, forwardedRef) => {
  const [page, setPage] = useState<number>(0);
  const [itemsCount, setItemsCount] = useState<number>(0);

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
  } = props;

  const { t } = useTranslation();

  const queryCache = useQueryCache();

  const { isLoading: isLoadingFetchData } = usePaginatedQuery(
    [queryKey, page],
    () => queryCallback(page, pageSize),
    {
      onSuccess: (data) => {
        const { items, count } = data;
        setEntries(items);
        setItemsCount(count);
        setLoader(false);
      },
      onError: async () => {
        await errorSweetAlert(t('error.loading-data'));
        setLoader(false);
      }
    }
  );

  const [entries, setEntries] = useState([]);
  const [isLoader, setLoader] = useState(true);

  const reFetchData = () => queryCache.invalidateQueries(queryKey);

  let tableActions: any[] = [
    {
      icon: "refresh",
      tooltip: "بارگزاری مجدد",
      isFreeAction: true,
      onClick: (): Promise<any> => reFetchData(),
    }
  ];

  if (addAction !== undefined) {
    tableActions = [...tableActions, {
      icon: 'add',
      tooltip: 'ایجاد',
      isFreeAction: true,
      onClick: (): void => addAction(),
    }];
  }
  if (editAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'edit',
        position: 'row',
        tooltip: 'ویرایش',
        color: '#dedede',
        onClick: (event: any, rowData: any): void =>
          editAction(event, rowData)
      }
    ];
  }
  if (removeAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
          icon: 'delete',
          position: 'row',
          tooltip: 'حدف',
          onClick: (event: any, rowData: any): void => {
            removeAction(event, rowData);
          }
        }
    ];
  }

  useImperativeHandle(forwardedRef, () => ({
    loadItems(): void {
      // tableRef.current && tableRef.current.onQueryChange();
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
          Pagination: (props: any) => (
            <TablePagination
              {...props}
              rowsPerPageOptions={[5, 10, 20, 30]}
              rowsPerPage={pageSize}
              count={itemsCount}
            />
          )
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
          searchFieldAlignment: "left",
          doubleHorizontalScroll: false,
          paginationType: "stepped",
          filtering: false,
          pageSize,
          exportButton: true,
          padding: "dense",
          showTitle: false,
          headerStyle: {
            fontWeight: 800,
            backgroundColor: "rgb(215, 204, 255)",
          },
          columnsButton: true,
          maxBodyHeight: 400,
          minBodyHeight: 400,
          rowStyle: (rowData: any): {} => ({
            backgroundColor: rowData.tableData.checked ? "#37b15933" : "",
          }),
        }}
        onChangePage={(pageNumber: any) => {
          console.log('pageNumber-->', pageNumber)
          setPage(pageNumber);
        }}
        onSelectionChange={(): void => {
          // onSelectionChange(rows, row);
        }}
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

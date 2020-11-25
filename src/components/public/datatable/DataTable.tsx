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
import { useQuery, useQueryCache } from "react-query";
import { errorSweetAlert } from "../../../utils";
import { useTranslation } from "react-i18next";

type CountdownHandle = {
  loadItems: () => void;
}

const DataTable: React.ForwardRefRenderFunction<CountdownHandle, DataTableProps> = (props, forwardedRef) => {
  const {
    columns,
    multiple = false,
    selection = false,
    tableRef = createRef(),
    isLoading,
    queryKey,
    queryCallback,
  } = props;

  const { t } = useTranslation();
  const queryCache = useQueryCache();
  const { isLoading: isLoadingFetchData } = useQuery(queryKey, queryCallback, {
    onSuccess: (data) => {
      const { items } = data;
      setEntries(items);
      setLoader(false);
    },
    onError: async () => {
      await errorSweetAlert(t('error.loading-data'));
      setLoader(false);
    }
  });

  const [entries, setEntries] = useState([]);
  const [isLoader, setLoader] = useState(true);

  const reFetchData = () => queryCache.invalidateQueries(queryKey);

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
        // style={{ margin: -10 }}
        localization={{
          pagination: {
            labelDisplayedRows: "{from}-{to} از {count}",
            labelRowsSelect: "ردیف",
            nextAriaLabel: "صفحه بعد",
            nextTooltip: "صفحه بعد",
            previousAriaLabel: "صفحه قبل",
            previousTooltip: "صفحه قبل",
            firstAriaLabel: "اولین صفحه",
            firstTooltip: "اولین صفحه",
            lastAriaLabel: "آخرین صفحه",
            lastTooltip: "آخرین صفحه",
          },
          toolbar: {
            nRowsSelected: "{0} ردیف انتخاب شده است",
            searchPlaceholder: "جستجو",
            addRemoveColumns: "افزودن و یا حذف ستون ها",
            showColumnsTitle: "نمایش ستون ها",
            showColumnsAriaLabel: "نمایش ستون ها",
            searchTooltip: "جستجو",
            exportTitle: "تبدیل کردن",
            exportName: "تبدیل به اکسل",
          },
          header: {
            actions: "عملیات",
          },
          body: {
            emptyDataSourceMessage: "هیچ رکوردی برای نمایش وجود ندارد",
            filterRow: {
              filterTooltip: "فیلتر",
            },
          },
        }}
        components={{
          Toolbar: (props: any): JSX.Element => <MTableToolbar {...props} />,
        }}
        columns={columns}
        // data={(query: any) =>
        //   new Promise((resolve, reject) => {
        //     let oQuery = { ...query };
        //     query.filter = "List.statuscode=1";
        //     query.whereClause = whereClause;
        //     query = { ...query, ...extraParam };
        //     if (typeof oQuery.filter !== "undefined") {
        //       delete oQuery.filter
        //     }
        //     if (typeof oQuery.whereClause !== "undefined") {
        //       delete oQuery.whereClause
        //     }
        //     var data = {
        //       data: [] = [],
        //       page: 0,
        //       totalCount: 0
        //     };
        //       return fetch(`${env.api.baseUrl}/${url}`, {
        //         method: "POST",
        //         headers: {
        //           Accept: "application/json",
        //           "Content-Type": "application/json",
        //         },
        //       })
        //         .then((response) => response.json())
        //         .then((result) => {
        //           resolve(result);
        //           getData(result);
        //           loadItems = false;
        //           oldQuery = { ...oQuery };
        //         });
        //   }).catch((error) => {
        //     alert(error.message);
        //     loadItems = false;
        //     oldQuery = {};
        //   })
        // }
        data={entries}
        actions={[
          {
            icon: "refresh",
            tooltip: "بارگزاری مجدد",
            isFreeAction: true,
            onClick: (): Promise<any> => reFetchData(),
          },
          {
            icon: 'add',
            tooltip: 'ایجاد',
            isFreeAction: true,
            onClick: (): void => props.addAction()
          },
          {
            icon: 'edit',
            position: 'row',
            tooltip: 'ویرایش',
            color: '#dedede',
            onClick: (event: any, rowData: any): void =>
              props.editAction(event, rowData)
          },
          {
            icon: 'delete',
            position: 'row',
            tooltip: 'حدف',
            onClick: (event: any, rowData: any): void => {
              props.removeAction(event, rowData)
            }
          }
        ]}
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
          pageSize: 10,
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

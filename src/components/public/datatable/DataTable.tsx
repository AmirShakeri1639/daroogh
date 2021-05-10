import React, { createRef, useState, forwardRef, useEffect } from 'react'
import MaterialTable, { MTableToolbar } from 'material-table'
import { DataTableProps } from '../../../interfaces'
import { useQueryCache } from 'react-query'
import { tError } from 'utils'
import { useTranslation } from 'react-i18next'
import localization from './localization'
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Slide,
  TablePagination,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { DataTableColumns } from '../../../interfaces/DataTableColumns'
import { UrlAddress } from '../../../enum/UrlAddress'
import FilterInput from './FilterInput'
import { DataTableFilterInterface } from '../../../interfaces/DataTableFilterInterface'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ReportViewerContainer from '../report/ReportViewerContainer'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import CloseIcon from '@material-ui/icons/Close'
import XLSX from 'xlsx'
import { tSimple, tSuccess, tInfo, tWarn } from 'utils'
import { screenWidth } from 'enum'
import { getBaseUrl } from 'config'
import Utils from '../utility/Utils'

const exportToExcel = async (columns: any[], data: any[], type: number, url: string) => {
  const columnInfo = columns.reduce(
    (acc, column) => {
      const headerLabel = column.title || column.field
      acc.header.push(headerLabel)
      acc.map[column.field] = headerLabel
      return acc
    },
    { map: {}, header: [] }
  )
  let mappedData: any[] = []

  switch (type) {
    case 0:
      const user = localStorage.getItem('user') || '{}'
      const { token } = JSON.parse(user)
      tInfo('فایل اکسل در حال تولید می باشد')
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          mappedData = result.items
        })
        .catch(
          async (error: any): Promise<any> => {
            tError(
              'خطایی در اجرای درخواست رخ داده است. لطفا با واحد پشتیبانی تماس حاصل نمایید.'
            )
            mappedData = []
          }
        )
      break
    case 1:
      mappedData = data
      break
    default:
      break
  }

  let result = mappedData.map((row) =>
    Object.entries(row).reduce((acc: any, [key, value]) => {
      if (columnInfo.map[key]) {
        acc[columnInfo.map[key]] = value
      }
      return acc
    }, {})
  )

  var ws = XLSX.utils.json_to_sheet(result, {
    header: columnInfo.header,
  })

  var wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  XLSX.writeFile(wb, `daroog.xlsx`)
}

type CountdownHandle = {
  loadItems: () => void
}

const useStyles = makeStyles((theme) => ({
  table: {
    '& tbody>.MuiTableRow-root:hover': {
      background: '#bbdefb !important',
    },
    '& tbody .MuiIconButton-root': {
      width: 30,
      height: 30,
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },
    '& tbody>.MuiTableRow-root:nth-child(even)': {
      background: '#f9f9f9',
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
}))

const Transition = React.forwardRef<TransitionProps, { children?: React.ReactElement<any, any> }>(
  (props, ref) => <Slide direction="up" ref={ref} {...props} />
)

const DataTable: React.ForwardRefRenderFunction<CountdownHandle, DataTableProps> = (
  props,
  forwardedRef
) => {
  const { table, closeButton } = useStyles()
  const [page, setPage] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>('')
  const [itemsCount, setItemsCount] = useState<number>(0)
  const [entries, setEntries] = useState([])
  const [isLoader, setLoader] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [filters, setFilters] = useState<DataTableFilterInterface[]>([])

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
    otherQueryString,
  } = props

  const { t } = useTranslation()

  const queryCache = useQueryCache()

  const expoertOptions = [
    { title: 'اکسپورت از تمام صفحات', type: 0 },
    { title: 'اکسپورت از صفحه جاری', type: 1 },
  ]
  const ITEM_HEIGHT = 48
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const open = Boolean(anchorEl)

  const handleExportButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setAnchorEl(null)
  }

  const materialTableProps = {
    onRowClick,
    onSelectionChange: (): any => void 0,
  }

  let tableActions: any[] = [
    {
      icon: 'find_replace',
      tooltip: 'فیلتر',
      isFreeAction: true,
      onClick: (): any => setShowFilter(!showFilter),
    },
    {
      icon: 'import_export',
      tooltip: 'اکسپورت',
      isFreeAction: true,
      onClick: (e: any): any => handleExportButtonClick(e),
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
  ]

  if (addAction !== undefined) {
    tableActions = [
      ...tableActions,
      {
        icon: 'add',
        tooltip: 'ایجاد',
        isFreeAction: true,
        onClick: (): void => addAction(),
      },
    ]
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
    ]
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
    ]
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
          removeAction(event, rowData)
        },
      },
    ]
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
            if (a.action) a.action(event, rowData)
          },
        },
      ]
    })
  }

  useEffect(() => {
    tableRef.current.onQueryChange()
  }, [filters])

  useEffect(() => {
    columns.forEach((element: DataTableColumns) => {
      element.filterComponent = (props: any): any => <FilterInput {...props} />
    })
  }, [columns])

  const ReportContainer = (): JSX.Element => (
    <Dialog
      onClose={(): any => setShowReport(false)}
      open={showReport}
      TransitionComponent={Transition}
      fullScreen={true}
      fullWidth={true}
    >
      <AppBar>
        <Toolbar variant="dense" style={{ backgroundColor: 'rgb(164, 191, 226)' }}>
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
  )
  
  const [querySearch, setQuerySearch] = useState('')

  const TOOLBAR_ID = "toolbar__unique__id";
  useEffect(() => {
    const searchBar: any = document.querySelector(`#${TOOLBAR_ID} input`);
    if (!searchBar) return;
    searchBar.focus();
  }, [querySearch, totalCount]);

  return (
    <div className={table}>
      <ReportContainer />
      <div id="dataTable1">
        <MaterialTable
          tableRef={tableRef}
          localization={localization}
          icons={{
            PreviousPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
          }}
          components={{
            Toolbar: (props: any): JSX.Element => {
              return (
                <div id={TOOLBAR_ID}>
                  <MTableToolbar {...props} />
                </div>
              );
            },
            Pagination: props => (
              <Grid container style={{ marginTop: -5 }}>
                <Grid item xs={12} sm={6} xl={3} style={{ display: 'flex', alignItems: 'center' }}>
                  <span>
                    <TablePagination {...props} />
                  </span>
                  <span style={{ marginRight: 20 }}>تعداد کل ردیف ها : <span style={{ color: 'blue', fontWeight: 'bold' }}>{Utils.numberWithCommas(totalCount)}</span></span>
                </Grid>
              </Grid>
            )
          }}
          columns={columns}
          data={(query): any =>
            new Promise((resolve, reject) => {
              let url = getBaseUrl() + urlAddress
              if (url.includes('?'))
                url += `&$top=${query.pageSize}&$skip=${query.page * query.pageSize}`
              else url += `?&$top=${query.pageSize}&$skip=${query.page * query.pageSize}`

              if (otherQueryString) {
                url += `&${otherQueryString}`
              }

              if (defaultFilter) {
                url += `&$filter= ${defaultFilter}`
              }

              const qFilter = query.filters.filter((x) => x.value.fieldValue !== '')
              qFilter.forEach((x: any, i: number) => {
                if (i === 0) url += defaultFilter ? ' and ' : '&$filter='
                const openP = i === 0 ? '(' : ''
                const closeP = i === qFilter.length - 1 ? ')' : ''
                const andO = i < qFilter.length - 1 ? 'and ' : ''
                url += `${openP} ${String(x.value.operator).replace(
                  '$',
                  x.value.fieldValue
                )} ${andO}${closeP}`
              })
              if (query.search && query.search !== '') {
                setQuerySearch(query.search)
                const columnsFilter = columns.filter((x: any) => x.searchable)
                if (columnsFilter.length > 0) {
                  url += defaultFilter || query.filters.length > 0 ? ' and ' : '&$filter='
                  columnsFilter.forEach((x: DataTableColumns, i: number) => {
                    const openP = i === 0 ? '(' : ''
                    const closeP = i === columnsFilter.length - 1 ? ')' : ''
                    const orO = i < columnsFilter.length - 1 ? 'or ' : ''
                    url += `${openP}contains(cast(${x.field},'Edm.String'),'${query.search}')${orO}${closeP}`
                  })
                }
              }
              if (query.orderBy) {
                url += `&$orderby=${query.orderBy.field?.toString()} ${query.orderDirection}`
              } else {
                if (columns.findIndex((c: any) => c.field === 'id') !== -1) {
                  url += `&$orderby=id desc`
                }
              }
              const user = localStorage.getItem('user') || '{}'
              const { token } = JSON.parse(user)

              if (urlAddress)
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
                    setTotalCount(result.count);
                    resolve({
                      data: result.items,
                      page: query.page,
                      totalCount: result.count,
                    })
                  })
                  .catch(
                    async (error: any): Promise<any> => {
                      tError(
                        'خطایی در اجرای درخواست رخ داده است. لطفا با واحد پشتیبانی تماس حاصل نمایید.'
                      )
                      setTotalCount(0);
                      resolve({
                        data: [],
                        page: 0,
                        totalCount: 0,
                      })
                    }
                  )
            })
          }
          detailPanel={
            detailPanel
              ? [
                {
                  tooltip: 'نمایش جزئیات',
                  render: (rowData): any => {
                    return detailPanel(rowData)
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
            // exportButton: true,
            padding: 'dense',
            showTitle: false,
            headerStyle: {
              fontWeight: 800,
              backgroundColor: '#0078d4',
              color: 'white',
            },
            columnsButton: true,
            maxBodyHeight: `calc(90vh - ${document?.getElementById('dataTable1')?.getBoundingClientRect()}`,
            minBodyHeight: 400,
            rowStyle: (rowData: any): {} => ({
              backgroundColor: rowData.tableData.checked ? '#37b15933' : '',
            }),
          }}
          onSearchChange={(text: string): any => setSearchText(text)}
          {...materialTableProps}
        />
      </div>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleExportClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            marginLeft: window.innerWidth <= screenWidth.sm ? 0 : 50,
          },
        }}
      >
        {expoertOptions.map((option) => (
          <MenuItem
            key={option.title}
            onClick={(): any => {
              exportToExcel(
                tableRef.current.dataManager.columns,
                tableRef.current.dataManager.data,
                option.type,
                getBaseUrl() + urlAddress
              )
              handleExportClose()
            }}
            style={{ fontSize: 12 }}
          >
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default forwardRef(DataTable)

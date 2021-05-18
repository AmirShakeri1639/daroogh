import React, { useState, Fragment } from "react"
import {
  TableColumnInterface,
} from "interfaces"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import CircleBackdropLoading from "../loading/CircleBackdropLoading"

interface DataGridProps {
  stickyHeader?: boolean
  ariaLabel?: string
  tableColumns: TableColumnInterface[]
  data: any
  isLoading: boolean
  extraColumn?: (item: any) => any
}

const DataGrid: React.FC<DataGridProps> = (props) => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const { t } = useTranslation()

  const {
    stickyHeader,
    ariaLabel,
    tableColumns,
    data,
    isLoading,
    extraColumn,
  } = props

  const handleChangePage = (
    event: unknown, newPage: number
  ): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const tableHeadGenerator = (): JSX.Element[] => {
    return tableColumns.map((item, index) => {
      return (
        <Fragment key={ item.field }>
          <TableCell>
            { item.title }
          </TableCell>
          {index + 1 === tableColumns.length && (
            <TableCell />
          ) }
        </Fragment>
      )
    })
  }

  const tableRowsGenerator = (): any => {
    if (data !== null) {
      return data
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item: any) => {
          return (
            <TableRow
              hover
              tabIndex={ -1 }
              key={ item.id }
            >
              {tableColumns.map((c, index) => {
                const value = c.render
                  ? c.render(item)
                  : c.field.toString().split('.')
                    .reduce((o, i) => o[i], item)
                return (
                  <Fragment key={ c.field }>
                    <TableCell>
                      { value }
                    </TableCell>
                    {(
                      extraColumn !== undefined &&
                      tableColumns.length === index + 1
                    ) && extraColumn(item) }
                  </Fragment>
                )
              }) }
            </TableRow>
          )
        })
    }
  }

  return (
    <>
      <TableContainer>
        <Table
          stickyHeader={ stickyHeader }
          aria-label={ ariaLabel }
        >
          <TableHead>
            <TableRow>
              { tableHeadGenerator() }
            </TableRow>
          </TableHead>
          <TableBody>
            { !isLoading && tableRowsGenerator() }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ [1, 25, 100] }
        component="div"
        count={ data?.length || 0 }
        rowsPerPage={ rowsPerPage }
        labelRowsPerPage={ t('general.rowsPerPage') }
        page={ page }
        onChangePage={ handleChangePage }
        onChangeRowsPerPage={ handleChangeRowsPerPage }
      />
      <CircleBackdropLoading isOpen={ isLoading } />
    </>
  )
}

DataGrid.defaultProps = {
  stickyHeader: true,
  ariaLabel: 'data table',
  isLoading: true,
}

export default DataGrid

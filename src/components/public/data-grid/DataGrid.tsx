import React, { useState, Fragment } from "react";
import {
  PermissionItemTableColumnInterface,
} from "../../../interfaces";
import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow,
} from "@material-ui/core";
import CircleLoading from "../loading/CircleLoading";
import { makeStyles } from "@material-ui/core/styles";

interface DataGridProps {
  stickyHeader?: boolean;
  ariaLabel?: string;
  tableColumns: PermissionItemTableColumnInterface[];
  data: any;
  isLoading: boolean;
  extraColumn?: (item: any) => any;
}

const useClasses = makeStyles(() => createStyles({
  tableContainer: {
    maxHeight: 350
  }
}));

const DataGrid: React.FC<DataGridProps> = (props) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const { tableContainer } = useClasses();

  const {
    stickyHeader,
    ariaLabel,
    tableColumns,
    data,
    isLoading,
    extraColumn,
  } = props;

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const tableHeadGenerator = (): JSX.Element[] => {
    return tableColumns.map((item, index) => {
      return (
        <Fragment key={item.id}>
          <TableCell>
            {item.label}
          </TableCell>
          {index + 1 === tableColumns.length && (
            <TableCell />
          )}
        </Fragment>
      );
    });
  }

  const tableRowsGenerator = (): any => {
    if (data !== null) {
      return data
        .slice(page * rowsPerPage, page  * rowsPerPage + rowsPerPage)
        .map((item: any) => {
          return (
            <TableRow
              hover
              tabIndex={-1}
              key={item.id}
            >
              {tableColumns.map((c, index) => {
                const value = item[c.id];
                return (
                  <Fragment key={c.id}>
                    <TableCell>
                      {value}
                    </TableCell>
                    {(extraColumn !== undefined && tableColumns.length === index + 1) && extraColumn(item)}
                  </Fragment>
                );
              })}
            </TableRow>
          );
        });
    }
  }

  return (
    <>
      <TableContainer className={tableContainer}>
        <Table
          stickyHeader={stickyHeader}
          aria-label={ariaLabel}
        >
          <TableHead>
            <TableRow>
              {tableHeadGenerator()}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && tableRowsGenerator()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[1, 25, 100]}
        component="div"
        count={data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {(isLoading) && <CircleLoading />}
    </>
  );
}

DataGrid.defaultProps = {
  stickyHeader: true,
  ariaLabel: 'data table',
  isLoading: true,
}

export default DataGrid;

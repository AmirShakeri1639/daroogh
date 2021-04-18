import React from 'react';
import Reports from '../../../../services/api/Reports';
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { TableColumnInterface } from '../../../../interfaces';
import { useQuery } from 'react-query';
import { Rating } from '@material-ui/lab';
const { getBestPharmaciesList } = new Reports();

const BestPharmaciesList: React.FC<{ for24Hour: boolean }> = (props) => {
  const { t } = useTranslation();

  const { container, table } = useClasses();
  const { data } = useQuery('getBestPharmaciesList' + props.for24Hour, () => {
    return getBestPharmaciesList(props.for24Hour);
  });

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader
        className={table}
        size="small"
        aria-label="sticky table"
      >
        <TableHead>
          <TableRow>
            <TableCell>نام</TableCell>
            <TableCell>رتبه</TableCell>
            <TableCell>امتیاز</TableCell>
            <TableCell>استان</TableCell>
            <TableCell>شهر</TableCell>
            <TableCell>ستاره</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.items &&
            data.items.length &&
            data.items.map((entry: any, index: number) => (
              <TableRow
                hover
                tabIndex={-1}
                key={entry.name}
                selected={entry.isMyself}
              >
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.rank}</TableCell>
                <TableCell>{entry.finalScore.toFixed(2)}</TableCell>
                <TableCell>{entry.province}</TableCell>
                <TableCell>{entry.city}</TableCell>
                <TableCell>
                  <Rating
                    name="half-rating-read"
                    defaultValue={entry.star}
                    precision={0.1}
                    readOnly
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BestPharmaciesList;

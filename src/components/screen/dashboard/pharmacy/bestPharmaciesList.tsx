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
const { getBestPharmaciesList } = new Reports();

const BestPharmaciesList: React.FC = () => {
  const { t } = useTranslation();

  const { container,table } = useClasses();
  const { data } = useQuery('getBestPharmaciesList', getBestPharmaciesList);

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div>{t('pharmacy.topList')}</div>
          <Paper>
            <TableContainer className={container}>
              <Table stickyHeader className={table}  size="small" aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>رتبه</TableCell>
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
                      <TableRow hover tabIndex={-1} key={1}>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>{entry.rank}</TableCell>
                        <TableCell>{entry.province}</TableCell>
                        <TableCell>{entry.city}</TableCell>
                        <TableCell>{entry.star}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BestPharmaciesList;

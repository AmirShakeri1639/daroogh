import React from 'react';
import Reports from '../../../../services/api/Reports';
import { Container, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import DataTable from '../../../public/datatable/DataTable';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import { TableColumnInterface } from '../../../../interfaces';
import { getJalaliDate } from '../../../../utils/jalali';
import { Convertor } from '../../../../utils';
import { UrlAddress } from '../../../../enum/UrlAddress';
import { ReportsEnum } from '../../../../enum';


function createData(name:any, calories:any, fat:any, carbs:any, protein:any) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const BestPharmaciesList: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();

  const { container, table } = useClasses();

  const { getBestPharmaciesList } = new Reports();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'pharmacyId',
        title: t('pharmacy.pharmacyId'),
        type: 'numeric',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'name',
        title: t('pharmacy.name'),
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      { 
        field: 'city',
       title: t('pharmacy.city'), type: 'string',
       cellStyle: { textAlign: 'right' },
      },
      { 
        field: 'province',
       title: t('pharmacy.province'), type: 'string',
       cellStyle: { textAlign: 'right' },
      },
      {
        field: 'star',
        title: t('pharmacy.star'),
        type: 'numeric',
        cellStyle: { textAlign: 'right' },
      },
    ];
  };



  return (
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('accounting.list') }</div>
          <Paper>
            <DataTable
              ref={ ref }
              columns={ tableColumns() }
              queryKey={ ReportsEnum.GET_BEST_PHARMACIES_LIST }
              queryCallback={ getBestPharmaciesList }
              urlAddress={ UrlAddress.getBestPharmaciesList }
              initLoad={ false }
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
    );
};

export default BestPharmaciesList;

import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import DataTable from 'components/public/datatable/DataTable';
import { useTranslation } from 'react-i18next';
import { useClasses } from '../classes';
import useDataTableRef from 'hooks/useDataTableRef';
import { DataTableColumns } from 'interfaces/DataTableColumns';
import { Pharmacy } from 'services/api';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

const initialState = {

}

interface Props {
  pharmacyId?: number | string
}

const PharmacyDocs: React.FC<Props> = (props) => {
  let { pharmacyId = 0 } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  if (params.pharmacyId) {
    pharmacyId = +params.pharmacyId
  }
  console.log('%cPharmacy Id in PharmacyDocs component:', 'padding: 0 1em; background: lightblue; color: purple', pharmacyId)
  const { t } = useTranslation()
  const {
    container,
  } = useClasses()
  const ref = useDataTableRef()

  // const {
  //   urls,
  //   files
  // } = new Pharmacy(pharmacyId);
  const pharmacy = new Pharmacy(pharmacyId)
  console.log('>>>>>>>>>>pharmacy files urls:', pharmacy.urls.files)

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
    ]
  }

  const saveHandler = (item: any): void => {

  }

  const removeHandler = async (item: any): Promise<any> => {
    
  }
  
  return (
    <Container maxWidth="lg" className={ container }>
      <h2>اسناد داروخانه</h2>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('pharmacy.list') }</div>
          <Paper>
            <DataTable
              tableRef={ ref }
              columns={ tableColumns() }
              addAction={ (): void => saveHandler(initialState) }
              editAction={ (e: any, row: any): void => saveHandler(row) }
              removeAction={ async (e: any, row: any): Promise<void> =>
                await removeHandler(row)
              }
              queryKey={ pharmacy.urls.files }
              queryCallback={ pharmacy.files }
              urlAddress={ pharmacy.urls.files }
              otherQueryString={`pharmacyId=${pharmacyId}`}
              initLoad={ false }
            />
            {/* { (isLoadingRemove || isLoadingConfirm || isLoadingSave) && (
              <CircleLoading />
            ) } */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PharmacyDocs

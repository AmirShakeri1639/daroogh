import { Container, Grid, Paper } from '@material-ui/core'
import DataTable from 'components/public/datatable/DataTable'
import { DataTableColumns } from 'interfaces'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Prescription } from 'services/api'
import { getJalaliDate } from 'utils'

const AcceptedPrescriptionsReport: React.FC = () => {
  const { t } = useTranslation()
  const { urls } = new Prescription()

  const tableColumns = useMemo((): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'number',
      },
      {
        title: 'تاریخ ارسال',
        field: 'sendDate',
        type: 'date',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        render: (row: any): any => {
          return <> {row.sendDate ? getJalaliDate(row.sendDate) : 'نامشخص'}</>;
        },
      },
      {
        field: 'comment',
        title: t('prescription.comment'),
        searchable: true,
        type: 'string',
      },
      {
        field: 'senderUserMobile',
        title: t('general.mobile'),
        searchable: true,
        type: 'string',
      },
   ]
  }, [])

  return (
    <Container>
      <Grid container>
        <Grid item xs={ 12 }>
          <h3>{ t('reports.acceptedPrescriptions') }</h3>
          <Grid item xs={ 12 }>
            <DataTable
              columns={ tableColumns }
              urlAddress={ urls.acceptedPrescriptions }
              initLoad={ false }
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AcceptedPrescriptionsReport

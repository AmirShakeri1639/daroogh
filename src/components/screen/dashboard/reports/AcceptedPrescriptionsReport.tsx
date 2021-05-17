import React, { useMemo } from 'react'
import { Container, Grid, Paper } from '@material-ui/core'
import DataTable from 'components/public/datatable/DataTable'
import { DataTableColumns } from 'interfaces'
import { useTranslation } from 'react-i18next'
import { Prescription } from 'services/api'
import { getJalaliDate } from 'utils'
import PrescriptionResponses from './PrescriptionResponses'

const AcceptedPrescriptionsReport: React.FC = () => {
  const { t } = useTranslation()
  const { urls } = new Prescription()

  const tableColumns = useMemo((): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'numeric',
      },
      {
        title: 'تاریخ ارسال',
        field: 'sendDate',
        type: 'date',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        render: (row: any): any => {
          return <> {
            row.sendDate
              ? getJalaliDate(row.sendDate)
              : 'نامشخص'
          }</>
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

  const detailPanelHandler = (row: any): JSX.Element => {
    return (
      <Paper
        style={ {
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          boxShadow: 'inset 0px 0px 3px 0px',
        } }
      >
        <PrescriptionResponses items={ row.prescriptionResponse } />
      </Paper>
    )
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={ 12 }>
          <h3>{ t('reports.acceptedPrescriptions') }</h3>
          <Grid item xs={ 12 }>
            <DataTable
              columns={ tableColumns }
              urlAddress={ urls.acceptedPrescriptions }
              detailPanel={ detailPanelHandler }
              initLoad={ false }
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AcceptedPrescriptionsReport

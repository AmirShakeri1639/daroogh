import React, { useMemo } from 'react'
import { Container, Paper } from '@material-ui/core'
import DataTable from '../../../public/datatable/DataTable'
import { Reports } from 'services/api'
import { DataTableColumns } from 'interfaces'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { ColorEnum } from 'enum'
import { getJalaliDate } from 'utils'

const AllPharmacyDrugReport: React.FC = () => {
  const { t } = useTranslation()
  const {
    urls,
    getAllPharmacyDrugs,
  } = new Reports()

  const tableColumns = useMemo((): DataTableColumns[] => {
    return [
      {
        field: 'phamacy.name',
        title: t('pharmacy.pharmacy'),
        type: 'string',
      },
      {
        field: 'drug.name',
        title: t('drug.product'),
        type: 'string',
      },
      {
        field: 'drug.genericName',
        title: t('drug.genericName'),
        type: 'string',
      },
      {
        field: 'drug.enName',
        title: t('drug.enName'),
        type: 'string',
        render: (row: any): any => {
          return (
            <span className="no-farsi-number">
              { row.drug.enName }
            </span>
          )
        }
      },
      {
        field: 'expireDate',
        title: t('general.expireDate'),
        type: 'string',
        render: (row: any): any => {
          return (
            `${getJalaliDate(row.expireDate)}`
          )
        }
      },
      {
        field: 'drug.categoryName',
        title: t('drug.category'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'drug.type',
        title: t('general.type'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'cnt',
        title: t('general.count'),
        type: 'string',
      },
      {
        field: 'totalAmount',
        title: t('accounting.amount'),
        type: 'string',
      },
    ]
  }, [])

  return (
    <Container>
      <Paper className="padding-2">
        <h2>{ t('reports.report') } { t('reports.allPharmacyDrug') }</h2>
        <DataTable
          showToolbar={ false }
          columns={ tableColumns }
          queryKey={ urls.getAllPharmacyDrugs }
          queryCallback={ getAllPharmacyDrugs }
          urlAddress={ urls.getAllPharmacyDrugs }
          initLoad={ false }
        />
      </Paper>
    </Container>
  )
}

export default AllPharmacyDrugReport

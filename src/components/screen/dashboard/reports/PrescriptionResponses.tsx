import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DataTableColumns,
  PrescriptionResponseForReportInterface
} from 'interfaces'
import { getJalaliDate } from 'utils'
import DataGrid from 'components/public/data-grid/DataGrid'
import { ColorEnum } from 'enum'

interface Props {
  items: PrescriptionResponseForReportInterface[]
}

const PrescriptionResponses: React.FC<Props> = (props) => {
  const { items } = props
  const { t } = useTranslation()

  const tableColumns = useMemo((): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'numeric',
      },
      {
        field: 'pharmacy.name',
        title: t('pharmacy.pharmacy'),
        type: 'string',
      },
      {
        field: 'pharmacy.mobile',
        title: t('general.mobile'),
        type: 'string',
      },
      {
        field: 'pharmacy.pharmacyCity',
        title: t('pharmacy.city'),
        type: 'string',
      },
      {
        field: 'pharmacyComment',
        title: t('prescription.pharmacyComment'),
        type: 'string',
      },
      {
        title: 'تاریخ ارسال',
        field: 'responseDate',
        type: 'date',
        headerStyle: { textAlign: 'right', direction: 'rtl' },
        cellStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
        render: (row: any): any => {
          return <> {
            row.responseDate
              ? getJalaliDate(row.responseDate)
              : 'نامشخص'
          }</>
        },
      },
      {
        field: 'stateString',
        title: t('general.state'),
        type: 'string',
        render: (row: any): any => {
          return <span style={{ 
              color: row.state == 2 ? ColorEnum.Green : ColorEnum.GrayRed,
              fontWeight: row.state == 2 ? 'bold' : 'normal'
            }}>
            { row.stateString }
          </span>
        }
      }
    ]
  }, [])

  return (
    <DataGrid
      tableColumns={ tableColumns }
      data={ items }
      isLoading={ false }
    />
  )
}

export default PrescriptionResponses

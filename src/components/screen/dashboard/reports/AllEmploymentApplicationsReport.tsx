import React, { memo, useMemo } from 'react'
import { DataTableColumns } from 'interfaces'
import { EmploymentApplication } from 'services/api'
import { useTranslation } from 'react-i18next'
import { getJalaliDate } from 'utils'
import { MaritalStatusType } from 'enum'
import { Container, Paper } from '@material-ui/core'
import DataTable from 'components/public/datatable/DataTable'

const AllEmploymentApplicationsReport: React.FC = () => {
  const { t } = useTranslation()

  const tableColumns = useMemo((): DataTableColumns[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'numeric',
        cellStyle: { textAlign: 'left' },
      },
      {
        field: 'name',
        title: t('general.name'),
        searchable: true,
        type: 'string',
      },
      {
        field: 'family',
        title: t('general.family'),
        searchable: true,
        type: 'string',
      },
      {
        field: 'mobile',
        title: t('general.mobile'),
        searchable: true,
        type: 'string',
      },
      {
        field: 'nationalCode',
        title: t('user.nationalCode'),
        searchable: true,
        type: 'string',
        hidden: true,
      },
      {
        field: 'gender',
        title: t('general.gender'),
        cellStyle: { textAlign: 'right' },
        type: 'numeric',
        fieldLookup: 'gender',
        lookupFilter: [
          { code: 0, name: t('general.male') },
          { code: 1, name: t('general.female') },
        ],
        render: (row: any): any =>
          row.gender == 0
            ? t('general.male')
            : row.gender == 1
              ? t('general.female')
              : t('general.unknown'),
      },
      {
        field: 'maritalStatus',
        title: t('general.maritalStatus'),
        searchable: true,
        fieldLookup: 'maritalStatus',
        lookupFilter: [
          {
            code: MaritalStatusType.Married,
            name: t('MaritalStatusType.Married')
          },
          {
            code: MaritalStatusType.Single,
            name: t('MaritalStatusType.Single')
          },
        ],
        type: 'string',
        render: (row: any): any => row.maritalStatusStr
      },
      {
        field: 'email',
        title: t('general.email'),
        searchable: true,
        type: 'string',
        hidden: true,
      },
      {
        field: 'birthDate',
        title: t('user.birthDate'),
        type: 'date',
        render: (row: any): any => `${getJalaliDate(row.birthDate)}`
      },
      {
        field: 'sendDate',
        title: t('date.sendDate'),
        type: 'date',
        render: (row: any): any => `${getJalaliDate(row.sendDate)}`
      },
      {
        field: 'hasReadingPrescriptionCertificate',
        title: t('jobs.hasReadingPrescriptionCertificate'),
        type: 'boolean',
        render: (row: any): any =>
          row.hasReadingPrescriptionCertificate
            ? t('general.yes') : t('general.no')
      },
      {
        field: 'workExperienceYear',
        title: t('peopleSection.workExperienceYear'),
        searchable: true,
        type: 'numeric',
      },
      {
        field: 'countryDivisionStr',
        title: t('peopleSection.countryDivisionCode'),
        type: 'string',
        hidden: true,
      }
    ]
  }, [])

  const { urls } = new EmploymentApplication()

  return (
    <Container>
      <Paper className="padding-2">
        <h2>{ t('reports.report') } { t('reports.allEmploymentApplicationsReport') }</h2>
        <DataTable
          columns={ tableColumns }
          queryKey={ urls.allEmploymentApplicationsForAdmin }
          urlAddress={ urls.allEmploymentApplicationsForAdmin }
          initLoad={ false }
        />
      </Paper>
    </Container>
  )
}

export default memo(AllEmploymentApplicationsReport)

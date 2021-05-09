import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from 'components/public/datatable/DataTable';
import { UrlAddress } from 'enum';
import { DataTableCustomActionInterface } from 'interfaces';
import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { faMobileAlt, faFile, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getBaseUrl } from 'config';
import { isNil } from 'lodash';
import CDialog from 'components/public/dialog/Dialog';
import { DialogContent, DialogTitle, Grid } from '@material-ui/core';
import { useMediaQueryWithTheme } from 'hooks';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import styled from 'styled-components';

const Container = styled.div`
  &&& {
    height: 400px;
    display: flex;
    align-items: space-between;
  }
`;

const DetailIcon = styled(FontAwesomeIcon)`
  color: #49abff;
`;

const ResumeIcon = styled(FontAwesomeIcon)`
  color: #5f9;
`;

const CallIcon = styled(FontAwesomeIcon)`
  color: #3f51b5;
`

interface Props {
  ref: any;
}

const resumeUrl = (resumeKey: string): string => {
  return `${getBaseUrl()}/File/GetFile?key=${resumeKey}`;
};

const ResumeDataTable: React.FC<Props & WithTranslation> = ({ ref, t }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const isSmallScreen = useMediaQueryWithTheme('down', 'sm');

  const columns = () => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'name',
        title: `${t('peopleSection.name')} ${t('general.and')} ${t('peopleSection.family')}`,
        type: 'string',
        render: (row: any): any => `${row.name} ${row.family}`,
      },
      {
        field: 'genderStr',
        title: t('general.gender'),
        searchable: true,
        type: 'string',
        fieldLookup: 'gender',
        lookupFilter: [
          { code: 0, name: t('general.male') },
          { code: 1, name: t('general.female') },
        ],
        cellStyle: { textAlign: 'right' },
      },
      {
        field: 'workExperienceYear',
        title: t('peopleSection.workExperienceYear'),
        searchable: true,
        type: 'string',
        cellStyle: { textAlign: 'right' },
      },
    ];
  };

  const detailModalHandler = (data: any) => {
    setUserData(data);
    setIsOpenModal(true);
  };

  const customDataTableActions: DataTableCustomActionInterface[] = [
    {
      icon: (): any => <DetailIcon icon={faInfoCircle} />,
      tooltip: t('peopleSection.detail'),
      action: (event: any, rowData: any): void => detailModalHandler(rowData),
    },
    {
      icon: (): any => <CallIcon icon={faMobileAlt} />,
      tooltip: t('general.call'),
      action: (event: any, rowData: any): void => {
        window.location.href = `tel:${rowData.mobile}`;
      },
    },
    {
      icon: (): any => <ResumeIcon icon={faFile} />,
      tooltip: t('employment.resume'),
      action: (event: any, rowData: any): void => {
        if (!isNil(rowData.resumeFileKey) && rowData.resumeFileKey.length > 0) {
          window.open(`${resumeUrl(rowData.resumeFileKey)}`, '_blank');
        }
      },
    },
  ];

  return (
    <>
      <DataTable
        ref={ref}
        columns={columns()}
        urlAddress={UrlAddress.adminEmploymentApplication}
        pageSize={10}
        isLoading
        customActions={customDataTableActions}
        // initLoad={false}
      />
      <CDialog
        isOpen={isOpenModal}
        hideSubmit
        fullScreen={isSmallScreen}
        fullWidth
        onClose={(): void => setIsOpenModal(false)}
      >
        <DialogTitle id="alert-dialog-title">{t('peopleSection.detail')}</DialogTitle>
        <DialogContent>
          <Container>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={`${t('peopleSection.name')} ${t('general.and')} ${t(
                    'peopleSection.family'
                  )}`}
                  body={userData?.name || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.gender')}
                  body={userData?.genderStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.maritalStatus')}
                  body={userData?.maritalStatusStr || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.readingPrescriptionCertificate')}
                  body={userData?.readingPrescriptionCertificateStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.workExperienceYear')}
                  body={userData?.workExperienceYear || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.suggestedWorkShift')}
                  body={userData?.suggestedWorkShiftStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.pharmaceuticalSoftwareSkill')}
                  body={userData?.pharmaceuticalSoftwareSkillStr || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.computerSkill')}
                  body={userData?.computerSkillStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.foreignLanguagesSkill')}
                  body={userData?.foreignLanguagesSkillStr || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.suggestedJobPosition')}
                  body={userData?.suggestedJobPositionStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.education')}
                  body={userData?.educationStr || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextWithTitle
                  title={t('peopleSection.hasGuarantee')}
                  body={userData?.hasGuaranteeStr || t('general.undefined')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextWithTitle
                  title={t('general.mobile')}
                  body={<a href={`tel:${userData?.mobile}`}>{userData?.mobile}</a> || t('general.undefined')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextWithTitle
                  title={t('general.address')}
                  body={userData?.address || t('general.undefined')}
                />
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </CDialog>
    </>
  );
};

export default withTranslation()(ResumeDataTable);

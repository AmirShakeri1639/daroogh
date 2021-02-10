import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import { EmploymentApplication, File } from '../../../../services/api';
import {
  errorHandler,
  isNullOrEmpty,
  successSweetAlert,
} from '../../../../utils';
import {
  DataTableCustomActionInterface,
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan, faInfoCircle, faDownload
} from '@fortawesome/free-solid-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';
import { getJalaliDate } from '../../../../utils/jalali';
import FormContainer from '../../../public/form-container/FormContainer';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, Grid,
  useMediaQuery, useTheme
} from '@material-ui/core';
import { ColorEnum, EmploymentApplicationEnum } from '../../../../enum';
import FileLink from '../../../public/picture/fileLink';
import { api } from '../../../../config/default.json';

const EmploymentApplicationList: React.FC = () => {
  const { t } = useTranslation();
  const ref = useDataTableRef();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const queryCache = useQueryCache();
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [detailsItem, setDetailsItem] = useState<any>();
  const {
    root,
    spacing1,
    dialogBig,
  } = useClasses();

  const { all, cancel, urls } = new EmploymentApplication();
  const { urls: fileUrls } = new File();

  const detialsDialog = (): JSX.Element => {
    const {
      name, family, genderStr, mobile, workExperienceYear,
      maritalStatusStr, suggestedWorkShiftStr,
      readingPrescriptionCertificateStr,
      gradeOfReadingPrescriptionCertificate,
      pharmaceuticalSoftwareSkillStr,
      computerSkillStr, foreignLanguagesSkillStr,
      suggestedJobPositionStr, educationStr,
      hasGuarantee, address, landlinePhone,
      previousWorkplace, previousWorkplacePhone,
      descriptions,
    } = detailsItem;
    return (
      <Dialog open={ isOpenDetails } fullScreen={ fullScreen } maxWidth="md">
        <DialogTitle>{ t('employment.application') }</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('general.nameFamily') }</b><br />
                { name } &nbsp; { family }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('general.gender') }</b><br />
                { genderStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('general.maritalStatus') }</b><br />
                { maritalStatusStr }
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Divider />
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.readingPrescriptionCertificate') }</b><br />
                { readingPrescriptionCertificateStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.gradeOfReadingPrescriptionCertificate') }</b><br />
                { gradeOfReadingPrescriptionCertificate }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.workExperience') }</b><br />
                { workExperienceYear }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.suggestedWorkShift') }</b><br />
                { suggestedWorkShiftStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.pharmaceuticalSoftwareSkill') }</b><br />
                { pharmaceuticalSoftwareSkillStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.computerSkill') }</b><br />
                { computerSkillStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.foreignLanguagesSkill') }</b><br />
                { foreignLanguagesSkillStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.suggestedJobPosition') }</b><br />
                { suggestedJobPositionStr }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.education') }</b><br />
                { educationStr }
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Divider />
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.guarantee') }</b><br />
                { hasGuarantee ? 'دارد'
                  : 'ندارد' }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('general.landlinePhone') }</b><br />
                { landlinePhone }
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Box className={ spacing1 }>
                <b>{ t('general.address') }</b><br />
                { address }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.previousWorkplace') }</b><br />
                { previousWorkplace }
              </Box>
            </Grid>
            <Grid item xs={ 4 }>
              <Box className={ spacing1 }>
                <b>{ t('employment.previousWorkplacePhone') }</b><br />
                { previousWorkplacePhone }
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Divider />
            </Grid>
            <Grid item xs={ 12 }>
              <Box className={ spacing1 }>
                <b>{ t('general.descriptions') }</b><br />
                { descriptions }
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={ (): void => {
              setIsOpenDetails(false);
            } }
          >
            { t('general.ok') }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const tableColumns = (): DataTableColumns[] => {
    return [
      {
        field: 'name',
        title: t('general.name'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'family',
        title: t('general.family'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'genderStr',
        title: t('general.gender'),
        type: 'string',
      },
      {
        field: 'mobile',
        title: t('general.mobile'),
        type: 'string',
        searchable: true,
      },
      {
        field: 'workExperienceYear',
        title: t('employment.workExperience'),
        type: 'number',
      },
      {
        field: 'id',
        title: t('general.details'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              <Button onClick={ (): any => {
                setDetailsItem(row);
                setIsOpenDetails(true);
              } }>
                <FontAwesomeIcon icon={ faInfoCircle } />
              </Button>
            </>
          )
        }
      },
      {
        field: 'resumeFileKey',
        title: t('employment.resume'),
        type: 'string',
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.resumeFileKey) &&
                <FileLink fileKey={ row.resumeFileKey } />
              }
            </>
          )
        }
      },
    ]
  }

  const [_cancel, { isLoading: isLoadingCancel }] = useMutation(cancel, {
    onSuccess: async () => {
      ref.current?.onQueryChange();
      await queryCache.invalidateQueries(EmploymentApplicationEnum.GET_ALL);
      await successSweetAlert(t('alert.done'));
    }
  });

  const cancelHandler = async (row: any): Promise<any> => {
    try {
      if (window.confirm(t('alert.cancelConfirm'))) {
        await _cancel(row.id);
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  const actions: DataTableCustomActionInterface[] = [
    {
      icon: (): any => (
        <FontAwesomeIcon icon={ faBan } color={ ColorEnum.Red } />
      ),
      tooltip: t('general.cancel'),
      position: 'row',
      action: async (e: any, row: any): Promise<void> => await cancelHandler(row),
    }
  ]

  return (
    <FormContainer title={ t('employment.application') }>
      <DataTable
        tableRef={ ref }
        columns={ tableColumns() }
        customActions={ actions }
        queryKey={ EmploymentApplicationEnum.GET_ALL }
        queryCallback={ all }
        urlAddress={ urls.all }
        initLoad={ false }
      />
      { isOpenDetails && detialsDialog() }
    </FormContainer>
  )
}

export default EmploymentApplicationList;

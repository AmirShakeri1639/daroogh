import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import CircleLoading from '../../../public/loading/CircleLoading';
import { EmploymentApplication } from '../../../../services/api';
import {
  errorHandler,
  isNullOrEmpty,
  successSweetAlert,
} from '../../../../utils';
import {
  ActionInterface,
  DataTableCustomActionInterface,
  PrescriptionInterface,
  PrescriptionResponseInterface
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { DataTableColumns } from '../../../../interfaces/DataTableColumns';
import { useClasses } from '../classes';
import { getJalaliDate } from '../../../../utils/jalali';
import FormContainer from '../../../public/form-container/FormContainer';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, Grid,
  Paper,
  Switch, TextField, useMediaQuery, useTheme
} from '@material-ui/core';
import { ColorEnum, EmploymentApplicationEnum } from '../../../../enum';
import FileLink from '../../../public/picture/fileLink';

const EmploymentApplicationList: React.FC = () => {
  const { t } = useTranslation();
  const ref = useDataTableRef();
  const queryCache = useQueryCache();

  const { all, cancel, urls } = new EmploymentApplication();

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
        searchable: true,
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
        searchable: true,
      },
      {
        field: 'resumeFileKey',
        title: t('employment.resume'),
        type: 'string',
        searchable: true,
        render: (row: any): any => {
          return (
            <>
              { !isNullOrEmpty(row.resumeFileKey) &&
                <FileLink fileKey={ row.resumeFileKey } fileName="resume.jpg" />
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
    </FormContainer>
  )
}

export default EmploymentApplicationList;

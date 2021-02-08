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
  PrescriptionInterface,
  PrescriptionResponseInterface
} from '../../../../interfaces';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import DataTable from '../../../public/datatable/DataTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
} from '@fortawesome/free-regular-svg-icons';
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
import { EmploymentApplicationEnum } from '../../../../enum';

const EmploymentApplicationList: React.FC = () => {
  const { t } = useTranslation();
  const ref = useDataTableRef();
  const queryCache = useQueryCache();

  const { all, urls } = new EmploymentApplication();

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
    ]
  }

  return (
    <FormContainer title={ t('employment.application') }>
      <DataTable
        tableRef={ ref }
        columns={ tableColumns() }
        queryKey={ EmploymentApplicationEnum.GET_ALL }
        queryCallback={ all }
        urlAddress={ urls.all }
        initLoad={ false }
      />
    </FormContainer>
  )
}

export default EmploymentApplicationList;

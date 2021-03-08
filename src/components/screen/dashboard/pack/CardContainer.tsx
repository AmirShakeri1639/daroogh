import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Divider,
} from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SupplyListCardContainer } from '../../../../interfaces';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useMutation, useQueryCache } from 'react-query';
import { PharmacyDrug } from '../../../../services/api';
import { successSweetAlert, errorSweetAlert } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { TextMessage } from '../../../../enum';
import { AllPharmacyDrug } from '../../../../enum/query';
import { PharmacyDrugSupplyList } from '../../../../model/pharmacyDrug';
import { useHistory } from 'react-router-dom';
import routes from '../../../../routes';

const { removePharmacyDrug } = new PharmacyDrug();

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1,1),
      borderRadius: 5,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

interface CardContainerProps {
  name: string;
  drugsCounter: number | string;
  totalPrice: string | number;
  id: number;
  removeHandler: (item: number) => void;
}

const { createPack } = routes;

const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { root, redTrash } = useStyle();
  const { id, removeHandler } = props;

  const queryCache = useQueryCache();
  const { t } = useTranslation();

  const { push } = useHistory();

  const [_removePharmacyDrug] = useMutation(removePharmacyDrug, {
    onSuccess: async (data) => {
      queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
      await successSweetAlert(t('alert.successfulRemoveTextMessage'));
    },
    onError: async () => {
      await errorSweetAlert(t('alert.failedRemove'));
    },
  });

  const itemRemoveHandler = (id: number): void => {
    removeHandler(id);
  };

  const packEditHandler = (id: number): void => {
    push(`${createPack}/${id}`);
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={3}>
        <Grid item xs={12} spacing={3}>
          <Detail {...props} />
        </Grid>
        
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        {' '}
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid justify="flex-end" container spacing={0}>
          <Grid item xs={2}>
            <Button
              onClick={(): void => packEditHandler(id)}
              style={{ color: 'green', fontSize: '14px' }}
            >
              ویرایش
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={(): void => itemRemoveHandler(id)}
              style={{ color: 'red', fontSize: '14px' }}
            >
              حذف
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CardContainer;

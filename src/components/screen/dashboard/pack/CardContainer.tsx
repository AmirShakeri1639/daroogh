import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid } from '@material-ui/core';
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

const { removePharmacyDrug } = new PharmacyDrug();

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1),
      borderRadius: 10,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

interface CardContainerProps {
  name: string;
  drugsCounter: number | string;
  createdAt: string;
  totalPrice: string | number;
  id: number;
}

const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { root, redTrash } = useStyle();
  const { createdAt, drugsCounter, name, totalPrice } = props;

  const queryCache = useQueryCache();
  const { t } = useTranslation();

  const [_removePharmacyDrug] = useMutation(removePharmacyDrug, {
    onSuccess: async (data) => {
      queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
      await successSweetAlert(t('alert.successfulRemoveTextMessage'));
    },
    onError: async () => {
      await errorSweetAlert(t('alert.failedRemove'));
    },
  });

  const itemRemoveHandler = (item: any): void => {
    // removeHandler(item);
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid justify="flex-end" container spacing={1}>
            {/* <Grid item xs={1}>
              <FontAwesomeIcon
                icon={faEdit}
                size="lg"
                className="cursor-pointer"
                onClick={openEditModal}
              />
            </Grid> */}
            <Grid item xs={1}>
              <FontAwesomeIcon
                onClick={(): void => itemRemoveHandler(id)}
                icon={faTrashAlt}
                size="lg"
                className={`${redTrash} cursor-pointer`}
              />
            </Grid>
          </Grid>
        </Grid>
        <Detail {...props} />
      </Grid>
    </Paper>
  );
};

export default CardContainer;

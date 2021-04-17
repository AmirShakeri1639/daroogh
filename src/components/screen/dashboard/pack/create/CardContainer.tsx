import React, { Fragment, useState } from 'react';
import { makeStyles, Paper, createStyles, Grid, Button, Divider } from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SupplyListCardContainer } from '../../../../../interfaces';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useMutation, useQueryCache } from 'react-query';
import { PharmacyDrug } from '../../../../../services/api';
import { tSuccess, tError } from 'utils';
import { useTranslation } from 'react-i18next';
import { TextMessage } from '../../../../../enum';
import { AllPharmacyDrug } from '../../../../../enum/query';
import { PharmacyDrugSupplyList } from '../../../../../model/pharmacyDrug';

const { removePharmacyDrug } = new PharmacyDrug();

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1),
      borderRadius: 10,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

interface CardContainerProps {
  item: PharmacyDrugSupplyList;
  removeHandler: (item: any) => void;
  status: number;
}

const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { root } = useStyle();
  const { item, removeHandler, status } = props;

  const {
    id,
    cnt,
    expireDate,
    offer1,
    offer2,
    amount,
    drugID: { label },
  } = item;

  const queryCache = useQueryCache();
  const { t } = useTranslation();

  const [_removePharmacyDrug] = useMutation(removePharmacyDrug, {
    onSuccess: async () => {
      queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
      tSuccess(t('alert.successfulRemoveTextMessage'));
    },
    onError: async () => {
      tError(t('alert.failedRemove'));
    },
  });

  const itemRemoveHandler = (item: any): void => {
    removeHandler(item);
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        <Detail
          drugName={label}
          amount={Number(amount)}
          expireDate={expireDate}
          count={Number(cnt)}
          offer1={Number(offer1)}
          offer2={Number(offer2)}
          enName={''}
        />
      </Grid>
      {status == 1 && (
        <Fragment>
          <Grid item xs={12} style={{ padding: '4px' }}>
            {' '}
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid justify="flex-end" container spacing={0}>
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
        </Fragment>
      )}
    </Paper>
  );
};

export default CardContainer;

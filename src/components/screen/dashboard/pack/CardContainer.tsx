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
import styled from 'styled-components';

const { removePharmacyDrug } = new PharmacyDrug();

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

const Ribbon = styled.div.attrs((props: any) => ({ text: props.text }))`
  position: absolute;
  transform: rotate(45deg);
  -webkit-transform: rotate(-45deg);
  left: -24px;
  top: 14px;
  width: 100px;
  height: 25px;
  background-color: #ff2e2e;
  content: '${(props: any): any => props.text}';
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: #fff;
`;


interface CardContainerProps {
  name: string;
  drugsCounter: number | string;
  totalPrice: string | number;
  id: number;
  removeHandler: (item: number) => void;
  status: number;
  statusMessage: string;
}

const { createPack } = routes;

const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { root, redTrash } = useStyle();
  const { id, removeHandler, status, statusMessage } = props;

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
      {status != 1 && (
        <Ribbon>{statusMessage}</Ribbon>
      )}
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
          <Grid item xs={status == 1 ? 2 : 3}>
            <Button
              onClick={(): void => packEditHandler(id)}
              style={{ color: 'green', fontSize: '14px' }}
            >
              {status == 1 ? 'ویرایش' :'مشاهده اقلام'}
            </Button>
          </Grid>
          {status == 1 && <Grid item xs={2}>
            <Button
              onClick={(): void => itemRemoveHandler(id)}
              style={{ color: 'red', fontSize: '14px' }}
            >
              حذف
            </Button>

          </Grid>
          }
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CardContainer;

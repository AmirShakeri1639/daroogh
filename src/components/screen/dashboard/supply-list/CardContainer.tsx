import React, { useState, memo } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Divider,
} from '@material-ui/core';
import Detail from './Detail';
import { SupplyListCardContainer } from '../../../../interfaces';
import { useMutation, useQueryCache } from 'react-query';
import { PharmacyDrug } from '../../../../services/api';
import { successSweetAlert, errorSweetAlert, confirmSweetAlert } from 'utils';
import { useTranslation } from 'react-i18next';
import { TextMessage } from '../../../../enum';
import { AllPharmacyDrug } from '../../../../enum/query';
import { BackDrop } from '../../../public';
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
      height: 250,
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

const DeleteButton = styled(Button)`
  color: red;
  font-size: 14px;
`;

const EditButton = styled(Button)`
  color: green;
  font-size: 14px;
`

const CardContainer: React.FC<SupplyListCardContainer> = memo((props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();
  const { drug, editHandler } = props;

  const {
    drug: { name, enName },
    cnt,
    expireDate,
    offer1,
    offer2,
    amount,
    id,
  } = drug;

  const queryCache = useQueryCache();
  const { t } = useTranslation();

  const [_removePharmacyDrug] = useMutation(removePharmacyDrug, {
    onSuccess: async () => {
      queryCache.invalidateQueries(AllPharmacyDrug.GET_ALL_PHARMACY_DRUG);
      setIsOpenBackDrop(false);
      await successSweetAlert(t('alert.successfulRemoveTextMessage'));
    },
    onError: async () => {
      setIsOpenBackDrop(false);
      await errorSweetAlert(t('alert.failedRemove'));
    },
  });

  const removeHandler = async (): Promise<any> => {
    const removeConfirm = await confirmSweetAlert(TextMessage.REMOVE_TEXT_ALERT)
    if (removeConfirm) {
      setIsOpenBackDrop(true);
      await _removePharmacyDrug(id);
    }
  };

  const openEditModal = (): void => {
    if (editHandler !== undefined) {
      editHandler();
    }
  };

  return (
    <Paper className={root} elevation={1}>
      {cnt == 0 && (
        <Ribbon>{`${t('general.inventory')} ${t('number.zero')}`}</Ribbon>
      )}
      <Grid container xs={12} spacing={1}>
        <Detail
          drugName={name}
          amount={amount}
          expireDate={expireDate}
          count={cnt}
          offer1={offer1}
          offer2={offer2}
          enName={enName}
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        {' '}
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Grid justify="flex-end" container spacing={0}>
          <Grid item xs={2}>
            <EditButton
              onClick={openEditModal}
            >
              {t('action.edit')}
            </EditButton>
          </Grid>
          <Grid item xs={2}>
            <DeleteButton
              onClick={removeHandler}
            >
              {t('action.delete')}
            </DeleteButton>
          </Grid>
        </Grid>
      </Grid>
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
});

export default CardContainer;

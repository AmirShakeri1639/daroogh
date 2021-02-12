import React, { useState, useContext } from 'react';
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
import { BackDrop } from '../../../public';

const { removePharmacyDrug } = new PharmacyDrug();

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 2),
      borderRadius: 10,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

const CardContainer: React.FC<SupplyListCardContainer> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root, redTrash } = useStyle();
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
    onSuccess: async (data) => {
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
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid justify="flex-end" container spacing={1}>
            <Grid item xs={1}>
              <FontAwesomeIcon
                icon={faEdit}
                size="lg"
                className="cursor-pointer"
                onClick={openEditModal}
              />
            </Grid>
            <Grid item xs={1}>
              <FontAwesomeIcon
                onClick={removeHandler}
                icon={faTrashAlt}
                size="lg"
                className={`${redTrash} cursor-pointer`}
              />
            </Grid>
          </Grid>
        </Grid>

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

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

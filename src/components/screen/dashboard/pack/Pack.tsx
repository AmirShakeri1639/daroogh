import React from 'react';
import {
  Container,
  createStyles,
  Fab,
  Grid,
  Hidden,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PackEnum } from '../../../../enum';
import { Pack as PackApi } from '../../../../services/api';
import { BackDrop, Button, MaterialContainer } from '../../../public';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CardContainer from './CardContainer';
import { errorSweetAlert, successSweetAlert } from '../../../../utils';

const { getPharmacyPacks, removePack } = new PackApi();

const useStyle = makeStyles((theme) =>
  createStyles({
    addButton: {
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
  })
);

const Pack: React.FC = () => {
  const { addButton, fab } = useStyle();

  const { t } = useTranslation();

  const { push } = useHistory();

  const queryCache = useQueryCache();

  const { isLoading, data } = useQuery(
    PackEnum.GET_PHARMACY_PACKS,
    getPharmacyPacks
  );

  const [_removePack, { isLoading: isLoadingRemovePack }] = useMutation(
    removePack,
    {
      onSuccess: () => {
        queryCache.invalidateQueries(PackEnum.GET_PHARMACY_PACKS);
        successSweetAlert(t('alert.successfulRemoveTextMessage'));
      },
      onError: () => {
        errorSweetAlert(t('alert.failedRemove'));
      },
    }
  );

  const createPackLink = (): void => {
    push({
      pathname: '/pack/create',
    });
  };

  const removeHandler = async (id: number): Promise<any> => {
    if (window.confirm(t('alert.remove'))) {
      await _removePack(id);
    }
  };

  const contentHandler = (): JSX.Element[] | null => {
    if (data !== undefined && !isLoading) {
      return data.items.reverse().map((item: any) => {
        const { id, name, pharmacyDrug, category , category2 , category3 , status , statusString} = item;
        let totalPrice = 0;
        let categories = `${category === null ? name : category.name} ${category2 === null ?  '':category2.name} ${category3 === null ? '' : category3.name} `;
        pharmacyDrug.forEach((item: any) => {
          totalPrice += item.amount * item.cnt;
        });
        let itemStatus = item.status;
        let itemStatusMessage = item.statusString;
        return (
          <Grid spacing={3} item xs={12} sm={12} md={4} xl={4} key={id}>
            <CardContainer
              totalPrice={totalPrice}
              drugsCounter={pharmacyDrug.length}
              name={category === null ? name : categories}
              id={id}
              removeHandler={removeHandler}
              status = {itemStatus}
              statusMessage = {itemStatusMessage}

            />
          </Grid>
        );
      });
    }

    return null;
  };

  return (
    <Container>
      <Grid container spacing={3}>
      <Grid item xs={12} style={{marginTop:16}}>
          {t('alerts.CreatePackAlert')}
        </Grid>

        <Grid item xs={12}>
          <h3>لیست پک ها</h3>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={12} md={4} xl={3}>
            <Paper className={addButton} onClick={createPackLink}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('pack.create')}</span>
            </Paper>
          </Grid>
        </Hidden>
        {contentHandler()}
        <Hidden smUp>
          <Fab onClick={createPackLink} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>
      </Grid>

      <BackDrop isOpen={isLoadingRemovePack} />
    </Container>
  );
};

export default Pack;

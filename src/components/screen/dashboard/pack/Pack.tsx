import React from 'react';
import {
  Container,
  createStyles,
  Fab,
  Grid,
  Hidden,
  makeStyles,
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
      display: 'flex',
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #cecece',
      borderRadius: 10,
      flexDirection: 'column',
      '& button': {
        height: 'inherit',
        width: '100%',
        display: 'flex',
        color: '#707070',
        background: 'transparent',
        '& span:nth-child(2)': {
          marginLeft: 8,
        },
      },
    },
    fab: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 40,
      left: 'auto',
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
        const { id, name, pharmacyDrug, category } = item;
        let totalPrice = 0;
        pharmacyDrug.forEach((item: any) => {
          totalPrice += item.amount;
        });
        return (
          <Grid spacing={3} item xs={12} sm={6} md={4} xl={3} key={id}>
            <CardContainer
              totalPrice={totalPrice}
              drugsCounter={pharmacyDrug.length}
              name={category === null ? name : category.name}
              id={id}
              removeHandler={removeHandler}
            />
          </Grid>
        );
      });
    }

    return null;
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h3>لیست پک ها</h3>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} md={4} xl={3} className={addButton}>
            <Button variant="text" onClick={createPackLink}>
              <FontAwesomeIcon icon={faPlus} />
              <span>{t('pack.create')}</span>
            </Button>
          </Grid>
        </Hidden>
        {contentHandler()}

        <Hidden smUp>
          <Fab onClick={createPackLink} className={fab} aria-label="add">
            <FontAwesomeIcon icon={faPlus} color="white" />
          </Fab>
        </Hidden>
      </Grid>

      <BackDrop isOpen={isLoadingRemovePack} />
    </Container>
  );
};

export default Pack;

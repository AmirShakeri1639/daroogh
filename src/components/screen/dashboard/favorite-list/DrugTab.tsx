import React, { useState } from 'react';
import {
  createStyles,
  Fab,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { PharmacyDrugEnum } from '../../../../enum';
import { debounce, remove } from 'lodash';
import { Favorite, Drug as DrugApi, Search } from '../../../../services/api';
import {
  MaterialContainer,
  Modal,
  Button,
  AutoComplete,
} from '../../../public';
import { errorHandler, successSweetAlert } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardContainer from './CardContainer';

const { getFavoriteList, saveFavoriteList } = new Favorite();

const { searchDrug } = new DrugApi();

const { searchCategory } = new Search();

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
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      maxWidth: 500,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
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

const DrugTab: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [drugSearchOptions, setDrugSearchOptions] = useState<any[]>([]);
  const [categoryDrugSearchOptions, setCategoryDrugSearchOptions] = useState<
    any[]
  >([]);
  const [drugName, setDrugName] = useState<string>('');

  const { t } = useTranslation();

  const { addButton, modalContainer, buttonContainer, fab } = useStyle();

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const queryCache = useQueryCache();

  const { isLoading, data, isFetched } = useQuery(
    PharmacyDrugEnum.GET_FAVORITE_LIST,
    getFavoriteList
  );

  const [_saveFavoriteList, { isLoading: isLoadingSaveData }] = useMutation(
    saveFavoriteList,
    {
      onSuccess: async (data) => {
        const { message } = data;
        queryCache.invalidateQueries(PharmacyDrugEnum.GET_FAVORITE_LIST);
        if (isOpenModal) {
          toggleIsOpenModal();
        }

        setDrugName('');

        await successSweetAlert(message);
      },
    }
  );

  const drugSearch = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }

      const result = await searchDrug(title);
      const items = result.map((i: any) => ({
        value: i.id,
        label: `${i.name} (${i.genericName})`,
      }));

      const options = items.map((item: any) => ({
        el: <div>{item.label}</div>,
        item,
      }));

      setDrugSearchOptions(options);
    } catch (e) {
      errorHandler(e);
    }
  };

  const categoryDrugSearch = async (category: string): Promise<any> => {
    try {
      if (category.length < 2) {
        return;
      }
      const result = await searchCategory(category, 100);
    } catch (e) {
      errorHandler(e);
    }
  };

  const formHandler = async (drugId: number = -1): Promise<any> => {
    try {
      const drugIds = data.items
        .map((item: any) => item.drug?.id)
        .filter((item: any) => item !== null && item !== undefined);

      const categoriesId = data.items
        .map((item: any) => item.category?.id)
        .filter((item: any) => item !== null && item !== undefined);

      if (drugId !== -1) {
        remove(drugIds, (num) => num === drugId);
      }
      if (drugName !== '') {
        drugIds.push(Number(drugName));
      }

      await _saveFavoriteList({
        pharmacyID: 0,
        categories: categoriesId,
        drugs: drugIds,
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && data !== undefined && isFetched) {
      return data.items.map((item: any) => {
        const { drug } = item;
        if (drug !== null) {
          return (
            <Grid key={drug.id} item xs={12} sm={6} md={4} xl={4}>
              <CardContainer data={drug} formHandler={formHandler} />
            </Grid>
          );
        }

        return null;
      });
    }

    return null;
  };

  return (
    <MaterialContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <span>لیست داروهای مورد علاقه</span>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} md={4} xl={4}>
            <Paper className={addButton} onClick={toggleIsOpenModal}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span>{t('favorite.addToDrugList')}</span>
            </Paper>
          </Grid>
        </Hidden>

        {contentGenerator()}
        <Hidden smUp>
          <Fab onClick={toggleIsOpenModal} className={fab} aria-label="add">
            <FontAwesomeIcon size="2x" icon={faPlus} color="white" />
          </Fab>
        </Hidden>
      </Grid>

      <Modal
        style={{ overflow: 'visible' }}
        open={isOpenModal}
        toggle={toggleIsOpenModal}
      >
        <div className={modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <AutoComplete
                isLoading={isLoading}
                onChange={debounce((e) => drugSearch(e.target.value), 500)}
                loadingText={t('general.loading')}
                className="w-100"
                placeholder={t('drug.name')}
                options={drugSearchOptions}
                onItemSelected={(item): void =>
                  setDrugName(String(item[0].value))
                }
              />
            </Grid>

            <Grid item xs={12} className={buttonContainer}>
              <Button color="pink" onClick={toggleIsOpenModal}>
                {t('general.cancel')}
              </Button>
              <Button
                color="blue"
                onClick={formHandler}
                disabled={isLoadingSaveData}
              >
                {isLoadingSaveData ? t('general.pleaseWait') : t('general.add')}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </MaterialContainer>
  );
};

export default DrugTab;

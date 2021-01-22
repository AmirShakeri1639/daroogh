import React, { useState } from 'react';
import { createStyles, Grid, makeStyles, TextField } from '@material-ui/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { PharmacyDrugEnum } from '../../../../enum';
import { debounce, remove } from 'lodash';
import { Favorite, Drug as DrugApi, Search } from '../../../../services/api';
import { MaterialContainer, Modal, Button } from '../../../public';
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
      display: 'flex',
      height: 167,
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
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 500,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const Drug: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [drugSearchOptions, setDrugSearchOptions] = useState<any[]>([]);
  const [categoryDrugSearchOptions, setCategoryDrugSearchOptions] = useState<
    any[]
  >([]);
  const [drugName, setDrugName] = useState<string>('');

  const { t } = useTranslation();

  const { addButton, modalContainer, buttonContainer } = useStyle();

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
        id: i.id,
        name: `${i.name} (${i.genericName})`,
      }));
      setDrugSearchOptions(items);
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
        console.log(item);
        if (drug !== null) {
          return (
            <Grid key={drug.id} item xs={12} sm={6} md={4} xl={3}>
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h3>لیست علاقه مندی ها</h3>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={3} className={addButton}>
          <Button onClick={toggleIsOpenModal} variant="text">
            <FontAwesomeIcon icon={faPlus} />
            <span>{t('favorite.addToDrugList')}</span>
          </Button>
        </Grid>

        {contentGenerator()}
      </Grid>

      <Modal open={isOpenModal} toggle={toggleIsOpenModal}>
        <div className={modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                id="drug-list"
                noOptionsText={t('general.noData')}
                loadingText={t('general.loading')}
                openText="openText"
                options={drugSearchOptions}
                onChange={(event, value, reason): void => {
                  setDrugName(value.id);
                }}
                getOptionLabel={(option: any) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={t('drug.name')}
                    variant="outlined"
                    onChange={debounce(
                      (e: any) => drugSearch(e.target.value),
                      500
                    )}
                  />
                )}
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

export default Drug;

import { createStyles, Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BackDrop, Button, MaterialContainer, Modal } from '../../../../public';
import CardContainer from './CardContainer';
import { useTranslation } from 'react-i18next';
import { remove } from 'lodash';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { PharmacyDrugEnum } from '../../../../../enum';
import { Favorite, Search } from '../../../../../services/api';
import { Autocomplete } from '@material-ui/lab';
import { errorHandler, successSweetAlert } from '../../../../../utils';

const { getFavoriteList, saveFavoriteList } = new Favorite();

const { searchCategory } = new Search();

const useStyle = makeStyles((theme) =>
  createStyles({
    addButton: {
      display: 'flex',
      height: 86,
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
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 500,
    },
  })
);

const Category: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [inSearchingMode, setInSearchingMode] = useState<boolean>(false);
  const [inSubmit, setInSubmit] = useState<boolean>(false);
  const [isOpenBackdrop, setIsOpenBackdrop] = useState<boolean>(false);

  const { addButton, modalContainer, buttonContainer } = useStyle();

  const { t } = useTranslation();

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const queryCache = useQueryCache();

  const { isLoading, data, isFetched } = useQuery(
    PharmacyDrugEnum.GET_FAVORITE_LIST,
    getFavoriteList
  );

  const [_saveFavoriteList] = useMutation(saveFavoriteList, {
    onSuccess: async (data) => {
      const { message } = data;
      queryCache.invalidateQueries(PharmacyDrugEnum.GET_FAVORITE_LIST);
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      setIsOpenBackdrop(false);

      setSelectedCategory(null);
      await successSweetAlert(message);
    },
  });

  const formHandler = async (categoryId: number = -1): Promise<any> => {
    try {
      setInSubmit(true);
      const drugIds = data.items
        .map((item: any) => item.drug?.id)
        .filter((item: any) => item !== null && item !== undefined);

      const categoriesId = data.items
        .map((item: any) => item.category?.id)
        .filter((item: any) => item !== null && item !== undefined);

      if (categoryId !== -1) {
        setIsOpenBackdrop(true);
        remove(categoriesId, (num) => num === categoryId);
      }

      if (selectedCategory !== null) {
        categoriesId.push(Number(selectedCategory));
      }

      console.log(categoriesId);

      await _saveFavoriteList({
        pharmacyID: 0,
        categories: categoriesId,
        drugs: drugIds,
      });
    } catch (e) {
      errorHandler(e);
      setIsOpenBackdrop(false);
    }
    setInSubmit(false);
  };

  const contentGenerator = (): JSX.Element[] | null => {
    if (!isLoading && data !== undefined && isFetched) {
      return data.items
        .filter((item: any) => item.category !== null)
        .map((item: any) => {
          const { category } = item;
          if (category !== null) {
            return (
              <Grid key={category.id} item xs={12} sm={6} md={4} xl={3}>
                <CardContainer data={category} formHandler={formHandler} />
              </Grid>
            );
          }

          return null;
        });
    }

    return null;
  };

  const drugCategorySearch = async (title: string): Promise<any> => {
    try {
      if (title.length < 2) {
        return;
      }
      setInSearchingMode(true);
      const result = await searchCategory(title);
      const items = result.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setOptions(items);
      setInSearchingMode(false);
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <MaterialContainer>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h3>لیست دسته بندی های دارویی موردعلاقه</h3>
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
                loading={inSearchingMode}
                id="drug-list"
                noOptionsText={t('general.noData')}
                loadingText={t('general.loading')}
                openText="openText"
                options={options}
                onChange={(event, value, reason): void => {
                  setSelectedCategory(value.id);
                }}
                getOptionLabel={(option: any) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={t('drug.category')}
                    variant="outlined"
                    onChange={(e): Promise<any> =>
                      drugCategorySearch(e.target.value)
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} className={buttonContainer}>
              <Button color="pink" onClick={toggleIsOpenModal}>
                {t('general.cancel')}
              </Button>
              <Button color="blue" onClick={formHandler} disabled={inSubmit}>
                {inSubmit ? t('general.pleaseWait') : t('general.add')}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>

      <BackDrop isOpen={isOpenBackdrop} />
    </MaterialContainer>
  );
};

export default Category;

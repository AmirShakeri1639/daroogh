import {
  Checkbox,
  createStyles,
  Grid,
  Input,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BackDrop, Button, MaterialContainer, Modal } from '../../../../public';
import CardContainer from './CardContainer';
import { useTranslation } from 'react-i18next';
import { remove } from 'lodash';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { CategoryQueryEnum, PharmacyDrugEnum } from '../../../../../enum';
import {
  Favorite,
  Search,
  Category as CategoryApi,
} from '../../../../../services/api';
import { Autocomplete } from '@material-ui/lab';
import { errorHandler, successSweetAlert } from '../../../../../utils';

const { getFavoriteList, saveFavoriteList } = new Favorite();

const { searchCategory } = new Search();

const { getAllCategories } = new CategoryApi();

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Category: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [inSearchingMode, setInSearchingMode] = useState<boolean>(false);
  const [inSubmit, setInSubmit] = useState<boolean>(false);
  const [isOpenBackdrop, setIsOpenBackdrop] = useState<boolean>(false);

  const { addButton, modalContainer, buttonContainer } = useStyle();

  const { t } = useTranslation();

  const toggleIsOpenModal = (): void => setIsOpenModal((v) => !v);

  const queryCache = useQueryCache();

  const { isLoading, data, isFetched } = useQuery(
    PharmacyDrugEnum.GET_FAVORITE_LIST,
    getFavoriteList,
    {
      onSuccess: (data) => {
        setSelectedCategory(
          data.items
            .filter((item: any) => item.category !== null)
            .map((item: any) => item.category.id)
        );
      },
    }
  );

  const {
    isLoading: isloadingAllCategory,
    data: allCategories,
  } = useQuery(CategoryQueryEnum.GET_ALL_CATEGORIES, () => getAllCategories(0));

  const [_saveFavoriteList] = useMutation(saveFavoriteList, {
    onSuccess: async (data) => {
      const { message } = data;
      queryCache.invalidateQueries(PharmacyDrugEnum.GET_FAVORITE_LIST);
      if (isOpenModal) {
        toggleIsOpenModal();
      }

      setIsOpenBackdrop(false);

      setSelectedCategory([]);
      await successSweetAlert(message);
    },
  });

  const formHandler = async (categoryId: number = -1): Promise<any> => {
    try {
      setInSubmit(true);
      const drugIds = data.items
        .map((item: any) => item.drug?.id)
        .filter((item: any) => item !== null && item !== undefined);

      let categoriesId = data.items
        .map((item: any) => item.category?.id)
        .filter((item: any) => item !== null && item !== undefined);

      if (categoryId > -1) {
        setIsOpenBackdrop(true);
        remove(categoriesId, (num) => num === categoryId);
      } else {
        categoriesId = selectedCategory;
      }

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

  const listGenerator = (): JSX.Element[] | null => {
    if (!isloadingAllCategory && allCategories !== undefined) {
      return allCategories.items.map((cat: any) => {
        return (
          <MenuItem key={cat.id} value={cat.id}>
            <Checkbox checked={selectedCategory.indexOf(cat.id) !== -1} />
            <ListItemText primary={cat.name} />
          </MenuItem>
        );
      });
    }

    return null;
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
              <InputLabel id="category-list">{t('drug.category')}</InputLabel>
              <Select
                multiple
                labelId="cateogry-list"
                label={t('drug.category')}
                variant="filled"
                className="w-100"
                MenuProps={MenuProps}
                value={selectedCategory}
                onChange={(e): void => {
                  const val = e.target.value;
                  setSelectedCategory(val as number[]);
                }}
                input={<Input />}
                renderValue={(selected: any): string => {
                  const items = allCategories?.items
                    .filter((item: any) => selected.indexOf(item.id) !== -1)
                    .map((item: any) => item.name);

                  return ((items as string[]) ?? []).join(', ');
                }}
              >
                {listGenerator()}
              </Select>
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
    </MaterialContainer>
  );
};

export default Category;

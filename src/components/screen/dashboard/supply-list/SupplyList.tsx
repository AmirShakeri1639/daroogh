import React, { useState } from 'react';
import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MaterialContainer } from '../../../public';
import SupplyListContext from './Context';
import MaterialSearchBar from '../../../public/material-searchbar/MaterialSearchbar';
import { useQuery } from 'react-query';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AllPharmacyDrug } from '../../../../enum/query';
import { PharmacyDrug } from '../../../../services/api';
import CardContainer from './CardContainer';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const useStyle = makeStyles((theme) =>
  createStyles({
    contentContainer: {
      marginTop: 15,
    },
    blankCard: {
      height: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    }
  })
);

const { allPharmacyDrug } = new PharmacyDrug();

const SupplyList: React.FC = () => {
  const [filteredItems, setFilteredItems] = useState<any>([]);

  const { t } = useTranslation();
  const { contentContainer, blankCard } = useStyle();

  const { isLoading, data, isFetched } = useQuery(
    AllPharmacyDrug.GET_ALL_PHARMACY_DRUG, () => allPharmacyDrug('test::17')
  );
  const contextValues = (): any => ({
    data,
  });

  const filteredItemsHandler = (e: any): void => {
    const _filteredItems = data.items.filter((item: any) => item.drug.name.includes(e) || item.drug.genericName.includes(e));
    setFilteredItems(_filteredItems);
  }

  const displayHandler = (): any => {
    let items;
    if (filteredItems.length > 0) {
      items = filteredItems.map((item: AllPharmacyDrugInterface) => {
        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            xl={3}
          >
            <CardContainer drug={item} />
          </Grid>
        );
      })
    }
    else {
      if (isFetched) {
        items = data.items.map((item: AllPharmacyDrugInterface) => {
        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            xl={3}
          >
            <CardContainer drug={item} />
          </Grid>
        );
      })
    }
  }
    return items;
  }

  return (
    <SupplyListContext.Provider value={contextValues}>
      <MaterialContainer>
        <h1 className="txt-md">
          {t('drug.SuppliedDrugsList')}
        </h1>
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <MaterialSearchBar onRequestSearch={filteredItemsHandler} />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          className={contentContainer}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            xl={3}
          >
            <Paper className={blankCard}>
              <FontAwesomeIcon icon={faPlus} size="2x" className="" />
              <span>{t('pharmacy.addToTransferList')}</span>
            </Paper>
          </Grid>
          {
            displayHandler()
          }
        </Grid>
      </MaterialContainer>
    </SupplyListContext.Provider>
  );
}

export default SupplyList;

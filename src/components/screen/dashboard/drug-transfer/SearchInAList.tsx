import React, { useContext, useState } from 'react';
import { DaroogSearchBar } from './DaroogSearchBar';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import PharmacyDrug from 'services/api/PharmacyDrug';
import { confirmSweetAlert, errorHandler, tSuccess } from 'utils';
import routes from 'routes';
import { useHistory } from 'react-router-dom';
import Modal from 'components/public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import { default as MatButton } from '@material-ui/core/Button';
import { useMutation } from 'react-query';
import ToolBox from './Toolbox';
import { useTranslation } from 'react-i18next'

const styles = makeStyles((theme) =>
  createStyles({
    icons: {
      marginTop: 0,
      color: theme.palette.gray.dark,
    },
    container: {
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
    },
    searchBar: {
      flex: 1,
      paddingLeft: 8,
      paddingRight: 8,
    },
  })
);

const SearchInAList: React.FC = () => {
  const { icons, container, searchBar } = styles();
  const { t } = useTranslation()
  const {
    orgAllPharmacyDrug,
    setAllPharmacyDrug,
    activeStep,
    orgUAllPharmacyDrug,
    setUAllPharmacyDrug,
    viewExhcnage,
    exchangeId,
    basketCount,
    uBasketCount,
    setBasketCount,
    setUbasketCount,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const [orgBasket, setOrgBasket] = React.useState<AllPharmacyDrugInterface[]>([]);
  const [orgUBasket, setOrgUBasket] = React.useState<AllPharmacyDrugInterface[]>([]);

  React.useEffect(() => {
    setOrgBasket(basketCount);
    setOrgUBasket(uBasketCount);
  }, []);

  const searchHandler = (v: string): void => {
    let order = 0;
    const basketList = activeStep === 1 ? orgBasket : orgUBasket;
    if (basketList && basketList.length > 0) {
      const filtered: AllPharmacyDrugInterface[] = basketList.filter((p) => {
        return (
          (p.drug.name && p.drug.name.includes(v)) ||
          (p.drug.companyName && p.drug.companyName?.includes(v)) ||
          (p.drug.genericName && p.drug.genericName?.includes(v))
        );
      });
      filtered.forEach((x) => {
        x.order += order;
      });
      switch (activeStep) {
        case 1:
          setBasketCount(filtered);
          break;
        case 2:
          setUbasketCount(filtered);
        default:
          break;
      }
    }

    const pharmacyDrugList = activeStep === 1 ? orgAllPharmacyDrug : orgUAllPharmacyDrug;
    if (pharmacyDrugList && pharmacyDrugList.length > 0) {
      const filtered: AllPharmacyDrugInterface[] = pharmacyDrugList.filter((p) => {
        return (
          (p.drug.name && p.drug.name.includes(v)) ||
          (p.drug.companyName && p.drug.companyName?.includes(v)) ||
          (p.drug.genericName && p.drug.genericName?.includes(v))
        );
      });

      switch (activeStep) {
        case 1:
          filtered.forEach((x) => {
            x.order += order + basketCount.length;
          });
          setAllPharmacyDrug(filtered);
          break;
        case 2:
          filtered.forEach((x) => {
            x.order += order + uBasketCount.length;
          });
          setUAllPharmacyDrug(filtered);
        default:
          break;
      }
    }
  };

  const { desktop } = routes;
  const history = useHistory();

  const { removeExchange } = new PharmacyDrug();

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(removeExchange, {
    onSuccess: async (res) => {
      if (res) {
        tSuccess(res.message);
        history.push(desktop);
      }
    },
  });

  const handleRemoveExchange = async (): Promise<any> => {
    try {
      await _removeExchange(exchangeId);
    } catch (e) {
      errorHandler(e);
    }
  };

  const exchangeRemove = async (): Promise<any> => {
    const confirmRemoveExchange = await confirmSweetAlert(t('alert.removeExchange'))
    if (confirmRemoveExchange) {
      await handleRemoveExchange()
      return
    }
  }

  return (
    <Grid container spacing={1} className={container}>
      <div className={searchBar}>
        <DaroogSearchBar onValueChange={(v: string): void => searchHandler(v)} />
      </div>
      <ToolBox />
      {/* <Grid item xs={9}>
       
      </Grid> */}
      {/* <Grid item xs={3}> */}

      {/* {viewExhcnage &&
          viewExhcnage.currentPharmacyIsA &&
          viewExhcnage.state == 1 && (
            <Tooltip title="حذف تبادل">
              <IconButton onClick={exchangeRemove}>
                <DeleteForeverIcon className={icons} />
              </IconButton>
            </Tooltip>
          )} */}
      {/* </Grid> */}
    </Grid>
  );
};

export default SearchInAList;

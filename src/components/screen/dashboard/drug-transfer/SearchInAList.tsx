import React, { useContext, useState } from 'react';
import { DaroogSearchBar } from './DaroogSearchBar';
import { AllPharmacyDrugInterface } from '../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from './Context';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import { useClasses } from '../classes';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PharmacyDrug from 'services/api/PharmacyDrug';
import { errorHandler, sweetAlert } from 'utils';
import routes from 'routes';
import { useHistory } from 'react-router-dom';
import Modal from 'components/public/modal/Modal';
import CloseIcon from '@material-ui/icons/Close';
import { default as MatButton } from '@material-ui/core/Button';
import { useMutation } from 'react-query';

const styles = makeStyles((theme) =>
  createStyles({
    icons: {
      marginTop: 0,
      color: theme.palette.gray.dark,
    },
  })
);

const SearchInAList: React.FC = () => {
  const { container } = useClasses();
  const { icons } = styles();
  const {
    orgAllPharmacyDrug,
    setAllPharmacyDrug,
    activeStep,
    orgUAllPharmacyDrug,
    setUAllPharmacyDrug,
    viewExhcnage,
    exchangeId,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const searchHandler = (v: string): void => {
    const pharmacyDrugList =
      activeStep === 1 ? orgAllPharmacyDrug : orgUAllPharmacyDrug;

    if (pharmacyDrugList && pharmacyDrugList.length > 0) {
      const filtered: AllPharmacyDrugInterface[] = pharmacyDrugList.filter(
        (p) => {
          return (
            (p.drug.name && p.drug.name.includes(v)) ||
            (p.drug.companyName && p.drug.companyName?.includes(v)) ||
            (p.drug.genericName && p.drug.genericName?.includes(v))
          );
        }
      );
      switch (activeStep) {
        case 1:
          setAllPharmacyDrug(filtered);
          break;
        case 2:
          setUAllPharmacyDrug(filtered);
        default:
          break;
      }
    }
  };

  const { desktop } = routes;
  const history = useHistory();

  const [isRemoveExchangeModal, setIsRemoveExchangeModal] = useState(false);
  const toggleIsRemoveExchangeModalForm = (): void => {
    setIsRemoveExchangeModal((v) => !v);
  };

  const { removeExchange } = new PharmacyDrug();

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(
    removeExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.message,
          });
          history.push(desktop);
        }
      },
    }
  );

  const handleRemoveExchange = async (): Promise<any> => {
    try {
      await _removeExchange(exchangeId);
    } catch (e) {
      errorHandler(e);
    }
    toggleIsRemoveExchangeModalForm();
  };

  const exchangeModalRemove = (): JSX.Element => {
    return (
      <Modal
        open={isRemoveExchangeModal}
        toggle={toggleIsRemoveExchangeModalForm}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="حذف تبادل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsRemoveExchangeModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>آیا از حذف تبادل اطمینان دارید؟</span>
              </div>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MatButton
                  onClick={async (): Promise<any> =>
                    await handleRemoveExchange()
                  }
                  variant="contained"
                  color="primary"
                  autoFocus
                >
                  بله
                </MatButton>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'left' }}>
                <MatButton
                  onClick={toggleIsRemoveExchangeModalForm}
                  variant="contained"
                  color="secondary"
                  autoFocus
                >
                  خیر
                </MatButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  return (
    <Grid container spacing={1} style={{backgroundColor: '#f7f7f7'}}>
      <Grid item xs={11}>
        <DaroogSearchBar
          onValueChange={(v: string): void => searchHandler(v)}
        />
      </Grid>
      <Grid item xs={1}>
        {viewExhcnage &&
          viewExhcnage.currentPharmacyIsA &&
          viewExhcnage.state == 1 && (
            <Tooltip title="حذف تبادل">
              <IconButton onClick={toggleIsRemoveExchangeModalForm}>
                <DeleteForeverIcon className={icons} />
              </IconButton>
            </Tooltip>
          )}
      </Grid>
      {isRemoveExchangeModal && exchangeModalRemove()}
    </Grid>
  );
};

export default SearchInAList;

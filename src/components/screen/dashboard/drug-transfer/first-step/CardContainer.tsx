import React, { useContext } from 'react';
import { createStyles, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from './CardHeader';
import { CardContainerRelatedPharmacyDrugsInterface } from '../../../../../interfaces';
import ItemContainer from './ItemContainer';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import Button from '../../../../public/button/Button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { EncrDecrService } from '../../../../../utils';
import { setTransferStart } from '../../../../../redux/actions';
import routes from '../../../../../routes';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#ECECEC',
      borderRadius: 10,
      padding: theme.spacing(2),
      position: 'relative',
      height: 350,
    },
    span: {
      color: '#707070',
      margin: theme.spacing(1, 0),
    },
    buttonContainer: {
      width: '100%',
      marginTop: theme.spacing(1),
      '& button': {
        width: '100%',
      },
    },
    itemContainer: {
      height: 187,
    },
  })
);

const { transfer } = routes;

const CardContainer: React.FC<CardContainerRelatedPharmacyDrugsInterface> = (
  props
) => {
  const {
    setSelectedPharmacyForTransfer,
    setActiveStep,
    activeStep,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { push } = useHistory();
  const dispatch = useDispatch();

  const encDecService = new EncrDecrService();

  const { data } = props;
  const {
    pharmacyCity,
    pharmacyProvince,
    itemsCount,
    betterItems,
    userType,
    star,
    warranty,
    notSendExchangeID,
  } = data;

  const { paper, span, buttonContainer, itemContainer } = useStyle();

  const { t } = useTranslation();

  const cardClickHandler = (id: number): void => {
    const encryptedId = encDecService.encrypt(id);
    push(`${transfer}?eid=${encodeURIComponent(encryptedId)}`);
  };

  const transferStart = (notSendExchangeID: number | null): void => {
    if (notSendExchangeID === null) {
      setSelectedPharmacyForTransfer(data.pharmacyKey);
      setActiveStep(activeStep + 1);
    } else {
      cardClickHandler(notSendExchangeID);
    }
  };

  const transferStartHandler = (): void => {
    transferStart(notSendExchangeID);
    dispatch(setTransferStart());
  };

  return (
    <Paper className={paper}>
      <Grid container spacing={1}>
        <CardHeader
          city={pharmacyCity}
          province={pharmacyProvince}
          guaranty={warranty}
          star={star}
          itemsCount={itemsCount}
          userType={userType}
        />
        <div className={`${span} w-100 txt-xs`}>نمونه اقلام</div>
        <div className={`${itemContainer} w-100`}>
          {betterItems.map((item: any) => (
            <ItemContainer
              drugGenericName={item.drugName}
              cnt={item.cnt}
              offer2={item.offer2}
              offer1={item.offer1}
              expireDate={item.expireDate}
            />
          ))}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={buttonContainer}>
          <Button
            type="button"
            variant="outlined"
            color={notSendExchangeID !== null ? 'pink' : 'blue'}
            onClick={transferStartHandler}
          >
            {notSendExchangeID !== null
              ? t('exchange.continue')
              : t('general.tabadol')}
          </Button>
        </div>
      </Grid>
    </Paper>
  );
};

export default CardContainer;

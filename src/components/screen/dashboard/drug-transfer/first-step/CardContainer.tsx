import React, { useContext } from 'react';
import { createStyles, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from './CardHeader';
import { CardContainerRelatedPharmacyDrugsInterface } from '../../../../../interfaces';
import ItemContainer from './ItemContainer';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import Button from '../../../../public/button/Button';
import { useTranslation } from 'react-i18next';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#ECECEC',
      borderRadius: 10,
      padding: theme.spacing(2),
      position: 'relative',
    },
    span: {
      color: '#707070',
      margin: theme.spacing(1, 0),
    },
    buttonContainer: {
      width: '100%',
      '& button': {
        width: '100%',
      },
    },
  })
);

const CardContainer: React.FC<CardContainerRelatedPharmacyDrugsInterface> = (
  props
) => {
  const {
    setSelectedPharmacyForTransfer,
    setActiveStep,
    activeStep,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

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

  const { paper, span, buttonContainer } = useStyle();

  const { t } = useTranslation();

  const transferStart = (): void => {
    setSelectedPharmacyForTransfer(data.pharmacyKey);
    setActiveStep(activeStep + 1);
  };

  return (
    <Paper className={`${paper}`}>
      <Grid container spacing={1}>
        <CardHeader
          city={pharmacyCity}
          province={pharmacyProvince}
          guaranty={warranty}
          star={star}
          itemsCount={itemsCount}
          userType={userType}
        />
        <span className={`${span} txt-xs`}>نمونه اقلام</span>
        {betterItems.map((item: any) => (
          <ItemContainer
            drugGenericName={item.drugName}
            cnt={item.cnt}
            offer2={item.offer2}
            offer1={item.offer1}
            expireDate={item.expireDate}
          />
        ))}
        <div className={buttonContainer}>
          <Button
            type="button"
            variant="outlined"
            color={notSendExchangeID !== null ? 'pink' : 'blue'}
            onClick={(): void => transferStart()}
          >
            {notSendExchangeID !== null
              ? t('transfer.continue')
              : t('general.tabadol')}
          </Button>
        </div>
      </Grid>
    </Paper>
  );
};

export default CardContainer;

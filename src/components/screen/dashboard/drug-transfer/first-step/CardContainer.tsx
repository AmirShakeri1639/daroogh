import React, { useContext } from 'react';
import {
  createStyles,
  Paper,
  Grid,
  Box,
  Divider,
  Button,
  Hidden,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CardHeader from './CardHeader';
import { CardContainerRelatedPharmacyDrugsInterface } from '../../../../../interfaces';
import ItemContainer from './ItemContainer';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTransferStart } from '../../../../../redux/actions';
import routes from '../../../../../routes';



const { transfer } = routes;

const CardContainer: React.FC<CardContainerRelatedPharmacyDrugsInterface> = (
  props
) => {
  const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
      borderRadius: 10,
      width: '100%',
      padding: theme.spacing(1),
      position: 'relative',
    },
    span: {
      color: '#707070',
      margin: theme.spacing(1, 0),
    },
    buttonContainer: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    itemContainer: {
      backgroundColor: '#fcfdfc',
    },
    box: {
      // padding: theme.spacing(1, 2),
      backgroundColor: '#fcfdfc',
      marginBottom: theme.spacing(1),
      width: '100%',
    },
    gridItem: {
      display: 'flex',
      alignItems: 'center',
    },
    detailContainer: {
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        color: '#9f9ea0',
      },
      '& span': {
        marginLeft: '5px',
      },
    },
    buttonContinueExchange: {
      color: '#fff',
      backgroundColor: '#54bc54 !important',
      width: '100%',
      fontSize: '12px',
    },
    buttonExchange: {
      color: '#fff',
      backgroundColor: '#269b26 !important',
      width: '100%',
      fontSize: '12px',
    },
    detailText:{
      color:'#f80501',
      fontSize:`${fullScreen?'10px':'13px'}`
    }
  })
);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    setSelectedPharmacyForTransfer,
    setActiveStep,
    activeStep,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { push } = useHistory();
  const dispatch = useDispatch();

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

  const {
    paper,
    itemContainer,
    box,
    detailContainer,
    buttonContinueExchange,
    buttonExchange,
    detailText
  } = useStyle();

  const { t } = useTranslation();

  const cardClickHandler = (id: string): void => {
    push(`${transfer}?eid=${id}`);
  };

  const transferStart = (notSendExchangeID: string | null): void => {
    console.log(notSendExchangeID);
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
      <Grid container spacing={0}>
        <CardHeader
          city={pharmacyCity}
          province={pharmacyProvince}
          guaranty={warranty}
          star={star}
          itemsCount={itemsCount}
          userType={userType}
        />
        <span className="txt-sm">نمونه اقلام عرضه شده در این داروخانه:</span>

        <Box component="div" className={box}>
          <Grid container spacing={0}>
            <Grid item xs={8} md={7} lg={7} className={detailContainer}>
              <span className={detailText}>نام دارو</span>
            </Grid>

            <Grid item xs={4} md={5} lg={5}>
              <Grid container spacing={1} alignItems="flex-end">
                <Hidden xsDown>
                  <Grid item xs={4} className={detailContainer}>
                    <span className={detailText}>هدیه</span>
                  </Grid>
                </Hidden>
                <Grid item xs={6} md={4} lg={4} className={detailContainer}>
                  <span className={detailText}>انقضا</span>
                </Grid>
                <Grid item xs={6} md={4} lg={4} className={detailContainer}>
                  <span className={detailText}> قیمت</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <div className={`${itemContainer} w-100`}>
            {React.Children.toArray(
              betterItems.map((item: any) => (
                <ItemContainer
                  drugGenericName={item.drugName}
                  cnt={item.cnt}
                  offer2={item.offer2}
                  offer1={item.offer1}
                  price={item.price}
                  expireDate={item.expireDate}
                />
              ))
            )}
          </div>
        </Box>
      </Grid>
      <Grid container xs={12}>
        <Grid item xs={9}></Grid>

        <Grid item xs={3}>
          <Button
            type="button"
            className={
              notSendExchangeID !== null
                ? buttonExchange
                : buttonContinueExchange
            }
            onClick={transferStartHandler}
          >
            {notSendExchangeID !== null
              ? t('exchange.continue')
              : t('general.tabadol')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CardContainer;

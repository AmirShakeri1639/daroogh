import React, { useContext, useState } from 'react';
import {
  createStyles,
  Paper,
  Grid,
  Box,
  Divider,
  Button,
  Hidden,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import AllPharmacyDrugsViwer from '../AllPharmacyDrugsViwer';
import { ColorEnum } from 'enum';

const { transfer } = routes;

const CardContainer: React.FC<CardContainerRelatedPharmacyDrugsInterface> = (props) => {
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
        fontSize:10
      },
      itemContainer: {
        backgroundColor: '#fcfdfc',
        minHeight: fullScreen? 0:255,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
        marginBottom: 8,
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

      buttonExchange: {
        border: '1px solid #ccc !important',
        width: '120px',
        fontSize: '10px',
        borderRadius: 2,
        margin:4
      },
      detailText: {
        color: '#f80501',
        fontSize: `${fullScreen ? '10px' : '13px'}`,
      },
      button: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginTop:8,
        // position:'absolute',
        // bottom: 8,
        // right: 8
      },
    })
  );

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    setSelectedPharmacyForTransfer,
    setActiveStep,
    activeStep,
    setBasketCount,
    setUbasketCount,
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
    pharmacyKey,
  } = data;

  const {
    paper,
    itemContainer,
    box,
    detailContainer,

    buttonExchange,
    detailText,
    button,
  } = useStyle();

  const { t } = useTranslation();

  const cardClickHandler = (id: string): void => {
    push(`${transfer}?eid=${id}`);
  };

  const transferStart = (notSendExchangeID: string | null): void => {
    if (notSendExchangeID === null) {
      setSelectedPharmacyForTransfer(data.pharmacyKey);
      setBasketCount([]);
      setUbasketCount([]);
      setActiveStep(activeStep + 1);
    } else {
      cardClickHandler(notSendExchangeID);
    }
  };

  const transferStartHandler = (): void => {
    transferStart(notSendExchangeID);
    dispatch(setTransferStart());
  };
  const [showExchangeTree, setShowExchangeTree] = useState(false);

  return (
    <>
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
        </Grid>

        <Grid item xs={12}>
          <span style={{ fontSize: 11, color: 'GrayText', marginBottom: 4 }}>
            نمونه اقلام عرضه شده در این داروخانه:
          </span>
        </Grid>
        <Grid item container xs={12} className={itemContainer}>
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
        </Grid>
        <Grid container item className={button} xs={12}>
         
            <Button type="button" className={buttonExchange} onClick={transferStartHandler}>
              {notSendExchangeID !== null ? t('exchange.continue') : t('general.tabadol')}
            </Button>
        
            <Button
              type="button" className={buttonExchange} 
              onClick={(): void => {
                setShowExchangeTree(true);
              }}
            >
              نمایش تمام اقلام
            </Button>
        </Grid>
      </Paper>
      <Dialog
        open={showExchangeTree}
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={() => setShowExchangeTree(false)}
      >
        <DialogTitle className="text-sm">{t('exchange.allPharmacyDrugs')}</DialogTitle>
        <DialogContent>
          <AllPharmacyDrugsViwer pharmacyId={data.pharmacyKey} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExchangeTree(false)} color="primary">
            بستن
          </Button>
          <Button type="button" onClick={transferStartHandler}>
            {notSendExchangeID !== null ? t('exchange.continue') : t('general.tabadol')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardContainer;

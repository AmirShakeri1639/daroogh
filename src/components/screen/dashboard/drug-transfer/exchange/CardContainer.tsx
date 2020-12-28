import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { ActionInterface, CardPropsInterface } from '../../../../../interfaces';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { useMutation } from 'react-query';
import { AddDrugInterface } from '../../../../../interfaces/ExchangeInterface';
import { errorHandler, sweetAlert } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import { AddDrog1, AddPack1 } from '../../../../../model/exchange';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { SnackbarProvider, useSnackbar } from 'notistack';

const style = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: 110,
      borderRadius: 14,
      display: 'inline-block',
      position: 'relative',
      margin: theme.spacing(1),
      boxShadow: '0 0 5px #cecece',
    },
    button: {
      height: 32,
      width: 80,
      fontSize: 10,
      fontWeight: 'bold',
    },
    counterButton: {
      height: 32,
      width: 20,
      fontSize: 11,
      fontWeight: 'bold',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    actionExpand: {
      display: 'flex',
      justifyContent: 'center',
      height: 35,
      '& > .MuiIconButton-root': {
        marginLeft: 0,
      },
      marginBottom: 7,
    },
    textBoxCounter: {
      fontSize: 12,
      border: '1px solid',
      height: 10,
      width: 20,
      textAlign: 'center',
    },
    action: {
      display: 'flex',
      height: 35,
      '& > .MuiIconButton-root': {
        marginLeft: 0,
      },
      marginBottom: 10,
      marginRight: 10,
      marginLeft: 10,
    },
    pack: {
      backgroundColor: '#00bcd430',
    },
    collapse: {
      // position: 'absolute',
      // height: 'auto'
    },
    orderCard: {
      backgroundColor: 'white',
    },
  })
);

const initialState: AddDrugInterface = {
  pharmacyDrugID: 0,
  count: 0,
  pharmacyKey: '',
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'pharmacyDrugID':
      return {
        ...state,
        pharmacyDrugID: value,
      };
    case 'count':
      return {
        ...state,
        count: value,
      };
    case 'pharmacyKey':
      return {
        ...state,
        pharmacyKey: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const CardContainer: React.FC<CardPropsInterface> = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [drugInfo, setDrugInfo] = useState<AllPharmacyDrugInterface>();
  const {
    addDrug1,
    addPack1,
    removePack1,
    addDrug2,
    addPack2,
    removePack2,
  } = new PharmacyDrug();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');

  const snackBarHandleClick = (): any => {
    setOpen(true);
  };

  const snackBarHandleClose = (event: any, reason: any): any => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Alert = (props: any): JSX.Element => {
    return (
      <MuiAlert
        style={{ zIndex: 99999 }}
        elevation={6}
        variant="filled"
        {...props}
      />
    );
  };

  const {
    allPharmacyDrug,
    setAllPharmacyDrug,
    uAllPharmacyDrug,
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    activeStep,
    recommendationMessage,
    setRecommendationMessage,
    exchangeId,
    setExchangeId,
    selectedPharmacyForTransfer,
    exchangeStateCode,
    viewExhcnage,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { isPack, collapsableContent, basicDetail, pharmacyDrug } = props;

  const [_addDrug1, { isLoading: isLoadingAddDrug1, data }] = useMutation(
    addDrug1,
    {
      onSuccess: async (res) => {
        setExchangeId(res.data.exchangeId);
        setRecommendationMessage(res.data.recommendationMessage);
        setMessage(t('alert.successAddDrug'));
        snackBarHandleClick();
        // await sweetAlert({
        //   type: 'success',
        //   text: t('alert.successAddDrug'),
        // });
      },
    }
  );

  const [_removeDrug1, { isLoading: isLoadingRemoveDrug1 }] = useMutation(
    addDrug1,
    {
      onSuccess: async () => {
        setMessage(t('alert.removeAddDrug'));
        snackBarHandleClick();
      },
    }
  );

  const [_addPack1, { isLoading: isLoadingAddPack1 }] = useMutation(addPack1, {
    onSuccess: async () => {
      setMessage(t('alert.successAddPack'));
      snackBarHandleClick();
      // await sweetAlert({
      //   type: 'success',
      //   text: t('alert.successAddPack'),
      // });
    },
  });

  const [_removePack1, { isLoading: isLoadingRemovePack1 }] = useMutation(
    removePack1,
    {
      onSuccess: async () => {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      },
    }
  );

  const [_addDrug2, { isLoading: isLoadingAddDrug2 }] = useMutation(addDrug2, {
    onSuccess: async () => {
      dispatch({ type: 'reset' });
      await sweetAlert({
        type: 'success',
        text: t('alert.successfulCreateTextMessage'),
      });
    },
  });

  const [_addPack2, { isLoading: isLoadingAddPack2 }] = useMutation(addPack2, {
    onSuccess: async () => {
      dispatch({ type: 'reset' });
      await sweetAlert({
        type: 'success',
        text: t('alert.successfulCreateTextMessage'),
      });
    },
  });

  const [_removePack2, { isLoading: isLoadingRemovePack2 }] = useMutation(
    removePack2,
    {
      onSuccess: async () => {
        dispatch({ type: 'reset' });
        await sweetAlert({
          type: 'success',
          text: t('alert.successfulCreateTextMessage'),
        });
      },
    }
  );

  useEffect(() => {
    setDrugInfo(pharmacyDrug);
  }, []);

  const {
    expand,
    expandOpen,
    root,
    action,
    actionExpand,
    pack,
    collapse,
    button,
    counterButton,
    textBoxCounter,
    orderCard,
  } = style();

  const counterHandle = (e: string): void => {
    switch (e) {
      case '+':
        if (pharmacyDrug.cnt > pharmacyDrug.currentCnt) {
          setDrugInfo({
            ...pharmacyDrug,
            currentCnt: pharmacyDrug.currentCnt += 1,
          });
        }
        break;
      case '-':
        if (pharmacyDrug.currentCnt > 1) {
          setDrugInfo({
            ...pharmacyDrug,
            currentCnt: pharmacyDrug.currentCnt -= 1,
          });
        }
        break;
      default:
        break;
    }
  };

  const lockState = async (): Promise<any> => {
    await sweetAlert({
      type: 'warning',
      text: 'در این مرحله امکان هیچگونه عملیاتی وجود ندارد',
    });
  };

  const addTransferHandle = async (): Promise<any> => {
    const inputmodel = new AddDrog1();
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.pharmacyKey = selectedPharmacyForTransfer;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug.id))
    ) {
      inputmodel.count = 0;
    }

    try {
      if (exchangeStateCode !== 2 && exchangeStateCode !== 4) {
        if (inputmodel.count > 0) {
          await _addDrug1(inputmodel);
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        } else {
          await _removeDrug1(inputmodel);
          if (
            (activeStep === 1 && basketCount.length === 1) ||
            (activeStep === 2 && uBasketCount.length === 1)
          ) {
            if (activeStep === 1) setBasketCount([]);
            else setUbasketCount([]);
          } else {
            if (activeStep === 1)
              setBasketCount([
                ...basketCount.filter((x) => x.id !== pharmacyDrug.id),
              ]);
            else
              setUbasketCount([
                ...uBasketCount.filter((x) => x.id !== pharmacyDrug.id),
              ]);
          }
        }
      } else {
        await lockState();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  const packHandle = async (): Promise<any> => {
    const inputmodel = new AddPack1();
    if (exchangeStateCode !== 2 && exchangeStateCode !== 4) {
      if (drugInfo !== undefined && drugInfo.packID !== undefined) {
        inputmodel.packID = drugInfo.packID;
        inputmodel.pharmacyKey = selectedPharmacyForTransfer;

        if (
          (activeStep === 1 &&
            !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
          (activeStep === 2 &&
            !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
        ) {
          drugInfo.packID = pharmacyDrug.packID;
          drugInfo.packName = pharmacyDrug.packName;
          try {
            await _addPack1(inputmodel);
            if (activeStep === 1) setBasketCount([...basketCount, drugInfo]);
            else setUbasketCount([...basketCount, drugInfo]);
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await _removePack1(inputmodel);
            // dispatch({ type: 'reset' });
            if (activeStep === 1)
              setBasketCount([
                ...basketCount.filter((x) => x.packID !== pharmacyDrug.packID),
              ]);
            else
              setUbasketCount([
                ...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID),
              ]);
          } catch (e) {
            errorHandler(e);
          }
        }
      }
    } else {
      await lockState();
    }
  };

  const CounterButton = (): JSX.Element => {
    return pharmacyDrug.buttonName === 'افزودن به تبادل' ? (
      <ButtonGroup variant="contained" color="primary">
        <Button
          size="small"
          className={counterButton}
          onClick={(): void => counterHandle('+')}
        >
          <AddIcon />
        </Button>
        <Button
          variant="outlined"
          size="small"
          style={{ paddingTop: 5, backgroundColor: 'white' }}
        >
          {pharmacyDrug.currentCnt}
        </Button>
        <Button
          size="small"
          className={counterButton}
          onClick={(): void => counterHandle('-')}
        >
          <RemoveIcon />
        </Button>
      </ButtonGroup>
    ) : (
      <>
        <b>{pharmacyDrug.currentCnt}</b> عدد انتخاب شده
      </>
    );
  };

  const handleExpandClick = (): any => {
    setExpanded(!expanded);
  };

  return (
    <Card
      className={`${root} ${isPack ? pack : ''}`}
      style={{ backgroundColor: pharmacyDrug.cardColor }}
    >
      <CardContent>{basicDetail}</CardContent>
      {!isPack && (
        <CardActions disableSpacing className={action}>
          {(!viewExhcnage ||
            !viewExhcnage.lockSuggestion ||
            exchangeStateCode === 1) && (
            <Grid container>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <CounterButton />
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'left' }}>
                <Button
                  variant="contained"
                  className={button}
                  size="small"
                  onClick={async (): Promise<any> => await addTransferHandle()}
                >
                  {pharmacyDrug.buttonName}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardActions>
      )}
      {isPack && (
        <>
          <CardActions disableSpacing className={actionExpand}>
            <IconButton
              className={clsx(expand, { [expandOpen]: expanded })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            className={collapse}
          >
            <div> {collapsableContent} </div>
            {(!viewExhcnage ||
              !viewExhcnage.lockSuggestion ||
              exchangeStateCode === 1) && (
              <Button
                variant="contained"
                size="small"
                className={button}
                style={{ marginBottom: 5 }}
                onClick={async (): Promise<any> => await packHandle()}
              >
                {pharmacyDrug.buttonName}
              </Button>
            )}
          </Collapse>
        </>
      )}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={snackBarHandleClose}
      >
        <Alert onClose={snackBarHandleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default CardContainer;

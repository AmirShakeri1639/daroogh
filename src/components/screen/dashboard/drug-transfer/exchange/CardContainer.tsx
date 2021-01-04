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
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {
  ActionInterface,
  CardPropsInterface,
  ViewExchangeInterface,
} from '../../../../../interfaces';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import { useMutation } from 'react-query';
import { AddDrugInterface } from '../../../../../interfaces';
import { errorHandler, sweetAlert } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import {
  AddDrog1,
  AddDrog2,
  AddPack1,
  AddPack2,
} from '../../../../../model/exchange';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';

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
      minWidth: 30,
      fontSize: 11,
      fontWeight: 'bold',
      backgroundColor: '#3f51b5',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#8787f5',
      },
    },
    counterButtonRight: {
      borderRadius: '5px 0 0 5px',
    },
    counterButtonLeft: {
      borderRadius: '0 5px 5px 0',
    },
    textCounter: {
      width: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      '& > .MuiOutlinedInput-inputMarginDense': {
        textAlign: 'center !important',
      },
      '& > .MuiOutlinedInput-root': {
        height: 32,
        borderRadius: 0,
        fontSize: 11,
      },
      '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
      },
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
  const [, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState<string>('');

  const [isLoading, setIsLoading] = React.useState(false);

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
    basketCount,
    setBasketCount,
    uBasketCount,
    setUbasketCount,
    activeStep,
    setRecommendationMessage,
    setExchangeId,
    selectedPharmacyForTransfer,
    exchangeStateCode,
    viewExhcnage,
    setViewExchange,
    exchangeId,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);

  const { isPack, collapsableContent, basicDetail, pharmacyDrug } = props;
  const { getViewExchange } = new PharmacyDrug();

  const [_addDrug1] = useMutation(addDrug1, {
    onSuccess: async (res) => {
      if (res) {
        setExchangeId(res.data.exchangeId);
        setRecommendationMessage(res.data.recommendationMessage);
        setMessage(t('alert.successAddDrug'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removeDrug1] = useMutation(addDrug1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddDrug'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack1] = useMutation(addPack1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();

        if (!viewExhcnage) {
          const viewExResult = await getViewExchange(res.data.exchangeId);
          const result: ViewExchangeInterface | undefined = viewExResult.data;
          if (result) setViewExchange(result);
        }
      }
    },
  });

  const [_removePack1] = useMutation(removePack1, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removeDrug2] = useMutation(addDrug2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_addPack2] = useMutation(addPack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.successAddPack'));
        snackBarHandleClick();
      }
    },
  });

  const [_removePack2] = useMutation(removePack2, {
    onSuccess: async (res) => {
      if (res) {
        setMessage(t('alert.removeAddPack'));
        snackBarHandleClick();
      }
    },
  });

  // useEffect(() => {
  //   setDrugInfo(pharmacyDrug);
  // }, []);

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
    counterButtonRight,
    counterButtonLeft,
    textCounter,
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

  // const lockState = async (): Promise<any> => {
  //   await sweetAlert({
  //     type: 'warning',
  //     text: 'در این مرحله امکان هیچگونه عملیاتی وجود ندارد',
  //   });
  // };

  const addDrugHandle = async (): Promise<any> => {
    const inputmodel = new AddDrog1();
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.pharmacyKey = selectedPharmacyForTransfer;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt || pharmacyDrug.currentCnt === 0)
    ) {
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده معتبر نمی باشد',
      });
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug1(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
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
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const addDrug2Handle = async (): Promise<any> => {
    const inputmodel = new AddDrog2();
    inputmodel.pharmacyDrugID = pharmacyDrug.id;
    inputmodel.exchangeID = exchangeId;
    inputmodel.count = pharmacyDrug.currentCnt;

    if (
      pharmacyDrug.buttonName === 'افزودن به تبادل' &&
      (!pharmacyDrug.currentCnt || pharmacyDrug.currentCnt === 0)
    ) {
      await sweetAlert({
        type: 'error',
        text: 'مقدار وارد شده معتبر نمی باشد',
      });
      return;
    }

    if (
      (activeStep === 1 && basketCount.find((x) => x.id == pharmacyDrug.id)) ||
      (activeStep === 2 && uBasketCount.find((x) => x.id == pharmacyDrug.id))
    ) {
      inputmodel.count = 0;
    }

    setIsLoading(true);
    try {
      if (inputmodel.count > 0) {
        const res = await _addDrug2(inputmodel);
        if (res) {
          pharmacyDrug.currentCnt = inputmodel.count;
          if (activeStep === 1) setBasketCount([...basketCount, pharmacyDrug]);
          else setUbasketCount([...uBasketCount, pharmacyDrug]);
        }
      } else {
        await _removeDrug2(inputmodel);
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
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      errorHandler(e);
    }
  };

  const packHandle = async (): Promise<any> => {
    const inputmodel = new AddPack1();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.pharmacyKey = selectedPharmacyForTransfer;

      setIsLoading(true);
      if (
        (activeStep === 1 &&
          !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 &&
          !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack1(inputmodel);
          if (res) {
            if (activeStep === 1)
              setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
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
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const pack2Handle = async (): Promise<any> => {
    const inputmodel = new AddPack2();
    if (pharmacyDrug !== undefined && pharmacyDrug.packID !== undefined) {
      inputmodel.packID = pharmacyDrug.packID;
      inputmodel.exchangeID = exchangeId;

      setIsLoading(true);
      if (
        (activeStep === 1 &&
          !basketCount.find((x) => x.packID == pharmacyDrug.packID)) ||
        (activeStep === 2 &&
          !uBasketCount.find((x) => x.packID == pharmacyDrug.packID))
      ) {
        try {
          const res = await _addPack2(inputmodel);
          if (res) {
            if (activeStep === 1)
              setBasketCount([...basketCount, pharmacyDrug]);
            else setUbasketCount([...uBasketCount, pharmacyDrug]);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      } else {
        try {
          await _removePack2(inputmodel);
          // dispatch({ type: 'reset' });
          if (activeStep === 1)
            setBasketCount([
              ...basketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          else
            setUbasketCount([
              ...uBasketCount.filter((x) => x.packID !== pharmacyDrug.packID),
            ]);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          errorHandler(e);
        }
      }
    }
  };

  const CounterButton = (): JSX.Element => {
    return pharmacyDrug.buttonName === 'افزودن به تبادل' ? (
      <>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonRight}`}
          onClick={(): void => counterHandle('+')}
        >
          <AddIcon />
        </Button>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          className={textCounter}
          defaultValue={pharmacyDrug.currentCnt}
          onChange={(e): void => {
            const val = +e.target.value;
            pharmacyDrug.currentCnt = +e.target.value;
          }}
        >
          {pharmacyDrug.currentCnt}
        </TextField>
        <Button
          size="small"
          variant="outlined"
          className={`${counterButton} ${counterButtonLeft}`}
          onClick={(): void => counterHandle('-')}
        >
          <RemoveIcon />
        </Button>
      </>
    ) : (
      <>
        <b>{pharmacyDrug.currentCnt}</b> عدد انتخاب شده
      </>
    );
  };

  const handleExpandClick = (): any => {
    setExpanded(!expanded);
  };

  const AddRemoveAction = (): JSX.Element => {
    let element = <></>;
    if (
      !viewExhcnage ||
      (!(viewExhcnage.state === 2 || viewExhcnage.state === 7) &&
        viewExhcnage.lockSuggestion === false)
    ) {
      element = (
        <Grid container>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            {!isPack && <CounterButton />}
          </Grid>
          <Grid
            item
            xs={!isPack ? 6 : 12}
            style={{
              textAlign: !isPack ? 'left' : 'center',
              marginBottom: !isPack ? 0 : 10,
              marginTop: !isPack ? 0 : 5,
            }}
          >
            <Button
              variant="contained"
              className={button}
              size="small"
              onClick={async (): Promise<any> => {
                if (!isPack) {
                  if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
                    await addDrug2Handle();
                  } else {
                    await addDrugHandle();
                  }
                } else {
                  if (viewExhcnage && !viewExhcnage.currentPharmacyIsA) {
                    await pack2Handle();
                  } else {
                    await packHandle();
                  }
                }
              }}
            >
              {pharmacyDrug.buttonName}
            </Button>
          </Grid>
        </Grid>
      );
    }

    return element;
  };

  return (
    <>
      <CircleBackdropLoading isOpen={isLoading} />
      <Card
        className={`${root} ${isPack ? pack : ''}`}
        style={{ backgroundColor: pharmacyDrug.cardColor }}
      >
        <CardContent>{basicDetail}</CardContent>
        {!isPack && (
          <CardActions disableSpacing className={action}>
            <AddRemoveAction />
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
              <AddRemoveAction />
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
    </>
  );
};

export default CardContainer;

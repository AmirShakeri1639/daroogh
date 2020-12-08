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

const style = makeStyles(theme =>
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
      marginBottom: 7,
    },
    pack: {
      backgroundColor: '#00bcd430',
    },
    collapse: {
      // position: 'absolute',
      // height: 'auto'
    },
  }),
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

const CardContainer: React.FC<CardPropsInterface> = props => {
  const [expanded, setExpanded] = React.useState(false);
  const [drugInfo, setDrugInfo] = useState<any>({});
  const { addDrug1 } = new PharmacyDrug();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();

  const { basketCount, setBasketCount } = useContext<TransferDrugContextInterface>(
    DrugTransferContext,
  );

  const { isPack, collapsableContent, basicDetail, pharmacyDrug } = props;

  const [_addDrug1, { isLoading: isLoadingNewCategory }] = useMutation(addDrug1, {
    onSuccess: async () => {
      dispatch({ type: 'reset' });
      await sweetAlert({
        type: 'success',
        text: t('alert.successfulCreateTextMessage'),
      });
    },
  });

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
  } = style();

  const counterHandle = (e: string): void => {
    switch (e) {
      case '+':
        // setBasketCount(
        //   basketCount.indexOf(pharmacyDrug?.id) !== -1
        //     ? [...basketCount]
        //     : [...basketCount, pharmacyDrug?.id],
        // );
        if (drugInfo.currentCnt < drugInfo.cnt) {
          // Object.assign(drugInfo, { currentCnt: drugInfo?.currentCnt + 1 });
          drugInfo.currentCnt += 1;
          setDrugInfo(drugInfo);
        }
        break;
      case '-':
        // if (drugInfo?.currentCnt === drugInfo?.cnt) {
        //   basketCount.splice(basketCount.indexOf(drugInfo?.id), 1);
        //   setBasketCount([...basketCount]);
        // } else if (drugInfo.currentCnt > drugInfo.cnt) {
        //   Object.assign(drugInfo, { currentCnt: drugInfo?.currentCnt - 1 });
        // }
        if (drugInfo.currentCnt > 0) {
          // Object.assign(drugInfo, { currentCnt: drugInfo?.currentCnt - 1 });
          drugInfo.currentCnt -= 1;
          setDrugInfo(drugInfo);
        }
        break;
      default:
        break;
    }
  };

  const getInputModel = (): AddDrugInterface => {
    return {
      pharmacyDrugID: drugInfo.id,
      count: drugInfo.currentCnt,
      pharmacyKey: 'test::17',
    };
  };

  const addTransferHandle = async (): Promise<any> => {
    debugger;
    // dispatch({ type: 'pharmacyDrugID', value: drugInfo.id });
    // dispatch({ type: 'count', value: drugInfo.currentCnt });
    // dispatch({ type: 'pharmacyKey', value: 'test::17' });
    // const { pharmacyDrugID, count, pharmacyKey } = state;

    try {
      await _addDrug1(getInputModel());
      dispatch({ type: 'reset' });
    } catch (e) {
      errorHandler(e);
    }
  };

  const CounterButton = (): JSX.Element => {
    return (
      <ButtonGroup variant="contained" color="primary">
        <Button size="small" className={counterButton} onClick={(): void => counterHandle('+')}>
          <AddIcon />
        </Button>
        <Button variant="outlined" size="small" style={{ paddingTop: 5 }}>
          {drugInfo.currentCnt}
        </Button>
        <Button size="small" className={counterButton} onClick={(): void => counterHandle('-')}>
          <RemoveIcon />
        </Button>
      </ButtonGroup>
    );
  };

  const handleExpandClick = (): any => {
    setExpanded(!expanded);
  };

  return (
    <Card className={`${root} ${isPack ? pack : ''}`}>
      <CardContent>{basicDetail}</CardContent>
      {!isPack && (
        <CardActions disableSpacing className={action}>
          <Grid container spacing={1}>
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
                افزودن به تبادل
              </Button>
            </Grid>
          </Grid>
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
          <Collapse in={expanded} timeout="auto" unmountOnExit className={collapse}>
            <div style={{ margin: 10 }}> {collapsableContent} </div>
            <Button variant="contained" size="small" className={button} style={{ marginBottom: 5 }}>
              افزودن به تبادل
            </Button>
          </Collapse>
        </>
      )}
    </Card>
  );
};

export default CardContainer;
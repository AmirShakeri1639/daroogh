import React from 'react';
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
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { CardPropsInterface } from '../../../../../interfaces';

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
      width: 100,
      fontSize: 12,
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
  }),
);

const CounterButton = (): JSX.Element => {
  return (
    <ButtonGroup variant="contained" color="primary">
      <Button size="small">
        <AddIcon />
      </Button>
      <Button variant="outlined" size="small" style={{ paddingTop: 5 }}>
        100
      </Button>
      <Button size="small">
        <RemoveIcon />
      </Button>
    </ButtonGroup>
  );
};

const CardContainer: React.FC<CardPropsInterface> = props => {
  const [expanded, setExpanded] = React.useState(false);

  const { isPack, collapsableContent, basicDetail } = props;

  const {
    expand,
    expandOpen,
    root,
    action,
    actionExpand,
    pack,
    collapse,
    button,
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
    const { pharmacyDrugID, count, pharmacyKey } = state;

    if (basketCount.indexOf(drugInfo.id) === -1) {
      setBasketCount([...basketCount, drugInfo.id]);
    } else {
      setBasketCount([...basketCount.splice(basketCount.indexOf(drugInfo.id), 1)]);
      setDrugInfo({ ...drugInfo, currentCnt: drugInfo.cnt });
    }

    // try {
    //   await _addDrug1(getInputModel());
    //   dispatch({ type: 'reset' });
    // } catch (e) {
    //   errorHandler(e);
    // }
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
                {basketCount.indexOf(drugInfo.id) == -1 ? 'افزودن به تبادل' : 'حذف از تبادل'}
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
            <div> {collapsableContent} </div>
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

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
  Icon,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { CardPropsInterface } from '../../../interfaces';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';

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

const CounterButton = (): JSX.Element => {
  return (
    <ButtonGroup variant="contained" color="primary">
      <Button size="small">
        <AddIcon />
      </Button>
      <Button variant="outlined" size="small">
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
    textBoxCounter,
  } = style();

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
              <Button variant="contained" className={button} size="small">
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
            <Button
              variant="contained"
              size="small"
              className={button}
              style={{ marginBottom: 5 }}
            >
              افزودن به تبادل
            </Button>
          </Collapse>
        </>
      )}
    </Card>
  );
};

export default CardContainer;

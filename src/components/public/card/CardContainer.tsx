import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CardPropsInterface } from '../../../interfaces';

const style = makeStyles(theme =>
  createStyles({
    root: {
      width: '33.33%',
      minHeight: 110,
      borderRadius: 14,
      display: 'inline-block',
      position: 'relative',
      margin: theme.spacing(1),
      boxShadow: '0 0 5px #cecece',
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
    action: {
      display: 'flex',
      justifyContent: 'center',
      height: 35,
      '& > .MuiIconButton-root': {
        marginLeft: 0,
      },
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

const CardContainer: React.FC<CardPropsInterface> = props => {
  const [expanded, setExpanded] = React.useState(false);

  const { isPack, collapsableContent, basicDetail } = props;

  const { expand, expandOpen, root, action, pack, collapse } = style();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={`${root} ${isPack ? pack : ''}`}>
      <CardContent>{basicDetail}</CardContent>
      {isPack && (
        <>
          <CardActions disableSpacing className={action}>
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
          </Collapse>
        </>
      )}
    </Card>
  );
};

export default CardContainer;

import React from 'react';
import { ItemContainerPropsInterface } from '../../../../../interfaces';
import { Box, createStyles, Grid } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles } from '@material-ui/core/styles';
import Convertor from '../../../../../utils/Convertor';

const useStyle = makeStyles((theme) =>
  createStyles({
    box: {
      padding: theme.spacing(1, 2),
      backgroundColor: '#fff',
      marginBottom: theme.spacing(1),
      borderRadius: 10,
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
  })
);

const { convertISOTime, zeroSeparator } = Convertor;

const ItemContainer: React.FC<ItemContainerPropsInterface> = (props) => {
  const { offer1, offer2, drugGenericName } = props;

  const { box, gridItem, detailContainer } = useStyle();

  return (
    <Box component="div" className={box}>
      <Grid container spacing={1}>
        <Grid item xs={6} className={gridItem}>
          <span className="txt-xs text-nowrap">{drugGenericName}</span>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={1} direction="column" alignItems="flex-end">
            {/*<div className={detailContainer}>*/}
            {/*  <EventNoteIcon fontSize="small" />*/}
            {/*  <span className="txt-xs">{convertISOTime(expireDate)}</span>*/}
            {/*</div>*/}
            <div className={detailContainer}>
              <SwapHorizIcon fontSize="small" />
              <span className="txt-xs">{`${offer1} به ${offer2}`}</span>
            </div>
            {/*<div className={detailContainer}>*/}
            {/*  <PaymentIcon fontSize="small" />*/}
            {/*  <span className="txt-xs" dir="ltr">{`${zeroSeparator(amount)}`}</span>*/}
            {/*</div>*/}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemContainer;

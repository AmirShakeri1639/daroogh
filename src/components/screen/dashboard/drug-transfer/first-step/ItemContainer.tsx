import React from 'react';
import { ItemContainerPropsInterface } from '../../../../../interfaces';
import { Box, createStyles, Divider, Grid, Hidden } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles } from '@material-ui/core/styles';
import Convertor from '../../../../../utils/Convertor';


const useStyle = makeStyles((theme) =>
  createStyles({
    box: {
      backgroundColor: '#fcfdfc',
      width: '100%',
      padding: '4px 0px',
      margin: '2px 0px'
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

const { convertISOTime,thousandsSeperator } = Convertor;

const ItemContainer: React.FC<ItemContainerPropsInterface> = (props) => {
  const { offer1, offer2, drugGenericName ,price,expireDate } = props;

  const { box, gridItem, detailContainer } = useStyle();

  return (
    <Box component="div" className={box}>
      <Grid container spacing={0}>
        <Grid item xs={8}  md={7} lg={7}  className={detailContainer}>
          <span className="txt-xs text-nowrap text-muted">{drugGenericName}</span>
        </Grid>

        <Grid item xs={4} md={5} lg={5} >
          <Grid container spacing={1} alignItems="flex-end">

            <Hidden xsDown>
              <Grid item xs={4} className={detailContainer}>
                <span className="txt-xs text-nowrap text-muted text-center">{`${offer1} به ${offer2}`}</span>
              </Grid>
            </Hidden>

            <Grid item xs={6} md={4} lg={4} className={detailContainer}>
              <span className="txt-xs text-nowrap text-muted">{convertISOTime(expireDate) }</span>
            </Grid>
            <Grid item xs={6} md={4} lg={4} className={detailContainer}>
              <span className="txt-xs text-nowrap text-muted">{thousandsSeperator(price) }</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemContainer;

import React from 'react';
import { ItemContainerPropsInterface } from '../../../../../interfaces';
import { Box, createStyles, Divider, Grid, Hidden, useMediaQuery } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Convertor from '../../../../../utils/Convertor';
import { ColorEnum } from 'enum';



const { convertISOTime,thousandsSeperator } = Convertor;

const ItemContainer: React.FC<ItemContainerPropsInterface> = (props) => {

  const useStyle = makeStyles((theme) =>
  createStyles({
    box: {
      backgroundColor: '#fcfdfc',
      width: '100%',
      padding: '4px 0px',
      margin: '2px 0px'
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
    detailText:{
      color:ColorEnum.DeepBlue,
      fontSize:`${fullScreen?'10px':'13px'}`
    }
  })
);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { offer1, offer2, drugGenericName ,price,expireDate } = props;

  const { box,detailText, detailContainer } = useStyle();

  return (
    <Box component="div" className={box}>
      <Grid container spacing={0}>
        <Grid item xs={8}  md={7} lg={7}  className={detailContainer}>
          <span className={detailText}>{drugGenericName}</span>
        </Grid>

        <Grid item xs={4} md={5} lg={5} >
          <Grid container spacing={1} alignItems="flex-end">

            <Hidden xsDown>
              <Grid item xs={4} className={detailContainer}>
                <span className={detailText}>{`${offer1} به ${offer2}`}</span>
              </Grid>
            </Hidden>

            <Grid item xs={6} md={4} lg={4} className={detailContainer}>
              <span className={detailText}>{convertISOTime(expireDate) }</span>
            </Grid>
            <Grid item xs={6} md={4} lg={4} className={detailContainer}>
              <span className={detailText}>{thousandsSeperator(price) }</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemContainer;

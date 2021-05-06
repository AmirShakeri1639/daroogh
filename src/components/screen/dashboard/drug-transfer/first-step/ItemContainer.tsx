import React from 'react';
import { ItemContainerPropsInterface } from '../../../../../interfaces';
import { Box, createStyles, Divider, Grid, Hidden, useMediaQuery,Theme } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Convertor from '../../../../../utils/Convertor';
import { ColorEnum } from 'enum';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { useTranslation } from 'react-i18next';
import Utils from 'components/public/utility/Utils';
import ShowOffer from 'components/public/offer-show/ShowOffer';



const { convertISOTime,thousandsSeperator } = Convertor;

const ItemContainer: React.FC<ItemContainerPropsInterface> = (props) => {

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('xs'));
  const useStyle = makeStyles((theme) =>
  createStyles({
    box: {
      backgroundColor: ColorEnum.LiteBack,
      paddingLeft: 16,
      borderLeft:`2px solid ${ColorEnum.Borders}` ,
      margin:4,
    },
    titleContainer: {
     
    },
    detailText:{
      color:'black',
      fontSize:`${isSmallDevice?'10px':'12px'}`,
      fontWeight:'bold'

    }
  })
);
  const {t} = useTranslation();


  const { offer1, offer2, drugGenericName ,price,expireDate,cnt } = props;

  const { box,detailText, titleContainer } = useStyle();


  return (
    <Grid container className={ box }>
      <Grid item xs={ 12 } className={ titleContainer }>
        <span className={ detailText }>{ drugGenericName }</span>
      </Grid>
      <Grid xs={ 12 } item container>
        <Grid item xs={ 6 } sm={ 3 }>
          <ShowOffer isSmall={ true } offer1={ offer1 } offer2={ offer2 } />
        </Grid>
        <Grid item xs={ 6 } sm={ 3 }>
          <TextWithTitle 
            isSmal={ true } 
            title='انقضا' 
            body={ convertISOTime(expireDate) } 
            dateSuffix={ Utils.getExpireDays(expireDate) } 
            showDateSuffix={ !isSmallDevice } 
          />
        </Grid>
        <Grid item xs={ 6 } sm={ 3 }>
          <TextWithTitle 
            isSmal={ true } 
            title={ t('general.price') } 
            body={ thousandsSeperator(price) } 
            suffix={ t('general.defaultCurrency') } 
          />
        </Grid>

        <Grid item xs={ 6 } sm={ 3 }>
          <TextWithTitle
            isSmal={ true } 
            title={ t('general.number') } 
            body={ thousandsSeperator(cnt) } 
          />
        </Grid>
      </Grid>
      <Grid item xs={ 12 }>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default React.memo(ItemContainer);

import React from 'react';
import { ItemContainerPropsInterface } from '../../../../../interfaces';
import { Box, createStyles, Divider, Grid, Hidden, useMediaQuery } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Convertor from '../../../../../utils/Convertor';
import { ColorEnum } from 'enum';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { useTranslation } from 'react-i18next';



const { convertISOTime,thousandsSeperator } = Convertor;

const ItemContainer: React.FC<ItemContainerPropsInterface> = (props) => {

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
      color:ColorEnum.DeepBlue,
      fontSize:`${fullScreen?'10px':'13px'}`
    }
  })
);
  const {t} = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { offer1, offer2, drugGenericName ,price,expireDate } = props;

  const { box,detailText, titleContainer } = useStyle();

  return (
    <Grid container className={box}>
        <Grid item xs={12} className={titleContainer}>
        <span className={detailText}>{drugGenericName}</span>
        </Grid>
        <Grid xs={12} item container>
          <Grid xs={4}>
              <TextWithTitle isSmal={true} title={t('general.gift')} body={`${offer1} به ${offer2}`} />
          </Grid>
          <Grid xs={4}>
          <TextWithTitle isSmal={true} title='انقضا' body={convertISOTime(expireDate) } />

            </Grid>
            <Grid xs={4}>
            <TextWithTitle isSmal={true} title={t('general.price')} body={thousandsSeperator(price) } suffix={t('general.defaultCurrency')}/>

            </Grid>
        </Grid>
        <Grid xs={12}>
                  <Divider/>

        </Grid>
    </Grid>
  );
};

export default ItemContainer;

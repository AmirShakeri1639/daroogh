import React, { useContext, useState } from 'react';
import {
  Grid, Card, CardContent, Divider, Tabs, Tab
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'react-i18next';
import { ViewExchangeInterface, CardInfo } from '../../../../../interfaces';
import { useClasses } from '../../classes';
import { DaroogTabPanel, TextLine } from '../../../../public';
import { isNullOrEmpty } from '../../../../../utils';
import { ColorEnum } from '../../../../../enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarTimes } from '@fortawesome/free-regular-svg-icons';
import moment from 'jalali-moment';
import {
  getExpireDateTitle, getExpireDate, ViewExchangeInitialState
} from '../../../../../utils/ExchangeTools';

interface Props {
  exchange: ViewExchangeInterface | undefined;
}

const ExCalculator: React.FC<Props> = (props) => {
  const exchange: ViewExchangeInterface =
    props.exchange == undefined ? ViewExchangeInitialState : props.exchange;

  const { t } = useTranslation();
  const {
    root, padding2, ltr, rtl, spacingVertical1, faIcons
  } = useClasses();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [tabTitle1, setTabTitle1] = useState('');
  const [tabTitle2, setTabTitle2] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const expireDateText: string = t(getExpireDateTitle(exchange.state));

  console.log('exchange: ', exchange)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setCurrentTabIndex(newValue);
  }

  if (exchange?.currentPharmacyIsA) {
    setTabTitle1(t('exchange.you'));
    setTabTitle2(t('exchange.otherSide'));
  } else {
    setTabTitle1(t('exchange.you'));
    setTabTitle2(t('exchange.otherSide'));
  }
  setExpireDate(getExpireDate(exchange));


  const getOneSideData = (isA: boolean): JSX.Element => {
    return (
      <>
        { !isNullOrEmpty(exchange?.sendDate) && (
          <Grid item xs={ 12 } className={ spacingVertical1 }>
            <TextLine
              backColor={ ColorEnum.White }
              rightText={
                <>
                  <FontAwesomeIcon
                    icon={ faCalendarPlus }
                    size="lg"
                    className={ faIcons }
                  />
                  {t('exchange.sendDate') }
                </>
              }
              leftText={
                exchange?.sendDate == null
                  ? ''
                  : moment(exchange?.sendDate, 'YYYY/MM/DD')
                    .locale('fa')
                    .format('YYYY/MM/DD')
              }
            />
          </Grid>
        ) }
      </>
    )
  }

  return (
    <Card className={ `${root} ${padding2}` }>
      <h3>{ t('exchange.exCalculator') } { t('exchange.exchange') }</h3>
      <Divider />
      <CardContent>
        <>
          <Grid container>
            <Grid item xs={ 12 }>
              <Tabs
                value={ currentTabIndex }
                indicatorColor="primary"
                textColor="primary"
                onChange={ handleChange }
                centered
              >
                <Tab label={ tabTitle1 } />
                <Tab label={ tabTitle2 } />
              </Tabs>
              <SwipeableViews
                enableMouseEvents
                axis={ 'x' }
                index={ currentTabIndex }
                onChangeIndex={ (index: number): void => setCurrentTabIndex(index) }
              >
                <DaroogTabPanel value={ currentTabIndex } index={ 0 }>
                  <span>
                    Your data: <br />
                    { getOneSideData(true) }
                  </span>
                </DaroogTabPanel>
                <DaroogTabPanel value={ currentTabIndex } index={ 1 }>
                  <span>
                    Other side's data: <br />
                    { getOneSideData(false) }
                  </span>
                </DaroogTabPanel>
              </SwipeableViews>
            </Grid>
            <Grid item xs={ 12 }>
              Warnings
          </Grid>
          </Grid>
          <Grid container>
            <>
              { !isNullOrEmpty(expireDate) && (
                <Grid item xs={ 12 } className={ spacingVertical1 }>
                  <FontAwesomeIcon
                    icon={ faCalendarTimes }
                    size="lg"
                    className={ faIcons }
                  />
                  { expireDateText }: { expireDate }
                </Grid>
              ) }
            </>
          </Grid>
        </>
      </CardContent>
    </Card>
  )
}

export default ExCalculator;

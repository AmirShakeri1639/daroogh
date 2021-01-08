import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
} from '@material-ui/core';
import React from 'react';
import { ExCardContentProps } from '../../../../../interfaces';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import MoneyIcon from '@material-ui/icons/Money';
import moment from 'jalali-moment';
import { AllPharmacyDrugInterface } from '../../../../../interfaces/AllPharmacyDrugInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBoxes,
  faCalendarTimes,
  faExchangeAlt,
  faMoneyBillWave,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { TextLine } from '../../../../public';
import { useTranslation } from 'react-i18next';
import Utils from '../../../../public/utility/Utils';
import Ribbon from '../../../../public/ribbon/Ribbon';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(1),
      padding: '0 !important',
    },
    paper: {
      textAlign: 'center',
      backgroundColor: 'aliceblue',
    },
    container: {
      padding: 5,
      minHeight: 170,
      alignItems: 'center',
      // fontSize: 11,
    },
    cardcontent: {
      borderRadius: 15,
      backgroundColor: '#E4E4E4',
      width: '100%',
      padding: 0,
    },
    rowRight: {
      display: 'flex',
      alignItems: 'center',
    },
    rowLeft: {
      display: 'table',
      textAlign: 'right',
    },
    colLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    colLeftIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    ulCardName: {
      padding: 0,
      textAlign: 'left',
      listStyleType: 'none',
    },
    ribbon: {
      width: '150px',
      height: '150px',
      overflow: 'hidden',
      position: 'absolute',
      '&::before &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '',
        display: 'block',
        border: '5px solid #2980b9',
      },
      '& span': {
        position: 'absolute',
        display: 'block',
        width: '225px',
        padding: '15px 0',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px rgba(0,0,0,.1)',
        color: 'silver',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
      },
    },
    ribbonTopLeft: {
      top: '-10px',
      right: '-10px',
      '&::before &::after': {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
      },
      '&::before': {
        top: 0,
        left: 0,
      },
      '&::after': {
        bottom: 0,
        right: 0,
      },
      '& span': {
        left: -15,
        top: 25,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 8,
      },
    },
  })
);

function ExCardContent(props: ExCardContentProps): JSX.Element {
  const { pharmacyDrug, formType, packInfo } = props;
  const {
    root,
    paper,
    container,
    cardcontent,
    ulCardName,
    colLeftIcon,
    ribbon,
    ribbonTopLeft,
  } = useClasses();

  const { t } = useTranslation();

  const PackContent = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        {pharmacyDrug?.cardColor === '#009900' && <Ribbon />}
        <Grid item xs={12}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={1} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faBars} size="sm" />
            </Grid>
            <Grid item xs={11}>
              <TextLine
                rightText={'نام دسته'}
                leftText={pharmacyDrug?.packName}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={1} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
            </Grid>
            <Grid item xs={11}>
              <TextLine
                rightText={t('general.price')}
                leftText={Utils.numberWithCommas(pharmacyDrug?.totalAmount)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const PackDetailContent = (): JSX.Element[] | any => {
    if (packInfo && packInfo.length > 0) {
      return packInfo.map((item: AllPharmacyDrugInterface) => {
        return (
          <div className={root}>
            <Paper className={paper}>
              <Grid container item spacing={0} style={{ padding: 2 }}>
                <Grid
                  item
                  xs={8}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <FontAwesomeIcon icon={faPills} size="1x" />
                  <span style={{ marginRight: 5 }}>{item.drug.name}</span>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'left' }}>
                  <ul className={ulCardName}>
                    <li className={colLeftIcon}>
                      <EventBusyIcon />
                      {moment(item.expireDate, 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')}
                    </li>
                    <li className={colLeftIcon}>
                      <CardGiftcardIcon />
                      {item.offer1} به {item.offer2}
                    </li>
                    <li className={colLeftIcon}>
                      <MoneyIcon />
                      <span>
                        {Utils.numberWithCommas(item.amount)} ({item.cnt} عدد)
                      </span>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </Paper>
          </div>
        );
      });
    }
    return <></>;
  };

  const DrugInfo = (): JSX.Element => {
    return (
      <Grid container spacing={1} className={container}>
        {/* {console.log('cardColor ===> ', pharmacyDrug?.cardColor)} */}
        {pharmacyDrug?.cardColor === '#89fd89' && <Ribbon />}
        <Grid item xs={12} sm={12}>
          <ul className={ulCardName}>
            <li style={{ fontWeight: 'bold', fontSize: 14 }}>
              <FontAwesomeIcon icon={faPills} size="1x" />
              <span style={{ marginRight: 10 }}>{pharmacyDrug?.drug.name}</span>
            </li>
            <li>
              <span style={{ fontSize: 13 }}>
                {pharmacyDrug?.drug.genericName}
              </span>
            </li>
          </ul>
        </Grid>
        <Grid item xs={6}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={2} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faBoxes} size="sm" />
            </Grid>
            <Grid item xs={10}>
              <TextLine
                rightText={t('general.inventory')}
                leftText={pharmacyDrug?.cnt}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={2} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
            </Grid>
            <Grid item xs={10}>
              <TextLine
                rightText={t('general.price')}
                leftText={Utils.numberWithCommas(pharmacyDrug?.amount)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={1} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faCalendarTimes} size="sm" />
            </Grid>
            <Grid item xs={11}>
              <TextLine
                rightText={t('general.expireDate')}
                leftText={moment(pharmacyDrug?.expireDate, 'YYYY/MM/DD')
                  .locale('fa')
                  .format('YYYY/MM/DD')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid alignItems="flex-end" container spacing={1}>
            <Grid item xs={1} style={{ textAlign: 'left' }}>
              <FontAwesomeIcon icon={faExchangeAlt} size="sm" />
            </Grid>
            <Grid item xs={11}>
              <TextLine
                rightText={t('general.offer')}
                leftText={`${pharmacyDrug?.offer1} به ${pharmacyDrug?.offer2}`}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container
      className={formType === 1 || formType === 2 ? `${cardcontent}` : ''}
    >
      {formType === 1 && <PackContent />}
      {formType === 2 && <DrugInfo />}
      {formType === 3 && <PackDetailContent />}
    </Container>
  );
}

export default ExCardContent;

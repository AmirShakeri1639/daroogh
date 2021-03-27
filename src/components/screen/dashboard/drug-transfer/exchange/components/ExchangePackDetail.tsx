import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createStyles,
  CheckboxProps,
  Grid,
  Hidden,
  makeStyles,
  withStyles,
  Checkbox,
} from '@material-ui/core';
import {
  faBars,
  faBoxes,
  faCalendarTimes,
  faExchangeAlt,
  faMoneyBillWave,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { green } from '@material-ui/core/colors';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import Utils from 'components/public/utility/Utils';
import { AllPharmacyDrugInterface } from 'interfaces';
import moment from 'jalali-moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import drug from '../../../../../../assets/images/drug.png';

interface Props {
  item: AllPharmacyDrugInterface;
}
const ExchangePackDetail: React.FC<Props> = (props) => {
  const {
    item
  } = props;
  const getExpireDate = (date: any): string => {
    const faDate = moment(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    const eDate = moment.from(faDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    const fromDate = new Date(eDate);
    const today = new Date();

    const differenceInDays = Utils.getDifferenceInDays(today, fromDate);

    const res = `${faDate}`;

    return res;
  };
  const { t } = useTranslation();
  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props: CheckboxProps) => (
    <Checkbox
      color="default"
      {...props}
      style={{
        transform: 'scale(1.5)',
      }}
    />
  ));

  const useStyle = makeStyles((theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        padding: '0 !important',
        marginLeft:8,
        marginRight:8,
      },
      verticalAlign: {
        display: 'flex',
      },
      textC: {
        color: '#1d0d50',
        fontSize: '14px',
        verticalAlign: 'middle',
        lineHeight: '20px',
      },
      avatar: {
        verticalAlign: 'middle',
        width: 40,
        height: 40,
        borderRadius: '10%',
        backgroundColor: 'silver',
        // marginTop:'15%'
      },
      avatarContainer: {
        display: 'flex',
        verticalAlign: 'middle',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      detailsHolder: {
        borderLeft: '1px solid #f80501',
        paddingLeft: 8,
      },
      checkBoxContainer: {
        display: 'flex',
        // verticalAlign: 'middle',
        //  alignContent: 'center',
        //  alignItems: 'center',
        // justifyContent: 'right',
        flexDirection: 'row-reverse',
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
      containerDetailPack: {
        padding: 0,
        borderTop: '1px solid silver',
      },
      ulDetailPack: {
        padding: 0,
        textAlign: 'left',
        listStyleType: 'none',
        float: 'right',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
      },
    horzintalLine: {
      marginRight: 3,
      marginLeft: 3,
      fontSize: 18,
      color: 'silver',
    },
    })
  );

  const {
    root,
    avatar,
    avatarContainer,
    detailsHolder,
    checkBoxContainer,
    rowLeft,
    rowRight,
    colLeft,
    colLeftIcon,
    ulDetailPack,
    horzintalLine,
    containerDetailPack
  } = useStyle();

  return (
    <div className={root}>
        <Grid container item spacing={0} style={{ padding: 2 }}>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 5, fontSize: 12,color:'#1d0d50',
 }}>
              {item.drug.name}
              {item.drug.enName && `(${item.drug.enName})`}
            </span>
          </Grid>
          <Grid item xs={8} style={{ textAlign: 'left', fontSize: 11 }}>
            <ul className={ulDetailPack}>
              <li className={colLeftIcon}>
                <span>تاریخ انقضا: </span>
                {getExpireDate(item.expireDate)}
              </li>
              <Hidden smDown>
                <span className={horzintalLine}>|</span>
              </Hidden>
              <li className={colLeftIcon}>
                <span>قیمت واحد: </span>
                {Utils.numberWithCommas(item.amount)} تومان
              </li>
              <Hidden smDown>
                <span className={horzintalLine}>|</span>
              </Hidden>
              <li className={colLeftIcon}>
                <span>تعداد در این پک: </span>
                {item.cnt} عدد
              </li>
              <Hidden smDown>
                <span className={horzintalLine}>|</span>
              </Hidden>
              <li className={colLeftIcon}>
                <span>قیمت کل: </span>
                {Utils.numberWithCommas(item.amount * item.cnt)} تومان
              </li>
            </ul>
          </Grid>
        </Grid>
    </div>
  );
};

export default ExchangePackDetail;

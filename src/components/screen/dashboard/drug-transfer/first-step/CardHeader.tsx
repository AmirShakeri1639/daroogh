import React, { useState } from 'react';
import { Box, createStyles, DialogContent, Divider, Grid, Hidden } from '@material-ui/core';
import { CardHeaderInterface } from '../../../../../interfaces';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as solidStar,
  faStarHalfAlt,
  faMapMarkerAlt,
  faCalculator,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@material-ui/icons/Person';
import { ColorEnum } from 'enum';

const useStyle = makeStyles((theme) =>
  createStyles({
    
    userLevelContainer: {
      display: 'flex',
      alignItems: 'center',
      '& span:nth-child(1)': {
        width: 12,
        height: 12,
        borderRadius: '50%',
        marginRight: 5,
        display: 'inline-block',
        '&.gold': {
          backgroundColor: '#ffd700',
        },
        '&.silver': {
          backgroundColor: '#c0c0c0',
        },
        '&.boronze': {
          backgroundColor: '#cd7f32',
        },
        '&.platinium': {
          background: '#E5E4E2',
        },
        '& svg': {
          width: 10,
          height: 10,
          color: 'white',
          marginLeft: 1,
          marginBottom: 1,
        },
      },
    },
    starIcon: {
      color: '#ffc65d',
    },

    headerBack: {
      background: ColorEnum.LiteBack,
      margin: '4px 4px 8px 4px',
      borderRadius: '8px 8px 0px 0px',
      padding: 4
    },
    logoType: {
      width: '60px',
      height: '60px',
      maxWidth: '100%',
      maxHeight: '100%',
      verticalAlign: 'middle',
    },
    pharmacyName: {
      fontSize: '15px',
      color: '#0d810d',
    },
  })
);

const CardHeader: React.FC<CardHeaderInterface> = (props) => {
  const { city, guaranty, province, star, itemsCount, userType } = props;
  const [ showPharmacyInfo , setShowPharmacyInfo] = useState<boolean>(true)

  const impersonate = (): void =>{

  }


  const {

    userLevelContainer,
    starIcon,
    headerBack,
    logoType,
    pharmacyName,
  } = useStyle();

  const { t } = useTranslation();

  const handleUserType = (userType: number): any => {
    const getUserLevel =
      userType === 1
        ? t('user.goldUser')
        : userType === 2
        ? t('user.silverUser')
        : userType === 3
        ? t('user.boronzeUser')
        : t('user.platiniumUser');

    const getUserType =
      userType === 1
        ? 'gold'
        : userType === 2
        ? 'silver'
        : userType === 3
        ? 'boronze'
        : 'platinium';

    return (
      <div className={userLevelContainer}>
        <span className={`${getUserType}`}>
          <PersonIcon />
        </span>
        <span className="txt-xs">{getUserLevel}</span>
      </div>
    );
  };

  const stars = (_star: number): any => {
    let star = Math.floor(_star * 10) / 10;
    let flooredStar = Math.floor(star);
    let decimal = (star * 10) % 10;
    /*
    x < 4.3 => 4
    4.3 <= x < 4.7 => 4.5
    x > 4.7 => 5
    */
    decimal = decimal > 7 ? 1 : decimal >= 3 ? 0.5 : 0;
    star = flooredStar + decimal;
    if (decimal === 1) {
      flooredStar++;
    }

    const starsArray: JSX.Element[] = [];
    for (let i = 0; i < flooredStar; i++) {
      starsArray.push(
        <FontAwesomeIcon icon={solidStar} size="sm" className={starIcon} />
      );
    }
    if (decimal === 0.5) {
      starsArray.push(
        <FontAwesomeIcon icon={faStarHalfAlt} size="sm" className={starIcon} />
      );
      flooredStar++;
    }
    for (let i = flooredStar; i < 5; i++) {
      starsArray.push(
        <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
      );
    }
    return starsArray;
  };

  return (
    <Grid container className={headerBack} spacing={1}>
      <Hidden xsDown >
      <Grid container xs={2} alignItems="center" justify="center">
        <img className={logoType} src="pharmacy.png" />
      </Grid>
      </Hidden>
     
      <Grid item xs={7} lg={6} md={6}>
        <Grid item xs={12}>
          <span>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          <Hidden xsDown ><span className="txt-xs ">محل داروخانه: </span></Hidden>
          <span className={` ${pharmacyName} `}>{`${province} ${city}`}</span>

          {showPharmacyInfo && (
            <span onClick={()=>impersonate()}>{'    '}
            <FontAwesomeIcon
              icon={faUser}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          )}

        </Grid>
        <Grid item xs={12}>
          {handleUserType(userType)}
        </Grid>
        <Grid item xs={12}>
          <span>
            <FontAwesomeIcon
              icon={faCalculator}
              size="1x"
              style={{ marginLeft: '6px' }}
            />
          </span>
          <span className="txt-xs ">تعداد اقلام عرضه شده: </span>
          <span className={` ${pharmacyName} `}>{itemsCount} </span>
        </Grid>
        <Grid item xs={12}>
          {stars(Number(star))}
        </Grid>
      </Grid>
      <Grid item xs={5} lg={4} md={4}></Grid>
    </Grid>

  );
};

export default CardHeader;

import React from 'react';
import { Box, createStyles, Divider, Grid } from '@material-ui/core';
import { CardHeaderInterface } from '../../../../../interfaces';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as solidStar,
  faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@material-ui/icons/Person';

const useStyle = makeStyles((theme) =>
  createStyles({
    box: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: theme.spacing(2, 1),
      position: 'relative',
    },
    divPosition: {
      position: 'absolute',
      '&.left': {
        right: 8,
        background: 'white',
        bottom: 9,
        padding: '0 3px 0 10px',
      },
      '&.right': {
        left: 8,
        background: 'white',
        bottom: 10,
        padding: '0 10px 0 3px',
      },
    },
    userLevelContainer: {
      display: 'flex',
      alignItems: 'center',
      '& span:nth-child(1)': {
        width: 15,
        height: 15,
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
          width: 12,
          height: 12,
          marginLeft: 1,
          marginBottom: 1,
        },
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    starIcon: {
      color: '#ffc65d',
    },
  })
);

const CardHeader: React.FC<CardHeaderInterface> = (props) => {
  const { city, guaranty, province, star, itemsCount, userType } = props;

  const {
    box,
    divPosition,
    userLevelContainer,
    textLeft,
    starIcon,
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
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid xs={6} item>
            {handleUserType(userType)}
          </Grid>

          <Grid xs={6} item className={textLeft}>
            <span className="txt-xs">{`${guaranty} تومان`}</span>
          </Grid>
        </Grid>

        <Grid container spacing={0}>
          <Grid xs={6} item>
            <span className="txt-xs">{`${province} ${city}`}</span>
          </Grid>

          <Grid xs={6} item className={textLeft}>
            <span className="txt-xs" dir="ltr">
              {stars(Number(star))}
            </span>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Box component="div" className={box}>
          <div className={`txt-xs ${divPosition} right`}>
            تعداد اقلام عرضه شده
          </div>
          <Divider />
          <div className={`txt-xs ${divPosition} left`}>{itemsCount}</div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CardHeader;

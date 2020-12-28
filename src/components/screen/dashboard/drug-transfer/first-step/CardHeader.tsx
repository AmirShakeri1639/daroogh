import React from 'react';
import { Box, createStyles, Divider, Grid } from '@material-ui/core';
import { CardHeaderInterface } from '../../../../../interfaces';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
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

  const { box, divPosition, userLevelContainer, textLeft, starIcon } = useStyle();

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

  const starHandler = (star: number): JSX.Element[] | JSX.Element => {
    if (star === 0) {
      return (
        <>
          <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
          <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
          <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
          <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
          <FontAwesomeIcon icon={faStarRegular} size="sm" className={starIcon} />
        </>
      )
    }

    let item: JSX.Element[] = [];

    while (star > 0) {
      item = [
        ...item,
        <FontAwesomeIcon icon={faStar} size="sm" className={starIcon} />
      ];
      star--;
    }
    return item;
  }

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
            <span className="txt-xs">{starHandler(Number(star))}</span>
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

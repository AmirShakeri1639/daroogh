import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid, Divider, Button } from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardJobApplicationInterface, CardJobInterface, NewUserData } from '../../../../interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BackDrop } from '../../../public';
import { useTranslation } from 'react-i18next';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    callButton: {
      fontSize: '11px',
      color: 'green',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      padding: '5px 15px',
      borderRadius: '4px',
      textDecoration: 'none',
    },
  })
);

const CardContainer: React.FC<CardJobApplicationInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root, callButton } = useStyle();
  const { t } = useTranslation();
  const { data, cancelHandler, detailHandler } = props;

  const { id, genderStr, name, family, mobile, workExperienceYear } = data;

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={0}>
        <Detail
          id={id}
          genderStr={genderStr}
          name={name}
          family={family}
          mobile={mobile}
          workExperienceYear={workExperienceYear}
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        {' '}
        <Divider />
      </Grid>

      <Grid item xs={12} container spacing={0} justify="flex-end">
        <Grid xs={4} style={{ flex: '1 1 auto', marginTop: '4px' }}>
          <a
            className={callButton}
            onClick={(e: any): any => {
              e.stopPropagation();
            }}
            href={'tel:' + mobile}
          >
            تماس
          </a>
        </Grid>
        <Grid xs={8} justify="flex-end" style={{ display: 'flex' }}>
          <Button
            onClick={(): void => detailHandler(data)}
            style={{ color: 'red', fontSize: '11px' }}
          >
            جزییات
          </Button>
          {/* <Button
            onClick={(): Promise<any> => cancelHandler(data)}
            style={{ color: 'red', fontSize: '11px' }}
          >
            {t('general.reject')}
          </Button> */}
        </Grid>
      </Grid>
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

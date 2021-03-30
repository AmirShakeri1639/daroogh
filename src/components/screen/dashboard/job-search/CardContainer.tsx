import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Divider,
  Button,
} from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CardJobApplicationInterface,
  CardJobInterface,
  NewUserData,
} from '../../../../interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BackDrop } from '../../../public';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1, 1),
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
  })
);

const CardContainer: React.FC<CardJobApplicationInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();

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
          mobile={
            mobile
          }
          workExperienceYear={
            workExperienceYear
          }
          
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
      {' '}
        <Divider />
      </Grid>

      <Grid item xs={12}  container spacing={0} justify="flex-end">
     
        <Button
          onClick={(): void => detailHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          جزییات
        </Button>
        <Button
          onClick={(): Promise<any> => cancelHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          انصراف
        </Button>
      </Grid>
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

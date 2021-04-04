import React, { useEffect, useState } from 'react';
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

  CardJobInterface,
  NewUserData,
  PrescriptionCardDataInterface,
} from '../../../../interfaces';
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
  })
);

const CardContainer: React.FC<PrescriptionCardDataInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();
  const { t } = useTranslation();
  const { data, saveHandler, detailHandler } = props;

  const {
    id,
    sendDate,
    contryDivisionName,
    comment,
    expireDate,
    responseDate,
    prescriptionResponse,
    fileKey,
    contryDivisionCode,
    cancelDate,
    duration,
    readOnly
  } = data;

  return (
    <Paper className={ root } elevation={ 1 }>
      <Grid container spacing={ 0 }>
        <Detail
          id={ id }
          sendDate={ sendDate }
          contryDivisionName={ contryDivisionName }
          comment={ comment }
          expireDate={ expireDate }
          fileKey={ fileKey }
          responseDate={ responseDate }
          prescriptionResponse={ prescriptionResponse }
          contryDivisionCode={ contryDivisionCode }
          cancelDate={ cancelDate }
          duration={ duration }
          readOnly={ readOnly }
        />
      </Grid>
      <Grid item xs={ 12 } style={ { padding: '4px' } }>
        <Divider />
      </Grid>

      <Grid item xs={ 12 } container spacing={ 0 } justify="flex-end">

        {/* <Button
          onClick={(): void => detailHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          نمایش نسخه
        </Button> */}
        <Button
          onClick={ (): void => saveHandler(data) }
          style={ { color: 'red', fontSize: '14px' } }
        >
          نمایش جزئیات و پاسخ
        </Button>
      </Grid>
      <BackDrop isOpen={ isOpenBackDrop } />
    </Paper>
  );
};

export default CardContainer;

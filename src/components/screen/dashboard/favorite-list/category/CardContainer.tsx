import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Divider,
} from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FavoriteDrugInterface } from '../../../../../interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { TextMessage } from '../../../../../enum';
import { BackDrop } from '../../../../public';
import { confirmSweetAlert } from 'utils'

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 0),
      borderRadius: 5,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

const CardContainer: React.FC<FavoriteDrugInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root, redTrash } = useStyle();
  const { data, formHandler } = props;

  const { name, id } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    const removeConfirm = await confirmSweetAlert(TextMessage.REMOVE_TEXT_ALERT)
    if (removeConfirm) {
      await formHandler(_id);
    }
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Detail id={id} name={name} />
        </Grid>

        <Grid item xs={12} style={{ padding: '4px' }}>
          <Divider />
        </Grid>

        <Grid item xs={12} justify="flex-end" >
          <Button
            onClick={(): Promise<any> => removeHandler(id)}
            style={{ color: 'red', fontSize: '14px' }}
          >
            حذف
          </Button>
        </Grid>
        <BackDrop isOpen={isOpenBackDrop} />
      </Grid>
    </Paper>
  );
};

export default CardContainer;

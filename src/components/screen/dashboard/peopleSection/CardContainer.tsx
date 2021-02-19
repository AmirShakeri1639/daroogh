import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid } from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FavoriteDrugInterface,
  PrescriptionDataInterface,
} from '../../../../interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { TextMessage } from '../../../../enum';
import { BackDrop } from '../../../public';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 2),
      borderRadius: 10,
    },
    redTrash: {
      color: '#ff0000',
    },
  })
);

const CardContainer: React.FC<PrescriptionDataInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root, redTrash } = useStyle();
  const { data, formHandler } = props;

  const {
    sendDate,
    contryDivisionName,
    contryDivisionCode,
    comment,
    id,
  } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid justify="flex-end" container spacing={1}>
            <Grid item xs={1}>
              <FontAwesomeIcon
                onClick={(): Promise<any> => removeHandler(id)}
                icon={faTrashAlt}
                size="lg"
                className={`${redTrash} cursor-pointer`}
              />
            </Grid>
          </Grid>
        </Grid>

        <Detail
          id={id}
          contryDivisionCode={contryDivisionCode}
          sendDate={sendDate}
          contryDivisionName={contryDivisionName}
          comment={comment}
        />
      </Grid>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

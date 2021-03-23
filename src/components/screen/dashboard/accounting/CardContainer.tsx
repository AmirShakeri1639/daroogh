import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Divider,
  Button,
  Link,
} from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AccountingCardInterface } from '../../../../interfaces/AccountingInterface';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BackDrop } from '../../../public';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1),
      borderRadius: 5,
      margin: theme.spacing(1.5),
    },
  })
);

const CardContainer: React.FC<AccountingCardInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();

  const { data, exchangeHandler } = props;

  const { id, date, description, amount, exchangeID, mandeh } = data;

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        <Detail
          id={id}
          date={date}
          description={description}
          amount={amount}
          exchangeID={exchangeID}
          mandeh={mandeh}
        />
      </Grid>

      {exchangeID && (
        <Grid item xs={12} justify="flex-end">
          <Grid item xs={12} style={{ padding: '4px' }}>
            <Divider />
          </Grid>

          {exchangeHandler(data)}
        </Grid>
      )}
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

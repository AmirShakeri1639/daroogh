import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid, Divider, Button, Link } from '@material-ui/core';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AccountingCardInterface } from '../../../../interfaces/AccountingInterface';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BackDrop } from '../../../public';
import { ColorEnum } from 'enum';

const CardContainer: React.FC<AccountingCardInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);

  const { data, exchangeHandler } = props;

  const { id, date, description, amount, exchangeID, mandeh } = data;
  const useStyle = makeStyles((theme) =>
    createStyles({
      root: {
        backgroundColor: '#fff',
        padding: theme.spacing(1, 1, 1, 1),
        borderRadius: 5,
        position: 'relative',
        overflow: 'hidden',
      },
      typeContainer: {
        display: 'flex',
        alignContent: 'center',
        background: `${amount <= 0 ? ColorEnum.Green : ColorEnum.Red}`,
        color: 'white',
        borderRadius: 30,
        flexDirection: 'column',
        padding: 5,
      },
    })
  );
  const { root, typeContainer } = useStyle();
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
      <Grid item xs={12} style={{ padding: '4px' }}>
        <Divider />
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: 'flex', flexDirection: 'row-reverse', alignContent: 'center' }}
      >
        <Grid item xs={6} container spacing={0} direction="row-reverse">
          {exchangeID && <>{exchangeHandler(data)}</>}
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6} container spacing={0} className={typeContainer}>
            <span>{amount <= 0 ? 'بستانکار' : 'بدهکار'}</span>
          </Grid>
        </Grid>
      </Grid>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

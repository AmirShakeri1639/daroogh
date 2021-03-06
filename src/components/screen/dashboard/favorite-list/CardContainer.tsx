import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid, Divider, Button } from '@material-ui/core';
import Detail from './Detail';
import { FavoriteDrugInterface } from '../../../../interfaces';
import { TextMessage } from '../../../../enum';
import { BackDrop } from '../../../public';
import { confirmSweetAlert } from 'utils'

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 1),
      borderRadius: 5,
    },
  })
);

const CardContainer: React.FC<FavoriteDrugInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();
  const { data, formHandler } = props;

  const {
    genericName,
    companyName,
    enName,
    name,
    id,
    category: { name: categoryName },
  } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    const removeConfirm = await confirmSweetAlert(TextMessage.REMOVE_TEXT_ALERT)
    if (removeConfirm) {
      await formHandler(_id);
    }
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={0}>
        <Detail
          id={id}
          name={name}
          companyName={companyName}
          genericName={genericName}
          enName={enName}
          categoryName={categoryName}
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        <Divider />
      </Grid>

      <Grid item xs={12} justify="flex-end">
        <Button
          onClick={(): Promise<any> => removeHandler(id)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          حذف
        </Button>
      </Grid>
      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

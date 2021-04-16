import React, { useState } from 'react';
import { makeStyles, Paper, createStyles, Grid, Divider, Button } from '@material-ui/core';
import Detail from './Detail';
import { UserInterface } from '../../../../../interfaces';
import { BackDrop } from '../../../../public';

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

const CardContainer: React.FC<UserInterface> = (props) => {
  const [isOpenBackDrop, setIsOpenBackDrop] = useState<boolean>(false);
  const { root } = useStyle();

  const { data, editRoleHandler, removeRolesHandler } = props;

  const {
    name,
    family,
    email,
    mobile,
    birthDate,
    id,
    nationalCode,
    pharmacyID,
    userName,
    active,
    gender,
  } = data;

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        <Detail
          id={id}
          name={name}
          family={family}
          mobile={mobile}
          email={email}
          userName={userName}
          nationalCode={nationalCode}
          birthDate={birthDate}
          active={active}
          pharmacyID={pharmacyID}
          gender={gender}
        />
      </Grid>
      <Grid item xs={12} style={{ padding: '4px' }}>
        {' '}
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={0} justify="flex-end">
        <Button
          onClick={(): void => editRoleHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          ویرایش نقش
        </Button>
        <Button
          onClick={(): void => removeRolesHandler(data)}
          style={{ color: 'red', fontSize: '14px' }}
        >
          حذف همه نقش ها
        </Button>
      </Grid>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

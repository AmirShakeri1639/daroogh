import React from 'react';
import {
  Container,
  Grid,
  createStyles,
  Typography,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UserForm from './UserForm';

const useClasses = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1),
    },
    titleContainer: {
      padding: theme.spacing(2),
    },
    formTitle: {
      margin: 0,
    },
  })
);

const CreateUser: React.FC = () => {
  const { formTitle, titleContainer, container } = useClasses();

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container spacing={0}>
        <Grid xs={12} item>
          <div className={titleContainer}>
            <Typography
              variant="h6"
              component="h6"
              className={`${formTitle} txt-md`}
            >
              کاربر جدید
            </Typography>
          </div>

          <Divider />

          <UserForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUser;

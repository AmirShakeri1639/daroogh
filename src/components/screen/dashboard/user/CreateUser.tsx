import React from "react";
import {
  Container,
  Grid,
  Paper,
  createStyles,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserForm from "./UserForm";

const useClasses = makeStyles((theme) => createStyles({
  container: {
    marginTop: theme.spacing(1),
  },
  titleContainer: {
    padding: theme.spacing(2)
  },
  formTitle: {
    margin: 0
  },
}));

const CreateUser: React.FC = () => {
  const {
    formTitle, titleContainer, container,
  } = useClasses();

  return (
    <Container maxWidth="lg" className={container}>
      <Grid
        container
        spacing={0}
      >
        <Grid
          xs={12}
          item
        >
          <Paper>
            <div className={titleContainer}>
              <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
                کاربر جدید
              </Typography>
            </div>
            <Divider />
            <UserForm />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateUser;

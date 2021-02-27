import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { FormContainerInterface } from '../../../interfaces/form';
import MaterialContainer from '../material-container/MaterialContainer';

const useClasses = makeStyles((theme) =>
  createStyles({
    titleContainer: {
      padding: theme.spacing(2),
    },
    formTitle: {
      margin: 0,
    },
  })
);

const FormContainer: React.FC<FormContainerInterface> = (props) => {
  const { titleContainer, formTitle } = useClasses();

  const { title, children } = props;

  return (
    <MaterialContainer>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper>
            <div className={titleContainer}>
              <Typography
                variant="h6"
                component="h6"
                className={`txt-md ${formTitle}`}
              >
                {title}
              </Typography>
            </div>
            <Divider />
            {children}
          </Paper>
        </Grid>
      </Grid>
    </MaterialContainer>
  );
};

export default FormContainer;

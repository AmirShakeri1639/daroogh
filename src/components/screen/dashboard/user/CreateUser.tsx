import React from "react";
import {
  Container,
  Grid,
  TextField,
  Paper,
} from "@material-ui/core";

const CreateUser: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={0}
      >
        <Grid
          xs={12}
          item
        >
          <Paper>
            <form
              autoComplete="off"
              noValidate
            >
              <TextField
                label="نام کاربر"
                required
                size="small"
                variant="outlined"
                // onChange={}
              />
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CreateUser;

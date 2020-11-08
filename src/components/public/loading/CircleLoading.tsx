import React from 'react';
import { Box, createStyles } from "@material-ui/core";
import CircularProgress  from '@material-ui/core/CircularProgress';
import { CircleProgressInterface } from "../../../interfaces";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => createStyles({
  root: {
    margin: theme.spacing(1),
  }
}));

const CircleLoading: React.FC<CircleProgressInterface> =
  (props): JSX.Element => {
    const { root } = useStyles();
    const { size, color } = props;

    return (
      <Box
        className={root}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress
          color={color}
          size={size}
        />
      </Box>
    );
  };

CircleLoading.defaultProps = {
  size: 24,
  color: 'primary',
};

export default CircleLoading;

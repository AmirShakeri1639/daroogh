import React from 'react';
import { Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const Note: React.FC = (props) => {
  return (
    <Grid container className="note" xs={ 12 } sm={ 10 }>
      <Grid item xs={ 1 }>
        <FontAwesomeIcon icon={ faExclamation } size="3x" />
      </Grid>
      <Grid item xs={ 11 }>
        { props.children }
      </Grid>
    </Grid>
  )
}

export default Note

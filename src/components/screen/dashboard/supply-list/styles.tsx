import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';

interface Props {
  isSmallScreen: boolean;
}

export const StyledFilterWrapper = styled((props) => <Grid {...props} />)`
  margin-top: ${(props: Props) => props.isSmallScreen ? '10px' : 0};
`

export const FormControlFilter = styled((props) => <FormControl {...props} />)`
  width: 100%;
`

import React from 'react';
import { Box, Typography } from '@material-ui/core';

export interface DaroogTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const DaroogTabPanel: React.FC<DaroogTabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      style={{ direction: 'rtl' }}
      {...other}
    >
      {value == index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { createStyles, Drawer } from '@material-ui/core';
import { MaterialDrawerPropsInterface } from '../../../interfaces';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) =>
  createStyles({
    container: {
      width: 300,
    },
  })
);

const MaterialDrawer: React.FC<MaterialDrawerPropsInterface> = (props) => {
  const { children, onClose, isOpen } = props;

  const { container } = useStyle();

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <div className={container}>{children}</div>
    </Drawer>
  );
};

export default MaterialDrawer;

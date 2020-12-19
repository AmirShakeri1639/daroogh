import React, { useState } from 'react';
import { createStyles, Drawer } from '@material-ui/core';
import { MaterialDrawerPropsInterface } from '../../../interfaces';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

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
    <SwipeableDrawer anchor="left" open={isOpen} onOpen={onClose} onClose={onClose}>
      <div className={container}>{children}</div>
    </SwipeableDrawer>
  );
};

export default MaterialDrawer;

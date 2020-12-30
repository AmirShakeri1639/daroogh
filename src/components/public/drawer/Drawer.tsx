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
    noScrollBarDrawer: {
      '& .MuiDrawer-paper::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
        display: 'none',
      },
    },
  })
);

const MaterialDrawer: React.FC<MaterialDrawerPropsInterface> = (props) => {
  const { children, onClose, isOpen } = props;

  const { container, noScrollBarDrawer } = useStyle();

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ): any => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
  };

  return (
    <SwipeableDrawer
      disableBackdropTransition
      anchor="left"
      open={ isOpen }
      onOpen={ onClose }
      onClose={ onClose }
      className={ noScrollBarDrawer }
    >
      <div className={ container }>{ children }</div>
    </SwipeableDrawer>
  );
};

export default MaterialDrawer;

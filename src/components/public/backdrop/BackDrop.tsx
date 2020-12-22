import { createStyles, makeStyles, Backdrop, CircularProgress } from '@material-ui/core';
import React from 'react';
import { BackDropPropsInterface } from '../../../interfaces';

const useStyle = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);


const BackDrop: React.FC<BackDropPropsInterface> = (props) => {
  const { isOpen, onClick } = props;
  const { backdrop } = useStyle();

  return (
    <Backdrop className={backdrop} open={isOpen} onClick={onClick}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackDrop;

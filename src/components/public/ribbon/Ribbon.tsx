import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';

const useClasses = makeStyles((theme) =>
  createStyles({
    ribbon: {
      width: '150px',
      height: '150px',
      overflow: 'hidden',
      position: 'absolute',
      '&::before &::after': {
        position: 'absolute',
        zIndex: -1,
        content: '',
        display: 'block',
        border: '5px solid #2980b9',
      },
      '& span': {
        position: 'absolute',
        display: 'block',
        width: '225px',
        padding: '15px 0',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px rgba(0,0,0,.1)',
        color: 'silver',
        textShadow: '0 1px 1px rgba(0,0,0,.2)',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 10,
      },
    },
    ribbonTopLeft: {
      top: '-10px',
      right: '-10px',
      '&::before &::after': {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
      },
      '&::before': {
        top: 0,
        left: 0,
      },
      '&::after': {
        bottom: 0,
        right: 0,
      },
      '& span': {
        left: -15,
        top: 25,
        transform: 'rotate(45deg)',
        height: 30,
        margin: 5,
        padding: 0,
        paddingLeft: 8,
      },
    },
  })
);

const Ribbon = (): JSX.Element => {
  const { ribbon, ribbonTopLeft } = useClasses();

  return (
    <div className={`${ribbon} ${ribbonTopLeft}`}>
      <span>
        اضافه/ویرایش شده
        <br /> توسط داروخانه مقابل
      </span>
    </div>
  );
};

export default Ribbon;

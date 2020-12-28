import { createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
import { TextLinePropsInterface } from '../../../interfaces';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'relative',
      '& span': {
        position: 'absolute',
        display: 'inline-block',
        backgroundColor: '#e4e4e4',
        padding: '1px 2px',
      },
      '& span.right': {
        bottom: '-7px',
        left: 0,
      },
      '& span.left': {
        bottom: '-10px',
        right: 0,
      },
    },
  })
);

const TextLine: React.FC<TextLinePropsInterface> = (props) => {
  const { leftText, rightText, textAlign = 'left' } = props;
  let { backColor } = props;
  if (backColor == undefined) {
    backColor = '#e4e4e4';
  }

  const useStyle = makeStyles((theme) =>
    createStyles({
      root: {
        position: 'relative',
        '& span': {
          position: 'absolute',
          display: 'inline-block',
          backgroundColor: backColor,
          padding: '1px 2px',
        },
        '& span.right': {
          bottom: '-7px',
          left: 0,
        },
        '& span.left': {
          bottom: '-10px',
          right: 0,
        },
      },
    })
  );

  const { root } = useStyle();

  return (
    <div className={root}>
      <span className="right">{rightText}</span>
      <hr />
      <span className="left">{leftText}</span>
    </div>
  );
};

export default TextLine;

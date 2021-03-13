import { createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { TextWithTitlePropsInterface } from '../../../interfaces';

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

const TextWithTitle: React.FC<TextWithTitlePropsInterface> = (props) => {
  const { title, body, suffix } = props;


  const useStyle = makeStyles((theme) =>
    createStyles({
      
        titleC:{
            color:"#5a5a5a",
            fontSize:"12px",
            verticalAlign:'middle',
            lineHeight: '20px'
        },
        suffixC:{
          color:"#5a5a5a",
          fontSize:"10px",
          verticalAlign:'middle',
          lineHeight: '20px'
      },
        textC:{
          color:"#1d0d50",
          fontSize:"14px",
          verticalAlign:'middle',
          lineHeight: '20px'
        }
     
    })
  );

  const { titleC,textC,suffixC } = useStyle();

  return (
    <Grid container xs={12}>
      <span className={titleC}>{title}</span>
      <div className={titleC}>:&nbsp;</div>
      <span className={textC}>{body}</span>
      {suffix && (
        <>
        <div>&nbsp;</div>
        <span className={suffixC}>{suffix}</span>
        </>
      )
      }
    </Grid>
  );
};

export default TextWithTitle;

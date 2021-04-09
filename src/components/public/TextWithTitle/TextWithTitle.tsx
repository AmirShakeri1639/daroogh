import { createStyles, Grid, makeStyles } from '@material-ui/core';
import { ColorEnum } from 'enum';
import React from 'react';
import { TextWithTitlePropsInterface } from '../../../interfaces';

const TextWithTitle: React.FC<TextWithTitlePropsInterface> = (props) => {
  const { title, body, suffix ,isSmal,dateSuffix,showDateSuffix} = props;


  const useStyle = makeStyles((theme) =>
    createStyles({
      
        titleC:{
            color:"#5a5a5a",
            fontSize: `${isSmal? '10px':'12px'}`,
            verticalAlign:'middle',
            lineHeight: '20px'
        },
        suffixC:{
          color:"#5a5a5a",
          fontSize:`${isSmal? '8px':'10px'}`,
          verticalAlign:'middle',
          lineHeight: '20px'
      },
        textC:{
          color:ColorEnum.DeepBlue,
          fontSize:`${isSmal? '12px':'14px'}`,
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
       {dateSuffix && (showDateSuffix === undefined || showDateSuffix === true) && (
        <>
        <div>&nbsp;</div>
        <span className={suffixC}>{`(${dateSuffix} روز)`}</span>
        </>
      )
      }
    </Grid>
  );
};

export default TextWithTitle;

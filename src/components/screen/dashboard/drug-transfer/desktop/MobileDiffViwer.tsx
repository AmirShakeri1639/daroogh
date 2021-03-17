import {  makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import { difference } from "lodash";
import { Convertor } from '../../../../../utils';

interface TextLinePropsInterface {

  percentage: number
  yourAmount:number | string ;
  otherAmount:number | string ;
}

const MobileDiffViwer: React.FC<TextLinePropsInterface> = (props) => {
  const { percentage,yourAmount,otherAmount  } = props;
 

  const useStyles = makeStyles((theme) => ({
    root: {
      width:'100%',
      background:"linear-gradient(#3A2F8B, #3A2F8B) no-repeat center/2px 100%" ,
      height:30 ,
      alignItems: "center",     
       flexDirection:'row-reverse'

       },
       rootRight: {
        width:'100%',
        background:"linear-gradient(#3A2F8B, #3A2F8B) no-repeat center/2px 100%" ,
        height:30 ,
        alignItems: "center",     
         flexDirection:'row'
  
         },

    containerRight: {
      height: 40,
      flexDirection: "row-reverse"
    },
    stepContainer: {
      background: "#fff",
      height: 30,
      display: "flex",
      alignItems: "center"
    },
    stepContainerRight: {
        background: "#fff",
        height: 30,
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse"

      },
    dateContainer: {
      display: "flex",
      alignItems: "center",
      paddingTop: 6,
      paddingBottom: 6,
      background: "#FFCB08",
    },
    dateContainerRight: {

      display: "flex",
      alignItems: "center",
      height:12,
      background: "#FFCB08",
      float:'right',
    },

    dateContainerLeft: {

        display: "flex",
        alignItems: "center",
        height:12,
        background: "#FFCB08",
        float:'left',
      },

    grayContainer: {
       height:12,
      background: "#ededed",
    },
    centerText:{
        textAlign:'center'
    }

    
  }));

  const classes = useStyles();
  let diff : number = (Number(yourAmount) - Number(otherAmount)) > 0 ? 1 : -1;

  return (
<Grid container className={classes.rootRight}>
      <Grid item xs={6} style={{paddingLeft:2}}>
          <Grid container className={classes.stepContainerRight}>
            <Grid item xs={12} className={classes.grayContainer}>
              <div className={classes.dateContainerRight}
            style={{ width : `${(diff < 0) ? (percentage) : '0' }% ` }} />
            </Grid>

            <Grid item xs={12} className={classes.centerText}>
                <span style={{fontSize:10}}>سبد مقابل: </span>
                <span style={{fontSize:10}}>‍‍‍{Convertor.thousandsSeperatorFa(otherAmount)}</span>

              </Grid>
          </Grid>
      </Grid>
      <Grid item xs={6} style={{paddingRight:2}}>
      <Grid container className={classes.stepContainer}>
            <Grid item xs={12} className={classes.grayContainer} >
              <div className={classes.dateContainerLeft}
            style={{ width : `${(diff > 0) ? (percentage) : '0' }% ` }} />
            </Grid>

            <Grid item xs={12} className={classes.centerText}>
                <span style={{fontSize:10}}>سبد شما: </span>
                <span style={{fontSize:10}}>‍‍‍{Convertor.thousandsSeperatorFa(yourAmount)}</span>

              </Grid>
          </Grid>
      </Grid>
    </Grid>
  );
};

export default MobileDiffViwer;

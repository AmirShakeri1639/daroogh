import { makeStyles } from '@material-ui/core';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { difference } from 'lodash';
import { Convertor } from '../../../../../utils';
import { borderRadius } from 'react-select/src/theme';
import { ColorEnum } from 'enum';

interface TextLinePropsInterface {
  percentage: number;
  yourAmount: number | string;
  otherAmount: number | string;
  is3PercentOk: boolean;
}

const MobileDiffViwer: React.FC<TextLinePropsInterface> = (props) => {
  const { percentage, yourAmount, otherAmount, is3PercentOk } = props;
  let okColor: string = '#4caf50';
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      background: `linear-gradient(${is3PercentOk ? okColor : '#3A2F8B'},${
        is3PercentOk ? okColor : '#3A2F8B'
      }) no-repeat center/2px 100%`,
      height: 30,
      alignItems: 'center',
      flexDirection: 'row-reverse',
    },

    rootRight: {
      width: '100%',
      background: `linear-gradient(${is3PercentOk ? okColor : '#f44336'},${
        is3PercentOk ? okColor : '#f44336'
      }) no-repeat center/2px 100%`,
      height: 30,
      alignItems: 'center',
      flexDirection: 'row',
    },

    diffContainer: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      display:'flex',
      alignContent:'center',
      // borderLeft:`2px solid ${is3PercentOk ? okColor : '#f44336'}`,
      color: ColorEnum.DeepBlue,
    },

    containerRight: {
      height: 40,
      flexDirection: 'row-reverse',
    },
    stepContainer: {
      background: '#fff',
      height: 30,
      display: 'flex',
      alignItems: 'center',
    },
    stepContainerRight: {
      background: '#fff',
      height: 30,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row-reverse',
    },
    dateContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 6,
      paddingBottom: 6,
      background: `${is3PercentOk ? okColor : '#f44336'}`,
    },
    dateContainerRight: {
      display: 'flex',
      alignItems: 'center',
      height: 12,
      background: `${is3PercentOk ? okColor : '#f44336'}`,
      float: 'right',
    },

    dateContainerLeft: {
      display: 'flex',
      alignItems: 'center',
      height: 12,
      background: `${is3PercentOk ? okColor : '#f44336'}`,
      float: 'left',
    },

    grayContainer: {
      height: 12,
      background: '#f5f5f5',
    },
    centerText: {
      textAlign: 'center',
    },
    container:{
      marginTop:8,
      paddingTop:2,
      border: `1px solid ${ColorEnum.DeepBlue}`
    }
  }));

  const classes = useStyles();
  let diff: number = Number(yourAmount) - Number(otherAmount) > 0 ? 1 : -1;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={10}>
        <Grid container className={classes.rootRight}>
          <Grid item xs={6} style={{ paddingLeft: 2 }}>
            <Grid container className={classes.stepContainerRight}>
              <Grid item xs={12} className={classes.grayContainer}>
                <div
                  className={classes.dateContainerRight}
                  style={{
                    width: `${
                      diff < 0 ? 48 + percentage / 2 : 50 - percentage / 2
                    }% `,
                  }}
                />
              </Grid>

              <Grid item xs={12} className={classes.centerText}>
                <span style={{ fontSize: 11 }}>سبد مقابل: </span>
                <span style={{ fontSize: 11 }}>
                  ‍‍‍{Convertor.thousandsSeperatorFa(otherAmount)}
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} style={{ paddingRight: 2 }}>
            <Grid container className={classes.stepContainer}>
              <Grid item xs={12} className={classes.grayContainer}>
                <div
                  className={classes.dateContainerLeft}
                  style={{
                    width: `${
                      diff < 0 ? 50 - percentage / 2 : 48 + percentage / 2
                    }% `,
                  }}
                />
              </Grid>

              <Grid item xs={12} className={classes.centerText}>
                <span style={{ fontSize: 11 }}>سبد شما: </span>
                <span style={{ fontSize: 11 }}>
                  ‍‍‍{Convertor.thousandsSeperatorFa(yourAmount)}
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} className={classes.diffContainer}>
      <span style={{ fontSize: 9 }}>اختلاف</span>
      <span style={{ fontSize: 15 }}>{percentage}<span style={{ fontSize: 12 }}>%</span></span>
      </Grid>
    </Grid>
  );
};

export default MobileDiffViwer;

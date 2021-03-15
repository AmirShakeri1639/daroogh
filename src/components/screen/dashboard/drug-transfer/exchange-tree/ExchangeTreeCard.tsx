import { createStyles, Divider, Grid, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import { borderRadius } from 'react-select/src/theme';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      borderLeft: '3px solid #3A2F8B',
      borderRight: '3px solid #3A2F8B',
    },
    container: {
      height: 40,
    },
    containerReverse: {
      height: 40,
      flexDirection : 'row-reverse'
      
    },
    stepContainer: {
      background: '#fff',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      
    },
    dateContainer: {
      //   borderRight: '3px solid #3A2F8B',
      //   borderTop: '3px solid #3A2F8B',
      //   borderBottom: '3px solid #3A2F8B',

      borderRadius: '0px 10px 10px 0px',
      height: 30,
      display: 'flex',
      alignItems: 'center',
      background: '#FFCB08',
      padding: 6,
    },
    dateContainerLeft: {
      //   borderRight: '3px solid #3A2F8B',
      //   borderTop: '3px solid #3A2F8B',
      //   borderBottom: '3px solid #3A2F8B',

      borderRadius: '10px 0px 0px 10px',
      height: 30,
      display: 'flex',
      alignItems: 'center',
      background: '#FFCB08',
      padding: 6,
    },

    titleContainer: {
      height: 30,
      display: 'flex',
      alignItems: 'center',
      padding: 6,
    },
  })
);

interface Props {
  title: string | React.ReactNode;
  date: string | React.ReactNode;
  isYou: boolean;
}

const ExchangeTreeCard: React.FC<Props> = (props) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    root,
    container,
    stepContainer,
    dateContainer,
    titleContainer,
    dateContainerLeft,
    containerReverse
  } = useStyle();
  const { date, title, isYou } = props;
  return (
    <Grid
      container
      spacing={0}
      className={root}
      
    >
      {isYou && (
          <>
        <Grid container xs={12} className={containerReverse} style={{ opacity: `${date ? '1' : '0.3'}` }}>
          <Grid container xs={12} md={6} className={stepContainer}>
            <Grid item xs={4} className={dateContainer}>
              <span>{date}</span>
            </Grid>
            <Grid item xs={8} className={titleContainer}>
              <span style={{fontSize:12}}>{title}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{padding:2}}>
        <Divider/>
    </Grid>
    </>
      )}
      {!isYou && (
          <>
        <Grid container xs={12}  className={container} style={{ opacity: `${date ? '1' : '0.3'}` }}>
          <Grid
            container
            xs={12}
            md={6}
            direction="row-reverse"
            className={stepContainer}
          >
            <Grid
              item
              xs={4}
              direction="row-reverse"
              className={dateContainerLeft}
            >
              <span>{date}</span>
            </Grid>
            <Grid
              item
              xs={8}
              direction="row-reverse"
              className={titleContainer}
            >
              <span style={{fontSize:12}}>{title}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{padding:2}}>
            <Divider/>
        </Grid>
        </>
      )}
    </Grid>
  );
};
export default ExchangeTreeCard;
import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core';
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
  const {
    root,
    container,
    stepContainer,
    dateContainer,
    titleContainer,
    dateContainerLeft,
  } = useStyle();
  const { date, title, isYou } = props;
  return (
    <Grid
      container
      spacing={0}
      className={root}
      style={{ opacity: `${date ? '1' : '0.3'}` }}
    >
      {isYou && (
          <>
        <Grid container xs={12} className={container}>
          <Grid container xs={10} className={stepContainer}>
            <Grid item xs={4} className={dateContainer}>
              <span>{date}</span>
            </Grid>
            <Grid item xs={8} className={titleContainer}>
              {title}
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
        <Grid container xs={12} direction="row-reverse" className={container}>
          <Grid
            container
            xs={10}
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
              {title}
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
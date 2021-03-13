import React, { memo } from 'react';
import { Message } from 'interfaces';
import { createStyles } from '@material-ui/styles';
import { Grid, Hidden, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Convertor } from 'utils';

const useClasses = makeStyles((theme) =>
  createStyles({
    boxContainer: {
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      backgroundColor: '#fff',
      boxShadow: '0 0 15px 12px #eee',
      marginBottom: theme.spacing(2),
    },
    topContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface MessageBoxProps {
  message: Message;
}

const { convertISOTime } = Convertor;

const MessageBox: React.FC<MessageBoxProps> = memo(({ message }) => {
  const { message1, sendDate, subject } = message;
  const { boxContainer, topContainer } = useClasses();
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} xs={12} sm={12} md={10} lg={10} >
      <Paper
        style={{ padding: '16px 16px 0px 16px', marginTop: 24, width: '100%' , borderRight: '3px solid #f80501' }}
        elevation={1}
      >
        <Grid item xs={12} spacing={0}>
          <Grid container xs={12} spacing={1} >
            <Hidden smDown>

            <Grid item xs={1} alignItems="center" style={{alignSelf:"center"}} spacing={0}>
              <img src="/message.jpg" style={{ width: '100%' }} />
            </Grid>
            </Hidden>

            <Grid item xs={12} sm={11} spacing={0}>
              <Grid container xs={12} spacing={0}>
                <Grid item xs={12} spacing={1}>
                  <strong style={{ color: '#1d0d50' }}>{subject}</strong>
                </Grid>
                <Grid item xs={12} spacing={1}>
                  <p>{message1}</p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} justify="flex-end" style={{ textAlign: 'left' }}>
              <span className="text-muted txt-xs">
                {t('date.sendDate')}:{convertISOTime(sendDate)}
              </span>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
    // <section className={boxContainer}>
    //   <div className={topContainer}>
    //     <strong>{subject}</strong>
    //     <span className="text-muted">
    //       {t('date.sendDate')}:<span dir="rtl">{convertISOTime(sendDate)}</span>
    //     </span>
    //   </div>
    //   <div>
    //     <p>{message1}</p>
    //   </div>
    // </section>
  );
});

export { MessageBox };

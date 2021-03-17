import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import {DrugInterface, InitialNewUserInterface, NewUserData, UserLoginInterface  } from '../../../../../interfaces';
import { TextLine } from '../../../../public';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 15,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: '0 6px',
        borderLeft: '3px solid #f80501',
        height: '40px',
        backgroundColor: '#FEFFF2',
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },
  })
);

const Detail: React.FC<NewUserData> = (props) => {
  const {  name,
    family,
    email,
    mobile,
    birthDate,
    id,
    nationalCode,
    pharmacyID,
    active,
    userName } = props;
  const { paper, container } = useStyle();

  const { t } = useTranslation();

  return (
    <Grid item xs={12} spacing={0}>
      <Paper className={paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid container xs={12} className="drug-container">
                  
                  <Grid
                    container
                    xs={11}
                    style={{ alignItems: 'center', paddingRight: '8px' }}
                  >
                    <span>{name + ' ' +  family}</span>
                     </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title="موبایل"
                      body={mobile || t('general.undefined')}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title='ایمیل'
                      body={email || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextWithTitle
                      title='کد ملی'
                      body={nationalCode || t('general.undefined')}
                    />
                    </Grid>

                  <Grid item xs={6}>

                    <TextWithTitle
                      title='نام کاربری'
                      body={userName || t('general.undefined')}
                    />
                  </Grid>
                  <Grid item xs={6}>

                    <TextWithTitle
                      title='وضعیت کاربر'
                      body={active ? 'فعال' : 'غیرفعال'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Detail;

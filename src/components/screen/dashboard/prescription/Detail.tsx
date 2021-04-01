import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faBoxes,
  faMoneyBillWave,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  DrugInterface,
  InitialNewUserInterface,
  JobApplicationInterface,
  UserLoginInterface,
} from '../../../../interfaces';
import { TextLine } from '../../../public';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import {
  PrescriptionInterface,
  PrescriptionInputInterface,
} from 'interfaces/PrescriptionInterface';
import { getJalaliDate, isNullOrEmpty, JwtData } from 'utils';
import { ColorEnum, PrescriptionResponseStateEnum } from 'enum';

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
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        height: '40px',
        backgroundColor: ColorEnum.LiteBack,
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

const Detail: React.FC<PrescriptionInterface> = (props) => {
  const {
    id,
    sendDate,
    contryDivisionName,
    comment,
    expireDate,
    responseDate,
    prescriptionResponse,
    fileKey,
    contryDivisionCode,
    cancelDate,
    duration,
    readOnly,
  } = props;
  const { paper, container } = useStyle();
  const [pharmacyName, setPharmacyName] = useState('');
  React.useEffect(() => {
    const jwtData = new JwtData();
    setPharmacyName(jwtData.userData.pharmacyName);
  }, []);
  const { t } = useTranslation();
  const getPrescriptionState = (): any => {
    const responses = prescriptionResponse.filter((i: any) => {
      return i.pharmacy.name === pharmacyName;
    });
    const thisState =
      PrescriptionResponseStateEnum[
        responses.length > 0 ? responses[0].state : 1
      ];
    return (
      <span
        style={{
          color:
            thisState ==
            PrescriptionResponseStateEnum[PrescriptionResponseStateEnum.Accept]
              ? ColorEnum.Green
              : ColorEnum.Gray,
        }}
      >
        {!isNullOrEmpty(prescriptionResponse) &&
          t(`PrescriptionResponseStateEnum.${thisState}`)}
      </span>
    );
  };
  const getResponseDate = (responseDate: any): string => {
    if (!isNullOrEmpty(responseDate)) {
      const rDate: string = responseDate;
      return getJalaliDate(rDate);
    }
    return '';
  };

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
                    <span>{comment}</span>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('prescription.sendDate')}
                      body={!isNullOrEmpty(sendDate) && getJalaliDate(sendDate)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('countryDivision.city')}
                      body={contryDivisionName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('general.expireDate')}
                      body={
                        !isNullOrEmpty(expireDate) && getJalaliDate(expireDate)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('prescription.responseDate')}
                      body={getResponseDate(responseDate)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextWithTitle title={t('general.state')} body={getPrescriptionState()} />
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

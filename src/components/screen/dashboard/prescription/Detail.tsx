import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
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
import noImage from './noImage.jpg';


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
  const jwtData = new JwtData();
  const pharmacyName = jwtData.userData.pharmacyName
  const { t } = useTranslation();
  // const getPrescriptionState = (): any => {
  //   const responses = prescriptionResponse.filter((i: any) => {
  //     return i.pharmacy.name === pharmacyName;
  //   });
  //   const thisState =
  //     PrescriptionResponseStateEnum[
  //       responses.length > 0 ? responses[0].state : 5
  //     ];
  //   return (
  //     <span
  //       style={{
  //         color:
  //           thisState ==
  //           PrescriptionResponseStateEnum[PrescriptionResponseStateEnum.Accept]
  //             ? ColorEnum.Green
  //             : ColorEnum.Gray,
  //       }}
  //     >
  //       {!isNullOrEmpty(prescriptionResponse) &&
  //         t(`PrescriptionResponseStateEnum.${thisState}`)}
  //     </span>
  //   );
  // };

  const [thisState, setThisState] =
    useState<any>(PrescriptionResponseStateEnum.Waiting)
  useEffect(() => {
    const responses = prescriptionResponse.filter((i: any) => {
      return i.pharmacy.name === pharmacyName;
    });
    setThisState(
      responses.length > 0
        ? responses[0].state
        : 5 // Waiting -- Unknown
    )
  }, [prescriptionResponse, prescriptionResponse.length])

  const [stateLabelBackground, setStateLabelBackground] = useState<any>(ColorEnum.LiteBack)
  const [stateLabelBody, setStateLabelBody] = useState('منتظر پاسخ شما')
  useEffect(() => {
    setStateLabelBackground(
      thisState != PrescriptionResponseStateEnum.Waiting
        ? thisState == PrescriptionResponseStateEnum.Accept
          ? ColorEnum.LightGreen3
          : ColorEnum.White
        : ColorEnum.LightGreen2
    )
    setStateLabelBody(
      t('PrescriptionResponseStateEnum.' +
        PrescriptionResponseStateEnum[thisState])
    )
  }, [thisState])

  const getResponseDate = (responseDate: any): string => {
    if (!isNullOrEmpty(responseDate)) {
      const rDate: string = responseDate;
      return getJalaliDate(rDate);
    }
    return '';
  };

  const addDefaultSrc = (ev: any): void => {
    ev.target.src = noImage;
    ev.target.onerror = null;
  };

  return (
    <>
    <Grid item xs={12} spacing={0}>
      <Grid container spacing={2}>
        <Grid item style={{ textAlign: 'center' }} xs={4}>
          <Grid xs={12} item>
            تصویر نسخه
          </Grid>
          <Grid xs={12} item>
        
              <img
                onError={addDefaultSrc}
                style={{ height: '80px', width: '80px', margin: '5px' }}
                src={'https://api.daroog.org/api/File/GetFile?key=' + fileKey}
              />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            spacing={1}
            style={{ paddingRight: 8, borderRight: '1px solid #f80501' }}
          >
            <Grid item xs={12}>
              <TextWithTitle
                title={'شماره پیگیری'}
                body={id || t('general.undefined')}
              />
            </Grid>
            <Grid item xs={12}>
            <TextWithTitle
                      title={t('prescription.sendDate')}
                      body={!isNullOrEmpty(sendDate) && getJalaliDate(sendDate)}
                    />
              {/* <TextWithTitle
                title={'اسامی داروها'}
                body={
                  <div onClick={(): void => toggleIsOpenModal(comment)}>
                    {(comment &&
                      (comment.length > 15
                        ? comment.substring(0, 15) + '...'
                        : comment)) ||
                      t('general.undefined')}
                  </div>
                }
              /> */}
            </Grid>
            <Grid item xs={ 12 } style={ { background: stateLabelBackground } }>
              <TextWithTitle title={ t('general.state') } body={ stateLabelBody } />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </>

  );
};

export default Detail;

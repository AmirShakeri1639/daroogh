import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Grid,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Modal } from '../../../../public';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarTimes, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ColorEnum, TextMessage } from '../../../../../enum';
import { BackDrop, TextLine } from '../../../../public';
import { useClasses } from '../../classes';
import moment from 'jalali-moment';
import { useQuery } from 'react-query';
import { EmploymentApplication as presApi } from '../../../../../services/api';
import { EmpApplicationDataInterface } from 'interfaces/EmploymentApplicationInterface';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';

const { detail } = new presApi();
const CardContainer: React.FC<EmpApplicationDataInterface> = (props) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpenBackDrop] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data: dataApi, refetch } = useQuery(
    ['getEmpApplicationDetail', props.data.id],
    () => detail(props.data.id),
    { enabled: false }
  );
  const toggleIsOpenModal = (): void => {
    if (!isOpenModal) {
      refetch();
    }

    setIsOpenModal((v) => !v);
  };
  const { paper } = useClasses();
  const { data, formHandler, toggleEditModal } = props;

  const { sendDate, suggestedJobPositionStr, id, resumeFileKey, cancelDate } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };

  return (
    <Paper elevation={1} style={{ paddingBottom: 4 }}>
      <Grid container xs={12} spacing={0}>
        <Grid
          item
          xs={12}
          style={{
            marginRight: 16,
            marginTop: 16,
            padding: '0 6px',
            borderRight: `2px solid ${ColorEnum.Borders}`,
            height: '40px',
            backgroundColor: ColorEnum.LiteBack,
            paddingTop: '8px',
            marginBottom: theme.spacing(1),
          }}
        >
          {cancelDate && (
            <TextWithTitle
              title={t('peopleSection.cancelDateText')}
              body={moment(cancelDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')}
            />
          )}
          {!cancelDate && (
            <TextWithTitle title={t('peopleSection.requestState')} body={t('general.active')} />
          )}
        </Grid>

        <Grid item xs={12}>
          <Detail
            resumeFileKey={resumeFileKey}
            onClick={toggleIsOpenModal}
            id={id}
            sendDate={sendDate}
            cancelDate={cancelDate}
            suggestedJobPositionStr={suggestedJobPositionStr}
          />
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid
            item
            container
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8,
              paddingRight: 8,
            }}
            xs={12}
          >
            <Grid xs={6}>
              {resumeFileKey && (
                <a
                  style={{ color: 'blue', fontSize: '12px', textDecoration: 'none' }}
                  onClick={(e: any): any => {
                    e.stopPropagation();
                  }}
                  download=""
                  href={'https://api.daroog.org/api/File/GetFile?key=' + resumeFileKey}
                >
                  {t('peopleSection.resumeDownload')}
                </a>
              )}
            </Grid>
            <Grid xs={12} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              {!cancelDate && (
                <Button
                  onClick={(): Promise<any> => removeHandler(id)}
                  style={{ color: 'red', fontSize: '12px' }}
                >
                  حذف
                </Button>
              )}
              <Button onClick={toggleIsOpenModal} style={{ color: 'green', fontSize: '12px' }}>
                جزئیات
              </Button>
              <Button
                onClick={(): void => toggleEditModal(data)}
                style={{ color: 'green', fontSize: '12px' }}
              >
                ویرایش
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={isOpenModal}
        onClose={toggleIsOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('peopleSection.detail')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {!dataApi && (
              <Grid item xs={12}>
                <Paper className={paper}>{t('peopleSection.noAnswer')}</Paper>
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              {dataApi && (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.gender')}
                      body={dataApi.genderStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.maritalStatus')}
                      body={dataApi.maritalStatusStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.readingPrescriptionCertificate')}
                      body={dataApi.readingPrescriptionCertificateStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.gradeOfReadingPrescriptionCertificate')}
                      body={dataApi.gradeOfReadingPrescriptionCertificate || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.workExperienceYear')}
                      body={dataApi.workExperienceYear || t('general.undefined')}
                      suffix={'سال'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.suggestedWorkShift')}
                      body={dataApi.suggestedWorkShiftStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.pharmaceuticalSoftwareSkill')}
                      body={dataApi.pharmaceuticalSoftwareSkillStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.computerSkill')}
                      body={dataApi.computerSkillStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.foreignLanguagesSkill')}
                      body={dataApi.foreignLanguagesSkillStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.suggestedJobPosition')}
                      body={dataApi.suggestedJobPositionStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.education')}
                      body={dataApi.educationStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.hasGuarantee')}
                      body={dataApi.hasGuaranteeStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.countryDivisionCode')}
                      body={dataApi.countryDivisionStr || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.previousWorkplace')}
                      body={dataApi.previousWorkplace || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.previousWorkplacePhone')}
                      body={dataApi.previousWorkplacePhone || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.landlinePhone')}
                      body={dataApi.landlinePhone || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextWithTitle
                      title={t('peopleSection.address')}
                      body={dataApi.address || t('general.undefined')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextWithTitle
                      title={t('peopleSection.descriptions')}
                      body={dataApi.descriptions || t('general.undefined')}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleIsOpenModal} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

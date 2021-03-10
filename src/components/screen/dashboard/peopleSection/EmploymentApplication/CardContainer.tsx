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
} from '@material-ui/core';
import { Modal } from '../../../../public';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarTimes,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { ColorEnum, TextMessage } from '../../../../../enum';
import { BackDrop, TextLine } from '../../../../public';
import { useClasses } from '../../classes';
import moment from 'jalali-moment';
import { useQuery } from 'react-query';
import { EmploymentApplication as presApi } from '../../../../../services/api';
import { EmpApplicationDataInterface } from 'interfaces/EmploymentApplicationInterface';
import { useTranslation } from 'react-i18next';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';

const useStyle = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(1, 1, 2),
      borderRadius: 10,
    },
    redTrash: {
      color: '#ff0000',
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2, 3),
      width: 500,
      height: 600,
    },
    buttonContainer: {
      textAlign: 'right',
      '& button:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);
const { detail } = new presApi();
const CardContainer: React.FC<EmpApplicationDataInterface> = (props) => {
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
  const { faIcons, spacingVertical1, paper } = useClasses();
  const { root, redTrash, modalContainer, buttonContainer } = useStyle();
  const { data, formHandler } = props;

  const {
    sendDate,
    suggestedJobPositionStr,
    id,
    resumeFileKey,
    cancelDate,
  } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };

  return (
    <Paper elevation={1}>
      <Grid container xs={12} spacing={3}>
        {cancelDate && (
          <Grid item xs={12}>
            <TextWithTitle
              title={t('peopleSection.cancelDateText')}
              body={moment(cancelDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Detail
            resumeFileKey={resumeFileKey}
            onClick={toggleIsOpenModal}
            id={id}
            sendDate={sendDate}
            cancelDate={cancelDate}
            suggestedJobPositionStr={suggestedJobPositionStr}
          />
          <Grid item xs={12} style={{ padding: 2 }}>
            <Divider />
          </Grid>

          {!cancelDate && (
            <Grid  justify="flex-end" container xs={12}>
              <Button
                onClick={(): Promise<any> => removeHandler(id)}
                style={{ color: 'green', fontSize: '14px' }}
              >
                حذف
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={isOpenModal}
        onClose={toggleIsOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('peopleSection.detail')}
        </DialogTitle>
        <DialogContent>
          <div className={modalContainer}>
            <Grid container spacing={1}>
              {!dataApi && (
                <Grid item xs={12} sm={12}>
                  <Paper className={paper}>{t('peopleSection.noAnswer')}</Paper>
                </Grid>
              )}
              <Grid item xs={12} sm={12}>
                {dataApi && (
                  <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    m={2}
                    p={2}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.gender')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.genderStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.maritalStatus')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.maritalStatusStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.readingPrescriptionCertificate')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.readingPrescriptionCertificateStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t(
                            'peopleSection.gradeOfReadingPrescriptionCertificate'
                          )}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.gradeOfReadingPrescriptionCertificate}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.workExperienceYear')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.workExperienceYear}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.suggestedWorkShift')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.suggestedWorkShiftStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.pharmaceuticalSoftwareSkill')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.pharmaceuticalSoftwareSkillStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.computerSkill')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.computerSkillStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.foreignLanguagesSkill')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.foreignLanguagesSkillStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.suggestedJobPosition')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.suggestedJobPositionStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.education')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.educationStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.hasGuarantee')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.hasGuaranteeStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.countryDivisionCode')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.countryDivisionStr}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.previousWorkplace')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.previousWorkplace}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.previousWorkplacePhone')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.previousWorkplacePhone}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.landlinePhone')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.landlinePhone}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.address')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.address}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {t('peopleSection.descriptions')}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.descriptions}</Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleIsOpenModal} color="primary">
            {t('peopleSection.descriptions')}
          </Button>
        </DialogActions>
      </Dialog>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

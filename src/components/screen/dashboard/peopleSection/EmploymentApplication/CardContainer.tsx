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
} from '@material-ui/core';
import { Modal } from '../../../../public';
import Detail from './Detail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarTimes, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ColorEnum, TextMessage } from '../../../../../enum';
import { BackDrop, TextLine } from '../../../../public';
import { useClasses } from '../../classes';
import moment from 'moment';
import { useQuery } from 'react-query';
import { EmploymentApplication as presApi } from '../../../../../services/api';
import { EmpApplicationDataInterface } from 'interfaces/EmploymentApplicationInterface';

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

  const { sendDate, suggestedJobPositionStr, id, resumeFileKey, cancelDate } = data;

  const removeHandler = async (_id: number): Promise<any> => {
    if (window.confirm(TextMessage.REMOVE_TEXT_ALERT)) {
      await formHandler(_id);
    }
  };

  return (
    <Paper className={root} elevation={1}>
      <Grid container spacing={1}>
        {cancelDate && (
          <Grid item xs={12} className={spacingVertical1}>
            <TextLine
              backColor={ColorEnum.White}
              rightText={
                <>
                  <FontAwesomeIcon icon={faCalendarTimes} size="lg" className={faIcons} />
                  {'کنسل شده در تاریخ : '}
                </>
              }
              leftText={moment(cancelDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD')}
            />
          </Grid>
        )}
        {!cancelDate && (
          <Grid item xs={12} className={spacingVertical1}>
            <Grid justify="flex-end" container spacing={1}>
              <Grid item xs={1}>
                <FontAwesomeIcon
                  onClick={toggleIsOpenModal}
                  icon={faEdit}
                  size="lg"
                  className={`${redTrash} cursor-pointer`}
                />
              </Grid>
              <Grid item xs={1}>
                <FontAwesomeIcon
                  onClick={(): Promise<any> => removeHandler(id)}
                  icon={faTrashAlt}
                  size="lg"
                  className={`${redTrash} cursor-pointer`}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Detail
          resumeFileKey={resumeFileKey}
          id={id}
          sendDate={sendDate}
          cancelDate={cancelDate}
          suggestedJobPositionStr={suggestedJobPositionStr}
        />
      </Grid>
      <Dialog
        open={isOpenModal}
        onClose={toggleIsOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'جزییات'}</DialogTitle>
        <DialogContent>
          <div className={modalContainer}>
            <Grid container spacing={1}>
              {!dataApi && (
                <Grid item xs={12} sm={12}>
                  <Paper className={paper}>پاسخی وجود ندارد</Paper>
                </Grid>
              )}
              <Grid item xs={12} sm={12}>
                {dataApi && (
                  <Box bgcolor="primary.main" color="primary.contrastText" m={2} p={2}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>جنسیت</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.genderStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>وضعیت تاهل</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.maritalStatusStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>گواهی نسخه خوانی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.readingPrescriptionCertificateStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>نمره مدرک نسخه خوانی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>
                          {dataApi.gradeOfReadingPrescriptionCertificate}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>سابقه کار</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.workExperienceYear}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>شیفت پیشنهادی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.suggestedWorkShiftStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>تسلط به نرم افزارهای دارویی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.pharmaceuticalSoftwareSkillStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>میزان تسلط به کامپیوتر</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.computerSkillStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>آشنایی با زبان خارجی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.foreignLanguagesSkillStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>سمت پیشنهادی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.suggestedJobPositionStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>میزان تحصیلات</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.educationStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>وثیقه</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.hasGuaranteeStr}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>محدوده جغرافیائی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.countryDivisionCode}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>محل کار قبلی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.previousWorkplace}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>شماره تماس محل کار قبلی</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.previousWorkplacePhone}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>تلفن ثابت</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.landlinePhone}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>آدرس</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>{dataApi.address}</Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper className={paper}>توضیحات</Paper>
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
            بستن
          </Button>
        </DialogActions>
      </Dialog>

      <BackDrop isOpen={isOpenBackDrop} />
    </Paper>
  );
};

export default CardContainer;

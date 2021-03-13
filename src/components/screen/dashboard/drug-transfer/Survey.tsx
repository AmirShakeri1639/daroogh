import {
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  MobileStepper,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { default as MatButton } from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { theme } from 'RTL';
import { SaveSurvey } from 'model/SaveSurvey';
import {
  GetQuestionGroupOfExchangeInterface,
  Question,
  QuestionOptions,
} from 'interfaces/GetQuestionGroupOfExchangeInterface';
import { errorHandler, sweetAlert } from 'utils';
import { useMutation } from 'react-query';
import routes from 'routes';
import { useHistory, useLocation } from 'react-router-dom';
import { Rating } from '@material-ui/lab';
import PharmacyDrug from 'services/api/PharmacyDrug';
import queryString from 'query-string';
import { getDate } from 'date-fns';

const style = makeStyles((theme) =>
  createStyles({
    actionContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 5,
      width: '100%',
    },
    cancelButton: {
      width: '100%',
    },
    confirmButton: {
      width: '100%',
    },
    fullRow: {
      width: '100%',
      marginBottom: 5,
    },
    cancelButton4: {
      width: '50%',
      marginRight: 10,
    },
    confirmButton4: {
      width: '50%',
      marginLeft: 10,
    },
    pharmacyInfoStyle: {
      flexGrow: 1,
      maxWidth: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        width: 600,
      },
    },
    questionHeader: {
      display: 'grid',
      textAlign: 'center',
      height: 50,
      flexDirection: 'column',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    stickySurvey: {
      position: 'sticky',
      margin: 0,
      padding: 10,
      paddingTop: 0,
      top: 60,
      zIndex: 999,
    },
  })
);

const Survey: React.FC = () => {
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { questionHeader } = style();
  const [surveyInput, setSurveyInput] = useState<SaveSurvey>(new SaveSurvey());
  const [openSurvayModal, setOpenSurvayModal] = React.useState(true);
  const [activeQuestionStep, setActiveQuestionStep] = React.useState(0);
  const handleNextQuestion = (): any => {
    setActiveQuestionStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBackQuestion = (): any => {
    setActiveQuestionStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [getQuestions, setQuestions] = useState<
    GetQuestionGroupOfExchangeInterface | undefined
  >(undefined);

  const [questionGroupId, serQuestionGroupId] = useState<number>(0);

  const { desktop } = routes;
  const history = useHistory();

  const location = useLocation();
  const params = queryString.parse(location.search);

  const [exchangeId, setExchangeId] = React.useState<number>(0);

  React.useEffect(() => {
    const xId = params.exchangeId == null ? 0 : +params.exchangeId;
    // setExchangeId(xId);
    (async (): Promise<void> => {
      await handleGetQuestionGroupOfExchange(xId);
    })();
  }, []);

  const { saveSurvey, getQuestionGroupOfExchange } = new PharmacyDrug();

  const [_saveSurvey, { isLoading: isLoadingSaveSurvey }] = useMutation(
    saveSurvey,
    {
      onSuccess: async (res: any) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.message,
          });
          history.push(desktop);
        }
      },
    }
  );

  const handleSaveSurvey = async (): Promise<any> => {
    try {
      if (params.exchangeId === null) return;
      var input = surveyInput;
      input.exchangeID = +params.exchangeId;
      input.questionGroupID = questionGroupId;
      await _saveSurvey(input);
    } catch (e) {
      errorHandler(e);
    }
    setOpenSurvayModal(false);
  };

  const handleGetQuestionGroupOfExchange = async (
    xId: number
  ): Promise<any> => {
    try {
      if (xId === 0) return;
      const res = await getQuestionGroupOfExchange(xId); // for Test = 10180
      const response: GetQuestionGroupOfExchangeInterface = res.data.data;
      setQuestions(response);
      serQuestionGroupId(response.question[0].questionGroupID);
      setOpenSurvayModal(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  const syrveyQuestion = (question: Question): JSX.Element => {
    const input = surveyInput;
    let element: JSX.Element = <></>;
    switch (question.type) {
      case 2:
        element = (
          <div style={{ textAlign: 'center' }}>
            <Rating
              value={
                surveyInput.surveyAnswer.find(
                  (x) => x.questionID === question.id
                )?.barom
              }
              precision={1}
              onChange={(event: any, newValue: any): any => {
                const i = input.surveyAnswer.findIndex(
                  (x) => x.questionID === question.id
                );
                if (i !== -1) {
                  input.surveyAnswer.splice(i, 1);
                }
                input.surveyAnswer.push({
                  questionID: question.id,
                  barom: newValue,
                });
                setSurveyInput({ ...input });
              }}
            />
          </div>
        );
        break;
      case 4:
        element = (
          <>
            {question.questionOptions.map(
              (item: QuestionOptions, index: number) => {
                return (
                  <FormControlLabel
                    key={index}
                    style={{ width: '100%' }}
                    control={
                      <Checkbox
                        checked={
                          surveyInput.surveyAnswer.findIndex(
                            (x) => x.optionID === item.id
                          ) !== -1
                        }
                        value={item.id}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ): any => {
                          const i = input.surveyAnswer.findIndex(
                            (x) => x.optionID === +event.target.value
                          );
                          if (i === -1)
                            input.surveyAnswer.push({
                              questionID: question.id,
                              optionID: item.id,
                            });
                          else input.surveyAnswer.splice(i, 1);
                          setSurveyInput({ ...input });
                        }}
                        color="primary"
                      />
                    }
                    label={item.title}
                  />
                );
              }
            )}
          </>
        );
        break;
      case 5:
        element = (
          <TextField
            label="توضیحات"
            required
            style={{ width: '100%' }}
            multiline={true}
            rows={5}
            size="small"
            variant="outlined"
            value={
              surveyInput.surveyAnswer.find((x) => x.questionID === question.id)
                ?.descriptiveAnswer
            }
            onChange={(e: any): void => {
              const i = input.surveyAnswer.findIndex(
                (x) => x.questionID === question.id
              );
              if (i !== -1) {
                input.surveyAnswer.splice(i, 1);
              }
              input.surveyAnswer.push({
                questionID: question.id,
                descriptiveAnswer: e.target.value,
              });
              setSurveyInput({ ...input });
            }}
          />
        );
      default:
        break;
    }
    return (
      <div style={{ height: 320, maxHeight: 320, width: 550, maxWidth: 550 }}>
        {element}
      </div>
    );
  };

  const survayModal = (): JSX.Element => (
    <Dialog
      fullScreen={fullScreen}
      open={openSurvayModal}
      closeAfterTransition={true}
      onClose={() => {
        setOpenSurvayModal(false);
      }}
    >
      <DialogTitle
        style={{ borderBottom: '1px silver solid', textAlign: 'center' }}
      >
        {'ثبت نظر (نظرسنجی)'}
      </DialogTitle>
      <DialogContent>
        {getQuestions && (
          <>
            <Paper square elevation={0} className={questionHeader}>
              <Typography style={{ fontWeight: 'bold' }}>
                {getQuestions.question[activeQuestionStep].title}
              </Typography>
            </Paper>
            {syrveyQuestion(getQuestions.question[activeQuestionStep])}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {getQuestions && (
              <MobileStepper
                steps={getQuestions.question.length}
                position="static"
                variant="text"
                style={{ backgroundColor: '#f1f1f1' }}
                activeStep={activeQuestionStep}
                nextButton={
                  <MatButton
                    size="small"
                    onClick={handleNextQuestion}
                    disabled={
                      activeQuestionStep === getQuestions.question.length - 1
                    }
                  >
                    بعدی
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </MatButton>
                }
                backButton={
                  <MatButton
                    size="small"
                    onClick={handleBackQuestion}
                    disabled={activeQuestionStep === 0}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    قبلی
                  </MatButton>
                }
              />
            )}
          </Grid>
        </Grid>
      </DialogActions>
      <DialogActions style={{ borderTop: '1px silver solid' }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <MatButton
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenSurvayModal(false);
                // history.push(desktop);
              }}
            >
              انصراف
            </MatButton>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'end' }}>
            <MatButton
              variant="contained"
              color="primary"
              onClick={async (): Promise<void> => {
                await handleSaveSurvey();
              }}
            >
              ذخیره
            </MatButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );

  return <>{openSurvayModal && getQuestions ? survayModal() : <></>}</>;
};

export default Survey;

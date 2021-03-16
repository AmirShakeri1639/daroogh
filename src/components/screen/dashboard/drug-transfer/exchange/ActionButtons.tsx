import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  MobileStepper,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ViewExchangeInterface } from '../../../../../interfaces/ViewExchangeInterface';
import Button from '../../../../public/button/Button';
import DrugTransferContext, { TransferDrugContextInterface } from '../Context';
import { default as MatButton } from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import errorHandler from '../../../../../utils/errorHandler';
import {
  Cancel,
  ConfirmOrNotExchange,
  Send,
} from '../../../../../model/exchange';
import { useMutation } from 'react-query';
import PharmacyDrug from '../../../../../services/api/PharmacyDrug';
import sweetAlert from '../../../../../utils/sweetAlert';
import Modal from '../../../../public/modal/Modal';
import ExchangeApprove from './ExchangeApprove';
import { useTranslation } from 'react-i18next';
import routes from '../../../../../routes';
import { useHistory } from 'react-router-dom';
import { PharmacyInfo } from '../../../../../interfaces/PharmacyInfo';
import { Map, TextLine } from '../../../../public';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ExCalculator from './ExCalculator';
import { theme } from '../../../../../RTL';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import {
  GetQuestionGroupOfExchangeInterface,
  Question,
  QuestionOptions,
} from '../../../../../interfaces/GetQuestionGroupOfExchangeInterface';
import { JsxEmit } from 'typescript';
import { Rating } from '@material-ui/lab';
import { SaveSurvey } from '../../../../../model/SaveSurvey';
import CircleLoading from '../../../../public/loading/CircleLoading';
import CircleBackdropLoading from '../../../../public/loading/CircleBackdropLoading';
//https://sweetalert2.github.io/
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const MySwal = withReactContent(Swal);

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

const ActionButtons = (): JSX.Element => {
  const { t } = useTranslation();
  const { desktop, survey } = routes;
  const history = useHistory();
  const {
    cancelButton,
    confirmButton,
    cancelButton4,
    confirmButton4,
    actionContainer,
    fullRow,
    pharmacyInfoStyle,
    questionHeader,
  } = style();
  const {
    activeStep,
    setActiveStep,
    exchangeStateCode,
    setShowApproveModalForm,
    viewExhcnage,
    setViewExchange,
    exchangeId,
    showApproveModalForm,
    is3PercentOk,
  } = useContext<TransferDrugContextInterface>(DrugTransferContext);
  const [comment, setComment] = useState<string>('');
  const [modalType, setModalType] = useState('');
  const [
    pharmacyInfoState,
    setPharmacyInfoState,
  ] = useState<PharmacyInfo | null>(null);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openApproveModal, setOpenApproveModal] = React.useState(false);

  const [isSelected, setIsSelected] = React.useState(false);

  const [isOpenCancelExchangeModal, setIsOpenCancelExchangeModal] = useState(
    false
  );
  const toggleIsOpenCancelExchangeModalForm = async (
    type: string
  ): Promise<void> => {
    setModalType(type);
    if (type !== 'approve') {
      await handleConfirmOrNotExchange(false);
      handleGetQuestionGroupOfExchange();
    } else {
      setIsOpenCancelExchangeModal((v) => !v);
    }
  };

  const [isRemoveExchangeModal, setIsRemoveExchangeModal] = useState(false);
  const toggleIsRemoveExchangeModalForm = (): void => {
    setIsRemoveExchangeModal((v) => !v);
  };

  const [isShowPharmacyInfoModal, setIsShowPharmacyInfoModal] = useState(false);
  const toggleIsShowPharmacyInfoModalForm = (): void => {
    setIsShowPharmacyInfoModal((v) => !v);
  };

  const [nameState, setNameState] = useState('');

  const {
    cancelExchange,
    confirmOrNotExchange,
    removeExchange,
    pharmacyInfo,
    send,
    getQuestionGroupOfExchange,
    saveSurvey,
    getViewExchange,
  } = new PharmacyDrug();

  const [surveyInput, setSurveyInput] = useState<SaveSurvey>(new SaveSurvey());
  const [openSurvayModal, setOpenSurvayModal] = React.useState(false);
  const [activeQuestionStep, setActiveQuestionStep] = React.useState(0);
  const handleNextQuestion = (): any => {
    setActiveQuestionStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackQuestion = (): any => {
    setActiveQuestionStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [getQuestions, setQuestions] = useState<
    GetQuestionGroupOfExchangeInterface
  >();

  const [questionGroupId, serQuestionGroupId] = useState<number>(0);

  const [_cancelExchange, { isLoading: isLoadingCancel }] = useMutation(
    cancelExchange,
    {
      onSuccess: async (res) => {
        if (res) {
          await sweetAlert({
            type: 'success',
            text: res.data.message,
          });
          history.push(desktop);
        }
      },
    }
  );

  const [_removeExchange, { isLoading: isLoadingRemoveExchange }] = useMutation(
    removeExchange,
    {
      onSuccess: async (res) => {
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

  const [
    _confirmOrNotExchange,
    { isLoading: isLoadingConfirmOrNotExchange },
  ] = useMutation(confirmOrNotExchange, {
    onSuccess: async (res) => {
      debugger;
      if (res) {
        await sweetAlert({
          type: 'success',
          text: res.data.message,
        });
        // history.push(desktop);
      }
    },
  });

  const [_saveSurvey, { isLoading: isLoadingSaveSurvey }] = useMutation(
    saveSurvey,
    {
      onSuccess: async (res) => {
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
      var input = surveyInput;
      input.exchangeID = exchangeId;
      input.questionGroupID = questionGroupId;
      await _saveSurvey(input);
    } catch (e) {
      errorHandler(e);
    }
    setOpenSurvayModal(false);
  };

  const handleGetQuestionGroupOfExchange = (): void => {
    // try {
    //   const res = await getQuestionGroupOfExchange(exchangeId); // for Test = 10180
    //   const response: GetQuestionGroupOfExchangeInterface = res.data.data;
    //   setQuestions(response);
    //   serQuestionGroupId(response.question[0].questionGroupID);
    //   setOpenSurvayModal(true);
    // } catch (error) {
    //   errorHandler(error);
    // }
    console.log('path', `${survey}?exchangeId=${exchangeId}`)
    history.push(`${survey}?exchangeId=${exchangeId}`);
  };

  const handleCancelExchange = async (): Promise<any> => {
    const inputmodel = new Cancel();
    inputmodel.exchangeID = exchangeId;
    inputmodel.comment = comment;
    try {
      var res = await sweetAlert({
        confirmButtonText: 'بله',
        cancelButtonText: 'خیر',
        showCancelButton: true,
        type: 'info',
        text: 'آیا اطمینان دارید؟',
      });
      if (res) await _cancelExchange(inputmodel);
      // await handleGetQuestionGroupOfExchange();
    } catch (e) {
      errorHandler(e);
    }
    // toggleIsOpenCancelExchangeModalForm(modalType);
  };

  const handleRemoveExchange = async (): Promise<any> => {
    try {
      await _removeExchange(exchangeId);
    } catch (e) {
      errorHandler(e);
    }
    toggleIsOpenCancelExchangeModalForm(modalType);
  };

  const getPharmacyInfo = async (): Promise<any> => {
    const res = await pharmacyInfo(exchangeId);
    const response: PharmacyInfo = res.data;
    setPharmacyInfoState(response);
  };

  const handlePharmacyInfo = async (): Promise<any> => {
    try {
      await getPharmacyInfo();
      toggleIsShowPharmacyInfoModalForm();
    } catch (e) {
      errorHandler(e);
    }
  };

  const handleConfirmOrNotExchange = async (
    isConfirm: boolean
  ): Promise<any> => {
    const inputmodel = new ConfirmOrNotExchange();
    inputmodel.exchangeID = exchangeId;
    inputmodel.isConfirm = isConfirm;
    try {
      let res = await _confirmOrNotExchange(inputmodel);
      if (viewExhcnage && viewExhcnage.state === 3) {
        setShowApproveModalForm(true);
      }
      if (isConfirm) toggleIsOpenCancelExchangeModalForm(modalType);
      if (isConfirm && res) {
        const viewExResult = await getViewExchange(exchangeId);
        const result: ViewExchangeInterface | undefined = viewExResult.data;
        if (result) setViewExchange(result);
        setShowApproveModalForm(true);
      }
    } catch (e) {
      errorHandler(e);
      toggleIsOpenCancelExchangeModalForm(modalType);
    }
  };

  const [_send, { isLoading: isLoadingSend }] = useMutation(send, {
    onSuccess: async (res) => {
      if (res) {
        history.push(desktop);
      }
    },
  });

  const handleSend = async (): Promise<any> => {
    const inputmodel = new Send();
    inputmodel.exchangeID = exchangeId;
    inputmodel.lockSuggestion = isSelected;
    setOpenApproveModal(false);
    try {
      await _send(inputmodel);
    } catch (e) {
      errorHandler(e);
    }
  };

  const handleChange = (event: any): any => {
    setIsSelected(event.target.checked);
  };

  const ShowApproveModal = (): JSX.Element => {
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openApproveModal}
        onClose={() => {
          setOpenApproveModal(false);
        }}
      >
        <DialogTitle>{'تایید نهایی'}</DialogTitle>
        <DialogContent>
          <ExCalculator exchange={viewExhcnage} full={false} />
          {is3PercentOk && (
            <DialogContentText>
              آیا می خواهید سبد انتخابی شما قفل باشد یا خیر؟
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSelected}
                      onChange={handleChange}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={isSelected ? 'بله' : 'خیر'}
                />
              </Grid>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <MatButton
            autoFocus
            onClick={() => {
              setOpenApproveModal(false);
            }}
            color="primary"
          >
            بستن
          </MatButton>
          <MatButton onClick={handleSend} color="primary" autoFocus>
            ارسال
          </MatButton>
        </DialogActions>
      </Dialog>
    );
  };

  const ShowPharmacyInfo = (): JSX.Element => {
    return (
      <Modal
        open={isShowPharmacyInfoModal}
        toggle={toggleIsShowPharmacyInfoModalForm}
      >
        <Card className={pharmacyInfoStyle}>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="اطلاعات داروخانه مقابل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsShowPharmacyInfoModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <span>نام داروخانه : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.name}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>آدرس : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.address}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>تلفن : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.telphon}
                </span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <span>موبایل : </span>
                <span style={{ fontWeight: 'bold' }}>
                  {pharmacyInfoState?.data.mobile}
                </span>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Card>
                  <CardContent style={{ textAlign: 'center' }}>
                    {pharmacyInfoState?.data.x && pharmacyInfoState?.data.y ? (
                      <Map
                        draggable={false}
                        defaultLatLng={[
                          pharmacyInfoState?.data.x,
                          pharmacyInfoState?.data.y,
                        ]}
                      />
                    ) : (
                      <span style={{ color: 'red' }}>
                        مختصات جغرافیایی این داروخانه ثبت نشده است
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}></Grid>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  const exchangeModalRemove = (): JSX.Element => {
    return (
      <Modal
        open={isRemoveExchangeModal}
        toggle={toggleIsRemoveExchangeModalForm}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title="حذف تبادل"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={toggleIsRemoveExchangeModalForm}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <div>
                <span>آیا از حذف تبادل اطمینان دارید؟</span>
              </div>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MatButton
                  onClick={async (): Promise<any> =>
                    await handleRemoveExchange()
                  }
                  variant="contained"
                  color="primary"
                  autoFocus
                >
                  بله
                </MatButton>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'left' }}>
                <MatButton
                  onClick={toggleIsRemoveExchangeModalForm}
                  variant="contained"
                  color="secondary"
                  autoFocus
                >
                  خیر
                </MatButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Modal>
    );
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
              onChange={(event, newValue): any => {
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
            onChange={(e): void => {
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

  const exchangeModalApproveCancel = (type: string): JSX.Element => {
    return (
      <Modal
        open={isOpenCancelExchangeModal}
        toggle={(): any => toggleIsOpenCancelExchangeModalForm(type)}
      >
        <Card>
          <CardHeader
            style={{ padding: 0, paddingRight: 10, paddingLeft: 10 }}
            title={type === 'approve' ? 'تایید تبادل' : 'لغو تبادل'}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                style={{ marginTop: 10 }}
                aria-label="settings"
                onClick={(): any => toggleIsOpenCancelExchangeModalForm(type)}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              {type === 'approve' ? (
                <div>
                  <span>آیا از انجام تبادل اطمینان دارید؟</span>
                </div>
              ) : (
                <div>
                  <span>لطفا در صورت تمایل علت لغو تبادل را توضیح دهید</span>
                  <TextField
                    style={{ width: '100%', marginTop: 10, fontSize: 10 }}
                    label="توضیحات"
                    multiline
                    rows={5}
                    variant="outlined"
                  />
                </div>
              )}
            </Grid>
          </CardContent>
          <CardActions>
            {type === 'approve' ? (
              <MatButton
                onClick={async (): Promise<any> =>
                  await handleConfirmOrNotExchange(true)
                }
                variant="contained"
                color="primary"
                autoFocus
              >
                تایید
              </MatButton>
            ) : (
              <MatButton
                onClick={async (): Promise<any> => {
                  await handleConfirmOrNotExchange(false);
                  handleGetQuestionGroupOfExchange();
                }}
                variant="contained"
                color="primary"
                autoFocus
              >
                لغو تبادل
              </MatButton>
            )}
          </CardActions>
        </Card>
      </Modal>
    );
  };

  let element: JSX.Element = <></>;
  if (!viewExhcnage) return element;
  const vx: ViewExchangeInterface | undefined = viewExhcnage;
  if (vx) {
    let state = vx.state;
    // The First Side ==========================================
    if (vx.currentPharmacyIsA) {
      if (state === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={async (): Promise<any> => await handleCancelExchange()}
            >
              لغو درخواست
            </Button>
          </>
        );

      if (state === 3)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('approve');
              }}
            >
              تایید و پرداخت
            </Button>

            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('cancel');
              }}
            >
              عدم تایید
            </Button>
          </>
        );

      if (state === 4)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
          </>
        );

      if (state === 10 || state === 8)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
          </>
        );

      if (state === 9)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
          </>
        );

      if (state === 1 && activeStep === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={(): void => setOpenApproveModal(true)}
            >
              {t('general.sendExchange')}
            </Button>
          </>
        );
      // The Second Side ==========================================
    } else {
      if (state > 10) state = state - 10;
      if (state === 2)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('approve');
              }}
            >
              تایید و پرداخت
            </Button>

            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="red"
              onClick={(): any => {
                toggleIsOpenCancelExchangeModalForm('cancel');
              }}
            >
              عدم تایید
            </Button>
          </>
        );

      if (state === 4)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
          </>
        );

      if (state === 9 || state === 10)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>
          </>
        );
      if (state === 8)
        element = (
          <>
            <>{element}</>
            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="blue"
              onClick={handlePharmacyInfo}
            >
              نمایش آدرس
            </Button>

            <Button
              className={fullRow}
              type="button"
              variant="outlined"
              color="green"
              onClick={(): any => {
                setShowApproveModalForm(true);
              }}
            >
              پرداخت
            </Button>
          </>
        );
    }
  }

  element = (
    <>
      <>{element}</>
      <Button
        className={fullRow}
        type="button"
        variant="outlined"
        color="bluegreen"
        onClick={(): any => history.push(desktop)}
      >
        برگشت به کارتابل
      </Button>
      {/* <Button
        className={fullRow}
        type="button"
        variant="outlined"
        color="bluegreen"
        onClick={async (): Promise<any> => await handleGetQuestionGroupOfExchange()}
      >
        نظرسنجی
      </Button> */}
      {isOpenCancelExchangeModal && exchangeModalApproveCancel(modalType)}
      {isRemoveExchangeModal && exchangeModalRemove()}
      {showApproveModalForm && <ExchangeApprove />}
      {isShowPharmacyInfoModal && <ShowPharmacyInfo />}
      {openApproveModal && <ShowApproveModal />}
      {/* {openSurvayModal && survayModal()} */}
    </>
  );

  return (
    <div className={actionContainer}>
      {element} <CircleBackdropLoading isOpen={isLoadingSend} />
    </div>
  );
};

export default ActionButtons;

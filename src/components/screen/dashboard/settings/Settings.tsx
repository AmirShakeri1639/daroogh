import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Container, createStyles, Divider, FormControlLabel, Grid,
  makeStyles, Paper, Switch, TextField, Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ActionInterface, SettingsInterface } from '../../../../interfaces';
import { Settings } from '../../../../services/api';
import { ThreePartDatePicker } from '../../../public';
import routes from '../../../../routes';
import {
  errorHandler,
  errorSweetAlert, successSweetAlert, warningSweetAlert
} from '../../../../utils';
import { useMutation } from 'react-query';
import changeProfilePic from '../user/changeProfilePic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


export const useClasses = makeStyles((theme) => createStyles({
  parent: {
    paddingTop: theme.spacing(2),
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  divider: {
    width: '100%',
    margin: '1em 0',
  },
  spacing1: {
    margin: theme.spacing(1)
  },
  spacing3: {
    margin: theme.spacing(3)
  },
  padding3: {
    padding: theme.spacing(3),
  },
  formItem: {
    display: 'flex',
    justifySelf: 'stretch',
    margin: theme.spacing(1)
  },
  rootFull: {
    flexGrow: 1,
    margin: theme.spacing(1)
  },
  longItem: {
    width: '75%',
  },
  centerItem: {
    display: 'flex',
    margin: 'auto'
  },
}));

const initialState: SettingsInterface = {
  passwordMinLength: 0,
  passwordRequiredLetter: false,
  passwordRequiredSymbol: false,
  diffrenceAllowPercentageInExchange: 0,
  smsNumber: '',
  smsAPIkey: '',
  notificationAPIkey: '',
  notificationSenderkey: '',
  applicationUrl: '',
  messageExpireDayDefault: 0,
  exchangeDeadline: 0,
  debtAmountAllow: 0,
  debtTimeAllow: 0,
  ticketExireDuration: 0,
  surveyTime: 0,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'passwordMinLength':
      return {
        ...state,
        passwordMinLength: value
      };
    case 'passwordRequiredLetter':
      return {
        ...state,
        passwordRequiredLetter: value
      };
    case 'passwordRequiredSymbol':
      return {
        ...state,
        passwordRequiredSymbol: value
      };
    case 'diffrenceAllowPercentageInExchange':
      return {
        ...state,
        diffrenceAllowPercentageInExchange: value
      };
    case 'smsNumber':
      return {
        ...state,
        smsNumber: value
      };
    case 'smsAPIkey':
      return {
        ...state,
        smsAPIkey: value
      };
    case 'notificationAPIkey':
      return {
        ...state,
        notificationAPIkey: value
      };
    case 'notificationSenderkey':
      return {
        ...state,
        notificationSenderkey: value
      };
    case 'applicationUrl':
      return {
        ...state,
        applicationUrl: value
      };
    case 'messageExpireDayDefault':
      return {
        ...state,
        messageExpireDayDefault: value
      };
    case 'exchangeDeadline':
      return {
        ...state,
        exchangeDeadline: value
      };
    case 'debtAmountAllow':
      return {
        ...state,
        debtAmountAllow: value
      };
    case 'debtTimeAllow':
      return {
        ...state,
        debtTimeAllow: value
      };
    case 'ticketExireDuration':
      return {
        ...state,
        ticketExireDuration: value
      };
    case 'surveyTime':
      return {
        ...state,
        surveyTime: value
      };
    case 'full':
      return {
        ...state,
        ...value
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
      break;
  }
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    parent,
    addButton,
    spacing3,
    padding3,
    formItem,
    rootFull,
    longItem,
    centerItem,
    divider,
  } = useClasses();

  const { get, save } = new Settings();

  useEffect(() => {
    async function getData(): Promise<any> {
      const data = await get();
      dispatch({ type: 'full', value: data });
    }

    getData();
  }, [])

  const [_save] = useMutation(save, {
    onSuccess: async () => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(t('alert.successfulSave'));
    }
  })

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    try {
      const {
        passwordMinLength, passwordRequiredLetter, passwordRequiredSymbol,
        diffrenceAllowPercentageInExchange, smsNumber, smsAPIkey,
        notificationAPIkey, notificationSenderkey, applicationUrl,
        messageExpireDayDefault, exchangeDeadline, debtAmountAllow,
        debtTimeAllow, ticketExireDuration, surveyTime,
      } = state;
      await _save({
        passwordMinLength, passwordRequiredLetter, passwordRequiredSymbol,
        diffrenceAllowPercentageInExchange, smsNumber, smsAPIkey,
        notificationAPIkey, notificationSenderkey, applicationUrl,
        messageExpireDayDefault, exchangeDeadline, debtAmountAllow,
        debtTimeAllow, ticketExireDuration, surveyTime,
      });
    } catch (e) {
      await errorSweetAlert(t('error.save'));
      errorHandler(e);
    }
  };

  const settingsForm = (): JSX.Element => {
    return (
      <Container maxWidth="lg" className={ parent }>
        <Paper className={ padding3 }>
          <Typography component="h2">
            <h2>{ t('settings.settings') }</h2>
          </Typography>
          <Divider />
          <form autoComplete="off" className={ rootFull } onSubmit={ submit }>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <h3>{ t('settings.password') }</h3>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.passwordMinLength.length < 1 && showError }
                  label={ t('settings.passwordMinLength') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.passwordMinLength }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'passwordMinLength', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.ticketExireDuration.length < 1 && showError }
                  label={ t('settings.ticketExireDuration') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.ticketExireDuration }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'ticketExireDuration', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ state.passwordRequiredLetter }
                      onChange={ (e): void =>
                        dispatch({
                          type: 'passwordRequiredLetter',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={ t('settings.passwordRequiredLetter') }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ state.passwordRequiredSymbol }
                      onChange={ (e): void =>
                        dispatch({
                          type: 'passwordRequiredSymbol',
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label={ t('settings.passwordRequiredSymbol') }
                />
              </Grid>
              <Divider className={ divider } />
            </Grid>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <h3>{ t('settings.exchange') }</h3>
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } >
                <TextField
                  error={ state.diffrenceAllowPercentageInExchange.length < 1 && showError }
                  label={ t('settings.diffrenceAllowPercentageInExchange') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.diffrenceAllowPercentageInExchange }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({
                      type: 'diffrenceAllowPercentageInExchange',
                      value: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } >
                <TextField
                  error={ state.exchangeDeadline.length < 1 && showError }
                  label={ t('settings.exchangeDeadline') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.exchangeDeadline }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'exchangeDeadline', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } >
                <TextField
                  error={ state.debtAmountAllow.length < 1 && showError }
                  label={ t('settings.debtAmountAllow') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.debtAmountAllow }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'debtAmountAllow', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } >
                <TextField
                  error={ state.debtTimeAllow.length < 1 && showError }
                  label={ t('settings.debtTimeAllow') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.debtTimeAllow }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'debtTimeAllow', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 8 } >
                <TextField
                  error={ state.surveyTime.length < 1 && showError }
                  label={ t('settings.surveyTime') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.surveyTime }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'surveyTime', value: e.target.value })
                  }
                />
              </Grid>
              <Divider className={ divider } />
            </Grid>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <h3>{ t('settings.message') }</h3>
              </Grid>
              <Grid item xs={ 12 } sm={ 4 } >
                <TextField
                  error={ state.messageExpireDayDefault.length < 1 && showError }
                  label={ t('settings.messageExpireDayDefault') }
                  required
                  type="number"
                  variant="outlined"
                  value={ state.messageExpireDayDefault }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'messageExpireDayDefault', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 8 } >
                <TextField
                  error={ state.applicationUrl.length < 1 && showError }
                  label={ t('settings.applicationUrl') }
                  variant="outlined"
                  value={ state.applicationUrl }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'applicationUrl', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.smsNumber.length < 1 && showError }
                  label={ t('settings.smsNumber') }
                  type="number"
                  variant="outlined"
                  value={ state.smsNumber }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'smsNumber', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.smsAPIkey.length < 1 && showError }
                  label={ t('settings.smsAPIkey') }
                  variant="outlined"
                  value={ state.smsAPIkey }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'smsAPIkey', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.notificationAPIkey.length < 1 && showError }
                  label={ t('settings.notificationAPIkey') }
                  variant="outlined"
                  value={ state.notificationAPIkey }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'notificationAPIkey', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } >
                <TextField
                  error={ state.notificationSenderkey.length < 1 && showError }
                  label={ t('settings.notificationSenderkey') }
                  variant="outlined"
                  value={ state.notificationSenderkey }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'notificationSenderkey', value: e.target.value })
                  }
                />
              </Grid>
              <Divider className={ divider } />
            </Grid>
            <Grid container spacing={ 3 }>
              {/* <div className={ spacing1 }>&nbsp;</div>
              <Divider /> */}
              {/* //////// SUBMIT //////////// */ }
              <Grid item xs={ 12 } className={ spacing3 }>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  className={ `${addButton} ${longItem} ${centerItem}` }
                >
                  <span>{ t('action.register') }</span>
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    )
  }

  return (
    settingsForm()
  )
}

export default Profile;

import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Container, createStyles, Divider, FormControlLabel, Grid,
  makeStyles, Paper, Switch, TextField, Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ActionInterface, ProfileInterface } from '../../../../interfaces';
import { User } from '../../../../services/api';
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
  avatarContainer: {
    cursor: 'pointer',
    display: 'block',
    position: 'relative',
    '&:hover $profileImageCamera': {
      zIndex: '1000',
      opacity: '.5',
    }
  },
  profileImageCamera: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60px',
    background: 'rgba(0,0,0,.3)',
    boxSizing: 'border-box',
    padding: '.5em',
    bottom: '5px',
    borderRadius: '.5em',
    opacity: '0',
    transition: 'all 1s ease-in-out',
  },
  profileImage: {
    borderRadius: '.5em',
    boxShadow: '0 0 3px',
    cursor: 'pointer',
    transition: 'all .5s ease-in-out',
    '&:hover': {
      filter: 'opacity(0.8) contrast(1.2)',
    },
  },
}));

const initialState: ProfileInterface | any = {
  id: 0,
  name: '',
  family: '',
  mobile: '',
  email: '',
  userName: '',
  nationalCode: '',
  birthDate: '',
  active: false,
  pharmacyName: '',
  pictureFileKey: '',
  isValidBirthDate: true,
  smsActive: true,
  notifActive: true,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value
      };
    case 'name':
      return {
        ...state,
        name: value
      };
    case 'family':
      return {
        ...state,
        family: value
      };
    case 'mobile':
      return {
        ...state,
        mobile: value
      };
    case 'email':
      return {
        ...state,
        email: value
      };
    case 'userName':
      return {
        ...state,
        userName: value
      };
    case 'nationalCode':
      return {
        ...state,
        nationalCode: value
      };
    case 'birthDate':
      return {
        ...state,
        birthDate: value
      };
    case 'active':
      return {
        ...state,
        active: value
      };
    case 'pharmacyName':
      return {
        ...state,
        pharmacyName: value
      };
    case 'pictureFileKey':
      return {
        ...state,
        pictureFileKey: value
      };
    case 'pharmacyID':
      return {
        ...state,
        pharmacyID: value
      };
    case 'isValidBirthDate':
      return {
        ...state,
        isValidBirthDate: value
      };
    case 'smsActive':
      return {
        ...state,
        smsActive: value
      };
    case 'notifActive':
      return {
        ...state,
        notifActive: value
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
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
  const { fileUrl } = routes;
  const isLoadingNewUser = false;

  const {
    parent,
    profileImage,
    addButton,
    spacing1,
    spacing3,
    padding3,
    formItem,
    rootFull,
    longItem,
    centerItem,
    profileImageCamera,
    avatarContainer,
  } = useClasses();

  const { profile, saveNewUser } = new User();

  useEffect(() => {
    async function getProfile(): Promise<any> {
      const data = await profile();
      dispatch({ type: 'full', value: data });
    }

    getProfile();
  }, [])

  const [_save] = useMutation(saveNewUser, {
    onSuccess: async () => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(t('alert.successfulSave'));
    }
  })

  const isFormValid = (): boolean => {
    const {
      name, family, nationalCode, mobile,
      userName, isValidBirthDate,
    } = state;

    return !(
      mobile.trim().length < 10 ||
      !isValidBirthDate ||
      name.trim().length < 2 ||
      family.trim().length < 2 ||
      userName.trim().length < 3 ||
      nationalCode.length !== 10
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (isFormValid()) {
      try {
        const {
          id, name, family, mobile, email, userName,
          active, nationalCode, birthDate, pharmacyID,
          smsActive, notifActive,
        } = state;
        await _save({
          id, name, family, mobile, email, userName,
          active, nationalCode, birthDate, pharmacyID,
          smsActive, notifActive,
        });
      } catch (e) {
        await errorSweetAlert(t('error.save'));
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
      setShowError(true);
    }
  };

  const profileForm = (): JSX.Element => {
    return (
      <Container maxWidth="lg" className={ parent }>
        <Paper className={ padding3 }>
          <Typography component="h2">
            <h2>{ t('user.profile') }</h2>
          </Typography>
          <Divider />
          <Grid container>
            <Grid item xs={ 12 } sm={ 4 } md={ 2 } className={ padding3 }>
              <label className={ avatarContainer }>
                <input
                  type='file'
                  style={ { display: 'none' } }
                  accept="image/jpeg"
                  id='profilePicUpload'
                  name='profilePicUpload'
                  onChange={ (e: any): void => {
                    e.preventDefault();
                    if (e.target.files.length > 0) {
                      changeProfilePic(state.id, e.target.files[0])
                        .then((response) => {
                          dispatch({ type: 'pictureFileKey', value: response });
                        })
                    }
                  } }
                />
                <img
                  src={ `${fileUrl}${state.pictureFileKey}` }
                  className={ profileImage }
                />
                <div className={ profileImageCamera }>
                  <FontAwesomeIcon icon={ faCamera } size="2x" />
                </div>
              </label>
            </Grid>
            <Grid item xs={ 12 } sm={ 8 } md={ 10 }>
              <form autoComplete="off" className={ rootFull } onSubmit={ submit }>
                <Grid container spacing={ 3 }>
                  <Grid item xs={ 12 } sm={ 6 } >
                    <TextField
                      error={ state.name.length < 2 && showError }
                      label={ t('general.name') }
                      required
                      variant="outlined"
                      value={ state.name }
                      className={ formItem }
                      onChange={ (e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 6 } >
                    <TextField
                      error={ state.family.length < 2 && showError }
                      label={ t('general.family') }
                      required
                      variant="outlined"
                      value={ state.family }
                      className={ formItem }
                      onChange={ (e): void =>
                        dispatch({ type: 'family', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 6 } >
                    <TextField
                      error={ state.mobile.trim().length < 10 && showError }
                      label={ t('general.mobile') }
                      type="number"
                      required
                      className={ formItem }
                      variant="outlined"
                      value={ state.mobile }
                      onChange={ (e): void =>
                        dispatch({ type: 'mobile', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 6 } >
                    <TextField
                      error={
                        state.email &&
                        !emailRegex.test(state.email) &&
                        showError
                      }
                      label={ t('general.email') }
                      type="email"
                      className={ formItem }
                      variant="outlined"
                      value={ state.email }
                      onChange={ (e): void =>
                        dispatch({ type: 'email', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 6 } >
                    <TextField
                      error={ state.userName.length < 2 && showError }
                      label={ t('login.username') }
                      required
                      variant="outlined"
                      value={ state.userName }
                      className={ formItem }
                      onChange={ (e): void =>
                        dispatch({ type: 'userName', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                      error={ state.nationalCode?.length < 10 && showError }
                      label={ t('user.nationalCode') }
                      required
                      type="text"
                      className={ formItem }
                      variant="outlined"
                      value={ state.nationalCode }
                      onChange={ (e): void =>
                        dispatch({ type: 'nationalCode', value: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid
                    item xs={ 12 } sm={ 12 }
                    style={ { display: 'flex', alignItems: 'center' } }
                  >
                    <ThreePartDatePicker
                      fullDate={ state.birthDate }
                      label={ t('user.birthDate') }
                      onChange={ (value: string, isValid: boolean): void => {
                        dispatch({ type: 'isValidBirthDate', value: isValid });
                        dispatch({ type: 'birthDate', value: value });
                      } }
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={ state.smsActive }
                          onChange={ (e): void =>
                            dispatch({
                              type: 'smsActive',
                              value: e.target.checked,
                            })
                          }
                        />
                      }
                      label={ t('user.smsActive') }
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={ state.notifActive }
                          onChange={ (e): void =>
                            dispatch({
                              type: 'notifActive',
                              value: e.target.checked,
                            })
                          }
                        />
                      }
                      label={ t('user.notifActive') }
                    />
                  </Grid>
                  <div className={ spacing1 }>&nbsp;</div>
                  <Divider />
                  {/* //////// SUBMIT //////////// */ }
                  <Grid item xs={ 12 } className={ spacing3 }>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      className={ `${addButton} ${longItem} ${centerItem}` }
                    >
                      { isLoadingNewUser ? (
                        t('general.pleaseWait')
                      ) : (
                          <span>{ t('action.register') }</span>
                        ) }
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    )
  }

  return (
    profileForm()
  )
}

export default Profile;

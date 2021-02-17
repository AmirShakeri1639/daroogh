import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Container, createStyles, Divider, Grid, makeStyles, Paper, TextField, Typography
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ActionInterface } from '../../../../interfaces';
import { ProfileInterface } from '../../../../interfaces/profile';
import { userReducer } from '../../../../redux/reducers';
import { User } from '../../../../services/api';
import { ThreePartDatePicker } from '../../../public';
import routes from '../../../../routes';
import { errorHandler, errorSweetAlert, successSweetAlert, warningSweetAlert } from '../../../../utils';
import { useMutation } from 'react-query';

export const useClasses = makeStyles((theme) => createStyles({
  parent: {
    paddingTop: theme.spacing(2),
  },
  dropdown: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  silverBackground: {
    background: '#ebebeb',
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
  titleContainer: {
    padding: theme.spacing(2)
  },
  formTitle: {
    margin: 0
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

const initialState: ProfileInterface = {
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
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  console.log('action in reducer:', action);
  console.log('state in reducer:', state);

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
    dropdown,
    silverBackground,
    addButton,
    spacing1,
    spacing3,
    padding3,
    formItem,
    titleContainer,
    formTitle,
    rootFull,
    longItem,
    centerItem,
  } = useClasses();

  const { profile, saveNewUser } = new User();

  useEffect(() => {
    async function getProfile(): Promise<any> {
      const data = await profile();
      console.log('data : ', data);
      dispatch({ type: 'full', value: data });
      console.log('ddata from state: ', state)
    }

    getProfile();
  }, [])

  useEffect(() => {
    console.log('ddata from state OUTSIDE: ', state);
  }, [state?.name]);

  const [_save, { isLoading: isLoadingSave }] = useMutation(saveNewUser, {
    onSuccess: async (data: any) => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(t('alert.successfulSave'));
    }
  })

  const isFormValid = (): boolean => {
    const {
      name, family, nationalCode, mobile,
      userName, isValidBirthDate
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

    console.log('e on submit:', e)

    if (isFormValid()) {
      try {
        const {
          name, family, mobile, email, userName,
          active, nationalCode, birthDate, pharmacyID,
        } = state;
        await _save({
          name, family, mobile, email, userName,
          active, nationalCode, birthDate, pharmacyID,
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
      <>
        { console.log('profile:', state) }
        <Container maxWidth="lg" className={ parent }>
          <Paper className={ padding3 }>
            <Typography component="h2">
              <h2>{ t('user.profile') }</h2>
            </Typography>
            <Divider />
            <Grid container>
              <Grid item xs={ 12 } sm={ 4 } md={ 2 } className={ padding3 }>
                <img src={ `${fileUrl}${state.pictureFileKey}` } />
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
                        error={ state.nationalCode.length < 10 && showError }
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
                      item xs={ 12 } sm={ 6 }
                      style={ { display: 'flex', alignItems: 'center' } }
                    >
                      <ThreePartDatePicker
                        label={ t('user.birthDate') }
                        onChange={ (value: string, isValid: boolean): void => {
                          dispatch({ type: 'isValidBirthDate', value: isValid });
                          dispatch({ type: 'birthDate', value: value });
                        } }
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
      </>
    )
  }

  return (
    profileForm()
  )
}

export default Profile;

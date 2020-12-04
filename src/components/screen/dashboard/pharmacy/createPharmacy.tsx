import React, { useReducer } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Paper,
  Button, createStyles, Grid, Typography, Divider, Box
} from '@material-ui/core';
import Pharmacy from '../../../../services/api/Pharmacy';
import { PharmacyInterface } from '../../../../interfaces';
import { queryCache, useMutation } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { errorHandler, sweetAlert } from "../../../../utils";

const initialState: PharmacyInterface = {
  id: 0,
  name: '',
  description: '',
  active: false,
  hix: '',
  gli: '',
  worktime: 1,
  address: '',
  mobile: '',
  telphon: '',
  website: '',
  email: '',
  postalCode: '',
  countryDivisionID: 1
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;
  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'name':
      return {
        ...state,
        name: value,
      };
    case 'hix':
      return {
        ...state,
        hix: value,
      };
    case 'gli':
      return {
        ...state,
        gli: value,
      };
    case 'worktime':
      return {
        ...state,
        worktime: +value,
      };
    case 'description':
      return {
        ...state,
        description: value,
      };
    case 'active':
      return {
        ...state,
        active: value,
      };
    case 'address':
      return {
        ...state,
        address: value,
      };
    case 'mobile':
      return {
        ...state,
        mobile: value,
      };
    case 'telphon':
      return {
        ...state,
        telphon: value,
      };
    case 'website':
      return {
        ...state,
        website: value,
      };
    case 'email':
      return {
        ...state,
        email: value,
      };
    case 'postalCode':
      return {
        ...state,
        postalCode: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

const useClasses = makeStyles((theme) => createStyles({
  parent: {
    paddingTop: theme.spacing(2),
  },
  root: {
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: theme.spacing(4),
  },
  container: {
    maxHeight: 440,
  },
  titleContainer: {
    padding: theme.spacing(2)
  },
  formPaper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2, 0, 2),
  },
  formTitle: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  formControl: {
    minWidth: 190,
    margin: theme.spacing(1),
  },
  gridContainer: {
    flexGrow: 1
  },
  gridFormControl: {
    margin: theme.spacing(3),
  },
  gridTitle: {
    marginLeft: theme.spacing(2),
  },
  gridItem: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  formBody: {
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  cancelButton: {
    marginLeft: theme.spacing(1),
    background: theme.palette.pinkLinearGradient.main,
  },
  box: {
    '& > .MuiFormControl-root': {
      flexGrow: 1,
    }
  }
}));

const CreatePharmacy: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const { save } = new Pharmacy();

  const {
    parent, formContainer,
    addButton, cancelButton, box,
    titleContainer, formTitle
  } = useClasses();

  const [_save] = useMutation(save, {
    onSuccess: async (data: any) => {
      await queryCache.invalidateQueries('pharmaciesList');
      await sweetAlert({
        type: 'success',
        text: data.message || t('alert.successfulSave')
      });
      dispatch({ type: 'reset' });
    },
    onError: async () => {
      await sweetAlert({
        type: 'error',
        text: t('error.save')
      })
    }
  })

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (state.name.trim().length < 1) {
      return;
    }
    try {
      await _save({
        id: state.id,
        name: state.name,
        hix: state.hix,
        gli: state.gli,
        worktime: state.worktime,
        address: state.address,
        mobile: state.mobile,
        telphon: state.telphon,
        website: state.website,
        email: state.email,
        postalCode: state.postalCode,
        description: state.description,
        active: !state.active,
        countryDivisionID: state.countryDivisionID
      });
    } catch (e) {
      errorHandler(e)
    }
  }

  return (
    <Container maxWidth="lg" className={parent}>
      <Grid container spacing={0}>
        <Paper>
          <div className={titleContainer}>
            <Typography variant="h6" component="h6" className={`${formTitle} txt-md`}>
              {t('pharmacy.new')}
            </Typography>
          </div>
          <Divider />
          <form
            autoComplete="off"
            className={formContainer}
            onSubmit={submit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.name')}
                    value={state.name}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.hix')}
                    value={state.hix}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'hix', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.gli')}
                    value={state.gli}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'gli', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  // TODO: dropdown and enum for worktime
                  <TextField
                    required
                    variant="outlined"
                    label={t('pharmacy.workTime')}
                    value={state.worktime}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'worktime', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.address')}
                    value={state.address}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'address', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.mobile')}
                    value={state.mobile}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'mobile', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.phone')}
                    value={state.telphon}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'telphon', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.website')}
                    value={state.website}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'website', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.email')}
                    value={state.email}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'email', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.postalCode')}
                    value={state.postalCode}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'postalCode', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.description')}
                    value={state.description}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'description', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <Button
                    type="submit"
                    color="primary"
                    className={addButton}
                  >
                    {t('general.save')}
                  </Button>
                  {
                    state.id !== 0 && (
                      <FormControl>
                        <Button
                          type="submit"
                          color="secondary"
                          className={cancelButton}
                          onClick={(): void => dispatch({ type: 'reset' })}
                        >
                          {t('general.cancel')}
                        </Button>
                      </FormControl>
                    )
                  }
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Container>
  )
}

export default CreatePharmacy;

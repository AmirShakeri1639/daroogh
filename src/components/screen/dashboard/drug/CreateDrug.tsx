import React, { useReducer } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Paper,
  Button, createStyles, Grid, Typography, Divider, Box
} from '@material-ui/core';
import Drug from '../../../../services/api/Drug';
import { DrugInterface } from '../../../../interfaces';
import { queryCache, useMutation } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { errorHandler, sweetAlert } from "../../../../utils";

const initialState: DrugInterface = {
  id: 0,
  categoryId: 1,
  name: '',
  genericName: '',
  companyName: '',
  barcode: '',
  description: '',
  active: false,
  enName: '',
  type: ''
};

function reducer(state = initialState, action: ActionInterface): any {
  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: action.value,
      };
    case 'categoryId':
      return {
        ...state,
        categoryId: action.value,
      };
    case 'name':
      return {
        ...state,
        name: action.value,
      };
    case 'genericName':
      return {
        ...state,
        genericName: action.value,
      };
    case 'companyName':
      return {
        ...state,
        companyName: action.value,
      };
    case 'barcode':
      return {
        ...state,
        barcode: action.value,
      };
    case 'description':
      return {
        ...state,
        description: action.value,
      };
    case 'active':
      return {
        ...state,
        active: action.value,
      };
    case 'enName':
      return {
        ...state,
        enName: action.value,
      };
    case 'type':
      return {
        ...state,
        type: action.value,
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

const CreateDrug: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const { save } = new Drug();

  // const { data: drugData } =
  //   useQuery('allRoles', getAllRoles);

  const {
    parent, formContainer,
    addButton, cancelButton, box,
    titleContainer, formTitle
  } = useClasses();

  const [_saveDrug] = useMutation(save, {
    onSuccess: async (data) => {
      await queryCache.invalidateQueries('drugsList');
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

  const submitDrug = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (state.name.trim().length < 1
        || state.genericName.trim().length < 1
        || state.companyName.trim().length < 1
        || state.enName.trim().length < 1
    ) {
      return;
    }
    try {
      await _saveDrug({
        id: state.id,
        categoryId: state.categoryId,
        name: state.name,
        genericName: state.genericName,
        companyName: state.companyName,
        barcode: state.barcode,
        description: state.description,
        active: state.active,
        enName: state.enName,
        type: state.type
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
              {t('drug.newDrug')}
            </Typography>
          </div>
          <Divider />
          <form
            autoComplete="off"
            className={formContainer}
            onSubmit={submitDrug}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('drug.name')}
                    value={state.name}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'name', value: e.target.value })
                    }
                  />
                  <div className="row">
                    {/* TODO: Add CategoryId */}
                  </div>
                  <TextField
                    required
                    variant="outlined"
                    label={t('drug.genericName')}
                    value={state.genericName}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'genericName', value: e.target.value })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" className={box}>
                  <TextField
                    required
                    variant="outlined"
                    label={t('drug.companyName')}
                    value={state.companyName}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'companyName', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('drug.barcode')}
                    value={state.barcode}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'barcode', value: e.target.value })
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
                  <div className="row">
                    {/* TODO: Add active boolean form control */}
                  </div>
                  <TextField
                    required
                    variant="outlined"
                    label={t('drug.enName')}
                    value={state.enName}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'enName', value: e.target.value })
                    }
                  />
                  <TextField
                    required
                    variant="outlined"
                    label={t('general.type')}
                    value={state.type}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'type', value: e.target.value })
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

export default CreateDrug;

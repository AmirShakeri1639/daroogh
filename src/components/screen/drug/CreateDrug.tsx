import React, { useReducer } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Button, createStyles
} from '@material-ui/core';
import Drug from '../../../services/api/Drug';
import { DrugInterface } from '../../../interfaces/DrugInterface';
import { queryCache, useMutation } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import { ActionInterface } from "../../../interfaces";
import { useTranslation } from "react-i18next";
import { errorHandler } from "../../../utils";

const initialState: DrugInterface = {
  id: 0,
  categoryID: 0,
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
    case 'categoryID':
      return {
        ...state,
        categoryID: action.value,
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
  }
}));

const CreateDrug: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const { saveDrug } = new Drug();

  const {
    parent, formContainer, formControl,
    formBody, addButton, cancelButton,
    // root, container, formPaper, formTitle,
    // gridContainer, gridFormControl, gridTitle,
  } = useClasses();

  const [_saveDrug] = useMutation(saveDrug, {
    onSuccess: () => {
      queryCache.invalidateQueries('allDrugs');
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
        categoryID: state.categoryID,
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
      <div className={formContainer}>
        <form
          autoComplete="off"
          onSubmit={submitDrug}>
          <div className={formBody}>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('drug.name')}
                  value={state.name}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'name', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              {/* TODO: Add CategoryID */}
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('drug.generic-name')}
                  value={state.genericName}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'genericName', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('drug.company-name')}
                  value={state.companyName}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'companyName', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('drug.barcode')}
                  value={state.barcode}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'barcode', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('general.description')}
                  value={state.description}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'description', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              {/* TODO: Add active boolean form control */}
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('drug.en-name')}
                  value={state.enName}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'enName', value: e.target.value })
                  }
                />
              </FormControl>
            </div>
            <div className="row">
              <FormControl className={formControl}>
                <TextField
                  required
                  id=""
                  label={t('general.type')}
                  value={state.type}
                  onChange={
                    (e): void =>
                      dispatch({ type: 'type', value: e.target.value })
                  }
                />
              </FormControl>
            </div>

            <div className="row">
              <FormControl>
                <Button
                  type="submit"
                  color="primary"
                  className={addButton}
                >
                  {t('general.save')}
                </Button>
              </FormControl>
            </div>
            <div className="row">
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
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default CreateDrug;

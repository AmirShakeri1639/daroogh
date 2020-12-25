import React, { useReducer, useState } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Paper,
  Button, Grid, Typography, Divider, Box, FormControlLabel, Switch
} from '@material-ui/core';
import Drug from '../../../../services/api/Drug';
import { DrugInterface } from '../../../../interfaces';
import { queryCache, useMutation } from "react-query";
import { useClasses } from "../classes";
import { ActionInterface } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { errorHandler, errorSweetAlert, successSweetAlert, sweetAlert } from "../../../../utils";
import { DaroogDropdown } from "../../../public/daroog-dropdown/DaroogDropdown";
import { Category } from "../../../../services/api";

const initialState: DrugInterface = {
  id: 0,
  categoryID: 1,
  name: '',
  genericName: '',
  companyName: '',
  barcode: '',
  description: '',
  active: false,
  enName: '',
  type: 'شربت'
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

const CreateDrug: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const { save, types } = new Drug();

  const {
    parent, formContainer, dropdown,
    addButton, cancelButton, box,
    titleContainer, formTitle
  } = useClasses();

  const { getAllCategories: allCategories } = new Category();
  const [categories, setCategories] = useState([]);
  React.useEffect(() => {
    async function getCategories(): Promise<any> {
      const result = await allCategories(0, 1000);
      setCategories(result.items.map((item: any) => ({ value: item.id, label: item.name })));
    }
    getCategories();
  }, []);

  const [drugTypes, setDrugTypes] = useState([]);
  React.useEffect(() => {
    async function getTypes(): Promise<any> {
      const result = await types();
      setDrugTypes(result.items.map((item: any) => ({ value: item, label: item })));
    }
    getTypes();
  }, []);

  const [_saveDrug] = useMutation(save, {
    onSuccess: async (data) => {
      await queryCache.invalidateQueries('drugsList');
      await successSweetAlert(t('alert.successfulSave'));
      dispatch({ type: 'reset' });
    },
    onError: async () => {
      await errorSweetAlert(t('error.save'));
    }
  })

  const submitDrug = async (e: React.FormEvent<HTMLFormElement>): Promise<any> => {
    e.preventDefault();

    if (state.name.trim().length < 1) {
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
                  <DaroogDropdown
                    defaultValue={state.categoryID}
                    className={dropdown}
                    data={categories}
                    label={t('drug.category')}
                    onChangeHandler={(v): void => {
                      return dispatch({ type: 'categoryID', value: v })
                    }}
                  />
                  <TextField
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
                    variant="outlined"
                    label={t('drug.companyName')}
                    value={state.companyName}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'companyName', value: e.target.value })
                    }
                  />
                  <TextField
                    variant="outlined"
                    label={t('drug.barcode')}
                    value={state.barcode}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'barcode', value: e.target.value })
                    }
                  />
                  <TextField
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
                  <TextField
                    variant="outlined"
                    label={t('drug.enName')}
                    value={state.enName}
                    onChange={
                      (e): void =>
                        dispatch({ type: 'enName', value: e.target.value })
                    }
                  />
                  <DaroogDropdown
                    defaultValue={state.type}
                    data={drugTypes}
                    className={dropdown}
                    label={t('general.type')}
                    onChangeHandler={(v): void => {
                      return dispatch({ type: 'type', value: v })
                    }}
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

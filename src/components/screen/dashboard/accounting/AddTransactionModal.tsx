import React, { useReducer, useState } from 'react';
import {
  Button, Container, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, Grid, Paper, 
  Radio, RadioGroup, TextField, useMediaQuery, useTheme
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import {
  AccountingTransactionInterface,
  ActionInterface
} from '../../../../interfaces';
import { Accounting } from '../../../../services/api';
import {
  errorHandler, errorSweetAlert, successSweetAlert
} from '../../../../utils';
import { todayJalali } from '../../../../utils/jalali';
import { useClasses } from '../classes';
import { TransactionTypeEnum } from '../../../../enum';

interface Props {
  pharmacyId: number;
  onClose?: () => void;
}

const initialState: AccountingTransactionInterface = {
  pharmacyId: 0,
  amount: 0,
  tarikh: todayJalali(),
  description: '',
  transactionType: TransactionTypeEnum.Creditor,
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'pharmacyId':
      return {
        ...state,
        pharmacyId: value,
      };
    case 'amount':
      return {
        ...state,
        amount: value.trim(),
      };
    case 'tarikh':
      return {
        ...state,
        tarikh: todayJalali(),
      };
    case 'description':
      return {
        ...state,
        description: value.trim(),
      };
    case 'transactionType':
      return {
        ...state,
        transactionType: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}


const AddTransactionModal: React.FC<Props> = ({ pharmacyId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, pharmacyId });
  const [dialogOpen, setDialogOpen] = useState(true);
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    formContainer,
    formItem,
    parent,
  } = useClasses();
  const [showError, setShowError] = useState(false);

  const { add } = new Accounting();
  const [_add] = useMutation(add, {
    onSuccess: async (r) => {
      dispatch({ type: 'reset' });
    },
    onError: async (e) => {
      setDialogOpen(false);
      await errorSweetAlert(e ? e : t('alert.failed'));
      setDialogOpen(true);
      errorHandler(e);
    }
  });

  const submit = async (el: any): Promise<any> => {
    el.preventDefault();

    const {
      pharmacyId, amount, tarikh, description, transactionType
    } = state;

    if (state.amount !== 0 && state.description.length > 2) {
      setShowError(false);
      if (window.confirm(t('accounting.areYouSure'))) {
        const amountToSend = transactionType == TransactionTypeEnum.Creditor
          ? -(amount) : amount;
        const result = await _add({
          pharmacyId, tarikh, description, amount: amountToSend
        });

        if (result !== undefined) {
          setDialogOpen(false);
          await successSweetAlert(result.message);
          if (onClose) onClose();
        }
      }
    } else {
      setShowError(true);
    }
  }

  const addTransactionForm = (): JSX.Element => {
    return (
      <Container maxWidth="lg" className={ parent }>
        <Paper>
          <form
            autoComplete="off"
            className={ formContainer }
          >
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <TextField
                  label={ t('accounting.amount') }
                  required
                  error={ state.amount == 0 && showError }
                  variant="outlined"
                  type="number"
                  value={ state.amount }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'amount', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 }>
                <TextField
                  error={ state.description.length < 3 && showError }
                  label={ t('general.description') }
                  required
                  variant="outlined"
                  value={ state.description }
                  className={ formItem }
                  onChange={ (e): void =>
                    dispatch({ type: 'description', value: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={ 12 }>
                <RadioGroup aria-label="transaction-type" name="transactionType"
                  value={ state.transactionType } onChange={ (e): void => {
                    dispatch({ type: 'transactionType', value: (e.target as HTMLInputElement).value })
                  } }>
                  <FormControlLabel
                    value={ TransactionTypeEnum.Creditor }
                    control={ <Radio /> }
                    checked={ state.transactionType == TransactionTypeEnum.Creditor }
                    label={ t('accounting.creditor') } />
                  <FormControlLabel
                    value={ TransactionTypeEnum.Debtor }
                    checked={ state.transactionType == TransactionTypeEnum.Debtor }
                    control={ <Radio /> }
                    label={ t('accounting.debtor') } />
                </RadioGroup>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    )
  }

  return (
    <>
      <Dialog open={ dialogOpen } fullScreen={ fullScreen }>
        <DialogTitle>
          { t('accounting.addTransaction') }
        </DialogTitle>
        <Divider />
        <DialogContent>
          { addTransactionForm() }
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={ (e): void => {
              submit(e);
            } }
          >
            { t('action.save') }
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={ (): void => {
              setDialogOpen(false);
              if (onClose) onClose();
            } }
          >
            { t('general.ok') }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTransactionModal;

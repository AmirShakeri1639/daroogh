import React, { useReducer, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, useMediaQuery, useTheme
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { 
  AccountingTransactionInterface,
  ActionInterface
} from '../../../../interfaces';
import { Accounting } from '../../../../services/api';
import { errorHandler, errorSweetAlert, successSweetAlert } from '../../../../utils';
import { today, todayJalali } from '../../../../utils/jalali';

interface Props {
  pharmacyId: number;
  onClose?: () => void;
}

const initialState: AccountingTransactionInterface = {
  pharmacyId: 0,
  amount: 0,
  tarikh: todayJalali(),
  description: ''
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch(action.type) {
    case 'pharmacyId':
      return {
        ...state,
        pharmacyId: value,
      };
    case 'amount':
      return {
        ...state,
        amount: value,
      };
    case 'tarikh':
      return {
        ...state,
        tarikh: todayJalali(),
      };
    case 'description':
      return {
        ...state,
        description: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}


const AddTransactionModal: React.FC<Props> = ({ pharmacyId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { add } = new Accounting();
  const [_add] = useMutation(add, {
    onSuccess: async () => {
      await successSweetAlert(t('alert.successfulSave'));
      // dispatch({ type: 'reset' });
    },
  });

  const submit = async (el: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el.preventDefault();
    // TODO: _add transcation
    const {
      pharmacyId, amount, tarikh, description
    } = state;

    try {
      const result = await _add({
        pharmacyId, amount, tarikh, description
      });

      if (result !== undefined) {
        setDialogOpen(false);
        if (onClose) onClose();
      }
    } catch (e) {
      await errorSweetAlert(t('alert.failed'));
      errorHandler(e);
    }
  }

  return (
    <>
      { console.log(today()) }
      { console.log(todayJalali()) }
      <Dialog open={ dialogOpen } fullScreen={ fullScreen }>
        <DialogTitle>
          { t('accounting.addTransaction') }
        </DialogTitle>
        <Divider />
        <DialogContent>
          <h1>Add Transaction</h1>
        </DialogContent>
        <DialogActions>
          {/* <Button
            variant="outlined"
            color="primary"
            onClick={ submit }
          >
            { t('action.save') }
          </Button> */}
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

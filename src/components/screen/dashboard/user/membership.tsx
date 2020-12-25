import React, { useState, useReducer } from 'react';
import {
  Container, Grid, Paper, Card, CardHeader, IconButton, Divider, CardContent, TextField, FormControlLabel, Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryCache } from 'react-query';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import {
  ActionInterface, MembershipRequestInterface, TableColumnInterface
} from '../../../../interfaces';
import { MembershipRequest } from '../../../../services/api';
import { errorHandler, successSweetAlert, warningSweetAlert } from '../../../../utils';
import { useClasses } from '../classes';
import Modal from '../../../public/modal/Modal';
import DataTable from '../../../public/datatable/DataTable';
import CircleLoading from '../../../public/loading/CircleLoading';
import { MembershipRequestEnum } from '../../../../enum/query';

const initialState: MembershipRequestInterface = {
  id: 0,
  userID: 0,
  pharmacyID: 0,
  sendDate: '',
  accepted: false,
  pharmacyComment: '',
}


function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: value,
      };
    case 'userID':
      return {
        ...state,
        userID: value,
      };
    case 'pharmacyID':
      return {
        ...state,
        pharmacyID: value,
      };
    case 'sendDate':
      return {
        ...state,
        sendDate: value,
      };
    case 'accepted':
      return {
        ...state,
        accepted: value,
      };
    case 'pharmacyComment':
      return {
        ...state,
        pharmacyComment: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined')
      break;
  }
}

const Membership: React.FC = () => {
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const queryCache = useQueryCache();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal(v => !v);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    container, root, formContainer, formItem,
    box, addButton, cancelButton, dropdown
  } = useClasses();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'id', title: t('general.id'), type: 'number',
        cellStyle: { textAlign: 'right' }
      },
      { field: 'user.name', title: t('user.name'), type: 'string' },
      { field: 'user.family', title: t('user.family'), type: 'string' },
      { field: 'sendDate', title: t('user.sendDate'), type: 'string' },
      { field: 'accepted', title: t('user.accepted'), type: 'boolean' },
    ];
  };

  const {
    all, accept
  } = new MembershipRequest();

  const [_accept, { isLoading }] = useMutation(accept, {
    onSuccess: async () => {
      if (showError) {
        setShowError(false);
      }
      await queryCache.invalidateQueries('membershipRequestsList');
      await successSweetAlert(t('alert.successfulSave'));
      dispatch({ type: 'reset' });
    }
  });

  const acceptHandler = async (item: MembershipRequestInterface): Promise<any> => {
    toggleIsOpenSaveModalForm();

    const {
      id, pharmacyID, accepted, pharmacyComment
    } = item;
    dispatch({ type: 'id', value: id });
    dispatch({ type: 'pharmacyID', value: pharmacyID });
    dispatch({ type: 'accepted', value: accepted });
    dispatch({ type: 'pharmacyComment', value: pharmacyComment });
  };

  const isFormValid = (): boolean => {
    return (
      state.pharmacyComment && state.pharmacyComment.trim().length > 0
    );
  };

  const submitAccept = async (el: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el.preventDefault();

    const {
      id, accepted, pharmacyComment
    } = state;

    if (isFormValid()) {
      try {
        await _accept({ id, accepted, pharmacyComment });
        dispatch({ type: 'reset' });
        ref.current?.loadItems();
      } catch (e) {
        errorHandler(e);
      }
    } else {
      await warningSweetAlert(t('alert.fillFormCarefully'));
      setShowError(true);
    }
  }

  const editModal = (): JSX.Element => {
    return (
      <Modal open={ isOpenSaveModal } toggle={ toggleIsOpenSaveModalForm }>
        <Card className={ root }>
          <CardHeader
            title={ state?.id === 0 ? t('action.create') : t('action.edit') }
            action={
              <IconButton onClick={ toggleIsOpenSaveModalForm }>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <form
              autoComplete="off"
              className={ formContainer }
              onSubmit={ submitAccept }
            >
              <Grid container spacing={ 3 }>
                <Grid item xs={ 12 } sm={ 6 }>
                  <TextField
                    error={ state.pharmacyComment.length < 2 && showError }
                    label={ t('general.comment') }
                    required
                    variant="outlined"
                    value={ state.pharmacyComment }
                    className={ formItem }
                    onChange={ (e):
                      void => dispatch({ type: 'pharmacyComment', value: e.target.value }) }
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ state?.accepted }
                        onChange={
                          (e): void =>
                            dispatch({ type: 'accepted', value: e.target.checked })
                        }
                      />
                    }
                    label={ t('user.accepted') }
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Modal>
    )
  }

  return (
    <Container maxWidth="lg" className={ container }>
      <Grid container spacing={ 0 }>
        <Grid item xs={ 12 }>
          <div>{ t('user.membershipRequestsList') }</div>
          <Paper>
            <DataTable
              ref={ ref }
              columns={ tableColumns() }
              stateAction={
                async (e: any, row: any): Promise<void> => await acceptHandler(row) }
              queryKey={ MembershipRequestEnum.GET_ALL }
              queryCallback={ all }
              initLoad={ false }
            />
            { isLoading && <CircleLoading /> }
          </Paper>
        </Grid>
        { isOpenSaveModal && editModal() }
      </Grid>
    </Container>
  );
};

export default Membership;

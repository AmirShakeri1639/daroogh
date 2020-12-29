import React, { useReducer, useState } from 'react';
import {
  Button, Card, CardActions, CardContent, CardHeader,
  Container, Divider, FormControlLabel,
  Grid, IconButton, Paper, TextField
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PharmacyEnum } from '../../../../enum';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import {
  ActionInterface, TableColumnInterface, UserRoleInterface
} from '../../../../interfaces';
import { MembershipRequest, Role } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';
import { useClasses } from '../classes';
import { useMutation, useQueryCache } from 'react-query';
import { errorHandler, errorSweetAlert, successSweetAlert } from '../../../../utils';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '../../../public/modal/Modal';

const initialState: UserRoleInterface = {
  roleId: 0,
  userId: 0
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'roleId':
      return {
        ...state,
        id: value,
      };
    case 'userId':
      return {
        ...state,
        userID: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined')
      break;
  }
}

const MemberRole: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryCache = useQueryCache();
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal(v => !v);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    container, root, formContainer, formItem, addButton, cancelButton,
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
    checked
  } = new MembershipRequest();

  const {
    addUserToRole
  } = new Role();

  // @ts-ignore
  const [_addUserToRole, { isLoading }] = useMutation(addUserToRole, {
    onSuccess: async (result: any) => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(result.message);
      dispatch({ type: 'reset' });
    },
    onError: (e, variables, context) => {
      // An error happened!
      errorHandler(e);
      console.log('e:', e);
      console.log('vars: ', variables);
      console.log('context:', context);
      // await errorSweetAlert(result.message);
    },
  });


  const addUserToRoleHandler = async (item: UserRoleInterface): Promise<any> => {
    toggleIsOpenSaveModalForm();

    const { userId } = item;
    dispatch({ type: 'userId', value: userId });
  }

  const submitAccept = async (el: React.FormEvent<HTMLFormElement>): Promise<any> => {
    el.preventDefault();

    const {
      roleId, userId
    } = state;

    try {
      await _addUserToRole(state.roleId, state.userId);
      dispatch({ type: 'reset' });
      ref.current?.loadItems();
    } catch (e) {
      errorHandler(e);
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
                    error={ state.pharmacyComment?.length < 2 && showError }
                    label={ t('general.comment') }
                    required
                    variant="outlined"
                    value={ state.pharmacyComment }
                    className={ formItem }
                    onChange={ (e):
                      void => dispatch({ type: 'pharmacyComment', value: e.target.value }) }
                  />
                </Grid>
                <Divider />
                <Grid item xs={ 12 }>
                  <CardActions>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      className={ addButton }
                    >
                      {
                        isLoading
                          ? t('general.pleaseWait')
                          : t('general.save')
                      }
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      className={ cancelButton }
                      onClick={ (): void => {
                        dispatch({ type: 'reset' });
                        toggleIsOpenSaveModalForm();
                      } }
                    >
                      { t('general.cancel') }
                    </Button>
                  </CardActions>
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
      <Grid container>
        <Grid item xs={ 12 }>
          <div>{ t('pharmacy.memberRole') }</div>
          <Paper>
            <DataTable
              ref={ ref }
              columns={ tableColumns() }
              editAction={
                async (e: any, row: any): Promise<void> => await addUserToRoleHandler(row) }
              queryKey={ PharmacyEnum.GET_MEMBERS }
              queryCallback={ checked }
              initLoad={ false }
            />
          </Paper>
        </Grid>
        { isOpenSaveModal && editModal() }
      </Grid>
    </Container>
  )
};

export default MemberRole;

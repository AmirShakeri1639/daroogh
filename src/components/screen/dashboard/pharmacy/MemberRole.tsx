import React, { useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PharmacyEnum } from '../../../../enum';
import useDataTableRef from '../../../../hooks/useDataTableRef';
import {
  ActionInterface,
  LabelValue,
  TableColumnInterface,
  UserRoleInterface,
} from '../../../../interfaces';
import { Role, User } from '../../../../services/api';
import DataTable from '../../../public/datatable/DataTable';
import { useClasses } from '../classes';
import { useMutation, useQueryCache } from 'react-query';
import {
  errorHandler,
  errorSweetAlert,
  successSweetAlert,
} from '../../../../utils';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '../../../public/modal/Modal';
import { DaroogDropdown } from '../../../public/daroog-dropdown/DaroogDropdown';
import { UrlAddress } from '../../../../enum/UrlAddress';

const initialState: UserRoleInterface = {
  roleID: 0,
  userID: 0,
};

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'roleID':
      return {
        ...state,
        roleID: value,
      };
    case 'userID':
      return {
        ...state,
        userID: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
      break;
  }
}

const MemberRole: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryCache = useQueryCache();
  const ref = useDataTableRef();
  const { t } = useTranslation();
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);
  const toggleIsOpenSaveModalForm = (): void => setIsOpenSaveModal((v) => !v);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    container,
    root,
    formContainer,
    formItem,
    addButton,
    cancelButton,
  } = useClasses();

  const tableColumns = (): TableColumnInterface[] => {
    return [
      {
        field: 'id',
        title: t('general.id'),
        type: 'number',
        cellStyle: { textAlign: 'right' },
      },
      { field: 'name', title: t('user.name'), type: 'string' },
      { field: 'family', title: t('user.family'), type: 'string' },
      { field: 'mobile', title: t('general.mobile'), type: 'string' },
      { field: 'nationalCode', title: t('user.nationalCode'), type: 'string' },
    ];
  };

  const { getCurrentPharmacyUsers } = new User();

  const { addUserToRole, getAllRoles } = new Role();

  // @ts-ignore
  const [_addUserToRole, { isLoading }] = useMutation(addUserToRole, {
    onSuccess: async (result: any) => {
      if (showError) {
        setShowError(false);
      }
      await successSweetAlert(result.message);
      dispatch({ type: 'reset' });
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  const [roles, setRoles] = useState<LabelValue[]>([]);
  useEffect(() => {
    async function getRoles(): Promise<any> {
      const result = await getAllRoles();
      if (result.items) {
        // type 2 means roles special for pharmacies
        setRoles(
          result.items
            .filter((i: any) => i.type == 2)
            .map((i: any) => ({ value: i.id, label: i.name }))
        );
      }
    }
    getRoles();
  }, []);

  const addUserToRoleHandler = async (item: any): Promise<any> => {
    toggleIsOpenSaveModalForm();

    dispatch({ type: 'userID', value: item.id });
    dispatch({ type: 'roleID', value: state.roleID });
  };

  const submitAccept = async (
    el: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    el.preventDefault();

    try {
      await _addUserToRole({ roleID: state.roleID, userID: state.userID });
      dispatch({ type: 'reset' });
      ref.current?.loadItems();
    } catch (e) {
      errorHandler(e);
    }
  };

  const editModal = (): JSX.Element => {
    return (
      <Modal open={isOpenSaveModal} toggle={toggleIsOpenSaveModalForm}>
        <Card className={root}>
          <CardHeader
            title={t('action.edit')}
            action={
              <IconButton onClick={toggleIsOpenSaveModalForm}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <form
              autoComplete="off"
              className={formContainer}
              onSubmit={submitAccept}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DaroogDropdown
                    defaultValue={state.type}
                    data={roles}
                    label={t('general.type')}
                    onChangeHandler={(v): void => {
                      dispatch({ type: 'roleID', value: v });
                    }}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <CardActions>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      className={addButton}
                    >
                      {isLoading ? t('general.pleaseWait') : t('general.save')}
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      className={cancelButton}
                      onClick={(): void => {
                        dispatch({ type: 'reset' });
                        toggleIsOpenSaveModalForm();
                      }}
                    >
                      {t('general.cancel')}
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Modal>
    );
  };

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container>
        <Grid item xs={12}>
          <div>{t('pharmacy.memberRole')}</div>
          <Paper>
            <DataTable
              ref={ref}
              columns={tableColumns()}
              editAction={async (e: any, row: any): Promise<void> =>
                await addUserToRoleHandler(row)
              }
              queryKey={PharmacyEnum.GET_MEMBERS}
              queryCallback={getCurrentPharmacyUsers}
              urlAddress={UrlAddress.getPharmacyUsers}
              defaultFilter="active eq true"
              initLoad={false}
            />
          </Paper>
        </Grid>
        {isOpenSaveModal && editModal()}
      </Grid>
    </Container>
  );
};

export default MemberRole;

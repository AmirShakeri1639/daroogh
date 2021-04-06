// @ts-nocheck
import {
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  Grid,
  Input,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { RoleQueryEnum, RoleType, UserQueryEnum } from '../../../../enum';
import { BackDrop, Button } from '../../../public';
import { Role, User } from '../../../../services/api';
import { difference } from 'lodash';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../../../utils';

interface RoleFormProps {
  userId: number;
  toggleForm: () => void;
  roleType?: RoleType;
}

const {
  getRolesOfUser,
  getAllRoles,
  addUserToRole,
  removeUserFromRole,
} = new Role();

const { getUserById } = new User();

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    cancelButton: {
      background: theme.palette.pinkLinearGradient.main,
    },
    buttonContainer: {
      textAlign: 'right',
      marginTop: theme.spacing(2),
    },
    roleInput: {
      width: 500,
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      minWidth: 'unset'
    },
  },
};

const RoleForm: React.FC<RoleFormProps> = ({
  userId,
  toggleForm,
  roleType,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[] | number[]>([]);
  const [isOpenBackDrop, setIsOpenBackDrop] = useState(false);

  const { data: userData } = useQuery(UserQueryEnum.GET_USER_BY_ID, () =>
    getUserById(userId)
  );

  const { root, cancelButton, buttonContainer, roleInput } = useClasses();

  const { t } = useTranslation();

  const { data: roleData } = useQuery(RoleQueryEnum.GET_ROLES_OF_USER, () =>
    getRolesOfUser(userId)
  );

  useEffect(() => {
    if (roleData !== undefined) {
      setSelectedRoles(roleData.map((item: any) => item.id));
    }
  }, [roleData]);

  const {
    isLoading: roleListLoading,
    data: roleListData,
  } = useQuery(RoleQueryEnum.GET_ALL_ROLES, () =>
    getAllRoles(roleType ? roleType : undefined)
  );

  const rolesListGenerator = (): any => {
    if (roleListData !== undefined && !roleListLoading) {
      return (
        roleListData.items
          // filter role of 'all-users' from array
          .filter((item: any) => item.id !== 1)
          .map((item: any) => {
            return (
              <Grid container item xs={12}>
                <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={selectedRoles.indexOf(item.id) !== -1} />
                <ListItemText primary={item.name} />
              </MenuItem>
              </Grid>
              
            );
          })
      );
    }

    return <MenuItem />;
  };

  const formHandler = async (roleId: number): Promise<any> => {
    try {
      await addUserToRole({
        roleID: roleId,
        userID: userId,
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const removeRole = async (roleId: number): Promise<any> => {
    try {
      await removeUserFromRole({
        userID: userId,
        roleID: roleId,
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ): Promise<any> => {
    const currentLength = event?.target?.value?.length;
    setIsOpenBackDrop(true);
    if (selectedRoles.length > currentLength) {
      const diff = difference(selectedRoles as number[], event.target.value);
      await removeRole(diff[0]);
    } else {
      await formHandler(event?.target?.value[event.target.value.length - 1]);
    }
    setIsOpenBackDrop(false);
    setSelectedRoles(event.target.value as string[]);
  };

  return (
    <>
      <div className={root}>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <span>نام کاربر: </span>
            </Grid>
            <Grid item xs={6}>
              <span>{`${userData?.name} ${userData?.family}`}</span>
            </Grid>

            <Divider />

            <Grid item xs={12}>
              <FormControl className={roleInput}>
                <InputLabel id="user-roles-list">نقش های کاربر:</InputLabel>
                <Select
                  variant="outlined"
                  labelId="user-roles-list"
                  id="roles-list"
                  multiple
                  input={<Input />}
                  MenuProps={MenuProps}
                  value={selectedRoles}
                  onChange={handleChange}
                  renderValue={(selected: any): string => {
                    const items = roleListData?.items
                      .filter((item: any) => selected.indexOf(item.id) !== -1)
                      .map((item: any) => item.name);

                    return ((items as string[]) ?? []).join(', ');
                  }}
                >
                  {rolesListGenerator()}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} className={buttonContainer}>
              <Button
                color="pink"
                type="button"
                onClick={toggleForm}
                className={cancelButton}
              >
                {t('general.close')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <BackDrop isOpen={isOpenBackDrop} />
    </>
  );
};

export default RoleForm;

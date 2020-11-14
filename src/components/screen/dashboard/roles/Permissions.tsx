import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  PermissionItemsInterface,
} from "../../../../interfaces";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

interface PermissionProps {
 permissionItems?: any;
 className: any;
 reducer: any;
}

const permissionGridsGenerator = (
  permissionItems: PermissionItemsInterface[],
  permissions: any,
  className: any,
  togglePermissionHandler: any
): any => {
  const { formPaper, gridTitle, gridFormControl, gridContainer } = className;

  let el: JSX.Element[] | null = null;
  if (permissionItems !== undefined) {
    el = permissionItems
      .map((permissionItem: PermissionItemsInterface) => {
        return (
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            key={permissionItem.category}
          >
            <Paper className={formPaper}>
              <Typography className={`${gridTitle} txt-md`} variant="h6" component="h6">
                {permissionItem.category}
              </Typography>
              <FormControl component="fieldset" className={gridFormControl}>
                <FormGroup>
                  {permissionItem.permissionItems.map((per) => {
                    return (
                      <FormControlLabel
                        key={per.permissionName}
                        control={
                          <Checkbox
                            color="primary"
                            name={per.permissionName}
                            checked={permissions.indexOf(per.permissionName) !== -1}
                            onChange={(): void => togglePermissionHandler(per.permissionName)}
                          />
                        }
                        label={per.title}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
            </Paper>
          </Grid>
        );
      });
  }
  return (
    <Grid
      container
      spacing={2}
      className={gridContainer}
    >
      {el}
    </Grid>
  );
}

const Permissions: React.FC<PermissionProps> = (props) => {
  const { permissionItems, className, reducer: { state, dispatch } } = props;

  const togglePermissionHandler = useCallback((permission: string): void => {
    if (state.permissions.indexOf(permission) !== -1) {
      const idx = state.permissions.indexOf(permission);
      state.permissions.splice(idx, 1);
      dispatch({ type: 'removePermissions', value: state.permissions });
    }
    else {
      dispatch({ type: 'addPermissions', value: permission });
    }
  }, [dispatch, state.permissions]);

  return useMemo(
    () => permissionGridsGenerator(permissionItems, state.permissions, className, togglePermissionHandler),
    [permissionItems, state.permissions, className, togglePermissionHandler]
  );
}

export default Permissions;

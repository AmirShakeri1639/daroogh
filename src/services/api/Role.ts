import Api from './Api';
import { errorHandler } from '../../utils';
import { NewRoleData, UserRoleInterface } from '../../interfaces';
import { RoleType } from '../../enum';

class Role extends Api {
  readonly urls = {
    all: '/Roles/AllRoles',
    allRolePermissionItems: '/Roles/AllPermissionItems',
    removeRoleById: '/Roles/Remove/',
    saveNewRole: '/Roles/Save',
    roleById: '/Roles/Detail/',
    addUserToRole: '/Roles/AddUserToRole',
    getRoleOfUser: '/Roles/GetRolesOfUser',
    removeUserRoles: '/Roles/RemoveAllPharmacyRole',
  };

  getAllRoles = async (type?: RoleType): Promise<any> => {
    try {
      let equalType = '';
      if (type === RoleType.PHARMACY) {
        equalType = "'ForPharmacy'";
      }
      const result = await this.postJsonData(
        `${this.urls.all}${type ? `?$filter=type eq ${equalType}` : ''}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getAllRolePermissionItems = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.allRolePermissionItems);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  removeRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.removeRoleById}${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  saveNewRole = async (data: NewRoleData): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.saveNewRole, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.roleById}${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  addUserToRole = async (data: UserRoleInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.addUserToRole, data);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  removeUserFromRole = async (data: UserRoleInterface): Promise<any> => {
    const result = await this.postJsonData(`/Roles/RemoveUserFronRole`, data);
    return result.data;
  };

  getRolesOfUser = async (userId: number | string): Promise<any> => {
    const result = await this.postData(`/Roles/GetRolesOfUser?userId=${userId}`);
    return result.data;
  };

  removeUserRoles = async (userId: number | string): Promise<any> => {
    const result = await this.postData(`/Roles/RemoveAllPharmacyRole?userId=${userId}`);
    return result.data;
  };
}

export default Role;

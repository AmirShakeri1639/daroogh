import Api from './Api';
import { errorHandler } from "../../utils";
import { NewRoleData, UserRoleInterface } from "../../interfaces";

class Role extends Api {
  readonly urls = {
    all: '/Roles/AllRoles',
    allRolePermissionItems: '/Roles/AllPermissionItems',
    removeRoleById: '/Roles/Remove/',
    saveNewRole: '/Roles/Save',
    roleById: '/Roles/Detail/',
    addUserToRole: '/Roles/AddUserToRole',
  }

  getAllRoles = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.all);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllRolePermissionItems = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.allRolePermissionItems);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  removeRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.removeRoleById}${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  saveNewRole = async (data: NewRoleData): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.saveNewRole,
        data,
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.roleById}${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  addUserToRole = async (data: UserRoleInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        this.urls.addUserToRole,
        data
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default Role;

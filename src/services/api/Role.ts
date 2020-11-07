import Api from './Api';
import { errorHandler } from "../../utils";
import { NewRoleData } from "../../interfaces";

class Role extends Api {
  getAllRoles = async (): Promise<any> => {
    try {
      const result = await this.postJsonData('/Roles/AllRoles');
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllRolePermissionItems = async (): Promise<any> => {
    try {
      const result = await this.postJsonData('/Roles/AllPermissionItems');
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  removeRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`/Roles/Remove/${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  saveNewRole = async (data: NewRoleData): Promise<any> => {
    try {
      const result = await this.postJsonData(
        '/Roles/Save',
        data,
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getRoleById = async (roleId: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`/Roles/Detail/${roleId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default Role;

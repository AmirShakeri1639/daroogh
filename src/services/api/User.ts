import Api from './Api';
import { errorHandler } from '../../utils';
import {
  ChangeUserPasswordInterface,
  NewUserData,
} from '../../interfaces/user';

class User extends Api {
  readonly urls = {
    currentPharmacyUsers: '/User/AllPharmacyUsers?$filter=active eq true',
    impersonate: '/User/GetNewToken?newPharmacyID=',
  };

  getUserData = async (): Promise<any> => {
    try {
      const result = await this.postJsonData('/User/Profile');
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getAllUsers = async (skip: number = 0, top: number = 10): Promise<any> => {
    try {
      const result = await this.postData(
        `/User/AllUsers?$top=${top}&$skip=${skip * top}&$orderby=id desc`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getCurrentPharmacyUsers = async (
    skip: number = 0,
    top: number = 1
  ): Promise<any> => {
    try {
      const result = await this.postData(
        `${this.urls.currentPharmacyUsers}&$top=${top}&$skip=${skip * top}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  impersonate = async (id: number | string): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.impersonate}${id}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  saveNewUser = async (data: NewUserData): Promise<any> => {
    return await this.postJsonData('/User/Save', data);
  };

  removeUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(`/User/Remove/${userId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  disableUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `/User/DisableUser?userId=${userId}`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  changeUserPassword = async (
    data: ChangeUserPasswordInterface
  ): Promise<any> => {
    return await this.postData(
      `/User/ChangePassword?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`
    );
  };

  getUserById = async (userId: string | number): Promise<any> => {
    const result = await this.postData(`/User/GetUser?userId=${userId}`);
    return result.data;
  };

  setNotification = async (notifKey: string): Promise<any> => {
    const result = await this.postData(
      `/User/SetNotificationKey?notifKey=${notifKey}`
    );
    return result.data;
  };
}

export default User;

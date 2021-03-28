import Api from './Api';
import { errorHandler } from '../../utils';
import {
  ChangeUserPasswordInterface,
  NewUserData,
} from '../../interfaces/user';
import { NewPharmacyUserData } from '../../model';
import { DataTableColumns } from 'interfaces/DataTableColumns';

class User extends Api {
  readonly urls = {
    profile: '/User/Profile',
    all: '/User/AllUsers',
    save: '/User/Save',
    remove: '/User/Remove/',
    changePassword: '/User/ChangePassword',
    getUser: '/User/GetUser?userId=',
    currentPharmacyUsers: '/User/AllPharmacyUsers?',
    impersonate: '/User/GetNewToken?newPharmacyID=',
    addUserByPharmacyManager: '/User/AddUserByPharmacyManager',
    setNotificationKey: '/User/SetNotificationKey?notifKey=',
    disableUser: '/User/DisableUser?userId=',
    changeProfileImage: '/User/ChangeProfileImage?userId=',
  };

  profile = async (): Promise<any> => {
    try {
      const result = await this.postJsonData(this.urls.profile);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getAllUsers = async (skip: number = 0, top: number = 10): Promise<any> => {
    try {
      const result = await this.postData(
        `${this.urls.all}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  getCurrentPharmacyUsers = async (
    skip: number = 0,
    top: number = 1,
    searchableColumns: DataTableColumns[] = [],
    searchText: string = ""
  ): Promise<any> => {
    var filter = 'true';
    if (searchText.trim() != "") {
      filter = `(contains(cast(id,'Edm.String'),'${searchText}')or contains(cast(name,'Edm.String'),'${searchText}')or contains(cast(family,'Edm.String'),'${searchText}')or contains(cast(mobile,'Edm.String'),'${searchText}')or contains(cast(email,'Edm.String'),'پ')or contains(cast(nationalCode,'Edm.String'),'پ')or contains(cast(userName,'Edm.String'),'${searchText}')or contains(cast(pharmacyName,'Edm.String'),'${searchText}'))`
    }
    try {
      const result = await this.postData(
        `${this.urls.currentPharmacyUsers}&$top=${top}&$skip=${skip * top}&$filter=${filter}&$orderby=id desc`
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
    return await this.postJsonData(this.urls.save, data);
  };

  removeUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(`${this.urls.remove}${userId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  };

  disableUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `${this.urls.disableUser}${userId}`
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
      `${this.urls.changePassword}?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`
    );
  };

  getUserById = async (userId: string | number): Promise<any> => {
    const result = await this.postData(`${this.urls.getUser}${userId}`);
    return result.data;
  };

  setNotification = async (notifKey: string): Promise<any> => {
    const result = await this.postData(
      `${this.urls.setNotificationKey}${notifKey}`
    );
    return result.data;
  };

  addPharmacyUser = async (data: NewPharmacyUserData): Promise<any> => {
    const result = await this.postJsonData(
      this.urls.addUserByPharmacyManager,
      data
    );

    return result.data;
  };

  changeProfileImage = async (userId: number | string, pic: any): Promise<any> => {
    const result = await this.postFormData(
      `${this.urls.changeProfileImage}${userId}`,
      { file: pic }
    )
    return result.data;
  }
}

export default User;

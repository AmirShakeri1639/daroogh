import Api from "./Api";
import {errorHandler} from "../../utils";
import {NewUserData} from "../../interfaces/user";

class User extends Api {
  getUserData = async (): Promise<any> => {
    try {
      const result = await this.postJsonData('/User/Profile');
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  getAllUsers = async (): Promise<any> => {
    try {
      const result = await this.postData('/User/AllUsers');
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  saveNewUser = async (data: NewUserData): Promise<any> => {
    try {
      const result = await this.postJsonData(
        '/User/Save',
        data,
      );
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  removeUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(`/User/Remove/${userId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }

  disableUser = async (userId: number): Promise<any> => {
    try {
      const result = await this.postJsonData(`/User/DisableUser?userId=${userId}`);
      return result.data;
    } catch (e) {
      errorHandler(e);
    }
  }
}

export default User;

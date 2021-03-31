import Api from "./Api";
import { ForgetPasswordDataInterface, UserLoginInterface } from "../../interfaces";

class Account extends Api {
  loginUser = async (data: UserLoginInterface): Promise<any> => {
    const result = await this.postJsonData(
      '/Account/Login',
      data,
    );
    return result.data;
  }

  forgetPassword = async (data: ForgetPasswordDataInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        `/Account/ForgetPassword?mobile=${data.mobile}`,
      );
      return result.data;
    }
    catch (e) {
      return e;
    }
  }
}

export default Account;

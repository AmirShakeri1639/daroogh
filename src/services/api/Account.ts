import Api from "./Api";
import { UserLoginInterface } from "../../interfaces";
import { errorHandler } from "../../utils";

class Account extends Api {
  loginUser = async (data: UserLoginInterface): Promise<any> => {
    try {
      const result = await this.postJsonData(
        '/api/Account/Login',
        data,
      );
      return result.data;
    }
    catch (e) {
      errorHandler(e);
    }
  }
}

export default Account;

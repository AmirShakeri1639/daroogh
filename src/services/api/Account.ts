import Api from "./Api";
import { UserLoginInterface } from "../../interfaces";

class Account extends Api {
  protected async loginUser(data: UserLoginInterface): Promise<any> {
    const result = await this.postJsonData(
      '/api/Account/Login',
      data,
    );
    return result.data;
  }
}

export default Account;

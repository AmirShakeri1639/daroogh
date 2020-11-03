import Api from "./Api";

class User extends Api {
  getUserData = async (): Promise<any> => {
    try {
      const result = await this.postJsonData('/User/Profile');
      return result.data;
    } catch (e) {
      console.log(e)
    }
  }
}

export default User;

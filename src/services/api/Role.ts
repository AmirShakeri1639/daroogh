import Api from './Api';

class Role extends Api {
  getAllRoles = async (): Promise<any> => {
    try {
      const result = await this.getData('/Roles/AllRoles');
      return result.data;
    } catch (e) {
      //
    }
  }
}

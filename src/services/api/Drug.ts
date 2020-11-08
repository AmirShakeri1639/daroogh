import Api from './Api'
import { DrugInterface } from '../../interfaces/DrugInterface'

class Drug extends Api {
  protected async drugSave(data: DrugInterface): Promise<any> {
    const result = await this.postJsonData(
      'Drugs/Save',
      data
    );
    return result.data;
  }
}

export default Accoutn;

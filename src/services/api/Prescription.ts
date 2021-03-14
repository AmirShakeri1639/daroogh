import Api from './Api';
import { PrescriptionResponseInterface } from '../../interfaces';
import { PrescriptionSendInterface } from '../../interfaces/PrescriptionInterface';

class Prescription extends Api {
  readonly urls = {
    getList: '/Prescription/GetPrescriptionForPharmacy',
    save: '/Prescription/SavePharmacyResponse',
    getPrescriptionOfUser: '/Prescription/GetPrescriptionOfUser',
    send: '/Prescription/Send',
    cancel: '/Prescription/Cancel',
    detail: '/Prescription/Detail',
  };

  getList = async (skip: number, top: number = 10): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getList}?$top=${top}&$skip=${skip * top}&$orderby=id desc`
    );
    return result.data;
  };

  getPrescriptionsCount = async (): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getList}?$filter=cancelDate eq null ` +
      `and expireDate gt now() `
    );
    return result.data.items.length;
  };

  getPrescriptionOfUser = async (
    skip: number,
    top: number = 10
  ): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getPrescriptionOfUser}`
    );
    return result.data;
  };
  
  detail = async (id: number): Promise<any> => {
    const result = await this.postJsonData(`${this.urls.detail}/${id}`);
    return result.data;
  };
  
  cancel = async (id: number): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.cancel}?prescriptionID=${id}`
    );
    return result.data;
  };

  save = async (data: PrescriptionResponseInterface): Promise<any> => {
    const { prescriptionID, isAccept, pharmacyComment } = data;
    const result = await this.postJsonData(
      `${this.urls.save}?prescriptionID=${prescriptionID}` +
        `&isAccept=${isAccept}&pharmacyComment=${pharmacyComment}`
    );
    return result.data;
  };

  send = async (data: PrescriptionSendInterface): Promise<any> => {
    const result = await this.postFormData(
      `${this.urls.send}?duration=${data.duration}` +
        `&contryDivisionCode=${data.contryDivisionCode}`,
      { file: data.file, comment: data.comment }
    );
    return result.data;
  };
}

export default Prescription;

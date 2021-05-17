import Api from './Api';
import { PrescriptionResponseInterface } from '../../interfaces';
import { PrescriptionSendInterface } from '../../interfaces/PrescriptionInterface';
import { DataTableColumns } from 'interfaces/DataTableColumns';
import { PrescriptionResponseStateEnum } from 'enum'

class Prescription extends Api {
  readonly urls = {
    getList: '/Prescription/GetPrescriptionForPharmacy',
    save: '/Prescription/SavePharmacyResponse',
    getPrescriptionOfUser: '/Prescription/GetPrescriptionOfUser',
    send: '/Prescription/Send',
    cancel: '/Prescription/Cancel',
    detail: '/Prescription/Detail',
    getAllPrescriptions: '/Prescription/GetAllPrescription',
    // PrescriptionResponseStateEnum.Accept
    acceptedPrescriptions: '/Prescription/GetAllPrescription?state=2',
  };

  getList = async (skip: number, top: number = 10,searchableColumns: DataTableColumns[] = [],
    searchText: string = ""): Promise<any> => {
      var filter = 'true';
      if (searchText.trim() != "") {
        filter = `(contains(cast(comment,'Edm.String'),'${searchText}'))`
      }
    const result = await this.postJsonData(
      `${this.urls.getList}?$top=${top}&$skip=${skip * top}&$orderby=id desc&$filter=${filter}`
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

  getAllPrescriptions = async (
    state: PrescriptionResponseStateEnum | null = null
  ): Promise<any> => {
    const result = await this.postJsonData(
      `${this.urls.getAllPrescriptions}?state=${state}`
    )
    return result.data
  }
}

export default Prescription;

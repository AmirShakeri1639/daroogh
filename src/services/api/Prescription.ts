import Api from './Api';
import { PrescriptionResponseInterface } from '../../interfaces';

class Prescription extends Api {
    readonly urls = {
        getList: '/Prescription/GetPrescriptionForPharmacy',
        save: '/Prescription/SavePharmacyResponse',
    }

    getList = async (skip: number, top: number = 10): Promise<any> => {
        const result = await this.postJsonData(this.urls.getList);
        return result.data;
    }

    save = async (data: PrescriptionResponseInterface): Promise<any> => {
        const {
            prescriptionID, isAccept, pharmacyComment
        } = data;
        const result = await this.postJsonData(
            `${this.urls.save}?prescriptionID=${prescriptionID}` +
            `&isAccept=${isAccept}&pharmacyComment=${pharmacyComment}`
        );
        return result.data;
    }
}

export default Prescription;

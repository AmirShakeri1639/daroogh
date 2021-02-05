import { PrescriptionResponseStateEnum } from "../enum";

export interface PrescriptionResponseInterface {
    prescriptionID: number;
    pharmacyComment: string;
    isAccept: boolean;
    state: PrescriptionResponseStateEnum;
}

export interface PrescriptionInterface {
    id: number;
    senderUserID: number;
    sendDate: string;
    expireDate: string;
    contryDivisionCode: string;
    contryDivisionName: string;
    comment: string;
    cancelDate: string;
    fileKey: string;
    duration: number;
    readOnly: boolean;
    prescriptionResponse: PrescriptionResponseInterface;
}

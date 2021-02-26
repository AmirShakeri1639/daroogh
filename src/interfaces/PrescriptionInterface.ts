import { PrescriptionResponseStateEnum } from "../enum";

export interface PrescriptionResponseInterface {
    prescriptionID: number;
    pharmacyComment: string;
    isAccept: boolean;
    state: PrescriptionResponseStateEnum;
}
export interface PrescriptionSendInterface {
    duration: number;
    contryDivisionCode: string;
    comment: string;
    file: string;
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
    prescriptionResponse: PrescriptionResponseInterface[];
}


export interface PrescriptionInputInterface {
    id: number;
    sendDate: string;
    contryDivisionCode: string;
    contryDivisionName: string;
    comment: string;
    fileKey: string;
  }
  
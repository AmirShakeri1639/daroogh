import { DrugI } from "./AllPharmacyDrugInterface";

export interface ViewExchangeInterface {
    id: number;
    state: number;
    canceller: any;
    stateString: string;
    currentPharmacyIsA: boolean;
    pharmacyKeyA: string;
    pharmacyKeyB: string;
    pharmacyCityA: string;
    pharmacyProvinceA: string;
    pharmacyCityB: string;
    pharmacyProvinceB: string;
    confirmA: any;
    confirmB: any;
    sendDate: any;
    confirmDateA: any;
    confirmDateB: any;
    paymentDateA: any;
    paymentDateB: any;
    cancelDate: any;
    description: string;
    lockSuggestion: boolean;
    allowShowPharmacyInfo: boolean;
    cartA: CardInfo[];
    cartB: CardInfo[];
}

export interface CardInfo {
    id: number;
    drugID: number;
    drug: DrugI;
    phamacyKey: string;
    addedByA: string;
    addedByB: string;
    packID?: number;
    expireDate: any;
    amount: number;
    cnt: number;
    offer1: number;
    offer2: number;
    pharmacyDrugID: number;
    confirmed?: boolean;
}

export interface CardDrugInfo{
    id: number;
    category: CardCategoryInfo;
    name: string;
    enName: string;
    genericName: string;
    type: string;
    active: boolean;
    companyName: string;
    barcode: boolean;
    description: string;
}

export interface CardCategoryInfo{
    id: number;
    name: string;
    type: number;
    parent?: number;
    typeString: string;
}
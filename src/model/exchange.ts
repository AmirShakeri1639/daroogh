export class AddDrog1 {
  pharmacyDrugID: number = 0;
  count: number = 0;
  pharmacyKey: string = '';
}

export class AddDrog2 {
  pharmacyDrugID: number = 0;
  count: number = 0;
  exchangeID: number = 0;
}

export class AddPack1 {
  packID: number = 0;
  pharmacyKey: string = '';
}

export class AddPack2 {
  packID: number = 0;
  exchangeID: number = 0;
}

export class RemovePack1 {
  packID: number = 0;
  pharmacyKey: string = '';
}

export class RemovePack2 {
  packID: number = 0;
  exchangeID: number = 0;
}

export class Send {
  exchangeID: number = 0;
  lockSuggestion: boolean = false;
}

export class Cancel {
  exchangeID: number = 0;
  comment: string = '';
}

export class ConfirmOrNotExchange {
  exchangeID: number = 0;
  isConfirm: boolean = true;
}

export class Payment {
  accountingIds: number[] = [];
  bankGetway: string = '';
}

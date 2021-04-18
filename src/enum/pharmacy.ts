export enum _PharmacyTypeEnum {
  FUZZY = '0',
  CONTAINS = '1',
  START_WITH = '2',
  EXACT = '3',
}

export enum PharmacyFileStateEnum {
  // در دست بررسی
  None = 0,
  Confirmed = 1,
  UnConfirmed = 2
}

export enum UserQueryEnum {
  GET_ALL_USERS = 'getAllUsers',
  USERS_LIST = 'usersList',
  GET_USER_BY_ID = 'getUserById',
}

export enum CategoryQueryEnum {
  GET_ALL_CATEGORIES = 'getAllCategories',
}

export enum MessageQueryEnum {
  GET_ALL_MESSAGES = 'getAllMessages',
  GET_USER_MESSAGES = 'getUserMessages',
}

export enum DrugEnum {
  GET_ALL = 'all',
}

export enum PharmacyEnum {
  GET_ALL = 'all',
  GET_MEMBERS = 'members',
}

export enum AccountingEnum {
  GET_ALL = 'all',
}

export enum RoleQueryEnum {
  GET_ALL_ROLES = 'getAllRoles',
  GET_ALL_ROLE_PERMISSION_ITEMS = 'getAllRolePermissionItems',
  GET_ROLES_OF_USER = 'getRolesOfUser',
}

export enum PharmacyDrugEnum {
  GET_RELATED_PHARMACY_DRUG = 'getRelatedPharmacyDrug',
  GET_FAVORITE_LIST = 'getFavoriteList',
}

export enum PharmacyUsersEnum {
  GET_PHARMACY_USERS = 'getPharmacyUsers',
}

export enum AllPharmacyDrug {
  GET_ALL_PHARMACY_DRUG = 'allPharmacyDrug',
}

export enum MembershipRequestEnum {
  GET_ALL = 'all',
  GET_CHECKED = 'checked',
  GET_NOT_CHECKED = 'notChecked',
}

export enum PackEnum {
  GET_PHARMACY_PACKS = 'getPharmacyPacks',
}

export enum ExchangeEnum {
  GET_ALL_EXCHANGE = 'allExchange',
}

export enum PrescriptionEnum {
  GET_LIST = 'getList',
}

import { api } from '../config/default.json';

const dashboard = 'dashboard';
const exchange = 'exchange';
const finance = 'finance';
const member = 'members';
const favorite = 'favorite';
const peopleSection = 'peopleSection';
const pharmacy = 'pharmacy';
const role = 'role';
const user = 'user';
const drug = 'drug';
const category = 'category';
const message = 'message';
const pack = 'pack';
const exchangemanagement = 'exchangemanagement';
const jobSearch = 'job-search';
const prescription = 'prescription';

export default {
  login: '/login',
  registerPharmacyWithUser: `/register-pharmacy-with-user`,
  forgetPassword: '/forget-password',

  dashboard: `/${dashboard}`,
  desktop: `/${dashboard}/${exchange}/desktop`,
  transfer: `/${dashboard}/${exchange}/transfer`,
  supplyList: `/${dashboard}/${exchange}/supply-list`,

  transactions: `/${dashboard}/${finance}/transactions`,
  accountingInfo: `/${dashboard}/${finance}/accountingInfo`,
  membersList: `/${dashboard}/${member}/members-list`,
  drugFavoriteList: `/${dashboard}/${favorite}/drug`,

  prescription: `/${dashboard}/${peopleSection}/prescription`,
  jobApplication: `/${dashboard}/${peopleSection}/jobApplication`,
  
  drugCategoryfavoriteList: `/${dashboard}/${favorite}/drug-category`,

  createPharmacy: `/${dashboard}/${pharmacy}/create`,
  pharmaciesList: `/${dashboard}/${pharmacy}/list`,
  pharmacyUsersList: `/${dashboard}/${pharmacy}/users`,

  membershipRequests: `/${dashboard}/${pharmacy}/membership-requests`,
  memberRole: `/${dashboard}/${pharmacy}/member-role`,

  createRole: `/${dashboard}/${role}/create`,

  createUser: `/${dashboard}/${user}/create`,
  usersList: `/${dashboard}/${user}/list`,
  changeUserPassword: `/${dashboard}/${user}/change-user-password`,

  createDrug: `/${dashboard}/${drug}/create`,
  drugsList: `/${dashboard}/${drug}/list`,

  categoryList: `/${dashboard}/${category}/list`,

  createMessage: `/${dashboard}/${message}/create`,
  messagesList: `/${dashboard}/${message}/list`,

  packsList: `/${pack}/list`,
  createPack: `/${pack}/create`,

  exchangeManagementList: `/${dashboard}/${exchangemanagement}/list`,

  jobSearchList: `/${dashboard}/${jobSearch}/list`,

  prescriptionList: `/${dashboard}/${prescription}/list`,
  
  fileUrl: `${api.baseUrl}/File/GetFile?key=`,
  
  profile: `/${dashboard}/${user}/profile`,
  settings: `/${dashboard}/settings`,
};

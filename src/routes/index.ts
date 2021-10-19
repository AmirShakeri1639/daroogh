import { getBaseUrl } from 'config';

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
const job = 'job';
const fda = `/${dashboard}/fda`;
const error = `/${dashboard}/error`;
const reports = `/${dashboard}/reports`
const commisionSettings = 'settingsCommision';
const employmentApplication = 'employmentApplication';

const pharmacyRoutes = {
  pharmacyMessage: `/${dashboard}/${pharmacy}/messages`,
  surveyList: `/${dashboard}/${pharmacy}/surveyList`,
  aPharmacyDocs: `/${dashboard}/${pharmacy}/current-pharmacy-docs`,
};

export default {
  login: '/login',
  registerPharmacyWithUser: `/register-pharmacy-with-user`,
  forgetPassword: '/forget-password',
  otp: '/otp',

  employmentApplicationForAdmin: `/${dashboard}/${employmentApplication}/list`,
  
  dashboard: `/${dashboard}`,
  desktop: `/${dashboard}/${exchange}/desktop`,
  transfer: `/${dashboard}/${exchange}/transfer`,
  transferWithFavorites: `/${dashboard}/${exchange}/transfer?faves=true`,
  survey: `/${dashboard}/${exchange}/survey`,
  supplyList: `/${dashboard}/${exchange}/supply-list`,

  transactions: `/${dashboard}/${finance}/transactions`,
  accountingInfo: `/${dashboard}/${finance}/accountingInfo`,
  membersList: `/${dashboard}/${member}/members-list`,
  drugFavoriteList: `/${dashboard}/${favorite}/drug`,

  prescription: `/${dashboard}/${peopleSection}/prescription`,
  jobApplication: `/${dashboard}/${peopleSection}/employmentApplication`,
  findJob: `/${dashboard}/${peopleSection}/findJob`,

  drugCategoryfavoriteList: `/${dashboard}/${favorite}/drug-category`,

  createPharmacy: `/${dashboard}/${pharmacy}/create`,
  pharmaciesList: `/${dashboard}/${pharmacy}/list`,
  pharmacyUsersList: `/${dashboard}/${pharmacy}/users`,
  pharmacyDocs: `/${dashboard}/${pharmacy}/docs`,

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

  fileUrl: `${getBaseUrl()}/File/GetFile?key=`,

  profile: `/${dashboard}/${user}/profile`,
  settings: `/${dashboard}/site-settings`,
  settingsAi: `/${dashboard}/settingsAi`,
  surplusDrugs: `/${dashboard}/surplusDrugs`,
  Top10Pharmacy: `/${dashboard}/Top10Pharmacy`,
  favoriteDrugs: `/${dashboard}/favoriteDrugs`,
  selectedDrugs: `/${dashboard}/selectedDrugs`,
  jobsList: `/${dashboard}/${job}/list`,
  commisionSettingsList: `/${dashboard}/${commisionSettings}/list`,

  ...pharmacyRoutes,

  fda_exchangeList: `${fda}/exchange-list`,

  error401: `${error}/401`,

  loginCountReport: `${reports}/login-count`,
  allPharmacyDrugReport: `${reports}/all-pharmacy-drugs`,
  acceptedPrescriptionsReport: `${reports}/accepted-prescriptions`,
  allEmploymentApplicationsReport: `${reports}/all-employment-applications`,

  about: `/${dashboard}/about`,
};

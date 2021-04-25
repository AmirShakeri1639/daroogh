export enum UrlAddress {
  // baseUrl = 'https://api.daroog.org/api', //>>> important: USE getBaseUrl() INSTEAD
  getAllExchange = '/Exchange/AllExchange',
  getAllAccounting = '/Accounting/AllAccounting',
  getAllCategories = '/Categories/AllCategories',
  getAllDrug = '/Drugs/AllDrugs',
  getAllMessage = '/Message/AllMessage',
  getPharmacyUsers = '/User/AllPharmacyUsers', // ?$filter=active eq true
  getPharmacyRequests = '/MembershipRequest/GetPharmacyRequests', //?$filter=acceptDate eq null',
  getAllPharmacy = '/Pharmacy/AllPharmacy',
  getAllRole = '/Roles/AllRoles',
  getAllUser = '/User/AllUsers',
  getBestPharmaciesList = '/Reports/GetBestPharmacyListScores',
  // getPharmacyUsers = '/User/AllPharmacyUsers?$filter=active eq true',
  getAllJobs = '/Job/CurrentPharmacyJobs',
  getAllCommisions = '/CommissionAmount/AllCommissionDiscounts',
}

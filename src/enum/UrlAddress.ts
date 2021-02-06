export enum UrlAddress {
  baseUrl = 'https://api.daroog.org/api',
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
  // getPharmacyUsers = '/User/AllPharmacyUsers?$filter=active eq true',
}

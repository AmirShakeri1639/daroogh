const dashboard = 'dashboard';
const exchange = 'exchange';
const finance = 'finance';
const members = 'members';
const pharmacy = 'pharmacy';

export default {
  login: '/login',
  registerPharmacyWithUser: `/register-pharmacy-with-user`,

  desktop: `/${dashboard}/${exchange}/desktop`,
  transfer: `/${dashboard}/${exchange}/transfer`,
  supplyList: `/${dashboard}/${exchange}/supply-list`,
  
  transactions: `/${dashboard}/${finance}/transactions`,
  
  membershipRequests: `/${dashboard}/${pharmacy}/membership-requests`,
  memberRole: `/${dashboard}/${pharmacy}/member-role`,

};

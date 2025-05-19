export const routeRolesMap: { [key: string]: string[] } = {
  'POST /auth/signup': [],
  'POST /auth/login': [],
  'PATCH /auth/roles/:email': ['ADMIN'],
  'POST /event': ['OPERATOR', 'ADMIN'],
  'GET /event': [],
  'GET /event/:eventId': [],
  'PATCH /event/state': ['OPERATOR', 'ADMIN'],
  'POST /reward/detail': ['OPERATOR', 'ADMIN'],
  'GET /reward/detail': [],
  'POST /rewardRequest/:rewardId': ['USER', 'ADMIN'],
  'GET /rewardRequest': ['USER', 'ADMIN'],
  'GET /rewardRequest/monitoring': ['ADMIN', 'AUDITOR'],
};

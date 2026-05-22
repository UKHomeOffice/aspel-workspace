import KcAdminClient from '@keycloak/keycloak-admin-client';

export async function* getAllUsers(client: KcAdminClient) {
  let page = 0;
  while (true) {
    const users = await client.users.find({ first: page * 100, max: 100 });

    for (const user of users) {
      yield user;
    }

    if (users.length < 100) {
      break;
    }

    page += 1;
  }
}

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createMockFsPromises } from '../../helpers/mock-fs-promises.js';

const fsPromises = createMockFsPromises();

jest.unstable_mockModule('@keycloak/keycloak-admin-client', () => ({
  default: jest.fn()
}));

jest.unstable_mockModule('fs/promises', () => ({
  mkdir: fsPromises.mkdir,
  open: fsPromises.open
}));

const { default: RemoveRoleCommand } = await import('../../../dist/scripts/lib/keycloak-manage-roles/remove-role-command.js');

const role = { id: 'role-id', name: 'old-role' };
const defaultRole = { id: 'default-role-id', name: 'default-roles-asl-test' };
const users = [
  { id: 'user-1', email: 'user1@example.com' },
  { id: 'user-2', email: 'user2@example.com' }
];

describe('RemoveRoleCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KEYCLOAK_REALM = 'asl-test';
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates required role arguments and resolves config', async () => {
    const client = {
      roles: {
        findOneByName: jest.fn()
          .mockResolvedValueOnce(role)
          .mockResolvedValueOnce(defaultRole)
      },
      users: {}
    };
    const command = new RemoveRoleCommand(client);

    await expect(command.getConfig({ role: 'old-role' })).resolves.toEqual({
      role,
      defaultRole,
      filename: 'remove-roles.csv'
    });

    expect(client.roles.findOneByName).toHaveBeenNthCalledWith(1, { name: 'old-role' });
    expect(client.roles.findOneByName).toHaveBeenNthCalledWith(2, { name: 'default-roles-asl-test' });
  });

  it('throws when the role argument is missing', async () => {
    const command = new RemoveRoleCommand({ users: {}, roles: {} });

    await expect(command.getConfig({})).rejects.toThrow('--role must be provided');
  });

  it('removes the role from users who currently have it', async () => {
    const client = {
      roles: {
        delCompositeRoles: jest.fn(async () => {}),
        findOneByName: jest.fn(),
        getCompositeRolesForRealm: jest.fn(async () => [role])
      },
      users: {
        count: jest.fn(async () => users.length),
        delRealmRoleMappings: jest.fn(async () => {}),
        find: jest.fn(async () => users),
        listRealmRoleMappings: jest.fn()
          .mockResolvedValueOnce([{ name: 'old-role' }])
          .mockResolvedValueOnce([])
      }
    };
    const command = new RemoveRoleCommand(client);
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});

    await command.run({ role, defaultRole, filename: 'roles-removed.csv' });

    expect(client.roles.getCompositeRolesForRealm).toHaveBeenCalledWith({ id: 'default-role-id' });
    expect(client.roles.delCompositeRoles).toHaveBeenCalledWith(
      { id: 'default-role-id' },
      [{ id: 'role-id', name: 'old-role' }]
    );
    expect(fsPromises.mkdir).toHaveBeenCalledWith(expect.stringContaining('/output'), { recursive: true });
    expect(fsPromises.open).toHaveBeenCalledWith(expect.stringContaining('output/roles-removed.csv'), 'w');
    expect(client.users.find).toHaveBeenCalledWith({ first: 0, max: 100 });
    expect(client.users.delRealmRoleMappings).toHaveBeenCalledTimes(1);
    expect(client.users.delRealmRoleMappings).toHaveBeenCalledWith({
      id: 'user-1',
      roles: [{ id: 'role-id', name: 'old-role' }]
    });
    expect(fsPromises.outfile.close).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenCalledWith('Added old-role to default-roles-asl-test');
    expect(consoleMock).toHaveBeenCalledWith('Processing 2 users ...');
    expect(fsPromises.getWrittenText()).toEqual([
      'id,email,userRoles,removed role?\n',
      'user-1,user1@example.com,,true\n',
      'user-2,user2@example.com,,false\n'
    ].join(''));
  });
});

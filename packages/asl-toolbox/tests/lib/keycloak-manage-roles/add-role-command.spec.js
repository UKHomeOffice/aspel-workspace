import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createMockFsPromises } from '../../helpers/mock-fs-promises.js';

const fsPromises = createMockFsPromises();

jest.unstable_mockModule('@keycloak/keycloak-admin-client', () => ({
  default: jest.fn()
}));

jest.unstable_mockModule('node:fs/promises', () => ({
  mkdir: fsPromises.mkdir,
  open: fsPromises.open
}));

const { default: AddRoleCommand } = await import('../../../scripts/lib/keycloak-manage-roles/add-role-command.js');

const role = { id: 'role-id', name: 'new-role' };
const defaultRole = { id: 'default-role-id', name: 'default-roles-asl-test' };
const users = [
  { id: 'user-1', email: 'user1@example.com' },
  { id: 'user-2', email: 'user2@example.com' }
];

describe('AddRoleCommand', () => {
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
    const command = new AddRoleCommand(client);

    await expect(command.getConfig({ role: 'new-role', description: 'A role' })).resolves.toEqual({
      role,
      defaultRole,
      filename: 'add-roles.csv'
    });

    expect(client.roles.findOneByName).toHaveBeenNthCalledWith(1, { name: 'new-role' });
    expect(client.roles.findOneByName).toHaveBeenNthCalledWith(2, { name: 'default-roles-asl-test' });
  });

  it('throws when the role argument is missing', async () => {
    const command = new AddRoleCommand({ users: {}, roles: {} });

    await expect(command.getConfig({})).rejects.toThrow('--role must be provided');
  });

  it('adds the role to users who do not already have it', async () => {
    const client = {
      roles: {
        createComposite: jest.fn(async () => {}),
        findOneByName: jest.fn(),
        getCompositeRolesForRealm: jest.fn(async () => [])
      },
      users: {
        addRealmRoleMappings: jest.fn(async () => {}),
        count: jest.fn(async () => users.length),
        find: jest.fn(async () => users),
        listRealmRoleMappings: jest.fn()
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([{ name: 'new-role' }])
      }
    };
    const command = new AddRoleCommand(client);
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});

    await command.run({ role, defaultRole, filename: 'roles-added.csv' });

    expect(client.roles.getCompositeRolesForRealm).toHaveBeenCalledWith({ id: 'default-role-id' });
    expect(client.roles.createComposite).toHaveBeenCalledWith(
      { roleId: 'default-role-id' },
      [{ id: 'role-id', name: 'new-role' }]
    );
    expect(fsPromises.mkdir).toHaveBeenCalledWith(expect.stringContaining('/output'), { recursive: true });
    expect(fsPromises.open).toHaveBeenCalledWith(expect.stringContaining('output/roles-added.csv'), 'w');
    expect(client.users.find).toHaveBeenCalledWith({ first: 0, max: 100 });
    expect(client.users.addRealmRoleMappings).toHaveBeenCalledTimes(1);
    expect(client.users.addRealmRoleMappings).toHaveBeenCalledWith({
      id: 'user-1',
      roles: [{ id: 'role-id', name: 'new-role' }]
    });
    expect(fsPromises.outfile.close).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenCalledWith('Added new-role to default-roles-asl-test');
    expect(consoleMock).toHaveBeenCalledWith('Processing 2 users ...');
    expect(fsPromises.getWrittenText()).toEqual([
      'id,email,userRoles,added role?\n',
      'user-1,user1@example.com,new-role,true\n',
      'user-2,user2@example.com,new-role,false\n'
    ].join(''));
  });
});

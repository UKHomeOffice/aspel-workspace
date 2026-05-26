import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Command, ValidatedRole } from './types.js';
import { ParsedArgs } from 'minimist';
import { asPayload, getValidRole, removeRoleFromComposite } from './helpers/role.js';
import { mkdir, open } from 'fs/promises';
import path from 'path';
import { ProgressBar } from '../progress-bar.js';
import { forEach, fromAsyncIterable, map, toCSV } from '../stream.js';
import { getAllUsers } from './helpers/users.js';
import { Writable } from 'stream';

type Args = {
  role: ValidatedRole;
  defaultRole: ValidatedRole;
  filename: string;
};

export default class RemoveRoleCommand implements Command<Args> {
  private readonly client: KeycloakAdminClient;
  readonly usage: string = `
  
  `;

  constructor(client: KeycloakAdminClient) {
    this.client = client;
  }

  async getConfig<T extends ParsedArgs>(args: T): Promise<Args> {
    const roleName = args.role;
    if (typeof roleName !== 'string') {
      throw new Error(`--role must be provided\n\n${this.usage}`);
    }

    const role = await getValidRole(roleName, this.client);

    const defaultRoleName = `default-roles-${process.env.KEYCLOAK_REALM}`;
    const defaultRole = await getValidRole(defaultRoleName, this.client);

    const filename = args.filename ?? 'remove-roles.csv';
    if (typeof filename !== 'string') {
      throw new Error(`--filename must be a string\n\n${this.usage}`);
    }

    return {
      role,
      defaultRole,
      filename
    };
  }

  async run({ role, defaultRole, filename: outputFilename }: Args): Promise<void> {
    await removeRoleFromComposite(defaultRole, role, this.client);

    const roles = [asPayload(role)];

    await mkdir(path.join(process.cwd(), 'output'), { recursive: true });
    const outfile = await open(path.join('output', outputFilename), 'w');

    try {
      const count = Number(await this.client.users.count());

      console.log(`Processing ${count} users ...`);
      const progressBar = new ProgressBar(count);

      await fromAsyncIterable(getAllUsers(this.client))
        .pipeThrough(map(
          async user => {
            let userRoles =
              (await this.client.users.listRealmRoleMappings({ id: user.id! }))
                .map(existingRole => existingRole.name)
                .filter((existingRole): existingRole is string => !!existingRole);
            const hasRole = userRoles.some(existingRole => existingRole === role.name);

            if (hasRole) {
              await this.client.users.delRealmRoleMappings({ id: user.id!, roles });
              userRoles = userRoles.filter(name => name !== role.name);
            }

            return {
              id: user.id!,
              email: user.email || '',
              userRoles: userRoles.join(','),
              'removed role?': hasRole ? 'true' : 'false'
            };
          }
        ))
        .pipeThrough(forEach(async () => progressBar.increment()))
        .pipeThrough(toCSV())
        .pipeTo(Writable.toWeb(outfile.createWriteStream()));

      await progressBar.complete();
    } finally {
      await outfile.close();
    }
  }

}

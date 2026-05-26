import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Command, ValidatedRole } from './types.js';
import { ParsedArgs } from 'minimist';
import { addRoleToComposite, asPayload, getOrCreateRole, getValidRole } from './helpers/role.js';
import { open, mkdir } from 'fs/promises';
import path from 'path';
import { ProgressBar } from '../progress-bar.js';
import { forEach, fromAsyncIterable, map, toCSV } from '../stream.js';
import { getAllUsers } from './helpers/users.js';
import { Writable } from 'stream';

type Args = {
  role: ValidatedRole;
  defaultRole: ValidatedRole;
  filename: string;
}

export default class AddRoleCommand implements Command<Args> {
  private readonly client: KeycloakAdminClient;
  readonly usage: string = `Usage: keycloak-manage-roles.js add-role [opts]

Options:
  --role           The name of the role to add (required)
  --description    If the role does not already exist this will need to be provided to create it
  --filename       CSV file to write under ./output (default: roles-added.csv)
  --help           Show this help`;

  constructor(client: KeycloakAdminClient) {
    this.client = client;
  }


  async getConfig<T extends ParsedArgs>(args: T): Promise<Args> {
    const roleName = args.role;
    if (typeof roleName !== 'string') {
      throw new Error(`--role must be provided`);
    }

    const role = await getOrCreateRole(roleName, args.description, this.client);

    const defaultRoleName = `default-roles-${process.env.KEYCLOAK_REALM}`;
    const defaultRole = await getValidRole(defaultRoleName, this.client);

    const filename = args.filename ?? 'add-roles.csv';
    if (typeof roleName !== 'string') {
      throw new Error(`--filename must be a string`);
    }

    return {
      role,
      defaultRole,
      filename
    }
  }

  async run({ role, defaultRole,filename: outputFilename }: Args): Promise<void> {
    await addRoleToComposite(defaultRole, role, this.client);

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
            const userRoles =
              (await this.client.users.listRealmRoleMappings({ id: user.id! }))
                .map(existingRole => existingRole.name)
                .filter((existingRole): existingRole is string => !!existingRole);
            const hasRole = userRoles.some(existingRole => existingRole === role.name);

            if (!hasRole) {
              await this.client.users.addRealmRoleMappings({ id: user.id!, roles });
              userRoles.push(role.name);
            }

            return {
              id: user.id!,
              email: user.email || '',
              userRoles: userRoles.join(','),
              'added role?': hasRole ? 'false' : 'true'
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

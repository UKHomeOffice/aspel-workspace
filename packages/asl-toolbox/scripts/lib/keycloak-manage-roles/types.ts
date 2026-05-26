import { ParsedArgs } from 'minimist';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation.js';

export interface Command<Args> {
  usage: string;
  getConfig<T extends ParsedArgs>(args: T): Promise<Args>;
  run(args: Args): Promise<void>;
}

export type ValidatedRole = RoleRepresentation & {id: string, name: string};

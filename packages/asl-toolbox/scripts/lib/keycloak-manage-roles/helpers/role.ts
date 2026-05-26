import RoleRepresentation, { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation.js';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { ValidatedRole } from '../types.js';

function isValidRole(role: RoleRepresentation | undefined): role is ValidatedRole {
  return role?.id != null && role?.name != null
}

export async function getValidRole(roleName: string, client: KeycloakAdminClient): Promise<ValidatedRole> {
  let role = await client.roles.findOneByName({ name: roleName });

  if (isValidRole(role)) {
    return role;
  }

  throw new Error(`Role ${roleName} doesn't exist, please provide --description`);
}

export async function getOrCreateRole(roleName: string, description: unknown, client: KeycloakAdminClient): Promise<ValidatedRole> {
  let role = await client.roles.findOneByName({ name: roleName });

  if (isValidRole(role)) {
    return role;
  }

  if (typeof description !== 'string') {
    throw new Error("Role doesn't exist, please provide --description");
  }

  await client.roles.create({ name: roleName, description });
  role = await client.roles.findOneByName({ name: roleName });


  if (!isValidRole(role)) {
    throw new Error(`Unable to find or create role ${roleName}`);
  }

  return role
}

export async function addRoleToComposite(composite: ValidatedRole, child: ValidatedRole, client: KeycloakAdminClient): Promise<void> {
  const compositeRoles = await client.roles.getCompositeRolesForRealm({ id: composite.id });
  const alreadyIncluded = compositeRoles.some(existingRole => existingRole.id === child.id);

  if (!alreadyIncluded) {
    await client.roles.createComposite(
      { roleId: composite.id },
      [asPayload(child)],
    );

    console.log(`Added ${child.name} to ${composite.name}`);
  }
}

export async function removeRoleFromComposite(composite: ValidatedRole, child: ValidatedRole, client: KeycloakAdminClient): Promise<void> {
  const compositeRoles = await client.roles.getCompositeRolesForRealm({ id: composite.id });
  const alreadyRemoved = !compositeRoles.some(existingRole => existingRole.id === child.id);

  if (!alreadyRemoved) {
    await client.roles.delCompositeRoles(
      { id: composite.id },
      [asPayload(child)],
    );

    console.log(`Added ${child.name} to ${composite.name}`);
  }
}

export function asPayload(role: ValidatedRole): RoleMappingPayload {
  return {id: role.id, name: role.name};
}

#!/usr/bin/env node

import 'dotenv/config';
import minimist, { type ParsedArgs } from 'minimist';
import { isCliEntrypoint } from './lib/cli.js';
import AddRoleCommand from './lib/keycloak-manage-roles/add-role-command.js';
import RemoveRoleCommand from './lib/keycloak-manage-roles/remove-role-command.js';
import { buildClient } from './lib/keycloak-manage-roles/helpers/keycloak-client.js';

/**
 * Exit the process with an error message
 * @param msg        the message to display
 * @param exitCode   the exit code for the process (default 1)
 */
export function panic(msg: string, exitCode = 1): never {
  console.error(msg);
  process.exit(exitCode);
}

function usage(exitCode = 1): never {
  const text = `Usage: keycloak-manage-roles.js command [command-opts] [opts]

Options:
  command          Name of command to run must be one of ${
  Object
    .keys(commandFactories)
    .map(commandName => `\n                     - ${commandName}`)
}
  --filename       CSV file to write under ./output (default: roles-added.csv)
  --help           Show this help, or the help for the command provided`;

  panic(text, exitCode);
}

const commandFactories = {
  'add-role': async () => new AddRoleCommand(await buildClient()),
  'remove-role': async () => new RemoveRoleCommand(await buildClient())
};

type CommandName = keyof typeof commandFactories;

function hasOwn<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getCommandName(value: unknown): CommandName {
  if (typeof value !== 'string' || !hasOwn(commandFactories, value)) {
    usage();
  }

  return value;
}

async function runCommand<K extends CommandName>(commandName: K, argv: ParsedArgs): Promise<void> {
  const command = await commandFactories[commandName]();

  try {
    const args = await command.getConfig(argv);
    await command.run(args);
  } catch (error) {
    panic(`${error instanceof Error ? error.message : error}\n\n${command.usage}`);
  }
}

async function main(argv: ParsedArgs) {
  const command = getCommandName(argv._[0]);
  await runCommand(command, argv);
}

if (isCliEntrypoint(import.meta.url)) {
  const argv = minimist(process.argv.slice(2));
  const exitCode = await main(argv) ?? 0;

  process.exit(exitCode);
}

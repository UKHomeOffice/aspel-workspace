// eslint-plugin-implicit-dependencies doesn't recognise `node:` dependencies as builtin
/* eslint-disable implicit-dependencies/no-implicit */
import * as nodeReadline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
/* eslint-enable implicit-dependencies/no-implicit */

/**
 * A wrapper around `node:readline` for asking a single question that handles closing the readline interface once done.
 *
 * @param question                The prompt to show the user
 * @returns {Promise<string>}     This will be completed with the response line entered by the user
 */
export async function readline(question) {
  const rl = nodeReadline.createInterface({input, output});

  const answer = await rl.question(question);

  rl.close();

  return answer;
}

/**
 * Given the file url of a script, return true if the current process was started with that script url as the main
 * script for that process.
 *
 * Usage:
 * ```node
 * isCliEntrypoint(import.meta.url)
 * ```
 *
 * @param {string} scriptUrl
 */
export function isCliEntrypoint(scriptUrl) {
  return scriptUrl === (`file://${process.argv[1]}`);
}

import fs from 'fs';

export const parseWdioLogFailures = logFile => {
  const contents = fs.readFileSync(logFile).toString();
  const regex = /^\[\d+-\d+] FAILED in chrome - file:\/\/\/tests\/(.*)$/;

  return contents
    .split(/[\n\r]+/)
    .flatMap(line => {
      const match = line.match(regex);
      return match ? [`./${match[1]}`] : [];
    });
};

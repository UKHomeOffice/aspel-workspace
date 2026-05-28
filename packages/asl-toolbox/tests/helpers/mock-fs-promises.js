import { jest } from '@jest/globals';
// eslint-disable-next-line implicit-dependencies/no-implicit
import { Writable } from 'stream';

export function createMockFsPromises() {
  const chunks = [];

  const writable = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk).toString('utf8'));
      callback();
    }
  });

  const outfile = {
    close: jest.fn(async () => {}),
    createWriteStream: jest.fn(() => writable)
  };

  return {
    mkdir: jest.fn(async () => {}),
    open: jest.fn(async () => outfile),
    outfile,
    getWrittenText: () => chunks.join('')
  };
}

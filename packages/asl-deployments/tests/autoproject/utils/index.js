import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const eventualCorpus = fs.readFile(path.resolve(__dirname, './text.txt'))
  .then(contents => contents.toString('utf8').split(/\W/).filter(Boolean));

const between = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const randomWord = async predecessor => {
  const corpus = await eventualCorpus;
  if (predecessor) {
    const successors = corpus
      .map((word, i) => word.toLowerCase() === predecessor.toLowerCase() ? corpus[i + 1] : null)
      .filter(Boolean);
    if (successors.length) {
      return successors[between(0, successors.length)];
    }
  }
  return corpus[between(0, corpus.length)];
};

export const words = async n => {
  const output = [];
  let last = null;
  while (output.length < n) {
    last = await randomWord(last);
    output.push(last);
  }
  return output.join(' ');
};

export const sentence = async (min = 10, max = 60, newline = true) => {
  const txt = await words(between(min, max)) + '.';
  return txt.replace(/^\w/, c => c.toUpperCase()) + (newline ? '\n' : '');
};

export const paragraphs = async (min = 1, max = 3, { words } = { words: [] }) => {
  const result = [];
  const minWords = words[0] || 10;
  const maxWords = words[1] || 100;
  const len = between(min, max);
  while (result.length < len) {
    result.push(await sentence(minWords, maxWords));
  }
  return result;
};

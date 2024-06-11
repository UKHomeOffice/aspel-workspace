import { paragraphs } from './index.js';

export default async function () {
  // If the fast flag is set fill in a lot less text
  const value = process.env.FAST ? await paragraphs(1, 2, { words: [5, 10] }) : await paragraphs();
  await this.click();
  for (const v of value) { await browser.keys(v); }
}

const { Octokit } = require('@octokit/rest');
const Git = require('@lennym/commit');
const fs = require('fs');
const path = require('path');

module.exports = () => {

  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return Promise.reject(new Error('GITHUB_ACCESS_TOKEN is required'));
  }
  if (!process.env.CI || !process.env.DRONE_BUILD_NUMBER) {
    console.log('No CI build detected');
    return Promise.resolve();
  }

  const dir = path.resolve(__dirname, '../');
  const repo = 'ukhomeoffice/asl-deployments';
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const octokit = new Octokit({ auth: token });

  const branch = `visual-regression-${process.env.DRONE_BUILD_NUMBER}`;

  const baselines = fs.readdirSync(path.join(dir, 'actual'))
    .map(name => {
      return {
        name: `tests/visual-regression/baseline/${name}`,
        content: fs.readFileSync(path.resolve(dir, 'actual', name))
      };
    });

  const diffs = fs.readdirSync(path.join(dir, 'diff'))
    .map(name => {
      return {
        name: `tests/visual-regression/diff/${name}`,
        content: fs.readFileSync(path.resolve(dir, 'diff', name))
      };
    });

  if (!diffs.length && !baselines.length) {
    console.log('No changes to push');
    return Promise.resolve();
  }

  const client = Git({
    repo,
    token
  });

  baselines.forEach(file => {
    client.add(file.name, file.content);
  });

  diffs.forEach(file => {
    client.add(file.name, file.content);
  });

  return client
    .branch(branch)
    .commit(`Update baseline images from visual regression build ${process.env.DRONE_BUILD_NUMBER}`)
    .push()
    .then(() => {
      return octokit.pulls.create({
        owner: 'ukhomeoffice',
        repo: 'asl-deployments',
        title: `Visual Regression ${process.env.DRONE_BUILD_NUMBER}`,
        head: branch,
        base: 'master'
      });
    })
    .then(result => {
      console.log(`Opened PR at: ${result.data.html_url}`);
    })
    .catch(e => {
      console.error(e.stack);
    });

};

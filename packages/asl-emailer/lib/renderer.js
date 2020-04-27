const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

module.exports = () => {

  const render = mustache.render;
  const dir = path.resolve(__dirname, '../templates');

  const _templates = new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return resolve({});
      }
      files = files
        .filter(f => path.extname(f) === '.txt')
        .reduce((map, f) => {
          return {
            ...map,
            [path.basename(f, '.txt')]: { path: path.resolve(dir, f) }
          };
        }, {});

      resolve(files);
    });
  });

  const _layout = new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../templates/layout.txt'), (err, content) => {
      return err ? reject(err) : resolve(content.toString());
    });
  });

  const getTemplates = () => _templates;
  const getLayout = () => _layout;

  const loadTemplate = config => {
    return new Promise((resolve, reject) => {
      if (config.content) {
        return resolve(config.content);
      }
      fs.readFile(config.path, (err, content) => {
        if (err) {
          return reject(err);
        }
        config.content = content.toString();
        return resolve(config.content);
      });
    });
  };

  return (template, data) => {
    return getTemplates()
      .then(templates => {
        if (!template || !templates[template]) {
          throw new Error(`Unrecognised template: ${template}`);
        }
        return templates[template];
      })
      .then(config => {
        return loadTemplate(config);
      })
      .then(message => {
        return getLayout()
          .then(layout => render(layout, data, { message }));
      });
  };

};

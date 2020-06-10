const { Packer, Document } = require('docx');
const addStyles = require('./add-styles');
const v0 = require('./renderers/v0');
const v1 = require('./renderers/v1');

module.exports = (project) => {
  const pack = document => {
    const packer = new Packer();
    return packer.toBuffer(document);
  };

  return Promise.resolve()
    .then(() => new Document())
    .then(doc => addStyles(doc))
    .then(doc => {
      const schemaVersion = project.schemaVersion;
      if (schemaVersion === 0) {
        return v0(doc, project);
      }
      return v1(doc, project);
    })
    .then(doc => pack(doc));

};

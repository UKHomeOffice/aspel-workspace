module.exports = {
  upload: {
    inputType: 'inputFile',
    validate: [
      'fileRequired',
      { maxSize: 1.5e7 },
      { ext: ['doc', 'docx', 'pdf'] }
    ]
  }
};

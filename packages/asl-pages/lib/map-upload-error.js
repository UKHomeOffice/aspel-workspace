const uploadValidationErrors = new Set([
  'fileRequired',
  'invalidFileContent',
  'malwareDetected',
  'maxSize',
  'unsupportedFileType'
]);

module.exports = error => {
  const status = error?.response?.status;
  const code = error?.response?.data?.error;

  if (status === 400 && uploadValidationErrors.has(code)) {
    return {
      validation: {
        upload: code
      }
    };
  }

  return error;
};

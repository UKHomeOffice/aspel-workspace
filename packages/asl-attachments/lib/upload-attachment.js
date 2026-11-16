const readUploadedFile = require('./read-uploaded-file');
const processUploadedFile = require('./process-uploaded-file');
const createStoreUploadedFile = require('./store-uploaded-file');

module.exports = ({ Attachment, bucket, kms, s3 }) => {
  const storeUploadedFile = createStoreUploadedFile({ Attachment, bucket, kms, s3 });

  return async req => {
    const file = await readUploadedFile(req);
    const processedFile = await processUploadedFile(file);

    return storeUploadedFile(processedFile);
  };
};

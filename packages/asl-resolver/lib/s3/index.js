const crypto = require('crypto');
const { S3 } = require('@asl/service/clients');
const { GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = (settings, logger) => {
  const s3Client = S3({ s3: settings });

  return async key => {
    logger.verbose(`Fetching message with key: ${key} from s3`);
    const params = {
      Key: key,
      Bucket: settings.bucket
    };

    // --- GET OBJECT ---
    const response = await s3Client.send(new GetObjectCommand(params));
    const body = await response.Body.transformToString('utf8');
    let data = JSON.parse(body);

    logger.verbose(`Message with key: ${key} retrieved`);

    // --- DELETE OBJECT (fire-and-forget) ---
    Promise.resolve()
      .then(() => s3Client.send(new DeleteObjectCommand(params)))
      .then(() => logger.verbose(`Key: ${key} removed from bucket`))
      .catch(err => logger.error(`Failed to delete key ${key}: ${err.message}`));

    // --- OPTIONAL DECRYPTION ---
    if (!data.secure) {
      return data;
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      settings.transportKey,
      settings.transportIV
    );

    const decrypted =
      decipher.update(data.payload, 'base64', 'utf8') +
      decipher.final('utf8');

    return JSON.parse(decrypted);
  };
};

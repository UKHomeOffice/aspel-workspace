const crypto = require('crypto');
const { S3 } = require('@asl/service/clients');
const { GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = (settings, logger) => {
  const s3Client = S3({ s3: settings });

  return async key => {
    const params = {
      Key: key,
      Bucket: settings.bucket
    };
    logger.verbose(`Retrieving message with key: ${key} from bucket: ${settings.bucket}`);
    // --- GET OBJECT ---
    let data;
    try {
      const response = await s3Client.send(new GetObjectCommand(params));
      const body = await response.Body.transformToString('utf8');
      data = JSON.parse(body);
      logger.verbose(`Message with key: ${key} retrieved`);
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        return null; // idempotent behavior
      }
      throw err;
    }

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

const Busboy = require('busboy');
const validateUpload = require('./upload-validation');

const { UploadValidationError } = validateUpload;

const MAX_FILE_SIZE = 1.5e7;

module.exports = req => {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
      }
    });

    let file;
    let settled = false;

    const done = (callback, value) => {
      if (settled) {
        return;
      }
      settled = true;
      callback(value);
    };

    busboy.on('file', (field, stream, info) => {
      const chunks = [];

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('limit', () => done(reject, new UploadValidationError('maxSize', 'The selected file exceeds the 15MB upload limit')));
      stream.on('error', error => done(reject, error));
      stream.on('end', () => {
        file = {
          buffer: Buffer.concat(chunks),
          field,
          filename: info.filename,
          mimeType: info.mimeType
        };
      });
    });

    busboy.on('filesLimit', () => done(reject, new UploadValidationError('fileLimit', 'Only one file can be uploaded at a time')));
    busboy.on('error', error => done(reject, error));
    busboy.on('finish', () => {
      if (!file) {
        return done(reject, new UploadValidationError('fileRequired', 'No file was uploaded'));
      }
      return done(resolve, file);
    });

    req.pipe(busboy);
  });
};

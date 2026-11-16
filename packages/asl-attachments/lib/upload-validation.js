const path = require('path');
const JSZip = require('jszip');

// EICAR_SIGNATURE for detecting specific file types and malware
const EICAR_SIGNATURE = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
const PDF_SIGNATURE = Buffer.from('%PDF-');
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const DOC_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

class UploadValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.status = 400;
  }
}

const startsWith = (buffer, signature) => {
  return Buffer.isBuffer(buffer) &&
    buffer.length >= signature.length &&
    buffer.subarray(0, signature.length).equals(signature);
};

const hasEicarSignature = buffer => {
  return Buffer.isBuffer(buffer) && buffer.toString('latin1').includes(EICAR_SIGNATURE);
};

const isDocx = async buffer => {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const contentTypesFile = zip.file('[Content_Types].xml');
    const documentFile = zip.file('word/document.xml');

    if (!contentTypesFile || !documentFile) {
      return false;
    }

    const contentTypes = await contentTypesFile.async('string');
    const hasMacroContentType = contentTypes.includes('wordprocessingml.document.macroEnabled');
    const hasMacroBinary = Object.keys(zip.files)
      .some(name => name.toLowerCase().endsWith('vbaproject.bin'));

    return contentTypes.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml') &&
      !hasMacroContentType &&
      !hasMacroBinary;
  } catch (error) {
    return false;
  }
};

const supportedTypes = {
  doc: {
    mimetype: 'application/msword',
    mimeTypes: ['application/msword', 'application/octet-stream'],
    validate: buffer => startsWith(buffer, DOC_SIGNATURE)
  },
  docx: {
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
      'application/zip'
    ],
    validate: isDocx
  },
  jpg: {
    mimetype: 'image/jpeg',
    mimeTypes: ['image/jpeg'],
    validate: buffer => startsWith(buffer, JPEG_SIGNATURE)
  },
  jpeg: {
    mimetype: 'image/jpeg',
    mimeTypes: ['image/jpeg'],
    validate: buffer => startsWith(buffer, JPEG_SIGNATURE)
  },
  pdf: {
    mimetype: 'application/pdf',
    mimeTypes: ['application/pdf'],
    validate: buffer => startsWith(buffer, PDF_SIGNATURE)
  },
  png: {
    mimetype: 'image/png',
    mimeTypes: ['image/png'],
    validate: buffer => startsWith(buffer, PNG_SIGNATURE)
  }
};

const validateMimeType = (fileType, mimeType) => {
  if (!mimeType) {
    return true;
  }

  const normalisedMimeType = mimeType.toLowerCase();
  return fileType.mimeTypes.includes(normalisedMimeType);
};

module.exports = async file => {
  const extension = path.extname((file && file.filename) || '').slice(1).toLowerCase();
  const fileType = supportedTypes[extension];

  if (!fileType) {
    throw new UploadValidationError('unsupportedFileType', 'The selected file type is not supported');
  }

  if (!validateMimeType(fileType, file.mimeType)) {
    throw new UploadValidationError('unsupportedFileType', 'The selected file type does not match the declared MIME type');
  }

  if (hasEicarSignature(file.buffer)) {
    throw new UploadValidationError('malwareDetected', 'The uploaded file contains a blocked malware signature');
  }

  const isValid = await fileType.validate(file.buffer);

  if (!isValid) {
    throw new UploadValidationError('invalidFileContent', 'The selected file contents do not match the file type');
  }

  return {
    extension,
    isImage: fileType.mimetype.startsWith('image/'),
    mimetype: fileType.mimetype
  };
};

module.exports.EICAR_SIGNATURE = EICAR_SIGNATURE;
module.exports.UploadValidationError = UploadValidationError;

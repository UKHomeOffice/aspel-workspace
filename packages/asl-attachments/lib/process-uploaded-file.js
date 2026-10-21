const sharp = require('sharp');
const validateUpload = require('./upload-validation');

const { UploadValidationError } = validateUpload;

const resizeImage = async buffer => {
  try {
    return await sharp(buffer)
      .resize(1200, undefined, { withoutEnlargement: true })
      .toBuffer();
  } catch (error) {
    throw new UploadValidationError('invalidFileContent', 'The selected image could not be processed');
  }
};

module.exports = async file => {
  const validatedFile = await validateUpload(file);
  const body = validatedFile.isImage
    ? await resizeImage(file.buffer)
    : file.buffer;

  return {
    body,
    filename: file.filename,
    mimetype: validatedFile.mimetype
  };
};

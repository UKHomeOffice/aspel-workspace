const FormData = require('form-data');
const { default: axios } = require('axios');
const mapUploadError = require('./map-upload-error');

module.exports = async (url, file) => {
  const formData = new FormData();

  formData.append('file', file.buffer, file.originalname);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { ...formData.getHeaders() }
    });

    return data;
  } catch (error) {
    throw mapUploadError(error);
  }
};

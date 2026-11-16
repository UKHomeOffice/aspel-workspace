const { expect } = require('chai');
const JSZip = require('jszip');
const validateUpload = require('../lib/upload-validation');

const buildDocxBuffer = async ({ macroEnabled = false } = {}) => {
  const zip = new JSZip();
  const documentContentType = macroEnabled
    ? 'application/vnd.ms-word.document.macroEnabled.main+xml'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';

  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/word/document.xml" ContentType="${documentContentType}"/>
    </Types>`);
  zip.file('word/document.xml', '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body /></w:document>');

  if (macroEnabled) {
    zip.file('word/vbaProject.bin', Buffer.from('macro-binary'));
  }

  return zip.generateAsync({ type: 'nodebuffer' });
};

const expectValidationError = async (file, code) => {
  try {
    await validateUpload(file);
    expect.fail(`Expected upload validation to fail with ${code}`);
  } catch (error) {
    expect(error.code).to.equal(code);
  }
};

describe('upload validation', () => {
  it('accepts a clean DOCX document', async () => {
    const buffer = await buildDocxBuffer();

    const result = await validateUpload({
      buffer,
      filename: 'assessment.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    expect(result).to.deep.equal({
      extension: 'docx',
      isImage: false,
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  });

  it('rejects macro-enabled Office files renamed as .docx', async () => {
    const buffer = await buildDocxBuffer({ macroEnabled: true });

    await expectValidationError({
      buffer,
      filename: 'assessment.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }, 'invalidFileContent');
  });
});

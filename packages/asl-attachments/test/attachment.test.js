const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const express = require('express');
const stream = require('stream');
const validateUpload = require('../lib/upload-validation');

describe('Attachment routes', () => {

  let app;
  let sendStub;
  let findOneStub;
  let deleteByIdStub;
  let insertStub;
  let uploadDoneStub;
  let UploadStub;

  beforeEach(() => {
    sendStub = sinon.stub();
    uploadDoneStub = sinon.stub().resolves();

    sinon.stub(require('@asl/service/clients'), 'S3').returns({
      send: sendStub
    });

    UploadStub = sinon.stub(require('@aws-sdk/lib-storage'), 'Upload').callsFake(function UploadMock() {
      this.done = uploadDoneStub;
    });

    findOneStub = sinon.stub();
    deleteByIdStub = sinon.stub().resolves();
    insertStub = sinon.stub().resolves();

    const AttachmentMock = {
      query: () => ({
        findOne: findOneStub,
        deleteById: deleteByIdStub,
        insert: insertStub
      })
    };

    const attachmentRouter = require('../lib/routers/attachment');

    const settings = {
      s3: { bucket: 'test-bucket' },
      models: { Attachment: AttachmentMock }
    };

    app = express();
    app.use(attachmentRouter(settings));
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../lib/routers/attachment')];
  });

  // ------------------------
  // POST /
  // ------------------------

  it('POST / uploads a validated PDF and returns 200', async () => {
    const res = await request(app)
      .post('/')
      .attach('file', Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF'), {
        filename: 'evidence.pdf',
        contentType: 'application/pdf'
      });

    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a('string');
    expect(uploadDoneStub.calledOnce).to.be.true;
    expect(UploadStub.calledOnce).to.be.true;
    expect(insertStub.calledOnce).to.be.true;
    expect(insertStub.firstCall.args[0]).to.include({
      filename: 'evidence.pdf',
      mimetype: 'application/pdf'
    });
  });

  it('POST / returns 400 for a file with malicious content', async () => {
    const res = await request(app)
      .post('/')
      .attach('file', Buffer.from(`%PDF-1.7\n${validateUpload.EICAR_SIGNATURE}`), {
        filename: 'eicar.pdf',
        contentType: 'application/pdf'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'malwareDetected' });
    expect(uploadDoneStub.called).to.be.false;
    expect(insertStub.called).to.be.false;
  });

  it('POST / returns 400 when file contents do not match the declared type', async () => {
    const res = await request(app)
      .post('/')
      .attach('file', Buffer.from('not-a-real-pdf'), {
        filename: 'broken.pdf',
        contentType: 'application/pdf'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'invalidFileContent' });
    expect(uploadDoneStub.called).to.be.false;
    expect(insertStub.called).to.be.false;
  });

  it('POST / returns 400 for unsupported macro-enabled Word formats', async () => {
    const res = await request(app)
      .post('/')
      .attach('file', Buffer.from('PK\u0003\u0004macro-enabled'), {
        filename: 'dangerous.docm',
        contentType: 'application/vnd.ms-word.document.macroEnabled.12'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'unsupportedFileType' });
    expect(uploadDoneStub.called).to.be.false;
    expect(insertStub.called).to.be.false;
  });

  // ------------------------
  // GET /:token
  // ------------------------

  it('GET /:token returns 200 and streams file', async () => {
    const fakeStream = stream.Readable.from(['hello']);

    findOneStub.resolves({
      id: '123',
      filename: 'file.txt',
      mimetype: 'text/plain'
    });

    sendStub.resolves({ Body: fakeStream });

    const res = await request(app).get('/valid-token');

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.include('text/plain');
    expect(res.headers['x-content-type-options']).to.equal('nosniff');
    expect(res.headers['x-original-filename']).to.equal('file.txt');

    expect(findOneStub.calledWith({ token: 'valid-token' })).to.be.true;
    expect(sendStub.calledOnce).to.be.true;
  });

  it('GET /:token returns 404 if not found', async () => {
    findOneStub.resolves(null);

    const res = await request(app).get('/bad-token');

    expect(res.status).to.equal(404);
  });

  it('GET /:token returns 500 if S3 fails', async () => {
    findOneStub.resolves({
      id: '123',
      filename: 'file.txt',
      mimetype: 'text/plain'
    });

    sendStub.rejects(new Error('S3 error'));

    const res = await request(app).get('/valid-token');

    expect(res.status).to.equal(500);
  });

  // ------------------------
  // DELETE /:token
  // ------------------------

  it('DELETE /:token deletes attachment and returns 204', async () => {
    findOneStub.resolves({ id: '123' });
    sendStub.resolves({});

    const res = await request(app).delete('/valid-token');

    expect(res.status).to.equal(204);

    expect(findOneStub.calledWith({ token: 'valid-token' })).to.be.true;
    expect(sendStub.calledOnce).to.be.true;
    expect(deleteByIdStub.calledWith('123')).to.be.true;
  });

  it('DELETE /:token returns 404 if not found', async () => {
    findOneStub.resolves(null);

    const res = await request(app).delete('/bad-token');

    expect(res.status).to.equal(404);
  });

  it('DELETE /:token returns 500 if S3 fails', async () => {
    findOneStub.resolves({ id: '123' });
    sendStub.rejects(new Error('S3 failure'));

    const res = await request(app).delete('/valid-token');

    expect(res.status).to.equal(500);
  });

  // ------------------------
  // GET /attachment-id/:token
  // ------------------------

  it('GET /attachment-id/:token returns id and timestamp', async () => {
    findOneStub.resolves({
      id: 'abc',
      createdAt: '2024-01-01'
    });

    const res = await request(app).get('/attachment-id/test-token');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      id: 'abc',
      uploadedAt: '2024-01-01'
    });
  });

  it('GET /attachment-id/:token returns 404 if not found', async () => {
    findOneStub.resolves(null);

    const res = await request(app).get('/attachment-id/bad-token');

    expect(res.status).to.equal(404);
  });
});

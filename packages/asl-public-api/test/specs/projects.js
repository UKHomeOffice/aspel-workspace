const assert = require('assert');
const request = require('supertest');
const apiHelper = require('../helpers/api');

const INACTIVE_PROJECT_ID = 'bf22f7cd-cf85-42ef-93da-02b709df67be';
const ACTIVE_PROJECT_ID = 'd2f9777d-2d9d-4ea2-a9c2-c5ed592fd98d';
const LICENCE_HOLDER_ID = 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9';

describe('/projects', () => {
  before(() => {
    return apiHelper.create()
      .then((api) => {
        this.api = api.api;
        this.workflow = api.workflow;
      });
  });

  after(() => {
    return apiHelper.destroy();
  });

  it('returns only the current establishments projects when searching - bugfix', () => {
    return request(this.api)
      .get('/establishment/100/projects?search=abc&status=inactive') // "abc" matches licence number for all projects
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 1, 'Returns exactly one project');
        assert.equal(response.body.data[0].title, 'Draft project');
      });
  });

  describe('PUT /:id/revoke', () => {
    it('prevents the revocation of non-active projects', () => {
      return request(this.api)
        .put(`/establishment/100/projects/${INACTIVE_PROJECT_ID}/revoke`)
        .send({ meta: { comments: 'testing revocation of inactive project' } })
        .expect(400)
        .expect(response => {
          assert(
            JSON.parse(response.error.text).message
              .match(/only active projects can be revoked/)
          );
        });
    });

    it('can revoke active projects', () => {
      return request(this.api)
        .put(`/establishment/100/projects/${ACTIVE_PROJECT_ID}/revoke`)
        .send({ meta: { comments: 'testing revocation of active project' } })
        .expect(200)
        .expect(() => {
          assert.equal(this.workflow.handler.callCount, 1);
          const req = this.workflow.handler.firstCall.args[0];
          const body = req.body;
          assert.equal(req.method, 'POST');
          assert.equal(body.model, 'project');
          assert.equal(body.action, 'revoke');
          assert.equal(body.id, ACTIVE_PROJECT_ID);
          assert.deepEqual(body.data, { establishmentId: 100, licenceHolderId: LICENCE_HOLDER_ID });
        });
    });
  });

});

const assert = require('assert');
const request = require('supertest');
const apiHelper = require('../helpers/api');
const ids = require('../data/ids');

describe('/roles', () => {
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

  it('returns NACWOs who do not have places assigned', () => {
    return request(this.api)
      .get(`/establishment/${ids.establishments.croydon}/roles?type=nacwo`)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 2);
        assert.equal(response.body.data[0].type, 'nacwo');
        assert.equal(response.body.data[1].type, 'nacwo');
      });
  });

  describe('create', () => {

    it('passes named person skills and experience fields to workflow', () => {
      const completeDate = new Date(Date.now() + 1).toISOString().slice(0, 10);
      return request(this.api)
        .post(`/establishment/${ids.establishments.croydon}/roles`)
        .send({
          data: {
            profileId: ids.profiles.derek,
            type: 'nacwo',
            mandatory: 'delay',
            incomplete: ['nacwo'],
            delayReason: 'Delayed training',
            completeDate,
            experience: 'Relevant welfare experience',
            authority: 'Manages the animal care team',
            skills: 'Strong communication skills'
          },
          meta: {
            version: 'named-person-mvp'
          }
        })
        .expect(200)
        .expect(() => {
          assert.equal(this.workflow.handler.callCount, 1);
          const req = this.workflow.handler.firstCall.args[0];
          assert.equal(req.body.data.experience, 'Relevant welfare experience');
          assert.equal(req.body.data.authority, 'Manages the animal care team');
          assert.equal(req.body.data.skills, 'Strong communication skills');
        });
    });

  });

  describe('delete', () => {

    it('returns a 404 if the role does not exist', () => {
      const callCount = this.workflow.handler.callCount;
      return request(this.api)
        .delete(`/establishment/${ids.establishments.marvell}/roles/${ids.roles.nacwoClive}?type=nacwo`)
        .expect(404)
        .expect(() => {
          assert.equal(this.workflow.handler.callCount, callCount);
        });
    });

  });

});

const request = require('supertest');

const assertTasks = require('../../helpers/assert-tasks');
const workflowHelper = require('../../helpers/workflow');

const { userAtMultipleEstablishments, user } = require('../../data/profiles');

describe('Subject', () => {
  before(() => {
    return workflowHelper.create()
      .then(workflow => {
        this.workflow = workflow;
        this.workflow.setUser({ profile: user });
      });
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => this.workflow.resetDBs())
      .then(() => this.workflow.seedTaskList());
  });

  after(() => {
    return this.workflow.destroy();
  });

  it('returns open tasks where user is the subject or opened the task', () => {
    const expected = [
      'recalled ppl',
      'pil returned',
      'pil with ntco',
      'pil with licensing',
      'another with-ntco to test ordering',
      'another with-inspectorate to test ordering',
      'project awaiting endorsement',
      'pil conditions recalled',
      'recalled project transfer',
      'ppl submitted by HOLC for user'
    ];
    return request(this.workflow)
      .get(`/profile-tasks/${user.id}`)
      .expect(200)
      .expect(response => {
        assertTasks(expected, response.body.data);
      });
  });

  it('includes non-open but not autoresolved tasks if passed an "all" flag', () => {
    const expected = [
      'recalled ppl',
      'pil returned',
      'pil with ntco',
      'pil with licensing',
      'another with-ntco to test ordering',
      'another with-inspectorate to test ordering',
      'project awaiting endorsement',
      'discarded ppl',
      'granted pil',
      'pil conditions recalled',
      'recalled project transfer',
      'ppl submitted by HOLC for user'
    ];
    return request(this.workflow)
      .get(`/profile-tasks/${user.id}?all=true`)
      .expect(200)
      .expect(response => {
        assertTasks(expected, response.body.data);
      });
  });

  it('returns open tasks for the subject at a particular establishment', () => {
    const expected = [
      'pil transfer recalled'
    ];
    return request(this.workflow)
      .get(`/profile-tasks/${userAtMultipleEstablishments.id}?establishmentId=101`)
      .expect(200)
      .expect(response => {
        assertTasks(expected, response.body.data);
      });
  });

});

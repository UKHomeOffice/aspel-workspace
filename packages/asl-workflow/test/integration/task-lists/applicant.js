const request = require('supertest');

const assertTasks = require('../../helpers/assert-tasks');
const workflowHelper = require('../../helpers/workflow');

const { user } = require('../../data/profiles');

describe('Applicant', () => {
  before(() => {
    return workflowHelper.create()
      .then(workflow => {
        this.workflow = workflow;
        this.workflow.setUser({ profile: user });
      });
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => workflowHelper.resetDBs())
      .then(() => workflowHelper.seedTaskList());
  });

  after(() => {
    return workflowHelper.destroy();
  });

  describe('outstanding tasks', () => {

    it('sees tasks for which they are the subject', () => {
      const expected = [ 'pil returned', 'Submitted by HOLC', 'recalled ppl' ];
      return request(this.workflow)
        .get('/')
        .expect(200)
        .expect(response => {
          assertTasks(expected, response.body.data);
        });
    });

  });

  describe('in progress tasks', () => {

    it('sees tasks for which they are the subject', () => {
      const expected = [ 'pil with licensing', 'pil with ntco' ];
      return request(this.workflow)
        .get('/?progress=inProgress')
        .expect(200)
        .expect(response => {
          assertTasks(expected, response.body.data);
        });
    });

  });

  describe('completed tasks', () => {

    it('sees tasks for which they are the subject', () => {
      const expected = [ 'granted pil', 'discarded ppl' ];
      return request(this.workflow)
        .get('/?progress=completed')
        .expect(200)
        .expect(response => {
          assertTasks(expected, response.body.data);
        });
    });

  });

});

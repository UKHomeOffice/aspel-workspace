const supertest = require('supertest');

const API = require('../lib/api');
const User = require('./helpers/user-wrapper.js');

describe('API', () => {

  beforeEach(() => {
    this.api = API({
      log: {
        level: 'silent'
      },
      permissions: {
        task1: {
          roles: ['owner']
        },
        task2: {
          roles: ['inspector']
        },
        task3: {
          task3a: {
            roles: ['owner', 'inspector']
          }
        }
      }
    });
  });

  describe('when user is an establishment user', () => {

    beforeEach(() => {
      const user = {
        is: () => false, // user has no roles
        get: prop => prop === 'establishment' && '100' // user is from establishment id 100
      };
      this.app = User(this.api, user);
    });

    it('returns 403 for unknown tasks', () => {
      return supertest(this.app)
        .get('/not-a-task')
        .expect(403);
    });

    it('returns 403 for tasks which do not have "owner" as a role', () => {
      return supertest(this.app)
        .get('/task2')
        .expect(403);
    });

    it('returns 403 for tasks which have "owner" as a role when called for a different establishment', () => {
      return supertest(this.app)
        .get('/task1?establishment=101')
        .expect(403);
    });

    it('returns 200 for tasks which have "owner" as a role when called with the users establishment', () => {
      return supertest(this.app)
        .get('/task1?establishment=100')
        .expect(200);
    });

    it('returns 200 for tasks which have "owner" as one of multiple roles', () => {
      return supertest(this.app)
        .get('/task3.task3a?establishment=100')
        .expect(200);
    });

  });

  describe('when user is an inspector', () => {

    beforeEach(() => {
      const user = {
        is: role => role === 'inspector', // user is an inspector
        get: prop => null // user has no establishment
      };
      this.app = User(this.api, user);
    });

    it('returns 403 for unknown tasks', () => {
      return supertest(this.app)
        .get('/not-a-task')
        .expect(403);
    });

    it('returns 403 for tasks which do not have "inspector" as a role', () => {
      return supertest(this.app)
        .get('/task1')
        .expect(403);
    });

    it('returns 200 for tasks which have "inspector" as a role', () => {
      return supertest(this.app)
        .get('/task2')
        .expect(200);
    });

    it('returns 200 for tasks which have "inspector" as a role irrespective of establishment id', () => {
      return supertest(this.app)
        .get('/task2?establishment=101')
        .expect(200);
    });

    it('returns 200 for tasks which have "inspector" as one of multiple roles', () => {
      return supertest(this.app)
        .get('/task3.task3a')
        .expect(200);
    });

  });

});

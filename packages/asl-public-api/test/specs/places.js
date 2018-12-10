const assert = require('assert');
const request = require('supertest');
const { stringify } = require('qs');
const apiHelper = require('../helpers/api');

describe('/places', () => {
  beforeEach(() => {
    return apiHelper.create()
      .then((api) => {
        this.api = api.api;
        this.workflow = api.workflow;
      });
  });

  afterEach(() => {
    return apiHelper.destroy();
  });

  it('returns only the places related to the current establishment', () => {
    return request(this.api)
      .get('/establishment/100/places')
      .expect(200)
      .expect(response => {
        assert(response.body.data.length > 0);
        response.body.data.forEach(row => {
          assert.equal(row.establishmentId, 100);
        });
      });
  });

  it('does not include deleted places', () => {
    return request(this.api)
      .get('/establishment/100/places')
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 2);
        response.body.data.forEach(row => {
          assert.notEqual(row.name, 'Deleted room');
        });
      });
  });

  it('filters by site', () => {
    const query = stringify({
      filters: {
        site: ['Lunar House']
      }
    });
    return request(this.api)
      .get(`/establishment/100/places?${query}`)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 2);
      });
  });

  it('filters by suitability', () => {
    const query = stringify({
      filters: {
        suitability: ['LA']
      }
    });
    return request(this.api)
      .get(`/establishment/100/places?${query}`)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 1);
      });
  });

  it('filters by holding', () => {
    const query = stringify({
      filters: {
        holding: ['LTH']
      }
    });
    return request(this.api)
      .get(`/establishment/100/places?${query}`)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 1);
      });
  });

  it('sends a message to Workflow on POST', () => {
    const input = {
      data: {
        site: 'Lunar House 3rd floor',
        name: '83',
        suitability: ['LA', 'DOG'],
        holding: ['NOH']
      }
    };
    return request(this.api)
      .post('/establishment/100/places')
      .send(input)
      .expect(200)
      .expect(() => {
        assert.equal(this.workflow.handler.callCount, 1);
        const req = this.workflow.handler.firstCall.args[0];
        const body = req.body;
        assert.equal(req.method, 'POST');
        assert.equal(body.model, 'place');
        assert.equal(body.action, 'create');
        assert.deepEqual(body.data, { ...input.data, establishmentId: '100' });
      });
  });

  it('can pass comments property without failing validation', () => {
    const input = {
      data: {
        site: 'Lunar House 3rd floor',
        name: '83',
        suitability: ['LA', 'DOG'],
        holding: ['NOH']
      },
      meta:
      {
        changesToRestrictions: 'changes',
        comments: 'comments'
      }
    };
    return request(this.api)
      .post('/establishment/100/places')
      .send(input)
      .expect(200);
  });

  it('returns 400 for invalid or missing data', () => {
    const input = {
      data: {
        site: 'Lunar House 3rd floor',
        // requires name
        suitability: ['LA', 'DOG'],
        holding: ['NOH']
      },
      meta:
      {
        changesToRestrictions: 'changes',
        comments: 'comments'
      }
    };
    return request(this.api)
      .post('/establishment/100/places')
      .send(input)
      .expect(400);
  });

  describe('/place/:id', () => {

    it('returns 404 for unrecognised id', () => {
      return request(this.api)
        .get('/establishment/100/places/notanid')
        .expect(404);
    });

    it('returns 404 for a different establishments place id', () => {
      return request(this.api)
        .get('/establishment/100/places/e859d43a-e8ab-4ae6-844a-95c978082a48')
        .expect(404);
    });

    it('returns 400 for invalid or missing data', () => {
      const input = {
        data: {
          site: 'Lunar House 3rd floor',
          name: '83',
          suitability: ['FAKE'],
          holding: ['NOH']
        },
        meta: {
          changesToRestrictions: 'changes',
          comments: 'comments'
        }
      };
      return request(this.api)
        .put('/establishment/100/places/1d6c5bb4-be60-40fd-97a8-b29ffaa2135f')
        .send(input)
        .expect(400);
    });

    it('adds a message to SQS on PUT', () => {
      const input = {
        data: {
          site: 'Lunar House 3rd floor',
          name: '83',
          suitability: ['LA', 'DOG'],
          holding: ['NOH']
        }
      };

      return request(this.api)
        .put('/establishment/100/places/1d6c5bb4-be60-40fd-97a8-b29ffaa2135f')
        .send(input)
        .expect(200)
        .expect(() => {
          assert.equal(this.workflow.handler.callCount, 1);
          const req = this.workflow.handler.firstCall.args[0];
          const body = req.body;
          assert.equal(req.method, 'POST');
          assert.equal(body.model, 'place');
          assert.equal(body.action, 'update');
          assert.equal(body.id, '1d6c5bb4-be60-40fd-97a8-b29ffaa2135f');
          assert.deepEqual(body.data, { ...input.data, establishmentId: '100' });
        });
    });

    it('adds a message to SQS on DELETE', () => {
      const input = {
        meta: {
          comments: 'Lorem ipsum dolor'
        }
      };
      return request(this.api)
        .delete('/establishment/100/places/1d6c5bb4-be60-40fd-97a8-b29ffaa2135f')
        .send(input)
        .expect(200)
        .expect(() => {
          assert.equal(this.workflow.handler.callCount, 1);
          const req = this.workflow.handler.firstCall.args[0];
          const body = req.body;
          assert.equal(req.method, 'POST');
          assert.equal(body.model, 'place');
          assert.equal(body.action, 'delete');
          assert.equal(body.id, '1d6c5bb4-be60-40fd-97a8-b29ffaa2135f');
        });
    });

  });

});

const apiHelper = require('../helpers/api');
const openAPI = require('../helpers/open-api');
const assert = require('assert');
const ids = require('../data/ids');
const moment = require('moment');
const uuid = require('uuid');

const courseDefaults = {
  establishmentId: ids.establishments.trainingEstablishment,
  startDate: moment().add(1, 'month').format('YYYY-MM-DD'),
  species: ['Mice', 'Rats'],
  coursePurpose: 'training'
};

async function insertCourse(db, overrides) {
  const course = {
    id: uuid(),
    ...courseDefaults,
    ...overrides
  };

  await db.TrainingCourse.query().insert(course);

  return course;
}

describe('Training courses and category E Licences', () => {
  beforeEach(() => {
    return apiHelper.create()
      .then(({ api, workflow }) => {
        this.api = api;
        this.db = api.app.db;
        this.workflow = workflow;
      });
  });

  afterEach(() => {
    return apiHelper.destroy();
  });

  describe('/establishment/{establishmentId}/training-course', () => {
    it('The response when there are no courses follows the OpenAPI spec', async () => {
      const res = await openAPI.validateGet(
        this.api,
        `/establishment/{establishmentId}/training-course`,
        {establishmentId: ids.establishments.trainingEstablishment}
      );

      assert.equal(res.body.data.length, 0, 'There should be no courses by default');
    });

    it('The response when there are upcoming courses follows the OpenAPI spec', async () => {
      await insertCourse(this.db, {
        projectId: ids.projects.trainingEstablishment.trainingWithRodents,
        title: 'Training course with mice',
        species: ['Mice']
      });

      await insertCourse(this.db, {
        projectId: ids.projects.trainingEstablishment.trainingWithRodents,
        title: 'Training course with rodents'
      });

      await insertCourse(this.db, {
        projectId: ids.projects.trainingEstablishment.trainingWithFish,
        title: 'Training course with fish',
        species: ['Zebra fish (Danio rerio)']
      });

      const res = await openAPI.validateGet(
        this.api,
        `/establishment/{establishmentId}/training-course`,
        {establishmentId: ids.establishments.trainingEstablishment}
      );

      assert.equal(res.body.data.length, 3, 'All inserted courses should be returned');
    });
  });
});

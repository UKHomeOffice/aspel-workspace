const fullSchema = require('../../course-details-form/schema');
const { pick } = require('lodash');

module.exports = pick(fullSchema, 'courseDuration');

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const loadTemplate = require('../../lib/dispatcher/load-template');
const { normalise } = require('../helpers/email-content');

const templatesDir = path.resolve(__dirname, '../../lib/dispatcher/templates');
const roleTemplateFiles = fs.readdirSync(templatesDir)
  .filter(file => file.startsWith('role-') && file.endsWith('.js'))
  .sort();

const templateCases = {
  'role-approved-subject': {
    vars: {
      roleName: 'Home Office liaison contact',
      name: 'Named Person',
      identifier: 'Establishment name',
      identifierValue: 'University of Croydon',
      status: 'approved',
      statusLine: ' This is a PEL amendment.'
    },
    expected: `The Home Office liaison contact role application for Named Person has been approved. This is a PEL amendment.

Establishment name: University of Croydon`
  },
  'role-removed': {
    vars: {
      roleName: 'Home Office liaison contact',
      name: 'Named Person',
      identifier: 'Establishment name',
      identifierValue: 'University of Croydon',
      taskUrl: 'http://localhost:8080/tasks/task-id?notification=task-id',
      statusLine: ' This is a PEL amendment.'
    },
    expected: `Named Person has been removed from the role of Home Office liaison contact. This is a PEL amendment.

Establishment name: University of Croydon

You can see more details about this task by visiting http://localhost:8080/tasks/task-id?notification=task-id`
  },
  'role-removed-refused': {
    vars: {
      roleName: 'Home Office liaison contact',
      name: 'Named Person',
      identifier: 'Establishment name',
      identifierValue: 'University of Croydon',
      taskUrl: 'http://localhost:8080/tasks/task-id?notification=task-id'
    },
    expected: `The request for Named Person's to be removed from the role of  Home Office liaison contact has been refused.

Establishment name: University of Croydon

You can see more details about this task by visiting http://localhost:8080/tasks/task-id?notification=task-id`
  },
  'role-removed-returned': {
    vars: {
      roleName: 'Home Office liaison contact',
      name: 'Named Person',
      identifier: 'Establishment name',
      identifierValue: 'University of Croydon',
      taskUrl: 'http://localhost:8080/tasks/task-id?notification=task-id'
    },
    expected: `The request for Named Person to be removed from the role of Home Office liaison contact has been returned.

Establishment name: University of Croydon

You can see more details about this task by visiting http://localhost:8080/tasks/task-id?notification=task-id`
  },
  'role-removed-subject': {
    vars: {
      roleName: 'Home Office liaison contact',
      name: 'Named Person',
      identifier: 'Establishment name',
      identifierValue: 'University of Croydon',
      statusLine: ' This is a PEL amendment.'
    },
    expected: `Named Person has been removed from the role of Home Office liaison contact. This is a PEL amendment.

Establishment name: University of Croydon`
  }
};

// Test layer: direct template rendering only.
// This suite is the filename-level safety net for every dispatcher template whose
// file name starts with role-.
describe('Dispatcher role-* templates - direct file rendering', () => {
  it('has an explicit direct test case for every role-* template file', () => {
    assert.deepEqual(roleTemplateFiles, Object.keys(templateCases).map(name => `${name}.js`).sort());
  });

  Object.entries(templateCases).forEach(([templateName, { vars, expected }]) => {
    it(`renders template file ${templateName}.js`, async () => {
      const result = await loadTemplate(templateName, vars);
      assert.equal(normalise(result), normalise(expected));
    });
  });
});

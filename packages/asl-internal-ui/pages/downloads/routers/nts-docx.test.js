const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const { test } = require('node:test');
// eslint-disable-next-line implicit-dependencies/no-implicit
const proxyquire = require('proxyquire').noCallThru();

function setup(items = []) {
  const document = {};
  const buffer = Buffer.from('docx');
  const rendered = [];
  const handler = proxyquire('./nts-docx', {
    '@asl/projects/client/components/download-link/renderers/nts-docx-renderer': {
      default: async options => {
        rendered.push(options);
        return document;
      }
    },
    '@asl/pages/pages/project-version/nts/schema': version => version,
    '@joefitter/docx': {
      Packer: class {
        async toBuffer(value) {
          assert.strictEqual(value, document);
          return buffer;
        }
      }
    },
    '@asl/service/ui/feature-flag': { FEATURE_FLAG_NTS_DOCX: 'nts-docx' },
    '@asl/projects/client/components/download-link/renderers/helpers/docx-style-helper': {
      addPageNumbers: value => assert.strictEqual(value, document)
    },
    '@ukhomeoffice/asl-constants': { getRAReasons: () => [] }
  })({ attachments: '/attachments' });
  const req = {
    hasFeatureFlag: () => true,
    form: { values: { 'date-from': '2024-1-1', 'date-to': '2024-7-1', ra: false } },
    api: async path => {
      assert.strictEqual(path, '/reports/nts-docx?startDate=2024-01-01&endDate=2024-07-01&ra=false');
      return { json: { data: items } };
    }
  };
  return { handler, req, buffer, rendered, document };
}

test('passes empty results to the form middleware as a validation error', async () => {
  const { handler, req } = setup();
  let error;
  await handler(req, {}, err => { error = err; });
  assert.deepStrictEqual(error, { validation: { form: 'noResults' } });
});

test('renders and packs the bulk DOCX using validated form values', async () => {
  const items = [
    { application: { schemaVersion: 1 }, data: {} },
    { application: { schemaVersion: 2 }, data: { 'training-licence': true } }
  ];
  const { handler, req, buffer, rendered, document } = setup(items);
  const res = {
    attachment: filename => assert.strictEqual(filename, 'NTS_2024-01-01_to_2024-07-01_ra_false.docx'),
    end: value => assert.strictEqual(value, buffer)
  };
  await handler(req, res, err => { throw err; });
  assert.strictEqual(rendered.length, 2);
  assert.strictEqual(rendered[0].mergedDocument, null);
  assert.strictEqual(rendered[1].mergedDocument, document);
  assert.strictEqual(rendered[1].isTrainingLicence, true);
});

test('propagates API errors rather than displaying an empty-results message', async () => {
  const { handler, req } = setup();
  const failure = new Error('Reports service unavailable');
  req.api = async () => { throw failure; };
  let error;
  await handler(req, {}, err => { error = err; });
  assert.strictEqual(error, failure);
});

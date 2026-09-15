const assert = require('assert');
const path = require('path');
const { Readable } = require('stream');
const Zip = require('jszip');

const exporterModulePath = path.resolve(__dirname, '../../../../lib/exporters/task-metrics/index.js');
const authModulePath = path.resolve(__dirname, '../../../../lib/clients/auth.js');
const metricsModulePath = path.resolve(__dirname, '../../../../lib/clients/metrics.js');

const setModuleExport = (modulePath, exportedValue) => {
  const resolved = require.resolve(modulePath);
  const original = require.cache[resolved];

  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: exportedValue
  };

  return () => {
    if (original) {
      require.cache[resolved] = original;
      return;
    }
    delete require.cache[resolved];
  };
};

const getTask = (id, overrides = {}) => ({
  id,
  status: 'resolved',
  data: {
    model: 'project',
    modelId: `model-${id}`,
    licenceNumber: `PPL-${id}`,
    role: null,
    action: 'grant',
    isContinuation: false
  },
  metrics: {
    taskType: 'pplApplication',
    firstSubmittedAt: '2026-08-01',
    firstReturnedAt: null,
    firstAssignedAt: '2026-08-02',
    firstSubmittedAtInPeriod: '2026-08-01',
    firstReturnedAtInPeriod: null,
    firstAssignedAtInPeriod: '2026-08-02',
    lastResubmittedAt: null,
    lastReturnedAt: null,
    lastAssignedAt: '2026-08-02',
    resolvedAt: '2026-08-03',
    deadline: '2026-08-31',
    isDeadlineExtended: false,
    totalDaysAssigned: 1,
    totalDaysAssignedInPeriod: 1,
    firstSubmitToActionDiff: 2,
    lastSubmitToActionDiff: 2,
    totalDaysWithAsru: 2,
    totalDaysWithAsruInPeriod: 2,
    firstAssignedToActionDiff: 1,
    wasFirstActionedInPeriod: true,
    wasSubmittedInPeriod: true,
    isOutstanding: false,
    returnedCount: 0,
    returnedCountInPeriod: 0,
    resubmittedCount: 0,
    resubmittedCountInPeriod: 0,
    resubmittedDiffs: [],
    subtasks: [
      {
        taskId: id,
        model: 'project',
        modelId: `model-${id}`,
        licenceNumber: `PPL-${id}`,
        versionId: 'v1',
        taskAction: 'grant',
        taskType: 'pplApplication',
        submitted: '2026-08-01',
        isResubmission: false,
        assigned: '2026-08-02',
        actioned: '2026-08-03',
        inspectorAction: 'resolved',
        inspectorName: 'Inspector',
        comment: null
      }
    ]
  },
  ...overrides
});
describe('Task metrics exporter stream lifecycle', function() {
  beforeEach(() => {
    this.events = [];
    this.logs = [];

    this.restoreAuth = setModuleExport(authModulePath, () => () => Promise.resolve('test-token'));

    this.restoreMetrics = setModuleExport(metricsModulePath, () => {
      return (reportPath, { stream = true } = {}) => {
        this.events.push(`metrics:${reportPath}`);

        if (reportPath === '/reports/internal-deadlines') {
          return Promise.resolve([
            {
              task_id: 'int-1',
              project_title: 'Project 1',
              licence_number: 'PPL-1',
              type: 'ppl',
              resubmitted: false,
              extended: false,
              still_open: false,
              target: '2026-08-10',
              resolved_at: '2026-08-12'
            }
          ]);
        }

        if (reportPath === '/reports/actioned-tasks' && stream) {
          const items = [getTask('task-1'), getTask('task-2')];
          const source = async function * () {
            this.events.push('stream:iterated');
            for (const item of items) {
              yield item;
            }
          }.bind(this);

          return Promise.resolve(Readable.from(source(), { objectMode: true }));
        }

        throw new Error(`Unexpected metrics call: ${reportPath}`);
      };
    });

    delete require.cache[require.resolve(exporterModulePath)];
    const builder = require(exporterModulePath);

    this.exporter = builder({
      logger: {
        debug: msg => this.logs.push(`debug:${msg}`),
        info: msg => this.logs.push(`info:${msg}`),
        error: msg => this.logs.push(`error:${msg}`)
      },
      auth: {},
      metrics: {},
      s3Upload: ({ stream }) => {
        this.events.push('upload:start');
        return new Promise((resolve, reject) => {
          const chunks = [];
          stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
          stream.on('error', reject);
          stream.on('end', () => {
            this.events.push('upload:end');
            this.zipBuffer = Buffer.concat(chunks);
            resolve({ ETag: 'etag-1' });
          });
        });
      }
    });
  });

  afterEach(() => {
    delete require.cache[require.resolve(exporterModulePath)];
    this.restoreAuth();
    this.restoreMetrics();
  });

  it('starts upload before consuming actioned-tasks stream and logs phase markers', async () => {
    const result = await this.exporter({
      id: 'job-1',
      meta: {
        start: '2026-08-01',
        end: '2026-08-31'
      }
    });

    assert.equal(result.etag, 'etag-1');

    const uploadStart = this.events.indexOf('upload:start');
    const internalDeadlinesFetch = this.events.indexOf('metrics:/reports/internal-deadlines');
    const streamIteration = this.events.indexOf('stream:iterated');

    assert.ok(uploadStart > -1);
    assert.ok(internalDeadlinesFetch > -1);
    assert.ok(streamIteration > -1);
    assert.ok(uploadStart < internalDeadlinesFetch);
    assert.ok(uploadStart < streamIteration);

    assert.ok(this.logs.some(msg => msg.includes('[phase:start] metrics internal-deadlines fetch')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:done] metrics internal-deadlines fetch')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:start] metrics actioned-tasks stream fetch')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:done] metrics actioned-tasks stream fetch')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:start] zip finalize')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:done] zip finalize')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:start] s3 upload completion')));
    assert.ok(this.logs.some(msg => msg.includes('[phase:done] s3 upload completion')));

    const zip = await Zip.loadAsync(this.zipBuffer);
    assert.ok(zip.file('internal-deadlines_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('actioned-tasks-raw_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('actioned-tasks-summary_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('subtasks-2026-08-01_2026-08-31.csv'));
  });
});

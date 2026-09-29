const assert = require('assert');
const { Readable } = require('stream');
const Zip = require('jszip');

const {
  loadTaskMetricsExporter,
  mockTaskMetricsClients,
  resetTaskMetricsMocks
} = require('./mocks');

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

describe('Task metrics exporter stream lifecycle', () => {
  let events;
  let logs;
  let zipBuffer;
  let exporter;

  beforeEach(() => {
    events = [];
    logs = [];
    zipBuffer = null;

    mockTaskMetricsClients({
      onMetricsCall: reportPath => events.push(`metrics:${reportPath}`),
      getInternalDeadlines: () => ([
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
      ]),
      getActionedTasksStream: () => {
        const items = [getTask('task-1'), getTask('task-2')];
        const source = async function * () {
          events.push('stream:iterated');
          for (const item of items) {
            yield item;
          }
        };

        return Readable.from(source(), { objectMode: true });
      },
      unexpectedMessage: 'Unexpected metrics call'
    });

    const builder = loadTaskMetricsExporter();
    exporter = builder({
      logger: {
        debug: msg => logs.push(`debug:${msg}`),
        info: msg => logs.push(`info:${msg}`),
        error: msg => logs.push(`error:${msg}`)
      },
      auth: {},
      metrics: {},
      s3Upload: ({ stream }) => {
        events.push('upload:start');
        return new Promise((resolve, reject) => {
          const chunks = [];
          stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
          stream.on('error', reject);
          stream.on('end', () => {
            events.push('upload:end');
            zipBuffer = Buffer.concat(chunks);
            resolve({ ETag: 'etag-1' });
          });
        });
      }
    });
  });

  afterEach(() => {
    resetTaskMetricsMocks();
  });

  it('starts upload before consuming actioned-tasks stream and logs phase markers', async () => {
    const result = await exporter({
      id: 'job-1',
      meta: {
        start: '2026-08-01',
        end: '2026-08-31'
      }
    });

    assert.equal(result.etag, 'etag-1');

    const uploadStart = events.indexOf('upload:start');
    const internalDeadlinesFetch = events.indexOf('metrics:/reports/internal-deadlines');
    const streamIteration = events.indexOf('stream:iterated');

    assert.ok(uploadStart > -1);
    assert.ok(internalDeadlinesFetch > -1);
    assert.ok(streamIteration > -1);
    assert.ok(uploadStart < internalDeadlinesFetch);
    assert.ok(uploadStart < streamIteration);

    assert.ok(logs.some(msg => msg.includes('[phase:start] metrics internal-deadlines fetch')));
    assert.ok(logs.some(msg => msg.includes('[phase:done] metrics internal-deadlines fetch')));
    assert.ok(logs.some(msg => msg.includes('[phase:start] metrics actioned-tasks stream fetch')));
    assert.ok(logs.some(msg => msg.includes('[phase:done] metrics actioned-tasks stream fetch')));
    assert.ok(logs.some(msg => msg.includes('[phase:start] zip finalize')));
    assert.ok(logs.some(msg => msg.includes('[phase:done] zip finalize')));
    assert.ok(logs.some(msg => msg.includes('[phase:start] s3 upload completion')));
    assert.ok(logs.some(msg => msg.includes('[phase:done] s3 upload completion')));

    const zip = await Zip.loadAsync(zipBuffer);
    assert.ok(zip.file('internal-deadlines_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('actioned-tasks-raw_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('actioned-tasks-summary_2026-08-01_2026-08-31.csv'));
    assert.ok(zip.file('subtasks-2026-08-01_2026-08-31.csv'));
  });
});

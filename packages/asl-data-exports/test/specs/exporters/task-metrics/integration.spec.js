const assert = require('assert');
const crypto = require('crypto');
const { Readable } = require('stream');
const fetch = require('node-fetch');
const Zip = require('jszip');
const parse = require('csv-parse/lib/sync');
const s3Upload = require('../../../../lib/clients/s3-upload');

const {
  loadTaskMetricsExporter,
  mockTaskMetricsClients,
  resetTaskMetricsMocks
} = require('./mocks');

jest.setTimeout(120000);

const makeLargeTask = taskId => {
  const comment = crypto.randomBytes(2048).toString('hex');

  return {
    id: taskId,
    status: 'resolved',
    data: {
      model: 'project',
      modelId: `model-${taskId}`,
      licenceNumber: `PPL-${taskId}`,
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
      wasSubmittedInPeriod: true,
      isOutstanding: false,
      returnedCount: 0,
      returnedCountInPeriod: 0,
      resubmittedCount: 0,
      resubmittedCountInPeriod: 0,
      subtasks: [
        {
          taskId,
          model: 'project',
          modelId: `model-${taskId}`,
          licenceNumber: `PPL-${taskId}`,
          versionId: 'v1',
          taskAction: 'grant',
          taskType: 'pplApplication',
          submitted: '2026-08-01',
          isResubmission: false,
          assigned: '2026-08-02',
          actioned: '2026-08-03',
          inspectorAction: 'resolved',
          inspectorName: 'Inspector',
          comment
        }
      ]
    }
  };
};

describe('Task metrics exporter localstack integration', () => {
  const s3Settings = {
    region: process.env.S3_REGION || 'eu-west-2',
    accessKey: process.env.S3_ACCESS_KEY || 'test',
    secret: process.env.S3_SECRET || 'test',
    bucket: process.env.S3_BUCKET || 'asl-dev',
    localstackUrl: process.env.S3_LOCALSTACK_URL || 'http://localhost:4566'
  };

  let exportZip;

  beforeAll(() => {
    mockTaskMetricsClients({
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
        const rows = async function * () {
          for (let index = 0; index < 100; index++) {
            yield makeLargeTask(index + 1);
          }
        };

        return Readable.from(rows(), { objectMode: true });
      }
    });

    const exporterBuilder = loadTaskMetricsExporter();
    exportZip = exporterBuilder({
      logger: {
        debug: () => null,
        info: () => null,
        error: err => {
          throw err;
        }
      },
      auth: {},
      metrics: {},
      s3Upload: s3Upload(s3Settings)
    });
  });

  afterAll(() => {
    resetTaskMetricsMocks();
  });

  it('streams the full archive to localstack without stalling on large exports', async () => {
    const job = {
      id: `task-metrics-${Date.now()}`,
      meta: {
        start: '2026-08-01',
        end: '2026-08-31'
      }
    };

    const result = await exportZip(job);
    assert.ok(result.etag);

    const response = await fetch(`${s3Settings.localstackUrl}/${s3Settings.bucket}/${job.id}`);
    assert.ok(response.ok);
    const body = await response.buffer();

    const zip = await Zip.loadAsync(body);
    const rawCsv = await zip.file(`actioned-tasks-raw_${job.meta.start}_${job.meta.end}.csv`).async('string');
    const subtasksCsv = await zip.file(`subtasks-${job.meta.start}_${job.meta.end}.csv`).async('string');

    const rawRows = parse(rawCsv, { columns: true, bom: true });
    const subtaskRows = parse(subtasksCsv, { columns: true, bom: true });

    assert.equal(rawRows.length, 100);
    assert.equal(subtaskRows.length, 100);
    assert.equal(rawRows[0].status, 'resolved');
    assert.equal(rawRows[0].modelId, 'model-1');
    assert.equal(rawRows[99].modelId, 'model-100');
    assert.equal(subtaskRows[0].taskId, '1');
    assert.equal(subtaskRows[99].taskId, '100');
  });
});

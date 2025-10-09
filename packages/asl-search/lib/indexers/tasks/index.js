const { Transform } = require('stream');
const { get, pick } = require('lodash');
const ElasticsearchWritableStream = require('elasticsearch-writable-stream');
const deleteIndex = require('../utils/delete-index');
const getDecorators = require('./decorators');
const synonyms = require('../profiles/synonyms');

const IndexName = 'tasks';
const BATCH_SIZE = 500; // Increased for better throughput
const flushTimeout = 1000; // Increased for larger batches

const COLUMNS_TO_INDEX = [
  'id', 'open', 'status', 'type', 'establishment', 'subject',
  'licenceHolder', 'asruUser', 'createdAt', 'updatedAt', 'assignedTo'
];

async function resetIndex(esClient) {
  console.log(`Rebuilding index [${IndexName}]...`);
  await deleteIndex(esClient, IndexName);

  await esClient.indices.create({
    index: IndexName,
    body: {
      settings: {
        analysis: {
          analyzer: {
            default: { tokenizer: 'standard', filter: ['lowercase'] },
            firstName: { tokenizer: 'standard', filter: ['lowercase', 'asciifolding', 'synonyms'] },
            lastName: { tokenizer: 'standard', filter: ['lowercase', 'asciifolding'] },
            projectTitle: { tokenizer: 'standard', filter: ['lowercase', 'stop'] }
          },
          normalizer: {
            licenceNumber: { type: 'custom', filter: ['lowercase'] }
          },
          filter: { synonyms: { type: 'synonym', synonyms } }
        }
      },
      mappings: {
        properties: {
          open: { type: 'boolean' },
          status: { type: 'keyword', fields: { value: { type: 'keyword' } } },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
          model: { type: 'keyword' },
          type: { type: 'keyword' },
          licenceNumber: { type: 'keyword', normalizer: 'licenceNumber' },
          establishment: { properties: { name: { type: 'text', fields: { value: { type: 'keyword' } } } } },
          projectTitle: { type: 'text', analyzer: 'projectTitle' },
          licenceHolder: {
            properties: {
              firstName: { type: 'text', analyzer: 'firstName' },
              lastName: { type: 'text', analyzer: 'lastName' }
            }
          },
          subject: {
            properties: {
              firstName: { type: 'text', analyzer: 'firstName' },
              lastName: { type: 'text', analyzer: 'lastName' }
            }
          },
          assignedTo: {
            properties: {
              firstName: { type: 'text', analyzer: 'firstName' },
              lastName: { type: 'text', analyzer: 'lastName' }
            }
          }
        }
      }
    }
  });
}

function createTaskDecorator(decorators) {
  return new Transform({
    objectMode: true,
    async transform(task, enc, done) {
      try {
        const decorationPromises = Object.keys(decorators).map(key =>
          Promise.resolve(decorators[key](task))
        );

        const results = await Promise.all(decorationPromises);

        const decorated = results.reduce((acc, result) => ({ ...acc, ...result }), task);

        done(null, decorated);
      } catch (err) {
        console.error(`Failed to decorate task ${task.id}:`, err.message);
        done(); // Skip this task
      }
    }
  });
}

function createDocumentTransform() {
  return new Transform({
    objectMode: true,
    transform(task, enc, done) {
      try {
        const body = {
          model: get(task, 'data.model', ''),
          modelStatus: get(task, 'data.modelData.status', ''),
          action: get(task, 'data.action', ''),
          licenceNumber: get(task, 'data.modelData.licenceNumber', ''),
          ...pick(task, COLUMNS_TO_INDEX)
        };

        if (body.model === 'project') {
          body.projectTitle = get(task, 'data.modelData.title', '');
        }

        done(null, { index: IndexName, id: task.id, type: '_doc', body });
      } catch (err) {
        console.error(`Failed to transform task ${task.id}: ${err.message}`);
        done(); // Skip this record
      }
    }
  });
}

function createCounter() {
  let count = 0;
  const counter = new Transform({
    objectMode: true,
    transform(data, enc, done) {
      count++;
      done(null, data);
    }
  });
  counter.getCount = () => count;
  return counter;
}

function createProgressTracker() {
  let processed = 0;
  const startTime = Date.now();
  let lastLogTime = startTime;

  return new Transform({
    objectMode: true,
    transform(data, enc, done) {
      processed++;

      const now = Date.now();
      if (processed % 10000 === 0 || now - lastLogTime >= 30000) {
        const elapsed = (now - startTime) / 1000;
        const rate = processed / elapsed;
        console.log(`Progress: ${processed.toLocaleString()} tasks (${Math.round(rate)}/sec)`);
        lastLogTime = now;
      }

      done(null, data);
    }
  });
}

module.exports = async ({ aslSchema, taskflowDb, esClient, logger, options = {} }) => {
  if (options.reset && options.id) {
    throw new Error('Do not define an ID when resetting indexes');
  }

  if (options.reset) {
    await resetIndex(esClient);
  }

  console.log('Loading decorators...');
  const decorators = await getDecorators(aslSchema);

  const formatSafeLogger = {
    info: (message, ...args) => {
      if (typeof message === 'string' && message.includes('%')) {
        // Use util.format to handle printf-style formatting
        const formatted = require('util').format(message, ...args);
        logger.info(formatted);
      } else {
        logger.info(message, ...args);
      }
    },
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    debug: logger.debug.bind(logger)
  };

  const counter = createCounter();
  const progressTracker = createProgressTracker();

  const bulkIndexStream = new ElasticsearchWritableStream(esClient, {
    highWaterMark: BATCH_SIZE,
    flushTimeout: flushTimeout,
    logger: formatSafeLogger,
    maxRetries: 3,
    retryDelay: 1000
  });

  const taskDecorator = createTaskDecorator(decorators);
  const documentTransform = createDocumentTransform();

  const query = taskflowDb
    .select('*')
    .from('cases')
    .whereNot('status', 'autoresolved')
    .modify(qb => {
      if (options.id) {
        qb.where({ id: options.id });
      } else {
        // Order by ID for better database performance on full reindex
        qb.orderBy('id');
      }
    });

  console.log(`Indexing tasks${options.id ? ` (id=${options.id})` : ''}...`);

  const startTime = Date.now();

  try {
    await new Promise((resolve, reject) => {
      query
        .stream(stream => {
          stream
            .pipe(counter)
            .pipe(progressTracker)
            .pipe(taskDecorator)
            .pipe(documentTransform)
            .pipe(bulkIndexStream)
            .on('finish', resolve)
            .on('error', reject);
        })
        .catch(reject);
    });

    const total = counter.getCount();
    const totalTime = (Date.now() - startTime) / 1000;
    const rate = total / totalTime;

    console.log(`Indexed ${total.toLocaleString()} tasks in ${Math.round(totalTime)}s (${Math.round(rate)} tasks/sec)`);
    await esClient.indices.refresh({ index: IndexName });

  } catch (error) {
    const failedAt = counter.getCount();
    console.error(`Failed after ${failedAt.toLocaleString()} tasks:`, error.message);
    throw error;
  }
};

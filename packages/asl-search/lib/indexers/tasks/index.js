const { Transform } = require('stream');
const { get, pick } = require('lodash');
const ElasticsearchWritableStream = require('elasticsearch-writable-stream');
const deleteIndex = require('../utils/delete-index');
const getDecorators = require('./decorators');
const synonyms = require('../profiles/synonyms');

const IndexName = 'tasks';
const BATCH_SIZE = 256;
const flushTimeout = 500;

const COLUMNS_TO_INDEX = [
  'id',
  'open',
  'status',
  'type',
  'establishment',
  'subject',
  'licenceHolder',
  'asruUser',
  'createdAt',
  'updatedAt',
  'assignedTo'
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
        const decorated = await Object.keys(decorators).reduce(
          async (acc, key) => decorators[key](await acc),
          Promise.resolve(task)
        );
        done(null, decorated);
      } catch (err) {
        console.error(`Failed to decorate task ${task.id}: ${err.message}`);
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

module.exports = async ({ aslSchema, taskflowDb, esClient, logger, options = {} }) => {
  if (options.reset && options.id) {
    throw new Error('Do not define an ID when resetting indexes');
  }

  if (options.reset) {
    await resetIndex(esClient);
  }

  const decorators = await getDecorators(aslSchema);
  const counter = createCounter();

  const bulkIndexStream = new ElasticsearchWritableStream(esClient, {
    highWaterMark: BATCH_SIZE,
    flushTimeout: flushTimeout,
    logger
  });

  const taskDecorator = createTaskDecorator(decorators);
  const documentTransform = createDocumentTransform();

  const query = taskflowDb
    .select('*')
    .from('cases')
    .whereNot('status', 'autoresolved')
    .modify(qb => {
      if (options.id) qb.where({ id: options.id });
    });

  console.log(`Indexing tasks${options.id ? ` (id=${options.id})` : ''}...`);

  await new Promise((resolve, reject) => {
    query
      .stream(stream => {
        stream
          .pipe(counter)
          .pipe(taskDecorator)
          .pipe(documentTransform)
          .pipe(bulkIndexStream)
          .on('finish', resolve)
          .on('error', reject);
      })
      .catch(reject);
  });

  const total = counter.getCount();
  console.log(`Indexed ${total} task${total === 1 ? '' : 's'}`);
  await esClient.indices.refresh({ index: IndexName });
};

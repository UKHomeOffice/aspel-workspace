const { Transform } = require('stream');
const { get, pick } = require('lodash');
const ElasticsearchWritableStream = require('elasticsearch-writable-stream');
const deleteIndex = require('../utils/delete-index');
const getDecorators = require('./decorators');
const synonyms = require('../profiles/synonyms');
const logger = require('../../logger');

const columnsToIndex = [
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

const ANALYSIS_SETTINGS = {
  analysis: {
    analyzer: {
      default: {
        tokenizer: 'standard',
        filter: ['lowercase']
      },
      firstName: {
        tokenizer: 'standard',
        filter: ['lowercase', 'asciifolding', 'synonyms']
      },
      lastName: {
        tokenizer: 'standard',
        filter: ['lowercase', 'asciifolding']
      },
      projectTitle: {
        tokenizer: 'standard',
        filter: ['lowercase', 'stop']
      }
    },
    normalizer: {
      licenceNumber: {
        type: 'custom',
        filter: ['lowercase']
      }
    },
    filter: {
      synonyms: {
        type: 'synonym',
        synonyms
      }
    }
  }
};

const FIELD_MAPPINGS = {
  open: {
    type: 'boolean'
  },
  status: {
    type: 'keyword',
    fields: {
      value: {
        type: 'keyword'
      }
    }
  },
  createdAt: {
    type: 'date',
    fields: {
      value: {
        type: 'date'
      }
    }
  },
  updatedAt: {
    type: 'date',
    fields: {
      value: {
        type: 'date'
      }
    }
  },
  model: {
    type: 'keyword',
    fields: {
      value: {
        type: 'keyword'
      }
    }
  },
  type: {
    type: 'keyword',
    fields: {
      value: {
        type: 'keyword'
      }
    }
  },
  licenceNumber: {
    type: 'keyword',
    normalizer: 'licenceNumber'
  },
  establishment: {
    properties: {
      name: {
        type: 'text',
        fields: {
          value: {
            type: 'keyword'
          }
        }
      }
    }
  },
  projectTitle: {
    type: 'text',
    analyzer: 'projectTitle'
  },
  licenceHolder: {
    properties: {
      firstName: {
        type: 'text',
        analyzer: 'firstName'
      },
      lastName: {
        type: 'text',
        analyzer: 'lastName'
      }
    }
  },
  subject: {
    properties: {
      firstName: {
        type: 'text',
        analyzer: 'firstName'
      },
      lastName: {
        type: 'text',
        analyzer: 'lastName'
      }
    }
  },
  assignedTo: {
    properties: {
      firstName: {
        type: 'text',
        analyzer: 'firstName'
      },
      lastName: {
        type: 'text',
        analyzer: 'lastName'
      }
    }
  }
};

async function resetIndex(esClient) {
  logger.info('Rebuilding index tasks');
  await deleteIndex(esClient, 'tasks');

  await esClient.indices.create({
    index: 'tasks',
    body: {
      settings: ANALYSIS_SETTINGS,
      mappings: {
        properties: FIELD_MAPPINGS
      }
    }
  });
}

function createTaskDecorator(decorators) {
  return new Transform({
    objectMode: true,
    async transform(task, encoding, callback) {
      try {
        let decoratedTask = task;

        for (const [key, decorator] of Object.entries(decorators)) {
          try {
            decoratedTask = await decorator(decoratedTask);
          } catch (error) {
            logger.error(`Decorator ${key} failed for task ${task.id}:`, error.message);
          }
        }

        callback(null, decoratedTask);
      } catch (error) {
        logger.error(`Task decoration failed for ${task.id}:`, error.message);
        callback(null, task); // Pass through original task if decoration fails
      }
    }
  });
}

function createDocumentTransform() {
  return new Transform({
    objectMode: true,
    transform(task, encoding, callback) {
      try {
        const document = {
          index: 'tasks',
          id: task.id,
          type: '_doc',
          body: {
            model: get(task, 'data.model') || '',
            modelStatus: get(task, 'data.modelData.status') || '',
            action: get(task, 'data.action') || '',
            licenceNumber: get(task, 'data.modelData.licenceNumber') || '',
            ...pick(task, columnsToIndex)
          }
        };

        if (document.body.model === 'project') {
          document.body.projectTitle = get(task, 'data.modelData.title') || '';
        }

        callback(null, document);
      } catch (error) {
        logger.error(`Failed to transform task ${task.id}:`, error.message);
        callback(); // Skip this task but continue processing
      }
    }
  });
}

function createBulkIndexStream(esClient, logger) {
  const bulkIndexStream = new ElasticsearchWritableStream(esClient, {
    highWaterMark: 500, // Increased for better throughput
    flushTimeout: 1000, // Reduced timeout for more frequent flushing
    maxBatchSize: 1000, // Larger batches for better performance
    logger
  });

  // Fix the logger format issue by intercepting the log messages
  const originalLog = logger.info;
  logger.info = function(message, ...args) {
    if (message === 'Wrote %d records to Elasticsearch' && args.length > 0) {
      originalLog.call(this, `Wrote ${args[0]} records to Elasticsearch`);
    } else {
      originalLog.apply(this, arguments);
    }
  };

  return bulkIndexStream;
}

module.exports = async ({ aslSchema, taskflowDb, esClient, logger, options = {} }) => {
  if (options.reset && options.id) {
    throw new Error('Do not define an id when resetting indexes');
  }

  logger.info('Loading decorators...');
  const decorators = await getDecorators(aslSchema);

  if (options.reset) {
    await resetIndex(esClient);
  }

  logger.info('Indexing tasks...');
  const startTime = Date.now();

  const bulkIndexStream = createBulkIndexStream(esClient, logger);
  const taskDecorator = createTaskDecorator(decorators);
  const documentTransform = createDocumentTransform();

  // Track count manually
  let taskCount = 0;

  const progressCounter = new Transform({
    objectMode: true,
    transform(data, encoding, callback) {
      taskCount++;

      // Log progress every 10,000 records for large datasets
      if (taskCount % 10000 === 0) {
        logger.info(`Processed ${taskCount} tasks...`);
      }

      callback(null, data);
    },

    flush(callback) {
      logger.info(`Total tasks processed: ${taskCount}`);
      callback();
    }
  });

  return new Promise((resolve, reject) => {
    const query = taskflowDb
      .select('*')
      .from('cases')
      .whereNot('status', 'autoresolved')
      .where(builder => {
        if (options.id) {
          builder.where({ id: options.id });
        }
      });

    query.stream(readStream => {
      readStream
        .on('error', reject)
        .pipe(progressCounter)
        .on('error', reject)
        .pipe(taskDecorator)
        .on('error', reject)
        .pipe(documentTransform)
        .on('error', reject)
        .pipe(bulkIndexStream)
        .on('finish', () => {
          const duration = Date.now() - startTime;
          const rate = taskCount > 0 ? Math.round(taskCount / (duration / 1000)) : 0;
          logger.info(`Indexed ${taskCount} tasks in ${duration}ms (${rate} tasks/sec)`);
          resolve(taskCount);
        })
        .on('error', reject);
    }).catch(reject);
  })
    .then(async (count) => {
      await esClient.indices.refresh({ index: 'tasks' });
      return count;
    })
    .catch(error => {
      logger.error('Task indexing failed:', error);
      throw error;
    });
};

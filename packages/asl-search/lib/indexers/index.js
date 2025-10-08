const { Router } = require('express');
const winston = require('winston');
const aslSchema = require('../db');
const taskflowDb = require('../db/taskflow');
const { NotFoundError } = require('@asl/service/errors');

const logger = winston.createLogger({
  level: 'debug',
  transports: [ new winston.transports.Console({ level: process.env.LOG_LEVEL || 'info' }) ]
});

const indexers = {
  establishments: require('./establishments'),
  enforcements: require('./enforcements'),
  projects: require('./projects'),
  'projects-content': require('./projects-content'),
  profiles: require('./profiles'),
  places: require('./places'),
  tasks: require('./tasks')
};

module.exports = (settings) => {
  const app = Router();

  app.param('index', (req, res, next, param) => {
    if (!indexers[param]) {
      throw new NotFoundError();
    }
    next();
  });

  app.put('/:index/:id', async (req, res, next) => {
    const { index, id } = req.params;
    const options = { id };

    try {
      const client = settings.esClient;
      logger.info(`Starting reindex for ${index}:${id}`);

      switch (index) {
        case 'establishments':
          await Promise.all([
            indexers.establishments(aslSchema, client, options),
            indexers.places(aslSchema, client, { establishmentId: id })
          ]);
          break;

        case 'projects':
          await Promise.all([
            indexers.projects(aslSchema, client, options),
            indexers['projects-content'](aslSchema, client, options)
          ]);
          break;

        case 'tasks':
          await indexers.tasks({ aslSchema, taskflowDb, esClient: client, logger, options });
          break;

        default:
          await indexers[index](aslSchema, client, options);
      }

      logger.info(`Successfully reindexed ${index}:${id}`);
      res.json({ message: `Reindexed ${index}:${id}` });

    } catch (err) {
      logger.error(`Error reindexing ${req.params.index}:${req.params.id}`, err);
      next(err);
    }
  });

  return app;
};

module.exports.indexers = indexers;

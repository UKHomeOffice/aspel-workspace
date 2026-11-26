const {Router} = require('express');
const {get, pick} = require('lodash');
const {Packer} = require('@joefitter/docx');
const filenamify = require('filenamify');
const renderer = require('@asl/projects/client/components/download-link/renderers/docx-renderer').default;
const ntsRenderer = require('@asl/projects/client/components/download-link/renderers/nts-docx-renderer').default;
const {loadRa, loadDraftTraining} = require('../middleware');
const getNtsSchema = require('../nts/schema');
const schema = require('@asl/projects/client/schema').default;
const {NotFoundError} = require('@asl/service/errors');
const {FEATURE_FLAG_NTS_DOCX} = require('@asl/service/ui/feature-flag');
const {loadImages} = require('./load-images');

const pack = doc => {
  const packer = new Packer(doc);
  return packer.toBuffer(doc);
};

const buildDocxContent = (req) => {
  const values = req.version.data || {};
  const application = {
    ...req.project,
    licenceHolder: req.version.licenceHolder,
    establishment: req.project.establishment,
    establishments: [
      pick(req.project.establishment, 'id', 'name')
    ]
  };

  const task = get(req.project, 'openTasks[0]');
  if (task && task.data.action === 'transfer') {
    const receivingEstablishment = get(task, 'data.meta.establishment.to');
    application.establishments.push(pick(receivingEstablishment, 'id', 'name'));
  }

  return {values, application};
};

module.exports = (settings) => {
  const app = Router();

  app.get('/', loadDraftTraining, (req, res, next) => {
    const sections = Object.values(schema[req.project.schemaVersion]());
    const {values, application} = buildDocxContent(req);

    renderer(application, sections, values, loadImages(settings.attachments))
      .then(pack)
      .then(buffer => {
        const isAmendment = req.project.status === 'active' && req.version.status !== 'granted';
        res.attachment(`${filenamify(values.title || 'Untitled project')} (${isAmendment ? 'amendment' : 'application'}).docx`);
        res.end(Buffer.from(buffer));
      })
      .catch(next);
  });

  app.get('/nts', loadRa, (req, res, next) => {
    if (!req.hasFeatureFlag(FEATURE_FLAG_NTS_DOCX)) {
      throw new NotFoundError('NTS DOCX download requires a feature flag');
    }
    const {values, application} = buildDocxContent(req);
    const includeDraftRa = req.query.draftRa === 'true';
    const isTrainingLicence = !!values['training-licence'];
    const ntsSections = getNtsSchema(req.project.schemaVersion);

    ntsRenderer({
      application,
      version: values,
      ntsSections,
      includeDraftRa,
      ra: includeDraftRa ? req.project.draftRa : req.project.grantedRa,
      raReasons: req.project.raReasons,
      isTrainingLicence,
      updateImageDimensions: loadImages(settings.attachments)
    })
      .then(pack)
      .then(buffer => {
        const title = filenamify(values.title || 'Untitled project');
        res.attachment(`${title} (non-technical summary).docx`);
        res.end(Buffer.from(buffer));
      })
      .catch(next);
  });

  return app;
};

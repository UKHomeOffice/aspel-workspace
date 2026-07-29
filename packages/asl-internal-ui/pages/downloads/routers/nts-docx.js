const { Router } = require('express');
const ntsRenderer = require('@asl/projects/client/components/download-link/renderers/nts-docx-renderer').default;
const getNtsSchema = require('@asl/pages/pages/project-version/nts/schema');
const { Packer } = require('@joefitter/docx');
const filenamify = require('filenamify');
const DocxMerger = require('@scholarcy/docx-merger');
const { FEATURE_FLAG_NTS_DOCX } = require('@asl/service/ui/feature-flag');
const { NotFoundError } = require('@asl/service/errors');

// Converts docx Document instance into a binary Buffer
const pack = doc => {
  const packer = new Packer(doc);
  return packer.toBuffer(doc);
};

// Convert docx-merger callback into a Promise
const mergeBuffers = async (buffers) => {
  const docx = new DocxMerger();
  await docx.initialize({}, buffers);
  return docx.save('nodebuffer');
};

// Helper to check YYYY-MM-DD format and date check
const isValidDate = (dateStr) => {
  if (typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const date = new Date(dateStr);
  // Ensures it's a valid date
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateStr;
};

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', async (req, res, next) => {
    try {
      if (!req.hasFeatureFlag(FEATURE_FLAG_NTS_DOCX)) {
        throw new NotFoundError('Unauthorised to access this feature. Please contact the ASL support if you need access to this feature.');
      }
      const { startDate, endDate, ra } = req.query;

      // Validate startDate
      if (!startDate) {
        return res.status(400).send('Missing required query parameter: "startDate".');
      }
      if (!isValidDate(startDate)) {
        return res.status(400).send('Invalid "startDate" parameter. Format must be YYYY-MM-DD.');
      }

      // Validate endDate
      if (!endDate) {
        return res.status(400).send('Missing required query parameter: "endDate".');
      }
      if (!isValidDate(endDate)) {
        return res.status(400).send('Invalid "endDate" parameter. Format must be YYYY-MM-DD.');
      }

      // Ensure startDate is not after endDate
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).send('"startDate" cannot be later than "endDate".');
      }

      // Validate ra (REQUIRED & must be 'true' or 'false')
      if (ra === undefined || ra === '') {
        return res.status(400).send('Missing required query parameter: "ra".');
      }
      const normalizedRa = String(ra).toLowerCase();
      if (!['true', 'false'].includes(normalizedRa)) {
        return res.status(400).send('Invalid "ra" parameter. Must be "true" or "false".');
      }

      // Build the api/db query params
      const query = new URLSearchParams();
      query.append('startDate', startDate);
      query.append('endDate', endDate);
      query.append('ra', ra);
      let queryString = query.toString();

      const response = await req.api('/reports/nts-docx?' + queryString);
      const items = response.json.data || [];

      if (items.length === 0) {
        return res.status(404).send('No projects found during the specified date range.');
      }
      // Rendering each report buffer individually
      const bufferPromises = items.map(async item => {
        const ntsSections = getNtsSchema(item.application.schemaVersion);
        const isTrainingLicence = !!item.data['training-licence'];
        const doc = await ntsRenderer({
          application: item.application,
          version: item.data,
          ntsSections,
          ra: normalizedRa === 'true',
          isTrainingLicence,
          attachmentsHost: settings.attachments,
          isBulk: true
        });

        // Pack each doc instance into a valid .docx Buffer
        return pack(doc);
      });

      const buffers = await Promise.all(bufferPromises);

      // Combine all .docx buffers into a single document
      const mergedBuffer = await mergeBuffers(buffers);

      // Return the merged file
      const filename = filenamify(`NTS_Combined_Report_${startDate}_to_${endDate}.docx`);
      res.attachment(filename);
      res.end(Buffer.from(mergedBuffer));
    } catch (err) {
      next(err);
    }
  });

  return router;
};

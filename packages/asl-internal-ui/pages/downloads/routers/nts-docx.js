const { Router } = require('express');
const ntsRenderer = require('@asl/projects/client/components/download-link/renderers/nts-docx-renderer').default;
const getNtsSchema = require('@asl/pages/pages/project-version/nts/schema');
const { Packer } = require('@joefitter/docx');
const filenamify = require('filenamify');
const DocxMerger = require('docx-merger');

const pack = doc => {
  const packer = new Packer(doc);
  return packer.toBuffer(doc);
};

// Helper to convert docx-merger callback into a Promise
const mergeBuffers = (buffers) => {
  return new Promise((resolve, reject) => {
    try {
      const docx = new DocxMerger({}, buffers);
      docx.save('nodebuffer', (mergedData) => resolve(mergedData));
    } catch (err) {
      reject(err);
    }
  });
};

// Helper to check YYYY-MM-DD format and actual calendar validity
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

      // Build the query params dynamically
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
      // Render each report buffer individually using your existing logic
      const bufferPromises = items.map(async item => {
        const ntsSections = getNtsSchema(item.application.schemaVersion);
        const isTrainingLicence = !!item.data['training-licence'];

        const doc = await ntsRenderer({
          application: item.application,
          version: item.data,
          ntsSections,
          isTrainingLicence,
          attachmentsHost: settings.attachments
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

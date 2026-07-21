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

module.exports = settings => {
  const router = Router({ mergeParams: true });

  router.get('/', async (req, res, next) => {
    try {
      const { startDate, endDate, ra } = req.query;
      console.log(startDate, endDate, ra);
      const response = await req.api(`/reports/nts-docx/`);
      console.log(response.json.data);
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
      const filename = filenamify(
        `NTS_Combined_Report_${startDate || 'all'}_to_${endDate || 'all'}.docx`
      );

      res.attachment(filename);
      res.end(Buffer.from(mergedBuffer));
    } catch (err) {
      next(err);
    }
  });

  return router;
};

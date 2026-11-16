const ntsRenderer = require('@asl/projects/client/components/download-link/renderers/nts-docx-renderer').default;
const getNtsSchema = require('@asl/pages/pages/project-version/nts/schema');
const { Packer } = require('@joefitter/docx');
const filenamify = require('filenamify');
const { addPageNumbers } = require('@asl/projects/client/components/download-link/renderers/helpers/docx-style-helper');
const { getRAReasons, DATE_FORMAT } = require('@ukhomeoffice/asl-constants');
const { parseDate } = require('@ukhomeoffice/asl-components/dayjs');

// Converts docx Document instance into a binary Buffer
const pack = doc => {
  const packer = new Packer(doc);
  return packer.toBuffer(doc);
};

module.exports = settings => {
  return async (req, res, next) => {
    try {
      const startDate = parseDate(req.form.values['date-from']).format(DATE_FORMAT.iso);
      const endDate = parseDate(req.form.values['date-to']).format(DATE_FORMAT.iso);
      const { ra } = req.form.values;

      // Build the api/db query params
      const query = new URLSearchParams();
      query.append('startDate', startDate);
      query.append('endDate', endDate);
      query.append('ra', ra);
      let queryString = query.toString();

      const response = await req.api('/reports/nts-docx?' + queryString);
      const items = response.json.data || [];

      if (items.length === 0) {
        return next({ validation: { form: 'noResults' } });
      }

      let mergedDocument = null;
      for (const item of items) {
        const ntsSections = getNtsSchema(item.application.schemaVersion);
        const isTrainingLicence = !!item.data['training-licence'];

        mergedDocument = await ntsRenderer({
          application: item.application,
          version: item.data,
          ntsSections,
          isTrainingLicence,
          raReasons: getRAReasons(item.data),
          attachmentsHost: settings.attachments,
          isBulk: true,
          mergedDocument
        });
      }

      addPageNumbers(mergedDocument);

      // Pack the final accumulated document into a buffer
      const finalBuffer = await pack(mergedDocument);

      // Return the combined document to the browser
      const filename = filenamify(`NTS_${startDate}_to_${endDate}_ra_${ra}.docx`);
      res.attachment(filename);
      res.end(finalBuffer);
    } catch (err) {
      next(err);
    }
  };
};

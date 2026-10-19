const ntsRenderer = require('@asl/projects/client/components/download-link/renderers/nts-docx-renderer').default;
const getNtsSchema = require('@asl/pages/pages/project-version/nts/schema');
const { Packer } = require('@joefitter/docx');
const filenamify = require('filenamify');
const { FEATURE_FLAG_NTS_DOCX } = require('@asl/service/ui/feature-flag');
const { NotFoundError } = require('@asl/service/errors');
const { addPageNumbers } = require('@asl/projects/client/components/download-link/renderers/helpers/docx-style-helper');
const { getRAReasons } = require('@ukhomeoffice/asl-constants');
const moment = require('moment');

// Converts docx Document instance into a binary Buffer
const pack = doc => {
  const packer = new Packer(doc);
  return packer.toBuffer(doc);
};

module.exports = settings => {
  return async (req, res, next) => {
    try {
      if (!req.hasFeatureFlag(FEATURE_FLAG_NTS_DOCX)) {
        throw new NotFoundError('Unauthorised to access this feature. Please contact the ASL support if you need access to this feature.');
      }
      const startDate = moment(req.form.values['date-from'], 'YYYY-MM-DD').format('YYYY-MM-DD');
      const endDate = moment(req.form.values['date-to'], 'YYYY-MM-DD').format('YYYY-MM-DD');
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

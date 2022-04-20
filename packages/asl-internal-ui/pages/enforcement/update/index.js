const { get, set, isEmpty } = require('lodash');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { page } = require('@asl/service/ui');
const { NotFoundError } = require('@asl/service/errors');
const cleanSubject = require('../helpers/clean-subject');
const validateSubjectForm = require('../helpers/validate-subject-form');
const processSubjectForm = require('../helpers/process-subject-form');
const getSchema = require('./schema');
const getModel = require('./schema/get-model');

const getNewSubject = (session, caseId) => {
  return get(session, `enforcementCases[${caseId}].newSubject`);
};

const setNewSubject = (session, caseId, subject) => {
  set(session, `enforcementCases[${caseId}].newSubject`, subject);
};

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    if (req.query.clear) {
      setNewSubject(req.session, req.enforcementCase.id, undefined);
      return res.redirect(req.buildRoute('enforcement.update', { caseId: req.enforcementCase.id }));
    }
    next();
  });

  // provides the list of establishments for the autosuggest
  app.get('/establishments', (req, res, next) => {
    return req.api('/search/establishments', { query: { limit: 1000 } })
      .then(response => {
        const options = response.json.data.map(e => {
          const label = e.name + (e.status !== 'active' ? ` (${e.status === 'inactive' ? 'draft' : e.status})` : '');
          return { label, value: e.id };
        });
        res.json(options);
      })
      .catch(next);
  });

  // provides a list of profiles for the autosuggest
  app.get('/profiles', (req, res, next) => {
    const subject = getNewSubject(req.session, req.enforcementCase.id);

    return req.api(`/establishment/${subject.establishmentId}/profiles`, { query: { limit: 'all' } })
      .then(response => {
        const options = response.json.data.map(p => {
          const roles = p.roles.map(r => r.type.toUpperCase()).join(', ');
          const label = `${p.firstName} ${p.lastName}` + (roles ? ` (${roles})` : '');
          return { value: p.id, label };
        });
        res.json(options);
      })
      .catch(next);
  });

  const updateNewSubject = (req, res, next) => {
    const subject = cleanSubject(req.body.subject);
    subject.caseId = req.enforcementCase.id;
    setNewSubject(req.session, req.enforcementCase.id, subject);
    next();
  };

  const getSubjectEstablishment = (req, res, next) => {
    const subject = getNewSubject(req.session, req.enforcementCase.id);

    if (subject.establishmentId && !subject.establishment) {
      return req.api(`/establishment/${subject.establishmentId}`)
        .then(response => {
          subject.establishment = response.json.data;
          setNewSubject(req.session, req.enforcementCase.id, subject);
        })
        .then(() => next())
        .catch(next);
    }

    next();
  };

  const getSubjectProfile = (req, res, next) => {
    const subject = getNewSubject(req.session, req.enforcementCase.id);

    if (subject.establishmentId && subject.profileId && !subject.profile) {
      return req.api(`/profile/${subject.profileId}`)
        .then(response => {
          subject.profile = response.json.data;

          subject.profile.roles = subject.profile.roles.map(r => ({
            ...r,
            establishment: subject.profile.establishments.find(e => e.id === r.establishmentId)
          }));

          setNewSubject(req.session, req.enforcementCase.id, subject);
        })
        .then(() => next())
        .catch(next);
    }

    next();
  };

  app.put('/subject/new-subject',
    jsonParser,
    updateNewSubject,
    getSubjectEstablishment,
    getSubjectProfile,
    (req, res, next) => {
      return res.json(getNewSubject(req.session, req.enforcementCase.id));
    }
  );

  app.use((req, res, next) => {
    const subject = getNewSubject(req.session, req.enforcementCase.id);

    // if the new-subject is ready for flagging, add it to the subjects list
    // so that it gets handled the same way as an existing subject (i.e. displays the edit form)
    if (subject && subject.establishment && subject.profile) {
      req.enforcementCase.subjects.push({ ...subject, editing: true });
    }

    next();
  });

  app.param('subjectId', (req, res, next, subjectId) => {
    req.subjectId = subjectId;
    next();
  });

  app.use('/subject/:subjectId', (req, res, next) => {
    const subject = req.enforcementCase.subjects.find(s => s.id === req.subjectId);

    if (!subject) {
      throw new NotFoundError('subject id not found');
    }

    req.subject = subject;
    next();
  });

  app.get('/subject/:subjectId/form', (req, res) => {
    res.json({
      schema: getSchema(req.subject),
      model: getModel(req.subject)
    });
  });

  app.put('/subject/:subjectId', jsonParser, (req, res, next) => {
    const errors = validateSubjectForm(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    const subject = processSubjectForm(req.subject, req.body);

    if (req.subject.new && isEmpty(subject.flags)) {
      setNewSubject(req.session, req.enforcementCase.id, undefined);
      return res.json({ ...req.subject, deleted: true });
    }

    const params = {
      method: 'PUT',
      json: { data: { subject } }
    };

    req.api(`/enforcement/${req.enforcementCase.id}/subject/${req.subjectId}`, params)
      .then(response => {
        if (req.subject.new) {
          setNewSubject(req.session, req.enforcementCase.id, undefined);
        }
        const updatedSubject = { ...response.json.data, editing: true }; // set editing flag so it can be toggled off
        return res.json(updatedSubject);
      })
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    res.locals.static.enforcementCase = req.enforcementCase;
    res.locals.static.sessionSubject = getNewSubject(req.session, req.enforcementCase.id);
    next();
  });

  return app;
};

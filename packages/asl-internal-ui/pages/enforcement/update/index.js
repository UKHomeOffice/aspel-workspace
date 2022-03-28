const { get, set } = require('lodash');
const bodyParser = require('body-parser');
const { page } = require('@asl/service/ui');
const { NotFoundError } = require('@asl/service/errors');
const flagsToSubjects = require('../helpers/flags-to-subjects');
const cleanSubject = require('../helpers/clean-subject');
const getSchema = require('./schema');

const getSubject = (session, caseId, subjectId) => {
  return get(session, `enforcementCases[${caseId}][${subjectId}]`);
};

const setSubject = (session, caseId, subject) => {
  set(session, `enforcementCases[${caseId}][${subject.id}]`, subject);
};

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.param('subjectId', (req, res, next, subjectId) => {
    req.subjectId = subjectId;
    next();
  });

  app.use((req, res, next) => {
    req.enforcementCase.subjects = flagsToSubjects(req.enforcementCase.flags);
    next();
  });

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

  app.get('/profiles', (req, res, next) => {
    const subject = getSubject(req.session, req.enforcementCase.id, 'new-subject');

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

  const jsonParser = bodyParser.json();

  const updateSubject = (req, res, next) => {
    const subject = cleanSubject(req.body.subject);
    setSubject(req.session, req.enforcementCase.id, subject);
    next();
  };

  const respondWithSubject = (req, res, next) => {
    res.json(getSubject(req.session, req.enforcementCase.id, req.subjectId));
  };

  const getSubjectEstablishment = (req, res, next) => {
    const subject = getSubject(req.session, req.enforcementCase.id, req.subjectId);

    if (subject.establishmentId && !subject.establishment) {
      return req.api(`/establishment/${subject.establishmentId}`)
        .then(response => {
          subject.establishment = response.json.data;
          setSubject(req.session, req.enforcementCase.id, subject);
        })
        .then(() => next())
        .catch(next);
    }

    next();
  };

  const getSubjectProfile = (req, res, next) => {
    const subject = getSubject(req.session, req.enforcementCase.id, req.subjectId);

    if (subject.establishmentId && subject.profileId && !subject.profile) {
      return req.api(`/establishment/${subject.establishmentId}/profiles/${subject.profileId}`)
        .then(response => {
          subject.profile = response.json.data;
          setSubject(req.session, req.enforcementCase.id, subject);
        })
        .then(() => next())
        .catch(next);
    }

    next();
  };

  app.put('/subject/new-subject',
    jsonParser,
    updateSubject,
    getSubjectEstablishment,
    getSubjectProfile,
    respondWithSubject
  );

  app.put('/subject/:subjectId/flags', jsonParser, (req, res, next) => {
    console.log(req.body);

    // create list of flags with correct status

    res.json({ whoop: 'dedoo' });
  });

  app.use((req, res, next) => {
    const subject = getSubject(req.session, req.enforcementCase.id, 'new-subject');

    // if the new-subject is ready for flagging, push it to the subjects array
    if (subject && subject.establishment && subject.profile) {
      req.enforcementCase.subjects.push({ ...subject, editing: true });
    }

    next();
  });

  app.get('/subject/:subjectId/schema', (req, res, next) => {
    const subject = req.enforcementCase.subjects.find(s => s.id === req.subjectId);

    if (!subject) {
      throw new NotFoundError('subject id not found');
    }

    res.json(getSchema(subject));
  });

  app.get('/', (req, res, next) => {
    res.locals.static.enforcementCase = req.enforcementCase;
    res.locals.static.sessionSubject = getSubject(req.session, req.enforcementCase.id, 'new-subject');
    next();
  });

  return app;
};

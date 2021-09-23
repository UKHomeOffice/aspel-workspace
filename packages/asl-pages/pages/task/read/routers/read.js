const { Router } = require('express');
const { merge, set, get, concat } = require('lodash');

const UnauthorisedError = require('@asl/service/errors/unauthorised');
const { populateNamedPeople } = require('../../../common/middleware');
const form = require('../../../common/routers/form');
const getSchema = require('../../schema/view');
const getAssignSchema = require('../../schema/assign');
const { cleanModel } = require('../../../../lib/utils');
const getContent = require('../content');
const { getEstablishment } = require('../../../common/helpers');
const updateData = require('../middleware/update-data');

const endorsingOwnPil = (task, profile) => {
  const isNtco = !!profile.roles.find(r => r.type === 'ntco' && r.establishmentId === task.data.establishmentId);
  return isNtco && task.data.model === 'pil' && task.status === 'awaiting-endorsement' && profile.id === get(task, 'data.subject.id');
};

module.exports = () => {
  const app = Router({ mergeParams: true });

  // get relevant versionId if task is for a project.
  app.use((req, res, next) => {
    const model = get(req.task, 'data.model');
    const action = get(req.task, 'data.action');

    if (model === 'project') {
      let url;
      let versionId = get(req.task, 'data.data.version');
      const project = get(req.task, 'data.modelData');

      req.projectId = get(req.task, 'data.id');
      req.establishmentId = project.establishmentId;

      url = `/establishment/${req.establishmentId}/project/${req.projectId}`;

      if (action === 'transfer') {
        // transfers need to fetch only the specific version because the top-level project
        // may not be visible to the receiving establishment and so may 404
        return req.api(`${url}/project-version/${versionId}`, { query: { withDeleted: true } })
          .then(({ json: { data } }) => {
            req.version = data;
            req.project = data.project;
          })
          .then(() => {
            if (req.project.transferEstablishmentId && req.project.transferProjectId) {
              const params = {
                id: req.project.transferProjectId,
                establishmentId: req.project.transferEstablishmentId,
                licenceHolderId: req.project.licenceHolderId
              };
              return req.user.can('project.read.single', params)
                .then(can => {
                  if (can) {
                    return req.api(`/establishment/${req.project.transferEstablishmentId}/project/${req.project.transferProjectId}`)
                      .then(({ json: { data } }) => {
                        res.locals.static.transferredProject = data;
                      });
                  }
                });
            }
          })
          .then(() => next())
          .catch(next);
      }

      if (action === 'grant-ra') {
        const raId = get(req.task, 'data.data.raVersion');
        return req.api(`${url}/retrospective-assessment/${raId}`, { query: { withDeleted: true } })
          .then(({ json: { data } }) => {
            req.ra = data;
            req.project = data.project;
          })
          .then(() => next())
          .catch(next);
      }

      return req.api(url, { query: { withDeleted: true } })
        .then(({ json: { data } }) => {
          req.project = data;
        })
        .then(() => {
          // if task is a change of PPL holder then load granted version
          if (action === 'update' && req.project.granted) {
            versionId = req.project.granted.id;
          }
          if (versionId) {
            return req.api(`${url}/project-version/${versionId}`, { query: { withDeleted: true } })
              .then(({ json: { data } }) => {
                req.version = data;
              });
          }
        })
        .then(() => next())
        .catch(next);
    }
    next();
  });

  app.use((req, res, next) => {
    req.model = { id: req.task.id };

    next();
  });

  app.use((req, res, next) => {
    const action = get(req.task, 'data.action');
    const model = get(req.task, 'data.model');
    if (action === 'transfer' && model === 'project') {
      return next();
    }
    if (model === 'trainingPil') {
      return next();
    }
    const establishmentId = get(req.task, 'data.model') === 'establishment'
      ? get(req.task, 'data.id')
      : get(req.task, 'data.establishmentId');
    if (establishmentId) {
      return getEstablishment(req, establishmentId)
        .then(establishment => {
          req.establishmentId = establishment.id;
          req.establishment = establishment;
        })
        .then(() => next())
        .catch(next);
    }
    next();
  });

  app.use(populateNamedPeople);

  app.use((req, res, next) => {
    const profileId = get(req.task, 'data.data.profileId');
    const establishmentId = get(req.task, 'data.data.establishmentId');

    if (profileId && establishmentId) {
      return req.api(`/establishment/${establishmentId}/profile/${profileId}`)
        .then(({ json: { data } }) => {
          req.profile = cleanModel(data);
        })
        .then(() => next())
        .catch(error => {
          return Promise.resolve()
            .then(() => req.user.can('profile.read.all', { establishment: establishmentId }))
            .then(canReadAllProfiles => {
              if (!canReadAllProfiles) {
                const content = getContent(req.task);
                next(new UnauthorisedError(content.errors.permissions));
              } else {
                next(error);
              }
            });
        });
    }
    next();
  });

  // if deleting model get vals, if updating model, get current values for diff,
  // if updating conditions get vals for context
  app.use((req, res, next) => {
    const action = req.task.data.action;
    const model = req.task.data.model;
    if (action === 'update' || action === 'delete' || action === 'update-conditions' || model === 'rop') {
      // if task is closed, get previous values from task
      if (!req.task.isOpen && model !== 'rop') {
        res.locals.static.values = get(req.task, 'activityLog[0].event.data.modelData');

        if (model === 'establishment') {
          if (!res.locals.static.values.authorisations) {
            res.locals.static.values.authorisations = [];
          }
        }

        if (model === 'role' && action === 'delete') {
          // if the task doesn't have the remainingRoles data, flag it so we can hide the list
          res.locals.static.remainingRoles = get(req.task, 'data.meta.remainingRoles', 'BC_NO_DATA');
        }

        return next();
      }

      if (model === 'profile' && req.user.profile.id === req.task.data.id) {
        res.locals.static.values = req.user.profile;
        return next();
      }

      if (model === 'role' && action === 'delete') {
        const removedRoleId = get(req.task, 'data.id');
        const roleType = get(req.task, 'data.modelData.type');
        const remainingRoles = req.establishment.roles
          .filter(role => role.type === roleType && role.id !== removedRoleId)
          .sort((a, b) => a.profile.lastName <= b.profile.lastName ? -1 : 1);
        res.locals.static.remainingRoles = remainingRoles;
      }

      const getUrl = () => {
        const modelId = get(req.task.data, 'id');
        const estId = get(req.task.data, 'data.establishmentId');
        const profileId = get(req.task.data, 'data.profileId');
        const projectId = get(req.task.data, 'data.projectId');
        switch (model) {
          case 'establishment':
            return `/establishment/${modelId}`;
          case 'profile':
            return `/profile/${modelId}`;
          case 'pil':
            return `/establishment/${estId}/profile/${profileId}/pil/${modelId}`;
          case 'rop':
            return `/establishment/${estId}/project/${projectId}/rop/${modelId}`;
          default:
            return `/establishment/${estId}/${model}/${modelId}`;
        }
      };

      return req.api(getUrl(), { query: { withDeleted: true } })
        .then(({ json: { data } }) => {
          res.locals.static.values = data;
        })
        .then(() => next())
        .catch(next);
    }

    next();
  });

  app.use((req, res, next) => {
    if (req.task.data.model === 'place') {
      const roleIds = req.task.data.data.roles || [];
      const nacwoProfileId = get(req.task, 'data.data.nacwo'); // handle legacy tasks before multiple nacwos

      if (nacwoProfileId) {
        const nacwoRole = req.establishment.nacwo.find(r => r.profile.id === nacwoProfileId);
        if (nacwoRole) {
          roleIds.push(nacwoRole.id);
        }
      }

      const allNacwos = req.establishment.nacwo;
      const allNvsSqps = concat(req.establishment.nvs, req.establishment.sqp);

      set(req.task, 'data.data.nacwos', allNacwos.filter(r => roleIds.includes(r.id)));
      set(req.task, 'data.data.nvssqps', allNvsSqps.filter(r => roleIds.includes(r.id)));

      if (req.task.data.action !== 'create') {
        res.locals.static.values.nacwos = (res.locals.static.values.roles || []).filter(r => r.type === 'nacwo');
        res.locals.static.values.nvssqps = (res.locals.static.values.roles || []).filter(r => ['nvs', 'sqp'].includes(r.type));
      }
    }
    next();
  });

  app.use((req, res, next) => {
    if (!req.user.profile.asruUser) {
      return next();
    }
    req.api('/asru/profiles')
      .then(({ json: { data } }) => {
        const profiles = data.filter(profile => profile.id !== req.user.profile.id);
        res.locals.static.assignmentSchema = getAssignSchema(profiles);
      })
      .then(() => next())
      .catch(next);
  });

  app.use(form(Object.assign({
    configure: (req, res, next) => {
      res.locals.static.content = merge({}, res.locals.static.content, getContent(req.task));
      req.schema = getSchema(req.task);
      req.form.schema = req.schema;

      if (req.task.data.model === 'place') {
        req.form.schema = {
          ...req.form.schema,
          restrictions: {}
        };
      }

      next();
    },
    locals: (req, res, next) => {
      res.locals.static.schema = req.schema;
      res.locals.static.task = req.task;
      res.locals.static.profile = req.profile;
      res.locals.static.user = req.user.profile;
      res.locals.static.isAsru = req.user.profile.asruUser;
      res.locals.static.isInspector = req.user.profile.asruUser && req.user.profile.asruInspector;
      res.locals.static.endorsingOwnPil = endorsingOwnPil(req.task, req.user.profile);
      res.locals.static.establishment = req.establishment;
      res.locals.static.project = req.project;
      res.locals.static.version = req.version;
      res.locals.static.ra = req.ra;
      next();
    },
    process: (req, res, next) => {
      if (req.task.data.model === 'place' && req.body.restrictions === null) {
        set(req.session, `form[${req.model.id}].values.restrictions`, null);
      }
      next();
    }
  })));

  app.post('/reopen', (req, res, next) => {
    const params = {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      json: {
        status: 'recovered'
      }
    };
    req.api(`/tasks/${req.taskId}/status`, params)
      .then(() => res.redirect(req.buildRoute('task.read')))
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    const status = get(req.form, 'values.status');
    if (status === 'updated') {
      return updateData(req, res, next);
    }
    next();
  });

  app.post('/', (req, res, next) => {
    const daysSinceDeadline = get(req.task, 'data.deadline.daysSince');
    const hasDeadlinePassedReason = get(req.task, 'data.meta.deadline-passed-reason');
    const model = get(req.task, 'data.model');
    const action = get(req.task, 'data.action');
    const status = get(req.form, 'values.status');
    const isAsruUser = req.user.profile.asruUser;

    if (model === 'project' && isAsruUser && daysSinceDeadline > 0 && !hasDeadlinePassedReason) {
      return res.redirect(req.buildRoute('task.read.deadlinePassed'));
    }

    if (model === 'project' && action === 'grant-ra' && status === 'endorsed') {
      return res.redirect(req.buildRoute('task.read.raAwerb'));
    }

    if (model === 'project' && ['grant', 'transfer'].includes(action) && status === 'endorsed') {
      return res.redirect(req.buildRoute('task.read.endorse'));
    }

    return res.redirect(req.buildRoute('task.read', { suffix: 'confirm' }));
  });

  return app;
};

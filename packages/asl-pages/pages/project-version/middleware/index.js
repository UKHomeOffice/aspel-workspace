const { chain, get, remove, isEqual, uniq } = require('lodash');
const isUUID = require('uuid-validate');

const getVersion = () => (req, res, next) => {
  req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.versionId}`)
    .then(({ json: { data } }) => {
      req.version = data;
    })
    .then(() => next())
    .catch(next);
};

const extractComments = task => {
  const statusChanges = task.activityLog.filter(e => e.eventName.match(/^status:/));
  return chain(task.activityLog)
    .filter(e => e.eventName === 'comment')
    .map(activity => {
      const { id, deleted, comment, createdAt, isNew, changedBy: { firstName, lastName } } = activity;
      return {
        id,
        field: activity.event.meta.payload.meta.field,
        comment,
        deleted,
        // we want to show the date of the following status change, not the comment submission.
        createdAt: ([...statusChanges].reverse().find(s => s.createdAt > createdAt) || {}).createdAt,
        author: `${firstName} ${lastName}`,
        isNew
      };
    })
    .groupBy(comment => comment.field)
    .mapValues(comments => {
      return comments.reverse();
    })
    .value();
};

const getComments = () => (req, res, next) => {
  if (!req.project.openTasks.length) {
    return next();
  }
  req.api(`/tasks/${req.project.openTasks[0].id}`)
    .then(response => extractComments(response.json.data, req.user))
    .then(comments => {
      res.locals.static.comments = comments;
    })
    .then(() => next())
    .catch(next);
};

const hasEditPermission = (req) => {
  if (req.user.profile.asruUser) {
    return Promise.resolve();
  }
  const params = {
    id: req.projectId,
    licenceHolderId: req.project.licenceHolderId,
    establishment: req.establishment.id
  };

  return req.user.can('project.update', params);
};

const userCanComment = req => {
  const asruUser = req.user.profile.asruUser;
  const task = get(req.project, 'openTasks[0]');
  if (!task) {
    return Promise.resolve(false);
  }
  return Promise.resolve()
    .then(() => {
      return asruUser ? task.withASRU : (!task.withASRU && hasEditPermission(req));
    });
};

const canComment = () => (req, res, next) => {
  userCanComment(req)
    .then(isCommentable => {
      res.locals.static.isCommentable = isCommentable;
    })
    .then(() => next())
    .catch(next);
};

const traverse = (node, key, keys = []) => {
  if (key) { keys.push(key); }
  if (node instanceof Array) {
    node.forEach(o => {
      traverse(o, `${key}${o.id ? `.${o.id}` : ''}`, keys);
    });
  } else if (node instanceof Object) {
    Object.keys(node).forEach(k => {
      traverse(node[k], `${key ? `${key}.` : ''}${k}`, keys);
    });
  }
  return keys;
};

const getNode = (tree, path) => {
  let keys = path.split('.');
  let node = tree[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    let parent = node;
    if (!parent) {
      return;
    }
    if (isUUID(keys[i])) {
      if (parent instanceof Array) {
        node = parent.find(o => o.id === keys[i]);
      }
    } else {
      node = parent[keys[i]];
    }
  }
  return node;
};

const getPreviousVersion = req => {
  const previous = req.project.versions
    // only get versions created after last granted, if granted
    .filter(version => {
      const granted = req.project.versions.find(v => v.status === 'granted');
      if (granted) {
        return version.createdAt >= granted.createdAt;
      }
      return true;
    })
    // previous version could be granted or submitted
    .filter(version => version.status === 'submitted' || version.status === 'granted')
    .find(version => version.createdAt < req.version.createdAt);

  if (!previous) {
    return Promise.resolve();
  }

  return req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${previous.id}`)
    .then(({ json: { data } }) => data);
};

const getGrantedVersion = req => {
  if (!req.project.granted) {
    return Promise.resolve();
  }
  return req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.project.granted.id}`)
    .then(({ json: { data } }) => data);
};

const getChanges = (current, version) => {
  if (!current || !version) {
    return [];
  }

  const cvKeys = traverse(current.data);
  const pvKeys = traverse(version.data);
  const added = remove(cvKeys, k => !pvKeys.includes(k));
  const removed = remove(pvKeys, k => !cvKeys.includes(k));
  let changed = [];
  cvKeys.forEach(k => {
    let cvNode = getNode(current.data, k);
    let pvNode = getNode(version.data, k);
    if (!isEqual(cvNode, pvNode)) {
      changed.push(k);
    }
  });
  return added.concat(removed).concat(changed);
};

const getAllChanges = () => (req, res, next) => {
  Promise.all([
    getPreviousVersion(req),
    getGrantedVersion(req)
  ])
    .then(([previousVersion, grantedVersion]) => {
      return {
        latest: getChanges(req.version, previousVersion),
        granted: getChanges(req.version, grantedVersion)
      };
    })
    .then(changes => {
      res.locals.static.changes = changes;
    })
    .then(() => next())
    .catch(next);
};

const getChangedValues = (question, req) => {
  return Promise.all([
    getPreviousVersion(req),
    getGrantedVersion(req)
  ])
    .then(([previousVersion, grantedVersion]) => {
      const previous = previousVersion && getNode(previousVersion.data, question);
      const granted = grantedVersion && getNode(grantedVersion.data, question);
      return {
        grantedId: grantedVersion.id,
        previousId: previousVersion.id,
        previous,
        granted
      };
    });
};

const getProjectEstablishment = () => (req, res, next) => {
  req.api(`/establishment/${req.project.establishmentId}`)
    .then(({ json: { data } }) => {
      req.project.establishment = data;
      req.project.establishment.licenceHolder = (data.roles.find(r => r.type === 'pelh' || r.type === 'nprc') || {}).profile;
    })
    .then(() => next())
    .catch(next);
};

const getPreviousProtocols = () => (req, res, next) => {
  Promise.all([
    getPreviousVersion(req),
    getGrantedVersion(req)
  ])
    .then(([previous, granted]) => {
      previous = get(previous, 'data.protocols', []).filter(p => !p.deleted).map(p => p.id);
      granted = get(granted, 'data.protocols', []).map(p => p.id);

      const showDeleted = uniq([ ...previous, ...granted ]);

      res.locals.static.previousProtocols = { previous, granted, showDeleted };
    })
    .then(() => next())
    .catch(next);
};

module.exports = {
  getVersion,
  getComments,
  canComment,
  getPreviousVersion,
  getGrantedVersion,
  getAllChanges,
  getChangedValues,
  getProjectEstablishment,
  getPreviousProtocols,
  extractComments
};

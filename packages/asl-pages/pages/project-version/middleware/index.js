const {
  get,
  isEqual,
  uniq,
  mapValues,
  sortBy,
  pickBy,
  isEmpty,
  castArray,
  flow,
  omit,
  dropWhile,
  reverse
} = require('lodash');
const isUUID = require('uuid-validate');
const extractComments = require('../lib/extract-comments');
const { mapSpecies, mapPermissiblePurpose, mapAnimalQuantities } = require('@asl/projects/client/helpers');
const diff = require('./diff');
const { deepRemoveEmpty } = require('../helpers/project');

// eslint-disable-next-line no-control-regex
const invisibleWhitespace = /[\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]/g;

const normaliseWhitespace = str => str.replace(invisibleWhitespace, '');

const getVersion = () => (req, res, next) => {
  req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.versionId}`)
    .then(({ json: { data, meta } }) => {
      req.project = {
        ...data.project,
        openTasks: meta.openTasks,
        ...req.project
      };
      req.project.versions = req.project.versions.filter(canViewVersion(req));
      req.project.retrospectiveAssessments = req.project.retrospectiveAssessments.filter(canViewVersion(req));
      req.version = data;
    })
    .then(() => next())
    .catch(next);
};

const getComments = (actions = ['grant', 'transfer']) => (req, res, next) => {
  if (!req.project || !req.project.openTasks || !req.project.openTasks.length) {
    return next();
  }
  if (req.project.establishmentId !== req.establishmentId) {
    // the application task for AA projects won't be visible so don't try to load it
    return next();
  }
  const task = get(req.project, 'openTasks', []).find(task => castArray(actions).includes(get(task, 'data.action')));
  if (!task) {
    return next();
  }
  req.api(`/tasks/${task.id}`)
    .then(response => extractComments(response.json.data))
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
    establishment: req.establishmentId
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

const traverse = (node, key = undefined, keys = []) => {
  if (key) {
    if (key.match(/^reduction-quantities-/)) {
      keys.push('reduction-quantities');
    }
    keys.push(key);
  }
  if (node instanceof Array) {
    node.forEach(o => {
      traverse(o, `${key}${o && o.id ? `.${o.id}` : ''}`, keys);
    });
  } else if (node instanceof Object) {
    Object.keys(node).forEach(k => {
      // don't traverse into text editor objects
      if (get(node[k], 'document.object') === 'document') {
        keys.push(`${key ? `${key}.` : ''}${k}`);
        return;
      }
      traverse(node[k], `${key ? `${key}.` : ''}${k}`, keys);
    });
  }
  return new Set(keys);
};

const getNode = (tree, path) => {
  if (path === 'species') {
    return mapSpecies(tree);
  }
  if (path === 'permissible-purpose') {
    return mapPermissiblePurpose(tree);
  }
  if (path === 'reduction-quantities') {
    return mapAnimalQuantities(tree, 'reduction-quantities');
  }
  if (path.match(/establishments\.(.*)\.establishment-id/)) {
    const id = path.split('.')[1];
    const establishment = (tree.establishments || []).find(e => e.id === id);
    return establishment && (establishment.name || establishment['establishment-name']);
  }
  let keys = path.split('.');
  let node = tree[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    let parent = node;
    if (!parent) {
      return;
    }
    if (parent instanceof Array && isUUID(keys[i])) {
      node = parent.find(o => o.id === keys[i]);
    } else {
      node = parent[keys[i]];
    }
  }
  return node;
};

const canViewVersion = req => version => {
  return (req.user.profile.asruUser === version.asruVersion) || version.status !== 'draft' || version.id === req.versionId;
};

const getVersionsForDiff = (req, type = 'project-versions') => {
  if (!req.project) {
    return {};
  }

  const key = type === 'project-versions' ? 'versions' : 'retrospectiveAssessments';
  const versions = reverse(sortBy(req.project[key], 'createdAt'));
  const versionId = type === 'project-versions' ? req.versionId : req.raId;

  const previousVersions = dropWhile(versions, version => version.id !== versionId).slice(1);

  const previous = previousVersions.shift();

  if (previous?.status === 'granted') {
    return { previous };
  }

  const granted = previousVersions.find(version => version.status === 'granted');
  const first = granted ? undefined : previousVersions.pop();

  return { previous, first, granted };
};

const getFirstVersion = (req, type = 'project-versions') => {
  const { first } = getVersionsForDiff(req, type);

  if (!first) {
    return Promise.resolve();
  }

  return getCacheableVersion(req, `/establishments/${req.establishmentId}/projects/${req.projectId}/${type}/${first.id}`)
    // swallow error as this will return 403 for receiving establishment viewing a project transfer version
    // eslint-disable-next-line handle-callback-err
    .catch(() => {});
};

const getPreviousVersion = (req, type = 'project-versions') => {
  const { previous } = getVersionsForDiff(req, type);

  if (!previous) {
    return Promise.resolve();
  }

  return getCacheableVersion(req, `/establishments/${req.establishmentId}/projects/${req.projectId}/${type}/${previous.id}`)
    // swallow error as this will return 403 for receiving establishment viewing a project transfer version
    // eslint-disable-next-line handle-callback-err
    .catch(() => {});
};

const getGrantedVersion = (req, type = 'project-versions') => {
  const { granted } = getVersionsForDiff(req, type);

  if (!granted) {
    return Promise.resolve();
  }

  return getCacheableVersion(req, `/establishments/${req.establishmentId}/projects/${req.projectId}/${type}/${granted.id}`)
    // swallow error as this will return 403 for receiving establishment viewing a project transfer version
    // eslint-disable-next-line handle-callback-err
    .catch(() => {});
};

const getCacheableVersion = (req, url) => {
  return req.api(url, { maxAge: 300 })
    .then(({ json: { data } }) => data)
    .then(data => {
      return data;
    });
};

function normaliseSteps(protocol) {
  if (!protocol.steps) {
    return [];
  }

  // legacy protocols have a rich text field for steps
  if (typeof protocol === 'object' && !Array.isArray(protocol.steps)) {
    return protocol.steps;
  }

  return (Array.isArray(protocol.steps) ? protocol.steps : []).flatMap(
    step => {
      // If step is not reusable, then it dont need reusableStepId, this is causing issues down the line
      if (step?.reusableStepId && step?.hasOwnProperty('reusable') && step?.reusable === false) {
        delete step.reusableStepId;
      }
      return step?.deleted ? [] : [omit(step, 'deleted')];
    }
  );
}

/**
 * Protocols and steps within them are soft deleted using a deleted flag. This
 * applies the meaning of that flag (deleting protocols/steps) where
 * `deleted: true`, and hiding the deleted flag when false so that adding the
 * flag, then setting it to false doesn't count as a change.
 *
 * @param versionData
 * @returns {*&{protocols: (*&{steps})[]}}
 */
const normaliseDeletedProtocols = (versionData) => ({
  ...versionData,
  protocols: (Array.isArray(versionData.protocols) ? versionData.protocols : []).flatMap(
    protocol => {
      // This was causing change badge to appear even though there are no other changes apart from marking it complete.
      protocol.complete = true;
      return protocol?.deleted
        ? []
        : [{
          ...omit(protocol, 'deleted'),
          steps: normaliseSteps(protocol)
        }];
    })
});

const normaliseData = (versionData, opts) => {
  return flow([
    normaliseConditions(opts),
    normaliseDeletedProtocols,
    deepRemoveEmpty
  ])(versionData);
};

const normaliseConditions = ({ isSubmitted }) => (versionData) => {
  return mapValues(versionData, (val, key) => {
    if (key === 'protocols') {
      return val.filter(Boolean).map(protocol => {
        return {
          ...protocol,
          conditions: isSubmitted && sortBy(protocol.conditions, 'key')
        };
      });
    }
    if (key === 'conditions') {
      return isSubmitted && sortBy(val, 'key');
    }
    return val;
  });
};

/**
 * @param {Set<*>} keys
 * @param prevTree
 * @param currTree
 *
 * In the case where a conditional field is changed, then the condition that
 * caused the change is reverted, the now obsolete changes still trigger a
 * change badge. If this gets unmanageable to configure manually - calculate it
 * from the schema.
 */
const removeHiddenChangeKeys = (keys, prevTree, currTree) => {
  if (!getNode(prevTree, 'other-establishments') && !getNode(currTree, 'other-establishments')) {
    keys.delete('establishments');
    [...keys]
      .filter(key => key.match(/^establishments\.[0-9a-f-]{36}(\.(id|name|establishment-id))?$/))
      .forEach(key => {
        keys.delete(key);
      });
  }
};

const getChanges = (current, version) => {
  if (!current || !version) {
    return [];
  }
  const normalisationOptions = { isSubmitted: current.status !== 'draft' };
  const before = normaliseData(version.data, normalisationOptions);
  const after = normaliseData(current.data, normalisationOptions);

  const cvKeys = traverse(after);
  const pvKeys = traverse(before);

  removeHiddenChangeKeys(cvKeys, before, after);
  removeHiddenChangeKeys(pvKeys, before, after);

  const added = cvKeys.difference(pvKeys);
  const removed = pvKeys.difference(cvKeys);
  const changed = cvKeys.values().flatMap(
    key => {
      const pvNode = getNode(before, key);
      const cvNode = getNode(after, key);
      return hasChanged(pvNode, cvNode, key) ? [key] : [];
    }
  );

  return [...added, ...removed, ...changed];
};

const ignoreEmptyArrayProps = obj => {
  return pickBy(obj, (value) => !Array.isArray(value) || !isEmpty(value));
};

const hasChanged = (before, after, key) => {
  // backwards compatibility check for transition from string to object values for RTEs
  if (typeof before === 'string' && typeof after !== 'string') {
    try {
      return hasChanged(JSON.parse(before), after, key);
    } catch (e) {}
  }

  // ignore empty arrays added by cleanProtocols()
  if (key === 'protocols') { // protocols array
    return before.some((protocol, idx) => {
      return !isEqual(ignoreEmptyArrayProps(before[idx]), ignoreEmptyArrayProps(after[idx]));
    });
  } else if (/^protocols\.[a-f0-9-]+$/.test(key)) { // individual protocol
    return !isEqual(ignoreEmptyArrayProps(before), ignoreEmptyArrayProps(after));
  }
  const valueChanged = !isEqual(before, after);

  // check for whitespace normalisation in RTE values
  if (valueChanged && typeof before === 'object' && typeof after === 'object') {
    return normaliseWhitespace(JSON.stringify(before)) !== normaliseWhitespace(JSON.stringify(after));
  }

  return valueChanged;
};

const getVersionChanges = (current, firstVersion, previousVersion, grantedVersion) => {
  return {
    first: getChanges(current, firstVersion),
    latest: getChanges(current, previousVersion),
    granted: getChanges(current, grantedVersion)
  };
};

const getPreviousProtocols = (firstVersion, previousVersion, grantedVersion) => {
  const first = get(firstVersion, 'data.protocols', []).filter(Boolean).filter(p => !p.deleted).map(p => p.id);
  const previous = get(previousVersion, 'data.protocols', []).filter(Boolean).filter(p => !p.deleted).map(p => p.id);
  const granted = get(grantedVersion, 'data.protocols', []).filter(Boolean).map(p => p.id);
  const showDeleted = uniq([...previous, ...granted]);

  // Adding code to get steps historical data
  function extractActiveSteps(version) {
    return get(version, 'data.protocols', [])
      .filter(Boolean)
      .filter(p => !p.deleted)
      .map(p => p.steps)
      .map((element) => element && Array.isArray(element) ? element.filter(s => !s?.deleted) : element);
  }

  const steps = extractActiveSteps(previousVersion);
  const firstSteps = extractActiveSteps(firstVersion);
  const grantedSteps = extractActiveSteps(grantedVersion);
  return { first, previous, granted, showDeleted, steps, firstSteps, grantedSteps };
};

const getPreviousAA = (firstVersion, previousVersion, grantedVersion) => {
  const first = get(firstVersion, 'data.establishments', []).filter(Boolean).filter(p => !p.deleted).map(p => p.id);
  const previous = get(previousVersion, 'data.establishments', []).filter(Boolean).filter(p => !p.deleted).map(p => p.id);
  const granted = get(grantedVersion, 'data.establishments', []).filter(Boolean).map(p => p.id);
  const showDeleted = uniq([...previous, ...granted]);
  return { first, previous, granted, showDeleted };
};

const getPreviousTraining = (firstVersion, previousVersion, grantedVersion) => {
  const first = get(firstVersion, 'data.training', []);
  const previous = get(previousVersion, 'data.training', []);
  const granted = get(grantedVersion, 'data.training', []);
  return { first, previous, granted };
};

const getAllChanges = (type = 'project-versions') => (req, res, next) => {
  const model = type === 'project-versions' ? 'version' : 'retrospectiveAssessment';
  Promise.all([
    getFirstVersion(req, type),
    getPreviousVersion(req, type),
    getGrantedVersion(req, type)
  ])
    .then(([firstVersion, previousVersion, grantedVersion]) => {
      res.locals.static.changes = getVersionChanges(req[model], firstVersion, previousVersion, grantedVersion);
      res.locals.static.previousProtocols = getPreviousProtocols(firstVersion, previousVersion, grantedVersion);
      res.locals.static.previousAA = getPreviousAA(firstVersion, previousVersion, grantedVersion);
      res.locals.static.previousTraining = getPreviousTraining(firstVersion, previousVersion, grantedVersion);
    })
    .then(() => next())
    .catch(next);
};

const getChangedValues = (question, req, type = 'project-versions') => {

  const model = type === 'project-versions' ? 'version' : 'retrospectiveAssessment';

  const getVersion = {
    latest: getPreviousVersion,
    granted: getGrantedVersion,
    first: getFirstVersion
  };

  return Promise.resolve()
    .then(() => getVersion[req.query.version](req, type))
    .then(async (result) => {
      const value = result && getNode(result.data, question);
      const current = getNode(req[model].data, question);
      return {
        value,
        diff: await diff(value, current, { type: req.query.type })
      };
    });
};

const getProjectEstablishment = () => (req, res, next) => {
  if (!req.project) {
    return next();
  }
  Promise.resolve()
    .then(() => {
      if (!req.project.establishment) {
        return req.api(`/establishment/${req.project.establishmentId}`)
          .then(({ json: { data } }) => {
            req.project.establishment = data;
          });
      }
    })
    .then(() => {
      return req.api(`/establishment/${req.project.establishmentId}/named-people`)
        .then(({ json: { data } }) => {
          req.project.establishment.licenceHolder = (data.find(r => r.type === 'pelh' || r.type === 'nprc') || {}).profile;
        });
    })
    .then(() => next())
    .catch(() => {
      // if project cannot be loaded then set licence holder details to a placeholder
      req.project.establishment.licenceHolder = {
        firstName: 'Unknown',
        lastName: 'User'
      };
      next();
    });
};

const loadRa = (req, res, next) => {
  const raCompulsory = get(req, 'version.raCompulsory');
  const retrospectiveAssessment = get(req, 'version.retrospectiveAssessment');
  const requiresRa = !!raCompulsory || !!retrospectiveAssessment || !!req.project.raDate;

  if (!requiresRa) {
    return next();
  }

  const raUrl = `/establishments/${req.establishmentId}/projects/${req.projectId}/retrospective-assessment`;
  const raReasons = req.api(`${raUrl}/reasons`);
  // grantedRa / draftRa is re-fetched if present because req.project.xxxRa doesn't include ra.data by default
  const grantedRa = req.project.grantedRa ? req.api(`${raUrl}/${req.project.grantedRa.id}`) : Promise.resolve();
  const draftRa = req.project.draftRa ? req.api(`${raUrl}/${req.project.draftRa.id}`) : Promise.resolve();

  return Promise.all([raReasons, grantedRa, draftRa])
    .then(([reasonsResponse, grantedRaResponse, draftRaResponse]) => {
      req.project.raReasons = get(reasonsResponse, 'json.data');
      req.project.grantedRa = grantedRaResponse ? get(grantedRaResponse, 'json.data') : null;
      req.project.draftRa = draftRaResponse ? get(draftRaResponse, 'json.data') : null;
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
  getVersionsForDiff,
  getChangedValues,
  getProjectEstablishment,
  loadRa
};

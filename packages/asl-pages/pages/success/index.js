const isUUID = require('uuid-validate');
const { merge, get, upperFirst } = require('lodash');
const { Router } = require('express');
const { NotFoundError } = require('@asl/service/errors');
const successMessages = require('./content');

const getTaskLabel = task => {
  const taskType = get(task, 'type');
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');

  switch (model) {
    case 'role':
      if (action === 'create') {
        return 'Add named person';
      }
      if (action === 'replace') {
        return 'Replace named person';
      }
      if (action === 'delete') {
        return 'Remove named person';
      }
      return `Establishment ${taskType}`;

    case 'place':
      if (action === 'create') {
        return 'New approved area';
      }
      if (action === 'delete') {
        return 'Area removal';
      }
      return `Area ${taskType}`;

    case 'rop':
      return 'Return of procedures';

    case 'pil':
    case 'trainingPil':
      return `Personal licence ${taskType}`;

    case 'project':
      if (action === 'grant-ra') {
        return 'Retrospective assessment';
      } else if (action === 'transfer') {
        return 'Project licence transfer';
      } else if (action === 'update') {
        return 'Project licence amendment';
      }
      return `${upperFirst(model)} ${taskType}`;

    default:
      return `${upperFirst(model)} ${taskType}`;
  }
};

const getSuccessType = task => {
  const model = get(task, 'data.model');
  const action = get(task, 'data.action');
  const latestActivity = get(task, 'activityLog[0]');

  if (task.status === 'resolved' && model === 'pil' && action === 'review') {
    return 'review-complete';
  }

  if (task.status === 'resolved' && action === 'suspend') {
    return 'suspended';
  }

  if (task.status === 'resolved' && action === 'reinstate') {
    return 'reinstated';
  }

  if (model === 'rop') {
    return 'rop-submitted';
  }

  if (latestActivity && latestActivity.action === 'endorsed') {
    if (latestActivity.eventName === 'status:new:endorsed') {
      return 'submitted'; // ppl auto-endorsed by admin, show as submitted
    }
    return 'endorsed';
  }

  if (latestActivity && get(latestActivity, 'event.status') === 'intention-to-refuse') {
    return 'intention-to-refuse';
  }

  if (task.status === 'resolved' && action === 'revoke') {
    return 'revoked';
  }

  if (['awaiting-endorsement', 'with-inspectorate', 'with-licensing'].includes(task.status)) {
    return 'submitted';
  }

  if (['inspector-recommended', 'inspector-rejected'].includes(task.status)) {
    return 'inspector-recommendation';
  }

  if (['discarded-by-applicant', 'discarded-by-asru'].includes(task.status)) {
    return 'discarded';
  }
  // HBA amendment licence holder content change on success
  if (task.status === 'resolved' && task?.type === 'amendment' && task?.data?.model === 'project') {
    return 'licence-amended';
  }
  // HBA PPL transfer establishment content change on success
  if (task.status === 'resolved' && task?.type === 'transfer' && task?.data?.model === 'project') {
    return 'pil-transfer';
  }

  return task.status;
};

const getAdditionalInfo = ({ task, project }) => {
  const model = get(task, 'data.model');

  switch (model) {
    case 'pil':
      return get(task, 'data.modelData.profile.name');

    case 'role':
      const profile = get(task, 'data.profile', {});
      return `${profile.firstName} ${profile.lastName}`;

    case 'place':
      return get(task, 'data.modelData.name');

    case 'project':
      return get(project, 'title') || get(task, 'data.modelData.title');

    case 'profile':
      return get(task, 'data.modelData.name');
  }
};

module.exports = () => {
  const app = Router();

  app.use((req, res, next) => {
    const taskId = get(req.session, 'success.taskId');

    if (!taskId || !isUUID(taskId)) {
      return next(new NotFoundError());
    }

    return req.api(`/tasks/${taskId}`)
      .then(response => {
        req.taskId = taskId;
        req.task = response.json.data;
      })
      .then(() => next())
      .catch(next);
  });

  app.use((req, res, next) => {
    const successType = getSuccessType(req.task);
    const success = merge({}, successMessages.default, get(successMessages, successType));
    merge(res.locals.static.content, { success });
    res.locals.static.taskId = req.taskId;
    res.locals.static.taskLabel = getTaskLabel(req.task);
    res.locals.static.isAsruUser = req.user.profile.asruUser;
    res.locals.static.additionalInfo = getAdditionalInfo(req);
    res.locals.static.establishment = req.establishment || get(req.task, 'data.establishment');

    // Update the project ID for transfer projects to ensure correct success page links
    if (req.task?.status === 'resolved' && req.task?.type === 'transfer' && req.task?.data?.model === 'project') {
      res.locals.static.projectId = res.locals.static.transferredProject?.id;
    } else if (req.task?.data?.model === 'project') {
      res.locals.static.projectId = req.project?.id;
    }

    next();
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

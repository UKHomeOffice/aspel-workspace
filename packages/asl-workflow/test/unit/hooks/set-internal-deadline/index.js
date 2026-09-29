const assert = require('assert');
const sinon = require('sinon');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { addWorkingDaysIso, todayIso } = dayJs;
const History = require('../../../helpers/history');
const { withInspectorate, returnedToApplicant } = require('../../../../lib/flow/status');

const hook = require('../../../../lib/hooks/set-internal-deadline');

const runHook = hook({});

describe('Set internal deadline hook', () => {

  describe('Non project tasks', () => {

	it('ignores non-project tasks', () => {
	  const pilTask = {
		data: {
		  model: 'pil',
		  action: 'grant',
		  data: {},
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		patch: sinon.stub()
	  };

	  runHook(pilTask);
	  assert.ok(pilTask.patch.notCalled);
	});

  });

  describe('Project tasks', () => {

	it('ignores non-grant tasks', () => {
	  const pplUpdateTask = {
		data: {
		  model: 'project',
		  action: 'update',
		  data: {},
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		patch: sinon.stub()
	  };

	  runHook(pplUpdateTask);
	  assert.ok(pplUpdateTask.patch.notCalled);
	});

	it('adds a 40 working day internal deadline for ppl amendment first submission', () => {
	  const pplAmendmentTask = {
		data: {
		  model: 'project',
		  action: 'grant',
		  data: {},
		  modelData: {
			status: 'active'
		  },
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		activityLog: [],
		updatedAt: todayIso(),
		patch: sinon.stub()
	  };

	  const history = History(pplAmendmentTask);
	  history.status(withInspectorate.id);

	  const expected = {
		internalDeadline: {
		  standard: addWorkingDaysIso(new Date(), 40),
		  extended: addWorkingDaysIso(new Date(), 40),
		  resubmitted: false
		}
	  };

	  runHook(pplAmendmentTask);
	  assert.ok(pplAmendmentTask.patch.calledOnce);
	  assert.deepEqual(pplAmendmentTask.patch.lastCall.args[0], expected);
	});

	it('adds a 40 working day internal deadline for ppl amendment subsequent submissions', () => {
	  const pplAmendmentResub = {
		data: {
		  model: 'project',
		  action: 'grant',
		  data: {},
		  modelData: {
			status: 'active'
		  },
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		activityLog: [],
		updatedAt: todayIso(),
		patch: sinon.stub()
	  };

	  const history = History(pplAmendmentResub);
	  history.status(withInspectorate.id);
	  history.status(returnedToApplicant.id);
	  history.status(withInspectorate.id);

	  const expected = {
		internalDeadline: {
		  standard: addWorkingDaysIso(new Date(), 40),
		  extended: addWorkingDaysIso(new Date(), 40),
		  resubmitted: true
		}
	  };

	  runHook(pplAmendmentResub);
	  assert.ok(pplAmendmentResub.patch.calledOnce);
	  assert.deepEqual(pplAmendmentResub.patch.lastCall.args[0], expected);
	});

	it('adds internal deadlines that match statutory deadlines for ppl applications first submission', () => {
	  const pplAmendmentResub = {
		data: {
		  model: 'project',
		  action: 'grant',
		  data: {},
		  modelData: {
			status: 'inactive'
		  },
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		activityLog: [],
		updatedAt: todayIso(),
		patch: sinon.stub()
	  };

	  const history = History(pplAmendmentResub);
	  history.status(withInspectorate.id);

	  const expected = {
		internalDeadline: {
		  standard: addWorkingDaysIso(new Date(), 40),
		  extended: addWorkingDaysIso(new Date(), 55),
		  resubmitted: false
		}
	  };

	  runHook(pplAmendmentResub);
	  assert.ok(pplAmendmentResub.patch.calledOnce);
	  assert.deepEqual(pplAmendmentResub.patch.lastCall.args[0], expected);
	});

	it('adds internal deadline of 40 days for ppl applications subsequent submissions', () => {
	  const pplAmendmentResub = {
		data: {
		  model: 'project',
		  action: 'grant',
		  data: {},
		  modelData: {
			status: 'inactive'
		  },
		  meta: {}
		},
		meta: {
		  payload: {
			data: {},
			meta: {}
		  }
		},
		activityLog: [],
		updatedAt: todayIso(),
		patch: sinon.stub()
	  };

	  const history = History(pplAmendmentResub);
	  history.status(withInspectorate.id);
	  history.status(returnedToApplicant.id);
	  history.status(withInspectorate.id);

	  const expected = {
		internalDeadline: {
		  standard: addWorkingDaysIso(new Date(), 40),
		  extended: addWorkingDaysIso(new Date(), 40),
		  resubmitted: true
		}
	  };

	  runHook(pplAmendmentResub);
	  assert.ok(pplAmendmentResub.patch.calledOnce);
	  assert.deepEqual(pplAmendmentResub.patch.lastCall.args[0], expected);
	});

  });

});

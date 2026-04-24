'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { getAlertUrl, summariseEstablishmentAlerts } = require('../../../../pages/dashboard/helpers');

// Helper to create a simple stub buildRoute that records calls
const makeBuildRoute = () => {
  const calls = [];
  const fn = (route, params) => {
    calls.push({ route, params });
    return `/${route}`;
  };
  fn.calls = calls;
  return fn;
};

describe('dashboard helpers', () => {
  describe('getAlertUrl', () => {
    it('returns the pil.read route for pilReview alerts', () => {
      const buildRoute = makeBuildRoute();
      const alert = {
        type: 'pilReview',
        model: { establishmentId: 10, profileId: 'p-1', id: 'pil-1' }
      };

      getAlertUrl(alert, buildRoute);

      assert.strictEqual(buildRoute.calls.length, 1);
      assert.strictEqual(buildRoute.calls[0].route, 'pil.read');
      assert.deepEqual(buildRoute.calls[0].params, {
        establishmentId: 10,
        profileId: 'p-1',
        pilId: 'pil-1'
      });
    });

    it('returns the project.read route with #reporting suffix for raDue alerts', () => {
      const buildRoute = makeBuildRoute();
      const alert = {
        type: 'raDue',
        model: { establishmentId: 10, id: 'proj-1' }
      };

      getAlertUrl(alert, buildRoute);

      assert.strictEqual(buildRoute.calls.length, 1);
      assert.strictEqual(buildRoute.calls[0].route, 'project.read');
      assert.deepEqual(buildRoute.calls[0].params, {
        establishmentId: 10,
        projectId: 'proj-1',
        suffix: '#reporting'
      });
    });

    it('returns the project.read route with #reporting suffix for ropDue alerts', () => {
      const buildRoute = makeBuildRoute();
      const alert = {
        type: 'ropDue',
        model: { establishmentId: 10, id: 'proj-2' }
      };

      getAlertUrl(alert, buildRoute);

      assert.strictEqual(buildRoute.calls.length, 1);
      assert.strictEqual(buildRoute.calls[0].route, 'project.read');
      assert.deepEqual(buildRoute.calls[0].params, {
        establishmentId: 10,
        projectId: 'proj-2',
        suffix: '#reporting'
      });
    });

    it('returns undefined for an unknown alert type', () => {
      const buildRoute = makeBuildRoute();
      const alert = { type: 'unknownType', model: {} };

      const result = getAlertUrl(alert, buildRoute);

      assert.strictEqual(result, undefined);
      assert.strictEqual(buildRoute.calls.length, 0);
    });
  });

  describe('summariseEstablishmentAlerts', () => {
    it('returns an empty array when no alerts are provided', () => {
      const buildRoute = makeBuildRoute();
      const result = summariseEstablishmentAlerts([], [], buildRoute);
      assert.deepEqual(result, []);
    });

    it('returns an empty array when alerts is undefined', () => {
      const buildRoute = makeBuildRoute();
      const result = summariseEstablishmentAlerts(undefined, [], buildRoute);
      assert.deepEqual(result, []);
    });

    it('groups a single due alert for one establishment', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'pilReview', overdue: false }
      ];
      const establishments = [{ id: 1, name: 'Test Establishment' }];

      const result = summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(result[0].name, 'Test Establishment');
      assert.strictEqual(result[0].summary.pilReview.due, 1);
      assert.strictEqual(result[0].summary.pilReview.overdue, 0);
      assert.strictEqual(result[0].summary.raDue.due, 0);
      assert.strictEqual(result[0].summary.ropDue.due, 0);
    });

    it('groups a single overdue alert for one establishment', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'raDue', overdue: true }
      ];
      const establishments = [{ id: 1, name: 'Test Establishment' }];

      const result = summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      assert.strictEqual(result[0].summary.raDue.overdue, 1);
      assert.strictEqual(result[0].summary.raDue.due, 0);
    });

    it('counts multiple alerts of the same type correctly', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'pilReview', overdue: false },
        { establishmentId: 1, type: 'pilReview', overdue: false },
        { establishmentId: 1, type: 'pilReview', overdue: true }
      ];
      const establishments = [{ id: 1, name: 'Est A' }];

      const result = summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      assert.strictEqual(result[0].summary.pilReview.due, 2);
      assert.strictEqual(result[0].summary.pilReview.overdue, 1);
    });

    it('creates separate entries for alerts from different establishments', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'pilReview', overdue: false },
        { establishmentId: 2, type: 'raDue', overdue: true }
      ];
      const establishments = [
        { id: 1, name: 'Est One' },
        { id: 2, name: 'Est Two' }
      ];

      const result = summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      assert.strictEqual(result.length, 2);

      const est1 = result.find(e => e.id === 1);
      const est2 = result.find(e => e.id === 2);

      assert.ok(est1, 'should have entry for establishment 1');
      assert.ok(est2, 'should have entry for establishment 2');
      assert.strictEqual(est1.name, 'Est One');
      assert.strictEqual(est1.summary.pilReview.due, 1);
      assert.strictEqual(est2.name, 'Est Two');
      assert.strictEqual(est2.summary.raDue.overdue, 1);
    });

    it('sets establishment name to undefined when establishment is not in profile', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 99, type: 'pilReview', overdue: false }
      ];

      const result = summariseEstablishmentAlerts(alerts, [], buildRoute);

      assert.strictEqual(result[0].id, 99);
      assert.strictEqual(result[0].name, undefined);
    });

    it('uses the earliest ropsYear across multiple ropDue alerts for the URL', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'ropDue', overdue: true, ropsYear: 2023 },
        { establishmentId: 1, type: 'ropDue', overdue: true, ropsYear: 2021 },
        { establishmentId: 1, type: 'ropDue', overdue: false, ropsYear: 2022 }
      ];
      const establishments = [{ id: 1, name: 'Est A' }];

      summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      const ropOverviewCall = buildRoute.calls.find(c => c.route === 'establishment.rops.overview');
      assert.ok(ropOverviewCall, 'should have called establishment.rops.overview');
      assert.strictEqual(ropOverviewCall.params.year, 2021);
    });

    it('counts multiple alert types for the same establishment independently', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [
        { establishmentId: 1, type: 'pilReview', overdue: false },
        { establishmentId: 1, type: 'raDue', overdue: true },
        { establishmentId: 1, type: 'ropDue', overdue: false, ropsYear: 2024 }
      ];
      const establishments = [{ id: 1, name: 'Est A' }];

      const result = summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      assert.strictEqual(result[0].summary.pilReview.due, 1);
      assert.strictEqual(result[0].summary.pilReview.overdue, 0);
      assert.strictEqual(result[0].summary.raDue.due, 0);
      assert.strictEqual(result[0].summary.raDue.overdue, 1);
      assert.strictEqual(result[0].summary.ropDue.due, 1);
      assert.strictEqual(result[0].summary.ropDue.overdue, 0);
    });

    it('builds the pils URL with the establishment id', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [{ establishmentId: 5, type: 'pilReview', overdue: false }];
      const establishments = [{ id: 5, name: 'Est Five' }];

      summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      const pilsCall = buildRoute.calls.find(c => c.route === 'pils');
      assert.ok(pilsCall, 'should have called pils route');
      assert.strictEqual(pilsCall.params.establishmentId, 5);
    });

    it('builds the project URL for raDue with the correct query string suffix', () => {
      const buildRoute = makeBuildRoute();
      const alerts = [{ establishmentId: 3, type: 'raDue', overdue: false }];
      const establishments = [{ id: 3, name: 'Est Three' }];

      summariseEstablishmentAlerts(alerts, establishments, buildRoute);

      const projectCall = buildRoute.calls.find(c => c.route === 'project');
      assert.ok(projectCall, 'should have called project route');
      assert.ok(projectCall.params.suffix.includes('raDate'), 'suffix should include raDate sort');
    });
  });
});

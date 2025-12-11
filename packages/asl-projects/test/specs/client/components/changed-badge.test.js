/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChangedBadge, { hasMatchingChange } from '../../../../client/components/changed-badge';
import assert from 'assert';

const makeStore = (overrides = {}) => {
  const initialState = {
    changes: {
      latest: [],
      granted: [],
      first: [],
      ...overrides.changes
    },
    application: {
      previousProtocols: {
        previous: overrides.previousAllowed?.previous ?? [],
        granted: overrides.previousAllowed?.granted ?? [],
        first: overrides.previousAllowed?.first ?? []
      }
    }
  };

  const reducer = (state = initialState, action) => state;
  return configureStore({ reducer });
};

describe('ChangedBadge', () => {

  describe.skip('ChangedBadge Component', () => {
    const protocolId = '123';

    function expandChange(change) {
      const expandedChange = [];
      change
        .split('.')
        .reduce((prefix, part) => {
          const next = [...prefix, part];
          expandedChange.push(next.join('.'));
          return next;
        }, []);
      return expandedChange;
    }

    function expandChanges(changes) {
      const expandedChanges = new Set();
      changes.flatMap(change => expandChange(change)).forEach(change => expandedChanges.add(change));
      return [...expandedChanges];
    }

    const fullChanges = expandChanges([
      'protocols.123.steps.1.title',
      'protocols.123.steps.1.usedInProtocols',
      'protocols.123.steps.1.reusedStep',
      'protocols.123.steps.1.reusableStepId',
      'protocols.123.steps.1.usedInProtocols.protocolId',
      'protocols.123.steps.1.usedInProtocols.protocolNumber'
    ]);

    it('renders "changed" when latest has a matching change', () => {
      const store = makeStore({ changes: { latest: fullChanges }, previousAllowed: { previous: [protocolId] } });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} />
        </Provider>
      );

      expect(screen.getByText('changed')).toBeTruthy();
      expect(screen.getByText('changed').classList.contains('badge')).toBe(true);
      expect(screen.getByText('changed').classList.contains('changed')).toBe(true);
    });

    it('renders "amended" when granted has a matching change', () => {
      const store = makeStore({ changes: { granted: fullChanges }, previousAllowed: { granted: [protocolId] } });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} />
        </Provider>
      );

      expect(screen.getByText('amended')).toBeTruthy();
    });

    it('renders "changed" when first has a matching change', () => {
      const store = makeStore({ changes: { first: fullChanges }, previousAllowed: { first: [protocolId] } });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} />
        </Provider>
      );

      expect(screen.getByText('changed')).toBeTruthy();
    });

    it('respects protocol gating: denies when protocolId not in allowed list', () => {
      const store = makeStore({
        changes: { latest: fullChanges },
        previousAllowed: { previous: ['999'] } // only protocol 999 allowed
      });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} />
        </Provider>
      );

      expect(screen.queryByText('changed')).toBeNull();
      expect(screen.queryByText('amended')).toBeNull();
    });

    it('respects protocol gating: allows when protocolId present', () => {
      const store = makeStore({
        changes: { latest: fullChanges },
        previousAllowed: { previous: [protocolId] }
      });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} />
        </Provider>
      );

      expect(screen.getByText('changed')).toBeTruthy();
    });

    it('renders empty label when noLabel is true', () => {
      const store = makeStore({ changes: { latest: fullChanges }, previousAllowed: { previous: [protocolId] } });

      render(
        <Provider store={store}>
          <ChangedBadge fields={['protocols.*.steps.*.title']} protocolId={protocolId} noLabel />
        </Provider>
      );

      expect(screen.queryByText('changed')).toBeNull();
      const badge = document.querySelector('.badge');
      expect(badge).toBeTruthy();
    });

    it('prefers changedFromLatest override even without matching fields', () => {
      const store = makeStore();

      render(
        <Provider store={store}>
          <ChangedBadge fields={['does.not.match']} changedFromLatest />
        </Provider>
      );

      expect(screen.getByText('changed')).toBeTruthy();
    });

    it('prefers changedFromGranted override', () => {
      const store = makeStore();

      render(
        <Provider store={store}>
          <ChangedBadge fields={['does.not.match']} changedFromGranted />
        </Provider>
      );

      expect(screen.getByText('amended')).toBeTruthy();
    });

    it('prefers changedFromFirst override', () => {
      const store = makeStore();

      render(
        <Provider store={store}>
          <ChangedBadge fields={['does.not.match']} changedFromFirst />
        </Provider>
      );

      expect(screen.getByText('changed')).toBeTruthy();
    });
  });

  describe('hasMatchingChange', () => {
    it('returns false if changes list is empty', () => {
      assert.equal(hasMatchingChange(['field1'], []), false);
      assert.equal(hasMatchingChange(['field1'], null), false);
      assert.equal(hasMatchingChange(['field1'], undefined), false);
    });

    it('returns false if fields list is empty', () => {
      assert.equal(hasMatchingChange([], ['field1']), false);
      assert.equal(hasMatchingChange(null, ['field1']), false);
      assert.equal(hasMatchingChange(undefined, ['field1']), false);
    });

    it('returns true if there is an exact match', () => {
      const fields = ['field1', 'field2'];
      const changes = ['field2', 'field3'];
      assert.equal(hasMatchingChange(fields, changes), true);
    });

    it('returns true if there is a wildcard match', () => {
      const fields = ['protocols.*.title'];
      const changes = ['protocols.123.title'];
      assert.equal(hasMatchingChange(fields, changes), true);
    });

    it('returns false if there are no matches', () => {
      const fields = ['field1', 'field2'];
      const changes = ['field3', 'field4'];
      assert.equal(hasMatchingChange(fields, changes), false);

      const fields2 = ['protocols.123.title'];
      const changes2 = ['protocols.*.description'];
      assert.equal(hasMatchingChange(fields2, changes2), false);
    });
  });
});

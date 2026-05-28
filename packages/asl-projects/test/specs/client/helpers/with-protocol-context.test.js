import assert from 'assert';
import { withProtocolContext } from '../../../../client/schema/v1/protocols/helpers/with-protocol-context';
import {
  editableValues,
  experimentalValues,
  getFieldState,
  standardDisabledProps,
  standardValues
} from '../test-utils/protocol-mode';

describe('withProtocolContext', () => {
  const field = withProtocolContext({
    name: 'severity',
    className: 'smaller',
    label: 'Default label',
    hint: 'Default hint',
    type: 'radio'
  }, {
    editable: {
      label: 'Editable label'
    },
    standard: {
      label: 'Standard label',
      hint: null,
      type: 'standard-radio'
    }
  });

  it('keeps non-overridden properties from the base field', () => {
    assert.equal(field.name, 'severity');
    assert.equal(field.className, 'smaller');
  });

  describe('protocol mode overrides', () => {
    [
      {
        mode: 'experimental',
        context: experimentalValues,
        expected: {
          label: 'Default label',
          hint: 'Default hint',
          type: 'radio'
        }
      },
      {
        mode: 'editable',
        context: editableValues,
        expected: {
          label: 'Editable label',
          hint: 'Default hint',
          type: 'radio'
        }
      },
      {
        mode: 'standard',
        context: standardValues,
        expected: {
          label: 'Standard label',
          hint: null,
          type: 'standard-radio'
        }
      }
    ].forEach(({ mode, context, expected }) => {
      it(`returns the expected values in ${mode} mode`, () => {
        assert.deepEqual(getFieldState(field, context), expected);
      });
    });
  });

  describe('when standard protocols are explicitly disabled', () => {
    it('falls back to the base value', () => {
      assert.deepEqual(getFieldState(field, standardDisabledProps), {
        label: 'Default label',
        hint: 'Default hint',
        type: 'radio'
      });
    });
  });
});


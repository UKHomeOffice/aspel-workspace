import assert from 'assert';
import { withProtocolContext } from '../../../../client/schema/v1/protocols/helpers/with-protocol-context';

describe('withProtocolContext', () => {
  it('keeps non-overridden properties from the base field', () => {
    const field = withProtocolContext({
      name: 'severity',
      className: 'smaller',
      label: 'Base label'
    }, {
      standard: {
        label: 'Standard label'
      }
    });

    assert.equal(field.name, 'severity');
    assert.equal(field.className, 'smaller');
    assert.equal(field.label({}), 'Base label');
  });

  const field = withProtocolContext({
    label: 'Default label',
    type: 'radio'
  }, {
    editable: {
      label: 'Editable label'
    },
    standard: {
      label: 'Standard label',
      type: 'standard-radio'
    }
  });

  describe('when protocol mode is experimental', () => {
    it('returns the base value for overridden properties', () => {
      assert.equal(field.label({}), 'Default label');
      assert.equal(field.type({}), 'radio');
    });
  });

  describe('when protocol mode is editable', () => {
    it('returns editable overrides', () => {
      assert.equal(
        field.label({ isStandardProtocol: false, standardProtocolType: 'editable' }),
        'Editable label'
      );
      assert.equal(field.type({ isStandardProtocol: false, standardProtocolType: 'editable' }), 'radio');
    });
  });

  describe('when protocol mode is standard', () => {
    it('returns standard overrides', () => {
      assert.equal(
        field.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
        'Standard label'
      );
      assert.equal(field.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'standard-radio');
    });
  });

  describe('when standard protocols are explicitly disabled', () => {
    it('falls back to the base value', () => {
      assert.equal(
        field.label({
          values: {
            isStandardProtocol: true,
            standardProtocolType: 'standard'
          },
          standardProtocolsEnabled: false
        }),
        'Default label'
      );
    });
  });
});


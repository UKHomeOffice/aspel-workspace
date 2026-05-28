import assert from 'assert';
import protocolDetailsFields from '../../../../client/schema/v1/protocols/details';
import {
  editableValues,
  experimentalValues,
  getFieldState,
  standardValues
} from '../test-utils/protocol-mode';

describe('protocol details fields', () => {
  const getField = name => protocolDetailsFields.find(field => field.name === name);

  describe('protocol-mode-specific field definitions', () => {
    it('uses the intended copy and field types for the description field across protocol modes', () => {
      const field = getField('description');

      assert.deepEqual({
        experimental: getFieldState(field, experimentalValues),
        editable: getFieldState(field, editableValues),
        standard: getFieldState(field, standardValues)
      }, {
        experimental: {
          label: 'Briefly describe the purposes of this protocol',
          hint: 'Ensure that you state any relevant regulatory guidelines.',
          type: 'texteditor'
        },
        editable: {
          label: 'What are the purposes of this protocol?',
          hint: 'Ensure that you state any relevant regulatory guidelines.',
          type: 'texteditor'
        },
        standard: {
          label: 'Purposes of protocol ',
          hint: null,
          type: 'paragraph'
        }
      });
    });

    it('uses the intended copy and field types for the severity field across protocol modes', () => {
      const field = getField('severity');

      assert.deepEqual({
        experimental: getFieldState(field, experimentalValues),
        editable: getFieldState(field, editableValues),
        standard: getFieldState(field, standardValues)
      }, {
        experimental: {
          label: 'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?',
          hint: null,
          type: 'radio'
        },
        editable: {
          label: 'What is the highest level of suffering an animal could experience in this protocol?',
          hint: 'This determines the severity category for the protocol',
          type: 'radio'
        },
        standard: {
          label: 'Highest level of suffering an animal could experience in this protocol ',
          hint: 'This determines the severity category for the protocol',
          type: 'standard-radio'
        }
      });
    });
  });

  describe('training-specific rules', () => {
    const showField = getField('training-used-for');
    const typeField = getField('training-participant-pre-course-training');

    it('shows training-used-for only for experimental training protocols', () => {
      assert.equal(showField.show({ ...experimentalValues, 'training-licence': true }), true);
      assert.equal(showField.show({ ...editableValues, 'training-licence': true }), true);
      assert.equal(showField.show({ ...standardValues, 'training-licence': true }), false);
    });

    it('switches participant pre-course training to paragraph only in standard mode', () => {
      assert.deepEqual({
        experimental: getFieldState(typeField, { ...experimentalValues, 'training-licence': true }).type,
        editable: getFieldState(typeField, { ...editableValues, 'training-licence': true }).type,
        standard: getFieldState(typeField, { ...standardValues, 'training-licence': true }).type
      }, {
        experimental: 'texteditor',
        editable: 'texteditor',
        standard: 'paragraph'
      });
    });
  });
});



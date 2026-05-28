import assert from 'assert';
import protocolDetailsFields from '../../../../client/schema/v1/protocols/details';

describe('protocol details fields', () => {
  const getField = name => protocolDetailsFields.find(field => field.name === name);

  describe('description field', () => {
    const field = getField('description');

    it('uses the experimental label, hint and texteditor type by default', () => {
      assert.equal(field.label({}), 'Briefly describe the purposes of this protocol');
      assert.equal(field.hint({}), 'Ensure that you state any relevant regulatory guidelines.');
      assert.equal(field.type({}), 'texteditor');
    });

    it('uses the editable label and hint in editable protocol mode', () => {
      assert.equal(
        field.label({ isStandardProtocol: false, standardProtocolType: 'editable' }),
        'What are the purposes of this protocol?'
      );
      assert.equal(
        field.hint({ isStandardProtocol: false, standardProtocolType: 'editable' }),
        'Ensure that you state any relevant regulatory guidelines.'
      );
      assert.equal(field.type({ isStandardProtocol: false, standardProtocolType: 'editable' }), 'texteditor');
    });

    it('uses the standard label and paragraph type in standard protocol mode', () => {
      assert.equal(
        field.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
        'Purposes of protocol '
      );
      assert.equal(field.hint({ isStandardProtocol: true, standardProtocolType: 'standard' }), null);
      assert.equal(field.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'paragraph');
    });
  });

  describe('severity field', () => {
    const field = getField('severity');

    it('uses the experimental label and radio type by default', () => {
      assert.equal(
        field.label({}),
        'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?'
      );
      assert.equal(field.hint({}), null);
      assert.equal(field.type({}), 'radio');
    });

    it('uses the editable label and hint in editable protocol mode', () => {
      assert.equal(
        field.label({ isStandardProtocol: false, standardProtocolType: 'editable' }),
        'What is the highest level of suffering an animal could experience in this protocol?'
      );
      assert.equal(
        field.hint({ isStandardProtocol: false, standardProtocolType: 'editable' }),
        'This determines the severity category for the protocol'
      );
      assert.equal(field.type({ isStandardProtocol: false, standardProtocolType: 'editable' }), 'radio');
    });

    it('uses the standard label, hint and standard-radio type in standard protocol mode', () => {
      assert.equal(
        field.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
        'Highest level of suffering an animal could experience in this protocol '
      );
      assert.equal(
        field.hint({ isStandardProtocol: true, standardProtocolType: 'standard' }),
        'This determines the severity category for the protocol'
      );
      assert.equal(field.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'standard-radio');
    });
  });

  describe('training fields', () => {
    const showField = getField('training-used-for');
    const typeField = getField('training-participant-pre-course-training');

    it('shows training-used-for for experimental training protocols', () => {
      assert.equal(showField.show({ 'training-licence': true }), true);
    });

    it('hides training-used-for in standard protocol mode', () => {
      assert.equal(
        showField.show({ isStandardProtocol: true, standardProtocolType: 'standard', 'training-licence': true }),
        false
      );
    });

    it('uses paragraph for participant pre-course training in standard protocol mode', () => {
      assert.equal(typeField.type({ 'training-licence': true }), 'texteditor');
      assert.equal(
        typeField.type({ isStandardProtocol: true, standardProtocolType: 'standard', 'training-licence': true }),
        'paragraph'
      );
    });
  });
});



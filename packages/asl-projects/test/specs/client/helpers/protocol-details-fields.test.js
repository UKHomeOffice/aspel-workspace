import assert from 'assert';
import protocolDetailsFields from '../../../../client/schema/v1/protocols/details';

describe('protocol details fields', () => {
  const getField = name => protocolDetailsFields.find(field => field.name === name);

  it('preserves description wording and type across modes', () => {
    const field = getField('description');

    assert.equal(field.label({}), 'Briefly describe the purposes of this protocol');
    assert.equal(field.hint({}), 'Ensure that you state any relevant regulatory guidelines.');
    assert.equal(field.type({}), 'texteditor');

    assert.equal(
      field.label({ isStandardProtocol: false, standardProtocolType: 'editable' }),
      'What are the purposes of this protocol?'
    );
    assert.equal(
      field.hint({ isStandardProtocol: false, standardProtocolType: 'editable' }),
      'Ensure that you state any relevant regulatory guidelines.'
    );
    assert.equal(field.type({ isStandardProtocol: false, standardProtocolType: 'editable' }), 'texteditor');

    assert.equal(
      field.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
      'Purposes of protocol '
    );
    assert.equal(field.hint({ isStandardProtocol: true, standardProtocolType: 'standard' }), null);
    assert.equal(field.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'paragraph');
  });

  it('preserves severity wording, hint and type across modes', () => {
    const field = getField('severity');

    assert.equal(
      field.label({}),
      'Given the controls and limitations in place, what is the highest severity that an animal could experience in this protocol?'
    );
    assert.equal(field.hint({}), null);
    assert.equal(field.type({}), 'radio');

    assert.equal(
      field.label({ isStandardProtocol: false, standardProtocolType: 'editable' }),
      'What is the highest level of suffering an animal could experience in this protocol?'
    );
    assert.equal(
      field.hint({ isStandardProtocol: false, standardProtocolType: 'editable' }),
      'This determines the severity category for the protocol'
    );
    assert.equal(field.type({ isStandardProtocol: false, standardProtocolType: 'editable' }), 'radio');

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

  it('preserves training field visibility and standard readonly type', () => {
    const showField = getField('training-used-for');
    const typeField = getField('training-participant-pre-course-training');

    assert.equal(showField.show({ 'training-licence': true }), true);
    assert.equal(
      showField.show({ isStandardProtocol: true, standardProtocolType: 'standard', 'training-licence': true }),
      false
    );

    assert.equal(typeField.type({ 'training-licence': true }), 'texteditor');
    assert.equal(
      typeField.type({ isStandardProtocol: true, standardProtocolType: 'standard', 'training-licence': true }),
      'paragraph'
    );
  });
});



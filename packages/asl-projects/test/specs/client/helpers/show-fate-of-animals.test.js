const assert = require('assert');
const { showFateOfAnimals } = require('../../../../client/helpers/show-fate-of-animals');

describe('showFateOfAnimals', () => {
  it('shows all fields for baseline protocols', () => {
    assert.equal(showFateOfAnimals({}, 'killed'), true);
    assert.equal(showFateOfAnimals({}, 'rehomed'), true);
  });

  it('shows all fields for editable standard protocols', () => {
    const values = {
      isStandardProtocol: false,
      standardProtocolType: 'editable'
    };

    assert.equal(showFateOfAnimals(values, 'killed'), true);
    assert.equal(showFateOfAnimals(values, 'continued-use-2'), true);
  });

  it('shows only the allowed fields for rodent-breeding-mild standard protocols when limited fates are selected', () => {
    const values = {
      isStandardProtocol: true,
      standardProtocolType: 'standard',
      protocolName: 'rodent-breeding-mild',
      project: {
        'fate-of-animals': ['set-free', 'rehomed', 'kept-alive']
      }
    };

    assert.equal(showFateOfAnimals(values, 'continued-use'), true);
    assert.equal(showFateOfAnimals(values, 'kept-alive'), true);
    assert.equal(showFateOfAnimals(values, 'killed'), false);
    assert.equal(showFateOfAnimals(values, 'set-free'), false);
  });

  it('shows the broader allowed set for rodent-breeding-mild standard protocols when a main fate is selected', () => {
    const values = {
      isStandardProtocol: true,
      standardProtocolType: 'standard',
      protocolName: 'rodent-breeding-mild',
      project: {
        'fate-of-animals': ['killed']
      }
    };

    assert.equal(showFateOfAnimals(values, 'killed'), true);
    assert.equal(showFateOfAnimals(values, 'continued-use-2'), true);
    assert.equal(showFateOfAnimals(values, 'kept-alive'), true);
    assert.equal(showFateOfAnimals(values, 'set-free'), false);
    assert.equal(showFateOfAnimals(values, 'rehomed'), false);
  });
});


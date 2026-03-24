const assert = require('assert');
const { showFateOfAnimals } = require('../../client/helpers/show-fate-of-animals.js');

describe('helpers/fate-of-animals', () => {

  const buildValues = (fates) => ({
    isStandardProtocol: true,
    standardProtocolType: 'standard',
    protocolName: 'rodent-breeding-mild',
    project: {
      'fate-of-animals': fates
    }
  });

  describe('showFateOfAnimals', () => {

    describe('when any main fate is selected (hasAllFates)', () => {

      it('should allow only main fates and hide set-free & rehomed', () => {
        const values = buildValues([
          'killed',
          'set-free',
          'rehomed'
        ]);

        assert.strictEqual(showFateOfAnimals(values, 'killed'), true);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use'), true);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use-2'), true);
        assert.strictEqual(showFateOfAnimals(values, 'kept-alive'), true);

        assert.strictEqual(showFateOfAnimals(values, 'set-free'), false);
        assert.strictEqual(showFateOfAnimals(values, 'rehomed'), false);
      });

    });

    describe('when only limited fates are selected', () => {

      it('should allow only continued-use and kept-alive', () => {
        const values = buildValues([
          'set-free',
          'rehomed',
          'kept-alive'
        ]);

        assert.strictEqual(showFateOfAnimals(values, 'continued-use'), true);
        assert.strictEqual(showFateOfAnimals(values, 'kept-alive'), true);

        assert.strictEqual(showFateOfAnimals(values, 'killed'), false);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use-2'), false);
        assert.strictEqual(showFateOfAnimals(values, 'set-free'), false);
        assert.strictEqual(showFateOfAnimals(values, 'rehomed'), false);
      });

    });

  });

});

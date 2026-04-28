const assert = require('assert');
const { showFateOfAnimals } = require('../../client/helpers/show-fate-of-animals.js');

describe('helpers/fate-of-animals', () => {

  // Flexible builder for test values
  const buildValues = ({
                         fates = [],
                         isStandardProtocol = true,
                         standardProtocolType = 'standard',
                         protocolName = 'rodent-breeding-mild'
                       } = {}) => ({
    isStandardProtocol,
    standardProtocolType,
    protocolName,
    project: {
      'fate-of-animals': fates
    }
  });

  describe('showFateOfAnimals', () => {

    describe('standard rodent-breeding-mild protocol', () => {

      it('should allow main fates and hide set-free & rehomed when hasAllFates', () => {
        const values = buildValues({ fates: ['killed', 'set-free', 'rehomed'] });

        assert.strictEqual(showFateOfAnimals(values, 'killed'), true);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use'), true);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use-2'), true);
        assert.strictEqual(showFateOfAnimals(values, 'kept-alive'), true);

        assert.strictEqual(showFateOfAnimals(values, 'set-free'), false);
        assert.strictEqual(showFateOfAnimals(values, 'rehomed'), false);
      });

      it('should allow only continued-use and kept-alive when limited fates selected', () => {
        const values = buildValues({ fates: ['set-free', 'rehomed', 'kept-alive'] });

        assert.strictEqual(showFateOfAnimals(values, 'continued-use'), true);
        assert.strictEqual(showFateOfAnimals(values, 'kept-alive'), true);

        assert.strictEqual(showFateOfAnimals(values, 'killed'), false);
        assert.strictEqual(showFateOfAnimals(values, 'continued-use-2'), false);
        assert.strictEqual(showFateOfAnimals(values, 'set-free'), false);
        assert.strictEqual(showFateOfAnimals(values, 'rehomed'), false);
      });

    });

    describe('non-standard protocol scenarios', () => {

      it('should return true for all fields if isStandardProtocol is false', () => {
        const values = buildValues({
          fates: ['killed'],
          isStandardProtocol: false,
          standardProtocolType: 'standard',
          protocolName: 'rodent-breeding-mild'
        });

        const fields = [
          'killed',
          'continued-use',
          'continued-use-2',
          'set-free',
          'rehomed',
          'kept-alive'
        ];

        fields.forEach(field => {
          assert.strictEqual(showFateOfAnimals(values, field), true);
        });
      });

      it('should return true for all fields if standardProtocolType is editable', () => {
        const values = buildValues({
          fates: ['killed'],
          isStandardProtocol: true,
          standardProtocolType: 'editable',
          protocolName: 'rodent-breeding-mild'
        });

        const fields = [
          'killed',
          'continued-use',
          'continued-use-2',
          'set-free',
          'rehomed',
          'kept-alive'
        ];

        fields.forEach(field => {
          assert.strictEqual(showFateOfAnimals(values, field), true);
        });
      });

    });

  });

});

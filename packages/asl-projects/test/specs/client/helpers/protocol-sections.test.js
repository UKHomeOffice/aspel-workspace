const assert = require('assert');
const fs = require('fs');
const path = require('path');
const animals = require('../../../../client/schema/v1/protocols/animals').default;
const gaas = require('../../../../client/schema/v1/protocols/gaas').default;
const fate = require('../../../../client/schema/v1/protocols/fate').default;
const NTSFateOfAnimalFields = require('../../../../client/helpers/nts-field').default;
const experience = require('../../../../client/schema/v1/protocols/experience').default;
const experimentalDesign = require('../../../../client/schema/v1/protocols/experimental-design').default;
const justification = require('../../../../client/schema/v1/protocols/justification').default;
const conditions = require('../../../../client/schema/v1/protocols/conditions').default;
const authorisations = require('../../../../client/schema/v1/protocols/authorisations').default;
const {
  editableValues,
  experimentalValues,
  getFieldState,
  sectionPropsFor,
  standardValues
} = require('../test-utils/protocol-mode');

const protocolSectionsIndexSource = fs.readFileSync(
  path.join(__dirname, '../../../../client/schema/v1/protocols/index.js'),
  'utf8'
);
const stepsSource = fs.readFileSync(
  path.join(__dirname, '../../../../client/schema/v1/protocols/steps.js'),
  'utf8'
);
const expectSourceToContain = (source, snippets) => {
  snippets.forEach(snippet => assert.ok(source.includes(snippet), snippet));
};

describe('protocol section schema', () => {
  describe('client/schema/v1/protocols/index.js source', () => {
    it('imports and exports the extracted protocol section modules', () => {
      expectSourceToContain(protocolSectionsIndexSource, [
        "import detailsFields from './details';",
        "import purpose from './purpose';",
        "import establishments from './establishments';",
        "import animals from './animals';",
        "import gaas from './gaas';",
        "import objectives from './objectives';",
        "import steps from './steps';",
        "import fate from './fate';",
        "import experience from './experience';",
        "import experimentalDesign from './experimental-design';",
        "import justification from './justification';",
        "import conditions from './conditions';",
        "import authorisations from './authorisations';",
        '  animals,',
        '  gaas,',
        '  steps,',
        '  fate,',
        '  experience,',
        '  experimentalDesign,',
        '  justification,',
        '  conditions,',
        '  authorisations'
      ]);
    });
  });

  describe('animals section', () => {
    const lifeStages = animals.fields.find(field => field.name === 'life-stages');
    const continuedUse = animals.fields.find(field => field.name === 'continued-use');

    it('uses checkbox for life-stages by default and standard-list in standard protocol mode', () => {
      assert.equal(lifeStages.label(experimentalValues), 'Which life stages will be used in this protocol?');
      assert.equal(lifeStages.type(experimentalValues), 'checkbox');
      assert.equal(lifeStages.type(standardValues), 'standard-list');
    });

    it('uses the standard continued-use label and standard-radio type in standard protocol mode', () => {
      assert.equal(continuedUse.label(standardValues), 'Continued use coming onto the protocol');
      assert.equal(continuedUse.type(experimentalValues), 'radio');
      assert.equal(continuedUse.type(standardValues), 'standard-radio');
    });
  });

  describe('gaas section', () => {
    const gaasField = gaas.fields.find(field => field.name === 'gaas');

    it('uses the expected default label and standard-radio type in standard protocol mode', () => {
      assert.equal(gaasField.label(experimentalValues), 'Will this protocol use any genetically altered animals?');
      assert.equal(gaasField.type(standardValues), 'standard-radio');
    });
  });

  describe('client/schema/v1/protocols/steps.js source', () => {
    it('declares adverse as a standard-radio field for standard protocols', () => {
      expectSourceToContain(stepsSource, [
        "import { withProtocolContext } from './helpers/with-protocol-context';",
        "name: 'adverse'",
        "label: 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?'",
        "label: `Expected adverse effects that are more than mild and short-term and not listed in General constraints ${markdownLink('General constraints', getToGeneralConstraints())}`",
        "type: 'standard-radio'"
      ]);
    });

    it('keeps the baseline readonly gating for reference and reusable metadata while hiding optional for standard protocols', () => {
      const readonlyMatches = stepsSource.match(/show: props => props\?\.isStandardProtocol === true \? false : !props\?\.readonly/g) || [];
      const standardOnlyMatches = stepsSource.match(/show: props => props\?\.isStandardProtocol !== true/g) || [];

      assert.equal(readonlyMatches.length, 2);
      assert.equal(standardOnlyMatches.length, 1);
    });
  });

  describe('experience and experimental design sections', () => {
    const experienceSummary = experience.fields.find(field => field.name === 'experience-summary');
    const outputs = experimentalDesign.fields.find(field => field.name === 'outputs');
    const quantitativeData = experimentalDesign.fields.find(field => field.name === 'quantitative-data');

    it('uses the standard experience summary label in standard protocol mode', () => {
      assert.equal(experienceSummary.label(standardValues), 'Typical experience or end-to-end scenario for an animal in this protocol');
    });

    it('uses the expected outputs labels across protocol modes', () => {
      assert.equal(outputs.label(experimentalValues), 'What outputs are expected to arise from this protocol?');
      assert.equal(outputs.label(standardValues), 'Permitted outputs from this protocol');
    });

    it('keeps quantitative-data as a radio question by default', () => {
      assert.equal(quantitativeData.label(experimentalValues), 'Will this protocol generate quantitative data?');
    });
  });

  describe('supporting sections', () => {
    const mostAppropriate = justification.fields.find(field => field.name === 'most-appropriate');
    const mostRefined = justification.fields.find(field => field.name === 'most-refined');
    const fateFields = NTSFateOfAnimalFields();
    const killedReveal = fateFields.killed.reveal;
    const justificationReveal = killedReveal.options[0].reveal;
    const continuedUseReveal = fateFields['continued-use'].reveal;

    it('export the expected titles and singular labels', () => {
      assert.equal(fate.title, 'Fate of animals');
      assert.equal(justification.title, 'Protocol justification');
      console.log(justification);
      assert.equal(justification.label, 'Why is each type of animal, experimental model, and/or method selected for this protocol:');
      assert.equal(conditions.singular, 'Additional condition');
      assert.equal(authorisations.singular, 'Authorisation');
    });

    it('shows the justification section in baseline and editable modes, but hides it in standard mode', () => {
      assert.equal(justification.show(sectionPropsFor(experimentalValues)), true);
      assert.equal(justification.show(sectionPropsFor(editableValues)), true);
      assert.equal(justification.show(sectionPropsFor(standardValues)), false);
    });

    it('uses the baseline label by default and the editable label in editable mode', () => {
      assert.equal(mostAppropriate.label(experimentalValues), 'a) the most appropriate scientific approach?');
      assert.equal(mostAppropriate.label(editableValues), 'In what ways have you changed the standard protocol and why?');
    });

    it('shows only the most-appropriate field in editable mode', () => {
      assert.equal(getFieldState(mostAppropriate, editableValues).type, 'textarea');
      assert.equal(mostRefined.show(experimentalValues), true);
      assert.equal(mostRefined.show(editableValues), false);
    });

    it('uses protocol-mode specific labels and types for NTS fate reveal fields', () => {
      assert.deepEqual(getFieldState(killedReveal, experimentalValues), {
        label: 'Will you be using non-schedule 1 killing methods on a conscious animal?',
        hint: undefined,
        type: 'radio'
      });

      assert.deepEqual(getFieldState(killedReveal, standardValues), {
        label: 'Non-schedule 1 killing methods on a conscious animal',
        hint: undefined,
        type: 'standard-radio'
      });

      assert.deepEqual(getFieldState(justificationReveal, standardValues), {
        label: 'For each non-schedule 1 method, explain why this is necessary.',
        hint: undefined,
        type: 'paragraph'
      });

      assert.deepEqual(getFieldState(continuedUseReveal, standardValues), {
        label: null,
        hint: undefined,
        type: 'paragraph'
      });
    });
  });
});







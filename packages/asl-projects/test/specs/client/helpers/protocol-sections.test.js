const assert = require('assert');
const fs = require('fs');
const path = require('path');
const animals = require('../../../../client/schema/v1/protocols/animals').default;
const gaas = require('../../../../client/schema/v1/protocols/gaas').default;
const fate = require('../../../../client/schema/v1/protocols/fate').default;
const experience = require('../../../../client/schema/v1/protocols/experience').default;
const experimentalDesign = require('../../../../client/schema/v1/protocols/experimental-design').default;
const justification = require('../../../../client/schema/v1/protocols/justification').default;
const justificationStandardProtocol = require('../../../../client/schema/v1/protocols/justification-standard-protocol').default;
const conditions = require('../../../../client/schema/v1/protocols/conditions').default;
const authorisations = require('../../../../client/schema/v1/protocols/authorisations').default;

const protocolSectionsIndexSource = fs.readFileSync(
  path.join(__dirname, '../../../../client/schema/v1/protocols/index.js'),
  'utf8'
);
const stepsSource = fs.readFileSync(
  path.join(__dirname, '../../../../client/schema/v1/protocols/steps.js'),
  'utf8'
);
describe('protocol sections', () => {
  it('wires the extracted section files through the protocol sections index', () => {
    [
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
      "import justificationStandardProtocol from './justification-standard-protocol';",
      "import conditions from './conditions';",
      "import authorisations from './authorisations';",
      '  animals,',
      '  gaas,',
      '  steps,',
      '  fate,',
      '  experience,',
      '  experimentalDesign,',
      '  justification,',
      '  justificationStandardProtocol,',
      '  conditions,',
      '  authorisations'
    ].forEach(snippet => assert.ok(protocolSectionsIndexSource.includes(snippet), snippet));
  });

  it('preserves animals section wording and standard field type', () => {
    const lifeStages = animals.fields.find(field => field.name === 'life-stages');
    const continuedUse = animals.fields.find(field => field.name === 'continued-use');

    assert.equal(lifeStages.label({}), 'Which life stages will be used in this protocol?');
    assert.equal(lifeStages.type({}), 'checkbox');
    assert.equal(lifeStages.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'standard-list');

    assert.equal(
      continuedUse.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
      'Continued use coming onto the protocol'
    );
    assert.equal(continuedUse.type({}), 'radio');
    assert.equal(continuedUse.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'standard-radio');
  });

  it('preserves gaas and steps section wording and type handling', () => {
    const gaasField = gaas.fields.find(field => field.name === 'gaas');

    assert.equal(gaasField.label({}), 'Will this protocol use any genetically altered animals?');
    assert.equal(gaasField.type({ isStandardProtocol: true, standardProtocolType: 'standard' }), 'standard-radio');

    [
      "import { withProtocolContext } from './helpers/with-protocol-context';",
      "name: 'adverse'",
      "label: 'Do you expect this step to have adverse effects for the animals that are more than mild and transient?'",
      "label: `Expected adverse effects that are more than mild and short-term and not listed in General constraints ${markdownLink('General constraints', getToGeneralConstraints())}`",
      "type: 'standard-radio'"
    ].forEach(snippet => assert.ok(stepsSource.includes(snippet), snippet));
  });

  it('preserves experience and experimental design wording', () => {
    const experienceSummary = experience.fields.find(field => field.name === 'experience-summary');
    const outputs = experimentalDesign.fields.find(field => field.name === 'outputs');
    const quantitativeData = experimentalDesign.fields.find(field => field.name === 'quantitative-data');

    assert.equal(
      experienceSummary.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
      'Typical experience or end-to-end scenario for an animal in this protocol'
    );
    assert.equal(outputs.label({}), 'What outputs are expected to arise from this protocol?');
    assert.equal(
      outputs.label({ isStandardProtocol: true, standardProtocolType: 'standard' }),
      'Permitted outputs from this protocol'
    );
    assert.equal(quantitativeData.label({}), 'Will this protocol generate quantitative data?');
  });

  it('preserves justification and supporting section config', () => {
    assert.equal(fate.title, 'Fate of animals');
    assert.equal(justification.label, 'Why is each type of animal, experimental model, and/or method selected for this protocol:');
    assert.equal(justificationStandardProtocol.label, 'In what ways have you changed the standard protocol and why?');
    assert.equal(conditions.singular, 'Additional condition');
    assert.equal(authorisations.singular, 'Authorisation');
  });
});







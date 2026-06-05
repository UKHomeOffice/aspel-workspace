import assert from 'assert';
import protocolDetailsFields from '../../../../client/schema/v1/protocols/details';
import { getComparisonFieldConfig } from '../../../../client/helpers/diff-window-field-config';
import {
  editableValues,
  standardValues
} from '../test-utils/protocol-mode';

describe('diff window field config', () => {
  const descriptionField = protocolDetailsFields.find(field => field.name === 'description');

  it('uses texteditor comparison for editable protocol descriptions', () => {
    const config = getComparisonFieldConfig({
      ...descriptionField,
      values: editableValues,
      standardProtocolsEnabled: true
    });

    assert.equal(config.resolvedType, 'texteditor');
    assert.equal(config.comparisonType, 'texteditor');
  });

  it('uses texteditor comparison for standard protocol paragraph playback', () => {
    const config = getComparisonFieldConfig({
      ...descriptionField,
      values: standardValues,
      standardProtocolsEnabled: true
    });

    assert.equal(config.resolvedType, 'paragraph');
    assert.equal(config.comparisonType, 'texteditor');
  });
});


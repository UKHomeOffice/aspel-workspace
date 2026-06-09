import assert from 'assert';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  checkboxDiffDisplay,
  radioDiffDisplay
} from '../../../../client/helpers';

const render = element => renderToStaticMarkup(element);

describe('comparison display helpers', () => {
  it('marks appended checkbox values as added in the proposed view', () => {
    const html = render(checkboxDiffDisplay({
      before: ['Existing value'],
      value: ['Existing value', 'New value'],
      isBefore: false,
      DEFAULT_LABEL: 'No answer provided'
    }));

    assert.ok(html.includes('Existing value'));
    assert.ok(html.includes('<span class="diff added">New value</span>'));
  });

  it('marks removed checkbox values as removed in the previous view', () => {
    const html = render(checkboxDiffDisplay({
      before: ['Removed value', 'Retained value'],
      value: ['Retained value'],
      isBefore: true,
      DEFAULT_LABEL: 'No answer provided'
    }));

    assert.ok(html.includes('<span class="diff removed">Removed value</span>'));
    assert.ok(html.includes('<span>Retained value</span>'));
  });

  it('marks radio changes as removed in the previous view', () => {
    const html = render(radioDiffDisplay({
      value: false,
      isBefore: true,
      DEFAULT_LABEL: 'No answer provided'
    }));

    assert.ok(html.includes('<span class="diff removed">No</span>'));
  });

  it('marks radio changes as added in the proposed view', () => {
    const html = render(radioDiffDisplay({
      value: true,
      isBefore: false,
      DEFAULT_LABEL: 'No answer provided'
    }));

    assert.ok(html.includes('<span class="diff added">Yes</span>'));
  });

  it('shows the default label for missing radio answers', () => {
    const html = render(radioDiffDisplay({
      value: undefined,
      isBefore: false,
      DEFAULT_LABEL: 'No answer provided'
    }));

    assert.ok(html.includes('<em>No answer provided</em>'));
  });
});



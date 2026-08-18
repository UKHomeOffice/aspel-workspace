const assert = require('assert');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const AccessibilityStatement = require('../../ui/pages/accessibility/views/index.jsx').default;

// ASL-5095: v2 of the statement, tested against WCAG 2.2 AA.
describe('accessibility statement', () => {
  let html;

  before(() => {
    html = renderToStaticMarkup(React.createElement(AccessibilityStatement));
  });

  it('states the v2 preparation and review dates', () => {
    assert.ok(html.includes('This statement was prepared on 24th June 2026'));
    assert.ok(html.includes('It was last reviewed on 24th June 2026'));
  });

  it('states the v2 testing date', () => {
    assert.ok(html.includes('This website was last tested on 31st March 2026'));
  });

  it('no longer refers to the 2020 dates', () => {
    assert.ok(!html.includes('September 2020'));
  });

  it('reports compliance against WCAG 2.2', () => {
    assert.ok(html.includes('Web Content Accessibility Guidelines version 2.2'));
    assert.ok(html.includes('https://www.w3.org/TR/WCAG22'));
    assert.ok(!html.includes('WCAG 2.1'));
  });

  it('marks up the non-accessible content sub-sections as headings, not italics', () => {
    ['Non-compliance with the accessibility regulations', 'Disproportionate burden']
      .forEach(heading => {
        assert.ok(html.includes(`>${heading}</h4>`), `"${heading}" should be an h4`);
        assert.ok(!html.includes(`<em>${heading}</em>`), `"${heading}" should not be italicised`);
      });
  });

  it('applies the GOV.UK type scale to headings', () => {
    assert.ok(html.includes('<h1 class="govuk-heading-xl"'));
    assert.ok(html.includes('<h2 class="govuk-heading-l"'));
    assert.ok(html.includes('<h3 class="govuk-heading-m"'));
    assert.ok(html.includes('<h4 class="govuk-heading-s"'));
  });

  it('does not skip a heading level', () => {
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map(([, level]) => Number(level));

    levels.reduce((previous, level) => {
      assert.ok(level <= previous + 1, `h${level} follows h${previous}`);
      return level;
    }, 1);
  });
});

const { get } = require('lodash');

/**
 * ASL-5129 / WCAG 2.4.2 Page Titled.
 *
 * Every screen in the PIL journey must declare a page title, and no two screens
 * may share one. Titles are prepended to `<licence holder> - <establishment>`
 * by `setPageTitle`, so the declared label is what distinguishes the pages.
 */
const screens = [
  ['create', require('../../../../pages/pil/create/content'), 'pageTitle'],
  ['update', require('../../../../pages/pil/dashboard/content'), 'pil.pageTitle'],
  ['update (amend)', require('../../../../pages/pil/dashboard/content'), 'pil.pageTitleAmend'],
  ['update/confirm', require('../../../../pages/pil/dashboard/content/confirm'), 'pageTitle'],
  ['update/species', require('../../../../pages/pil/species/content'), 'pageTitle'],
  ['update/procedures', require('../../../../pages/pil/procedures/content'), 'pageTitle'],
  ['update/training', require('../../../../pages/pil/training/content'), 'pageTitle'],
  ['update/establishment', require('../../../../pages/pil/establishment/content'), 'pageTitle'],
  ['review', require('../../../../pages/pil/review/content'), 'pageTitle'],
  ['revoke', require('../../../../pages/pil/revoke/content'), 'pageTitle'],
  ['revoke/confirm', require('../../../../pages/pil/revoke/content/confirm'), 'pageTitle'],
  ['read', require('../../../../pages/pil/read/content'), 'pageTitle']
];

describe('PIL journey page titles', () => {
  it.each(screens)('%s declares a page title', (name, content, path) => {
    expect(get(content, path)).toEqual(expect.any(String));
    expect(get(content, path).trim()).not.toBe('');
  });

  it('gives every screen a unique title', () => {
    const titles = screens.map(([, content, path]) => get(content, path));
    const duplicates = titles.filter((title, i) => titles.indexOf(title) !== i);

    expect(duplicates).toEqual([]);
  });

  it('does not leak a parent page title through content merges', () => {
    // dashboard/content merges pil/content, procedures/content and species/content;
    // a stray top-level pageTitle there would silently retitle the dashboard.
    const dashboard = require('../../../../pages/pil/dashboard/content');
    expect(dashboard.pageTitle).toBeUndefined();
  });
});

describe('suspend and reinstate page titles', () => {
  const content = require('../../../../pages/suspend/content');

  it.each(['suspend', 'reinstate'])('%s declares titles for both steps', action => {
    expect(content[action].title).toEqual(expect.any(String));
    expect(content[action].pageTitleConfirm).toEqual(expect.any(String));
  });

  it('distinguishes the two steps and the two actions', () => {
    const titles = [
      content.suspend.title,
      content.suspend.pageTitleConfirm,
      content.reinstate.title,
      content.reinstate.pageTitleConfirm
    ];

    expect(new Set(titles).size).toBe(titles.length);
  });
});

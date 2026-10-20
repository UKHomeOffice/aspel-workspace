const assert = require('assert');
// eslint-disable-next-line implicit-dependencies/no-implicit
const { test } = require('node:test');
const React = require('react');
// eslint-disable-next-line implicit-dependencies/no-implicit
const { createRoot } = require('react-dom/client');
// eslint-disable-next-line implicit-dependencies/no-implicit
const { JSDOM } = require('jsdom');
// eslint-disable-next-line implicit-dependencies/no-implicit
const proxyquire = require('proxyquire').noCallThru();

// eslint-disable-next-line implicit-dependencies/no-implicit
require('@babel/register')({
  babelrc: false,
  configFile: false,
  only: [
    require.resolve('./nts-downloads.jsx'),
    require.resolve('../../../../../asl-components/src/form/form.jsx')
  ],
  presets: ['@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs']
});

const Form = proxyquire('../../../../../asl-components/src/form/form.jsx', {
  '../': { Fieldset: () => React.createElement('input', { type: 'checkbox', name: 'ra' }) }
}).default;
const state = {
  static: {
    schema: { dateRange: {}, 'date-from': { validate: [] }, 'date-to': { validate: [] }, ra: {} },
    errors: { noResults: 'noResults' }
  },
  model: {}
};
const NTSDownloads = proxyquire('./nts-downloads.jsx', {
  'react-redux': { useSelector: selector => selector(state) },
  '@ukhomeoffice/asl-components': {
    Form,
    ErrorSummary: () => React.createElement('div', { id: 'errors' }, 'No results')
  }
}).default;

test('disables NTS submissions until a field changes and allows the next download', async () => {
  const dom = new JSDOM('<div id="root"></div>');
  const previousWindow = global.window;
  const previousDocument = global.document;
  const previousActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.getElementById('root');
  const root = createRoot(container);

  try {
    await React.act(async () => root.render(React.createElement(NTSDownloads)));
    assert.ok(container.querySelector('#errors'));
    const form = container.querySelector('form');
    assert.strictEqual(form.getAttribute('action'), '/downloads?tab=nts');

    for (let attempt = 0; attempt < 2; attempt++) {
      assert.strictEqual(container.querySelector('button').disabled, false);
      const event = new dom.window.Event('submit', { bubbles: true, cancelable: true });
      await React.act(async () => {
        form.dispatchEvent(event);
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      assert.strictEqual(event.defaultPrevented, false);
      assert.strictEqual(container.querySelector('#errors'), null);
      assert.strictEqual(container.querySelector('button').disabled, true);
      const repeatedEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
      await React.act(async () => form.dispatchEvent(repeatedEvent));
      assert.strictEqual(repeatedEvent.defaultPrevented, true);
      await React.act(async () => container.querySelector('input[name="ra"]').click());
      assert.strictEqual(container.querySelector('button').disabled, false);
    }
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    global.window = previousWindow;
    global.document = previousDocument;
    global.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

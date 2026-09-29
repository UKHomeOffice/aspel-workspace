import assert from 'assert';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import TrainingSummaryWithChangeHighlighting from '../../../../client/components/training-summary-custom';

const buildStore = state => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: () => {}
});

const render = ({ certificates = [], comparisons, previousTraining, versions = [] }) => {
  const store = buildStore({
    static: {
      previousTraining,
      project: { versions }
    }
  });

  return renderToStaticMarkup(
    <Provider store={store}>
      <TrainingSummaryWithChangeHighlighting
        certificates={certificates}
        comparisons={comparisons}
        project={{}}
      />
    </Provider>
  );
};

const emptyComparisons = () => ({
  added: [{ color: 'pink', ids: [] }, { color: 'grey', ids: [] }],
  removed: [{ color: 'pink', ids: [] }, { color: 'grey', ids: [] }],
  changed: [{ color: 'pink', ids: [] }, { color: 'grey', ids: [] }]
});

const certificate = overrides => ({
  id: 'cert-1',
  modules: ['ppl'],
  species: ['Mice'],
  certificateNumber: 'ABC123',
  accreditingBody: 'RSPCA',
  ...overrides
});

describe('<TrainingSummaryWithChangeHighlighting />', () => {

  describe('when there are no training records', () => {
    it('renders the empty label rather than an empty table', () => {
      const markup = render({
        certificates: [],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.equal(markup, '<p>No training record</p>');
    });

    it('renders the empty label when there is no training history at all', () => {
      const markup = render({
        certificates: [],
        comparisons: { added: [], removed: [], changed: [] },
        previousTraining: undefined
      });

      assert.equal(markup, '<p>No training record</p>');
    });
  });

  describe('when there are training records', () => {
    it('renders a table of the records', () => {
      const markup = render({
        certificates: [certificate()],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.ok(markup.includes('<table'));
      assert.ok(markup.includes('ABC123'));
      assert.ok(!markup.includes('No training record'));
    });

    it('renders the default label for a record with no modules or species', () => {
      const markup = render({
        certificates: [certificate({ modules: [], species: [] })],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.ok(markup.includes('<table'));
      assert.ok(!markup.includes('[object Object]'));
    });

    it('renders the date an exemption was added', () => {
      const markup = render({
        certificates: [certificate({
          isExemption: true,
          exemptionReason: 'Previously trained abroad',
          createdAt: '2026-03-14T10:30:00.000Z'
        })],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.ok(markup.includes('Previously trained abroad'));
      assert.ok(markup.includes('Added on: </span><span class="value">14 March 2026</span>'));
    });

    it('renders a dash when an exemption has no created date', () => {
      const markup = render({
        certificates: [certificate({ isExemption: true, exemptionReason: 'Legacy exemption' })],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.ok(markup.includes('Added on: </span><span class="value">-</span>'));
    });

    it('does not render an added date for training certificates', () => {
      const markup = render({
        certificates: [certificate({ createdAt: '2026-03-14T10:30:00.000Z' })],
        comparisons: emptyComparisons(),
        previousTraining: { first: [], previous: [], granted: [] }
      });

      assert.ok(!markup.includes('Added on'));
    });

    it('does not throw when comparisons have no grey entry', () => {
      assert.doesNotThrow(() => render({
        certificates: [certificate()],
        comparisons: { added: [], removed: [], changed: [] },
        previousTraining: { first: [], previous: [], granted: [] }
      }));
    });
  });

});

const assert = require('assert');
const {
  getDuplicatedProtocols,
  getProtocolSelector,
  scrollToProtocolById,
  scheduleProtocolScroll
} = require('../../../../client/pages/sections/protocols/duplicate-protocol.js');

describe('protocol duplication helpers', () => {
  let previousWindow;
  let previousDocument;

  beforeEach(() => {
    previousWindow = global.window;
    previousDocument = global.document;
  });

  afterEach(() => {
    global.window = previousWindow;
    global.document = previousDocument;
  });

  describe('getDuplicatedProtocols', () => {
    it('appends the copy suffix and resets completion only for the duplicated protocol', () => {
      const items = [
        { id: 'protocol-1', title: 'Protocol 1', complete: true },
        { id: 'protocol-2', title: 'Protocol 2', complete: true }
      ];

      const result = getDuplicatedProtocols(items, 'protocol-2');

      assert.deepStrictEqual(result, [
        { id: 'protocol-1', title: 'Protocol 1', complete: true },
        { id: 'protocol-2', title: 'Protocol 2 (Copy)', complete: false }
      ]);
      assert.deepStrictEqual(items, [
        { id: 'protocol-1', title: 'Protocol 1', complete: true },
        { id: 'protocol-2', title: 'Protocol 2', complete: true }
      ]);
    });

    it('returns an empty list for invalid items input', () => {
      assert.deepStrictEqual(getDuplicatedProtocols(null, 'protocol-2'), []);
    });
  });

  describe('scrollToProtocolById', () => {
    it('scrolls to the duplicated protocol when it exists in the DOM', () => {
      const scrollTo = (...args) => {
        scrollTo.calls.push(args);
      };
      scrollTo.calls = [];

      const querySelector = selector => {
        querySelector.calls.push(selector);
        return { offsetTop: 320 };
      };
      querySelector.calls = [];

      global.window = { scrollTo };
      global.document = { querySelector };

      const didScroll = scrollToProtocolById('protocol-2');

      assert.equal(didScroll, true);
      assert.deepStrictEqual(querySelector.calls, [getProtocolSelector('protocol-2')]);
      assert.deepStrictEqual(scrollTo.calls, [[{ top: 320, left: 0 }]]);
    });

    it('fails safely when the duplicated protocol is not yet rendered', () => {
      const scrollTo = (...args) => {
        scrollTo.calls.push(args);
      };
      scrollTo.calls = [];

      global.window = { scrollTo };
      global.document = {
        querySelector: () => undefined
      };

      const didScroll = scrollToProtocolById('protocol-2');

      assert.equal(didScroll, false);
      assert.deepStrictEqual(scrollTo.calls, []);
    });
  });

  describe('scheduleProtocolScroll', () => {
    it('defers the scroll until the next animation frame', () => {
      let scheduled = false;
      const scrollTo = (...args) => {
        scrollTo.calls.push(args);
      };
      scrollTo.calls = [];

      global.window = {
        scrollTo,
        requestAnimationFrame: callback => {
          scheduled = true;
          callback();
        },
        setTimeout
      };
      global.document = {
        querySelector: () => ({ offsetTop: 480 })
      };

      const wasScheduled = scheduleProtocolScroll('protocol-3');

      assert.equal(wasScheduled, true);
      assert.equal(scheduled, true);
      assert.deepStrictEqual(scrollTo.calls, [[{ top: 480, left: 0 }]]);
    });
  });
});


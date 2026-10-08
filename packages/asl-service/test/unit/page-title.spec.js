const assert = require('assert');
const pageTitle = require('../../ui/page-title');

describe('pageTitle', () => {
  it('prefers an explicit page title', () => {
    const res = {
      locals: {
        pageTitle: 'Custom title',
        static: {
          content: {
            pageTitle: 'Content page title',
            title: 'Content title'
          }
        }
      }
    };

    assert.equal(pageTitle({}, res), 'Custom title');
  });

  it('falls back to content pageTitle', () => {
    const res = {
      locals: {
        static: {
          content: {
            pageTitle: 'Content page title',
            title: 'Content title'
          }
        }
      }
    };

    assert.equal(pageTitle({}, res), 'Content page title');
  });

  it('falls back to content title', () => {
    const res = {
      locals: {
        static: {
          content: {
            title: 'Content title'
          }
        }
      }
    };

    assert.equal(pageTitle({}, res), 'Content title');
  });

  it('falls back to nested page title', () => {
    const res = {
      locals: {
        static: {
          content: {
            page: {
              title: 'Nested title'
            }
          }
        }
      }
    };

    assert.equal(pageTitle({}, res), 'Nested title');
  });
});

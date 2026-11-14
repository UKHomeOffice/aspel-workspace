const assert = require('assert');
const { safePostLogoutRedirectUri } = require('../../../lib/auth');

// /logout used to send the raw Referer/Origin header straight on to Keycloak
// as post_logout_redirect_uri. Either header reflects whatever page the
// browser was on when it followed a link to this app's own /logout, which a
// third-party page can set just by linking there, so an attacker page could
// steer a signed-out user to a destination of its choosing. These tests
// cover the same-origin check that now gates it.

const req = (host, headers) => ({
  protocol: 'https',
  get: name => (name === 'host' ? host : undefined),
  headers
});

describe('safePostLogoutRedirectUri', () => {

  it('uses the referer when it shares this request\'s origin', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {
      referer: 'https://aspel.example/some/page'
    }));
    assert.strictEqual(result, 'https://aspel.example/some/page');
  });

  it('uses the origin header when the referer is absent', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {
      origin: 'https://aspel.example'
    }));
    assert.strictEqual(result, 'https://aspel.example');
  });

  it('falls back to this app\'s own origin for a cross-origin referer', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {
      referer: 'https://attacker.example/phish'
    }));
    assert.strictEqual(result, 'https://aspel.example');
  });

  it('falls back to this app\'s own origin for a cross-origin origin header', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {
      origin: 'https://attacker.example'
    }));
    assert.strictEqual(result, 'https://aspel.example');
  });

  it('falls back to this app\'s own origin when neither header is present', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {}));
    assert.strictEqual(result, 'https://aspel.example');
  });

  it('falls back to this app\'s own origin for an unparseable referer', () => {
    const result = safePostLogoutRedirectUri(req('aspel.example', {
      referer: 'not a url'
    }));
    assert.strictEqual(result, 'https://aspel.example');
  });

});

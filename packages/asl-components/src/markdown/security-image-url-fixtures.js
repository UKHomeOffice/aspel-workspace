export const SECURITY_IMAGE_URL_FIXTURES = [
    {
        category: 'external-images',
        url: 'https\\://webhook.site/1a3f67a7-f46b-4dad-87d1-65221b5d9004/probe-1c0ac14dc9.png',
        allowed: true
    },
    {
        category: 'http-https',
        url: 'http\\://206.238.68.215:8899/A_base.png',
        allowed: true
    },
    {
        category: 'http-https',
        url: 'https\\://206.238.68.215:8443/tlsprobe.png',
        allowed: true
    },
    {
        category: 'xss-attribute-breakout',
        url: 'http\\://206.238.68.215:8899/B.png" onerror="new Image().src=\'http\\://206.238.68.215:8899/B_JS.png\'',
        allowed: false
    },
    {
        category: 'svg-active-content',
        url: 'http\\://206.238.68.215:8899/s1.svg',
        allowed: true
    },
    {
        category: 'ssrf-metadata',
        url: 'http\\://169.254.169.254/latest/meta-data/',
        allowed: false
    },
    {
        category: 'ssrf-localhost',
        url: 'http\\://127.0.0.1:8080/conv.png',
        allowed: false
    },
    {
        category: 'ssrf-ipv6-loopback',
        url: 'http\\://[::1]:8899/A11_ipv6.png',
        allowed: false
    },
    {
        category: 'local-file',
        url: 'file:///etc/passwd',
        allowed: false
    },
    {
        category: 'local-file',
        url: 'file:///proc/self/environ',
        allowed: false
    },
    {
        category: 'scheme-relative',
        url: '//206.238.68.215:8899/A10_rel.png?probe=A10',
        allowed: false
    },
    {
        category: 'unsupported-scheme',
        url: 'ftp\\://206.238.68.215:2121/A9_ftp.png',
        allowed: false
    },
    {
        category: 'blob-url',
        url: 'blob:http\\://example.com/00000000-0000-0000-0000-000000000000',
        allowed: false
    },
    {
        category: 'auth-userinfo',
        url: 'http\\://artxuser:artxpass\\@206.238.68.215:8899/authprobe.png',
        allowed: false
    },
    {
        category: 'redirect-external',
        url: 'http\\://206.238.68.215:8899/A13_redir_ext.png?redir=http%3A%2F%2F206.238.68.215%3A8899%2FA13_after.png',
        allowed: true
    },
    {
        category: 'redirect-to-metadata',
        url: 'http\\://206.238.68.215:8899/A14_redir_mds.png?redir=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F',
        allowed: true
    },
    {
        category: 'data-url-image',
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        allowed: true
    },
    {
        category: 'data-url-svg',
        url: 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIi8+',
        allowed: false
    },
    {
        category: 'internal-public-host',
        url: 'https\\://external.aspel.homeoffice.gov.uk/favicon.ico',
        allowed: true
    },
    {
        category: 'internal-private-hostname-not-blocked-by-name',
        url: 'https\\://internal.aspel.homeoffice.gov.uk/favicon.ico',
        allowed: true
    }
];


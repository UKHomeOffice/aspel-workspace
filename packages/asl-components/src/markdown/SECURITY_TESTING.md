# Markdown Image Security Tests

This folder includes fixture-driven tests for markdown image URL safety.

## Files

- `security-image-url-fixtures.js`: representative payloads and expected allow/deny outcomes.
- `image-url-policy.js`: policy used to accept or block image URLs.
- `image-url-policy.spec.js`: Jest harness validating classification and rendering behavior.

## Quick Run

From `aspel-workspace`:

```bash
npm run test:unit -w @ukhomeoffice/asl-components -- src/markdown/image-url-policy.spec.js
```

## Coverage Highlights

- External HTTP/HTTPS URLs
- `data:` image URLs (non-SVG only)
- SSRF probes (`127.0.0.1`, `::1`, `169.254.169.254`, private IPv4)
- `file:`, `ftp:`, `blob:`, and scheme-relative URL rejection
- Userinfo in authority section (`user:pass@host`)
- Rendering behavior: blocked URLs are not rendered as `<img>`


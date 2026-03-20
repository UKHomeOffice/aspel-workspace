import assert from 'assert';
import {
  resolveImageSource,
  updateImageDimensions
} from '../../../../../../client/components/download-link/renderers/helpers/docx-image-helper';

describe('docx image helper', () => {
  const originalFetch = global.fetch;
  const originalFileReader = global.FileReader;
  const originalImage = global.Image;

  afterEach(() => {
    global.fetch = originalFetch;
    global.FileReader = originalFileReader;
    global.Image = originalImage;
  });

  it('returns an existing data URI without fetching', async () => {
    global.fetch = () => {
      throw new Error('fetch should not be called for data URIs');
    };

    const node = {
      data: {
        src: 'data:image/png;base64,abc123'
      }
    };

    const result = await resolveImageSource(node, '/custom-attachment');

    assert.equal(result, 'data:image/png;base64,abc123');
  });

  it('falls back to token URLs when the original src fetch fails', async () => {
    const calls = [];

    global.fetch = src => {
      calls.push(src);

      if (src === 'https://example.com/broken-image.png') {
        return Promise.reject(new Error('broken'));
      }

      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve({ id: 'fallback-image' })
      });
    };

    global.FileReader = class MockFileReader {
      readAsDataURL(blob) {
        this.result = `data:mock/${blob.id}`;
        this.onloadend();
      }
    };

    const node = {
      data: {
        src: 'https://example.com/broken-image.png',
        token: 'token-123'
      }
    };

    const result = await resolveImageSource(node, '/custom-attachment');

    assert.equal(result, 'data:mock/fallback-image');
    assert.deepEqual(calls, [
      'https://example.com/broken-image.png',
      '/custom-attachment/token-123'
    ]);
  });

  it('updates node dimensions after the image loads', async () => {
    global.Image = class MockImage {
      constructor() {
        this.naturalWidth = 1200;
        this.naturalHeight = 600;
      }

      set src(value) {
        this._src = value;
        setTimeout(() => this.onload(), 0);
      }

      get src() {
        return this._src;
      }
    };

    const node = {
      data: {
        src: 'data:image/png;base64,abc123',
        renderError: true,
        renderErrorMessage: 'old error'
      }
    };

    const result = await updateImageDimensions(node, '/custom-attachment');

    assert.strictEqual(result, node);
    assert.equal(node.data.width, 600);
    assert.equal(node.data.height, 300);
    assert.equal(node.data.renderError, undefined);
    assert.equal(node.data.renderErrorMessage, undefined);
  });

  it('marks the node with a placeholder when image loading fails', async () => {
    global.Image = class MockImage {
      set src(value) {
        this._src = value;
        setTimeout(() => this.onerror(new Error('bad image')), 0);
      }

      get src() {
        return this._src;
      }
    };

    const node = {
      data: {
        src: 'data:image/png;base64,abc123'
      }
    };

    const result = await updateImageDimensions(node, '/custom-attachment');

    assert.strictEqual(result, node);
    assert.equal(node.data.renderError, true);
    assert.equal(node.data.renderErrorMessage, '[Image unavailable in export]');
  });
});
const mapUploadError = require('../../../lib/map-upload-error');

describe('mapUploadError', () => {
  test('maps recognised attachment validation errors to the upload field', () => {
    const error = {
      response: {
        status: 400,
        data: {
          error: 'malwareDetected'
        }
      }
    };

    expect(mapUploadError(error)).toEqual({
      validation: {
        upload: 'malwareDetected'
      }
    });
  });

  test('returns the original error for unrecognised responses', () => {
    const error = {
      response: {
        status: 500,
        data: {
          error: 'boom'
        }
      }
    };

    expect(mapUploadError(error)).toBe(error);
  });
});

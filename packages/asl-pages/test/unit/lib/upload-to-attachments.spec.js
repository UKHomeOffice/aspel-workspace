jest.mock('axios', () => ({
  default: {
    post: jest.fn()
  }
}));

const { default: axios } = require('axios');
const uploadToAttachments = require('../../../lib/upload-to-attachments');

describe('uploadToAttachments', () => {
  const file = {
    buffer: Buffer.from('test file'),
    originalname: 'evidence.pdf'
  };

  beforeEach(() => {
    axios.post.mockReset();
  });

  test('posts the file to the attachments service and returns the response data', async () => {
    axios.post.mockResolvedValue({ data: { token: 'abc123' } });

    const result = await uploadToAttachments('http://attachments', file);

    expect(result).toEqual({ token: 'abc123' });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0][0]).toBe('http://attachments');
    expect(axios.post.mock.calls[0][2]).toEqual({
      headers: expect.any(Object)
    });
  });

  test('maps recognised upload validation failures before rethrowing', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error: 'malwareDetected'
        }
      }
    });

    await expect(uploadToAttachments('http://attachments', file)).rejects.toEqual({
      validation: {
        upload: 'malwareDetected'
      }
    });
  });
});

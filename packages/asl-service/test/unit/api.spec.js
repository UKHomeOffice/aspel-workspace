import Api from '../../api';

describe('api', () => {

  test('can initialise without error', () => {
    expect(() => Api({})).not.toThrow();
  });

});

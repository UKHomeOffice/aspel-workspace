import assert from 'assert';
import cleanProtocols from '../../../client/helpers/clean-protocols';

describe('clean-protocols', () => {

  it('removes unused establishments from protocols', () => {
    const state = {
      title: 'Test project',
      objectives: [],
      protocols: [
        {
          locations: [
            'University of Cheese',
            'University of Croydon',
            'University of Life'
          ],
          objectives: []
        }
      ]
    };
    const changed = {
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    };
    const establishment = {
      name: 'University of Croydon'
    };
    assert.deepEqual(cleanProtocols({ state, changed, establishment }), {
      title: 'Test project',
      objectives: [],
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ],
      protocols: [
        {
          locations: [
            'University of Croydon'
          ],
          objectives: []
        }
      ]
    });
  });

  it('removes all additional establishments from protocols when additional establishment use is disabled', () => {
    const state = {
      title: 'Test project',
      objectives: [],
      protocols: [
        {
          locations: [
            'University of Cheese',
            'University of Croydon',
            'University of Life',
            'POLE'
          ],
          objectives: []
        }
      ],
      establishments: [
        {name: 'University of Cheese'},
        {name: 'University of Life'},
      ],
      'other-establishments': false,
      poles: true,
      polesList: [{ title: 'POLE'}]
    };
    const changed = {
      'other-establishments': false,
    };
    const establishment = {
      name: 'University of Croydon'
    };

    const expected = {
      ...state,
      protocols: [
        {
          ...state.protocols[0],
          locations: [
            'University of Croydon',
            'POLE'
          ]
        }
      ]
    };

    assert.deepEqual(
      cleanProtocols({ state, changed, establishment }),
      expected
    );
  });

  it('does not throw an error if project has no objectives', () => {
    const state = {
      title: 'Test project',
      protocols: []
    };
    const changed = {
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    };
    const establishment = {
      name: 'University of Cheese'
    };
    assert.deepEqual(cleanProtocols({ state, changed, establishment }), {
      title: 'Test project',
      protocols: [],
      establishments: [
        { 'establishment-name': 'University of Croydon' }
      ]
    });
  });

  it('removes species from protocols when they are removed from the project', () => {
    const savedState = {
      title: 'Test project',
      species: ['mice', 'rats'],
      protocols: [
        {
          species: ['mice', 'rats']
        }
      ]
    };
    const state = {
      title: 'Test project',
      species: ['mice'],
      protocols: [
        {
          species: ['mice', 'rats']
        }
      ]
    };
    const changed = {
      species: ['mice']
    };
    const establishment = {
      name: 'University of Cheese'
    };
    assert.deepEqual(cleanProtocols({ state, savedState, changed, establishment }), {
      title: 'Test project',
      species: ['mice'],
      protocols: [
        {
          species: ['mice']
        }
      ]
    });
  });

});

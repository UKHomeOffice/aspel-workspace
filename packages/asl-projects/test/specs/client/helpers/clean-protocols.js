import assert from 'assert';
import cleanProtocols, { cleanProtocolSteps } from '../../../../client/helpers/clean-protocols';

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

describe('cleanProtocolSteps', () => {

  it('removes empty steps from protocols', () => {
    const protocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' },
          { id: 'step-2', title: '   ', reference: '' },
          { id: 'step-3', reference: 'Step 3' }
        ]
      }
    ];

    const result = cleanProtocolSteps(protocols);

    assert.equal(result[0].steps.length, 2);
    assert.deepEqual(result[0].steps, [
      { id: 'step-1', reference: 'Step 1' },
      { id: 'step-3', reference: 'Step 3' }
    ]);
  });

  it('keeps deleted steps that existed in previous protocols', () => {
    const protocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' },
          { id: 'step-2', reference: 'Step 2', deleted: true }
        ]
      }
    ];

    const previousProtocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' },
          { id: 'step-2', reference: 'Step 2' }
        ]
      }
    ];

    const result = cleanProtocolSteps(protocols, previousProtocols);

    assert.equal(result[0].steps.length, 2);
    assert.equal(result[0].steps[1].deleted, true);
  });

  it('removes newly deleted empty steps', () => {
    const protocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' },
          { id: 'step-new', deleted: true, title: '   ' }
        ]
      }
    ];

    const previousProtocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' }
        ]
      }
    ];

    const result = cleanProtocolSteps(protocols, previousProtocols);

    assert.equal(result[0].steps.length, 1);
    assert.deepEqual(result[0].steps, [
      { id: 'step-1', reference: 'Step 1' }
    ]);
  });

  it('does not modify protocols with no empty steps', () => {
    const protocols = [
      {
        id: 'protocol-1',
        steps: [
          { id: 'step-1', reference: 'Step 1' },
          { id: 'step-2', reference: 'Step 2' }
        ]
      }
    ];

    const result = cleanProtocolSteps(protocols);

    assert.strictEqual(result[0], protocols[0]);
  });

  it('handles protocols with no steps', () => {
    const protocols = [
      {
        id: 'protocol-1'
      }
    ];

    const result = cleanProtocolSteps(protocols);

    assert.strictEqual(result[0], protocols[0]);
  });

  it('integrates with cleanProtocols to remove empty steps', () => {
    const state = {
      title: 'Test project',
      objectives: [],
      protocols: [
        {
          id: 'protocol-1',
          locations: ['University of Croydon'],
          objectives: [],
          steps: [
            { id: 'step-1', reference: 'Step 1', title: JSON.stringify({document: {text: 'Test'}}) },
            { id: 'step-2', title: '   ', reference: '' }
          ]
        }
      ]
    };

    const savedState = {
      title: 'Test project',
      objectives: [],
      protocols: [
        {
          id: 'protocol-1',
          locations: ['University of Croydon'],
          objectives: [],
          steps: [
            { id: 'step-1', reference: 'Step 1', title: JSON.stringify({document: {text: 'Test'}}) }
          ]
        }
      ]
    };

    const changed = {
      objectives: []
    };

    const establishment = {
      name: 'University of Croydon'
    };

    const result = cleanProtocols({ state, savedState, changed, establishment });

    assert.equal(result.protocols[0].steps.length, 1);
    assert.equal(result.protocols[0].steps[0].id, 'step-1');
  });

});

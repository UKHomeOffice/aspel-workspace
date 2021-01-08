const uuid = require('uuid/v4');
const toRichText = require('../tables/utils/to-rich-text');

module.exports = [
  {
    id: '5760be36-6234-43e2-a0fe-f2cb244ba30a',
    'projectId': '519eb1d6-e8f0-4d9c-8628-8da4394c2d2e',
    'data': {
      'title': 'Active project',
      'keywords': ['Voila', 'Une', 'Baguette'],
      'training-licence': false,
      'permissible-purpose': ['basic-research'],
      'translational-research': ['translational-research-1'],
      'project-aim': toRichText('Lorem ipsum dolor', 'Sit amet'),
      objectives: [
        { id: uuid(), title: 'First objective' },
        { id: uuid(), title: 'Second objective' }
      ],
      'objective-relation': toRichText(
        'Some reasoning about how the objectives relate',
        'Additional text content in a scond paragraph'
      ),
      'objectives-alternatives': toRichText(
        'Some description about alternatives',
        'Additional text content in a scond paragraph'
      ),
      protocols: [
        {
          id: uuid(),
          title: 'First protocol title',
          description: toRichText('Description of the first protocol.'),
          severity: 'mild',
          locations: ['University of Croydon'],
          objectives: ['First objective', 'Second objective'],
          gaas: false,
          steps: [
            {
              id: uuid(),
              optional: true,
              adverse: false,
              title: toRichText('Description of step one', 'Additional content about this step')
            },
            {
              id: uuid(),
              optional: false,
              adverse: false,
              title: toRichText('Description of step two', 'Additional content about this step')
            },
            {
              id: uuid(),
              optional: false,
              adverse: false,
              title: toRichText('Description of step three', 'Additional content about this step')
            }
          ],
          'experience-summary': toRichText('Summary of the typical animal experience'),
          'experience-endpoints': toRichText('Humane endpoints applied to the animals'),
          outputs: toRichText('The outputs expected from this protocol'),
          'quantitative-data': false
        }
      ],
      'conditions': [
        {
          'key': 'non-purpose-bred-sched-2',
          'path': 'non-purpose-bred-sched-2.versions.0',
          'type': 'condition',
          'autoAdded': true
        },
        {
          'key': 'code-of-practice',
          'path': 'code-of-practice.versions.0',
          'type': 'authorisation',
          'autoAdded': true
        }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '84ec643f-893b-4232-ab4c-5789d50773de',
    'data': {
      'title': 'Legacy project',
      'primary-establishment': 'University of Croydon',
      'protocols': [
        {
          'id': '8a647535-4165-4528-b841-a6324a509e17',
          'steps': null
        }
      ],
      'conditions': [
        {
          'key': 'custom',
          'edited': 'This is a legacy custom condition'
        }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '1cbbb865-f5e7-4314-a35d-e8adcf19a811',
    'data': {
      'title': 'Legacy change licence holder',
      'experience-knowledge': toRichText('Experience content before')
    },
    'status': 'granted'
  },
  {
    'projectId': 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031',
    'data': {
      'title': 'Basic user project',
      'permissible-purpose': ['basic-research'],
      'protocols': [
        {
          'id': 'cd64135f-2770-4bdb-8858-bfefb16f3d8d',
          'steps': [
            {
              'id': '7a2a0d9f-2a63-40bc-be16-d06deb41a7aa'
            }
          ],
          'complete': true,
          'speciesDetails': []
        }
      ],
      'objectives': [
        {
          'id': '4d5dd800-de78-43de-b619-2ac050f49cdf'
        }
      ],
      'keywords': [
        'fishmonger',
        'elephant',
        'happiness'
      ],
      'id': 'dbc6845f-82b6-4ffe-9d93-12b8fff74029'
    },
    'status': 'granted',
    'createdAt': '2019-10-14',
    'updatedAt': '2019-10-14'
  },
  {
    'projectId': '9ad36797-7bb4-4f4f-96c1-a8162c5eec44',
    'data': {
      'title': 'Download test project',
      'project-aim': toRichText('This is a project used for testing file downloads. DO NOT USE IT FOR AMENDMENTS!'),
      'permissible-purpose': ['basic-research'],
      'protocols': [
        {
          'id': '119b4a7e-ee08-4437-9328-283a8fe1a190',
          'steps': [
            {
              'id': '43bb032e-1cde-43f7-93a9-cd137e2ce990'
            }
          ],
          'complete': true,
          'speciesDetails': []
        }
      ],
      'objectives': [
        {
          'id': 'ee39ef5f-7fbb-4f2d-bda6-85151069a59a'
        }
      ],
      'keywords': [
        'barbershop',
        'clementine',
        'muffintop'
      ],
      'id': '1689353d-e064-4898-bf56-7d1a4061d6b7'
    },
    'status': 'granted',
    'createdAt': '2020-10-14',
    'updatedAt': '2020-10-14'
  },
  {
    'projectId': 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031',
    'data': {
      'title': 'First basic user project title'
    },
    'status': 'granted',
    'createdAt': '2017-02-05',
    'updatedAt': '2017-02-05'
  },
  {
    'projectId': 'd42196ff-eb93-4b20-8b71-22673901873d',
    'data': {
      'title': 'Project with protocols',
      'protocols': [
        {
          'id': 'fb95dd09-cfe0-4efc-baef-dbecb61ccc8d',
          'steps': [
            {'id': '61395505-2400-444b-a47e-a7a08879b654'}
          ],
          'title': 'New protocol',
          'complete': true,
          'severity': 'mild',
          'conditions': [],
          'description': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Purpose 1","marks":[]}]}]}}',
          'speciesDetails': [],
          'severity-proportion': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"10%","marks":[]}]}]}}'
        },
        {
          'id': 'b9233bf4-e354-4ee7-8143-83ba6b1355eb',
          'steps': [
            {
              'id': 'ffa8233d-00d8-4647-8805-eb12d1490ca8',
              'title': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"A new step","marks":[]}]}]}}',
              'completed': true
            },
            {
              'id': '39a85fda-09f4-4d5a-ab92-dfe8192be7b1',
              'title': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Step 2","marks":[]}]}]}}',
              'completed': true
            }
          ],
          'title': 'New protocol 2',
          'complete': true,
          'severity': 'mild',
          'conditions': [],
          'speciesDetails': [],
          'description': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Some details","marks":[]}]}]}}'
        }
      ],
      'conditions': [
        {
          'key': 'non-purpose-bred-sched-2',
          'path': 'non-purpose-bred-sched-2.versions.0',
          'type': 'condition',
          'autoAdded': true
        },
        {
          'key': 'code-of-practice',
          'path': 'code-of-practice.versions.0',
          'type': 'authorisation',
          'autoAdded': true
        }
      ],
      'objectives': [
        {'id': 'f9d2ff55-bedb-4f9c-b39c-4dd850b4f737'}
      ],
      'purpose-bred': false,
      'wild-animals': false,
      'feral-animals': false,
      'nmbas-complete': true,
      'poles-complete': true,
      'funding-complete': true,
      'benefits-complete': true,
      'strategy-complete': true,
      'transfer-expiring': false,
      'clinical-condition': false,
      'endangered-animals': false,
      'protocols-complete': true,
      'reduction-complete': true,
      'experience-complete': true,
      'experience-projects': true,
      'nts-review-complete': true,
      'refinement-complete': true,
      'action-plan-complete': true,
      'commercial-slaughter': false,
      'other-establishments': false,
      'replacement-complete': true,
      'introduction-complete': true,
      'feral-animals-complete': true,
      'project-harms-complete': true,
      'establishments-complete': true,
      'fate-of-animals-complete': true,
      'experimental-design-sexes': false,
      'endangered-animals-complete': true,
      'general-principles-complete': true,
      'experimental-design-complete': true,
      'commercial-slaughter-complete': true,
      'experimental-design-repeating': false,
      'purpose-bred-animals-complete': true,
      'establishments-care-conditions': false,
      'scientific-background-complete': true,
      'animals-containing-human-material': false,
      'containing-human-material-complete': true,
      'animals-taken-from-the-wild-complete': true,
      'establishments-care-conditions-justification': null
    },
    'status': 'granted'
  },
  {
    'projectId': '7d867c46-5e17-4f7f-8718-4f99160582d3',
    'data': {
      'title': 'Draft with withdrawn'
    }
  },
  {
    'projectId': '7d867c46-5e17-4f7f-8718-4f99160582d3',
    'data': {
      'title': 'Draft with withdrawn'
    },
    'status': 'withdrawn'
  },
  {
    'projectId': '77af45c8-761e-49f6-b6fb-e105f0e67185',
    'data': {
      'title': 'Additional availability to be added draft'
    }
  },
  {
    'projectId': '5cb97819-3e21-4ea5-85f0-32df2b06213b',
    'data': {
      'title': 'Additional availability to be added'
    },
    'status': 'granted'
  },
  {
    id: '2b80b02a-3ee1-408a-b86d-6417a1ac5483',
    'projectId': '5cb97819-3e21-4ea5-85f0-32df2b06213c',
    'data': {
      'title': 'Additional availability active'
    },
    'status': 'granted'
  },
  {
    'projectId': '163c30f5-d6f9-4b34-9c63-21f21e7948ba',
    'status': 'granted',
    'data': {
      'title': 'Additional availability old style',
      'other-establishments': true,
      'transfer-of-animals-complete': true,
      'establishments': [
        {
          'id': 'c57600db-6d2e-443b-bec9-c21f070861ce',
          'establishment-name': 'Marv Pharm'
        },
        {
          'id': '79be38a4-c797-4b96-a6a5-f2bcaeaaf056',
          'establishment-name': 'Mini Pharm'
        }
      ]
    }
  },
  {
    'projectId': '38008c26-8748-45f8-b0a5-18f1bafbae70',
    'data': {
      'title': 'Draft legacy project',
      'protocols': [
        {
          'id': 'd43ebbca-7ea7-40a2-9c06-d18608a13759',
          'steps': null
        }
      ]
    }
  },
  {
    'id': 'b603d058-267a-4f7b-8356-389271076c06',
    projectId: '6b9b7471-396e-47fe-a98f-da0c76e0a26a',
    data: {
      title: 'Amend in prog project 2',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText(
                'Step content after amendment',
                'with another paragraph',
                'and a changed paragraph'
              )
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:36.146Z'
  },
  {
    projectId: '6b9b7471-396e-47fe-a98f-da0c76e0a26a',
    data: {
      title: 'Amend in prog project',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText(
                'Step content before amendment',
                'with another paragraph',
                'and another paragraph'
              )
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'granted',
    createdAt: '2019-09-18T11:39:17.292Z'
  },
  {
    id: '74ddb097-a988-4955-920b-a439e580041a',
    projectId: 'e022533a-bc01-438a-815b-6cbf6ec1f31c',
    data: {
      title: 'Draft Application',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          title: 'A protocol',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText('Second submission')
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:36.146Z'
  },
  {
    projectId: 'e022533a-bc01-438a-815b-6cbf6ec1f31c',
    data: {
      title: 'Draft Application',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          title: 'A protocol',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText('Initial submission')
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:17.292Z'
  },
  {
    'projectId': '6b9b7471-396e-47fe-a98f-da0c76e0a26b',
    'data': {
      'title': 'Project with legacy list',
      'project-aim': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"bulleted-list","nodes":[{"object":"block","type":"list-item","nodes":[{"object":"text","text":"List item 1","marks":[]}],"data":{}},{"object":"block","type":"list-item","nodes":[{"object":"text","text":"List item 2","marks":[]}],"data":{}}],"data":{}}]}}'
    },
    'status': 'granted'
  },
  {
    'projectId': '739fbe40-cfb9-431d-80c2-ac3d5beee2b2',
    'status': 'granted',
    'data': {
      'title': 'Active project wrong issue date',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'projectId': '6b9b7471-396e-47fe-a98f-da0c76e0a26d',
    'data': {
      'title': 'Submitted draft'
    },
    'status': 'submitted'
  },
  {
    'projectId': 'b8973df0-408c-4f3c-a7f2-b5b8f8c2943b',
    'status': 'granted',
    'data': {
      'title': 'RA true',
      'retrospectiveAssessment': true
    }
  },
  {
    'projectId': '6b97eee3-0d2a-4ffa-8ba5-094b0d67154e',
    'status': 'granted',
    'data': {
      'title': 'RA false',
      'retrospectiveAssessment': false
    }
  },
  {
    'projectId': '0841bc71-f6b5-402d-a8f0-45467213f158',
    'status': 'granted',
    'raCompulsory': true,
    'data': {
      'title': 'RA not editable - species',
      'species': ['cats']
    }
  },
  {
    'projectId': '715a0156-4639-42ee-bd00-35a96e75ca4a',
    'status': 'draft',
    'data': {
      'title': 'Unmigrated Species',
      'species': [ 'zebra-fish', 'mice' ],
      'protocols': [
        {
          'id': 'f1797774-520f-417e-9ed6-18450b273b6c',
          'title': 'Protocol 1',
          'species': [ 'zebra-fish', 'mice' ],
          'speciesDetails': [
            { 'name': 'Mice' },
            { 'name': 'Zebra fish' }
          ]
        }
      ]
    }
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2018-12-31',
    'updatedAt': '2019-01-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-01-31',
    'updatedAt': '2019-02-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-02-28',
    'updatedAt': '2019-03-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-03-31',
    'updatedAt': '2019-04-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-04-30',
    'updatedAt': '2019-05-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': '3b125d04-a0ec-46fe-9954-80a13b3e39f9',
    'status': 'granted',
    'data': {
      'title': 'Transfer basic user project'
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': 'b5554241-083c-4fce-a031-71403fdae509',
    'status': 'draft',
    'data': {
      'title': 'Transfer basic user draft'
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': '04956663-711b-4bda-b201-46d9eeabf9d4',
    'data': {
      'title': 'Project with deleted protocols',
      'species': ['mice', 'rats'],
      'protocols': [
        {
          'id': '43f5e295-277c-4e60-9759-e6c3612d6bfe',
          'steps': [],
          'title': 'First protocol',
          'species': [ 'mice' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': '39415b58-73bc-4040-b7dd-d5bef57de5f2',
              'name': 'Mice',
              'reuse': false,
              'value': 'mice',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ]
        },
        {
          'id': '997659c6-6789-49db-a5cd-1cfcb6856406',
          'steps': [],
          'title': 'Deleted protocol',
          'species': [ 'rats' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': 'f4252ce0-10b0-49d8-ab7c-4548d65c906f',
              'name': 'Rats',
              'reuse': false,
              'value': 'rats',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ],
          'deleted': true
        }
      ]
    },
    'status': 'draft',
    'createdAt': '2020-06-30',
    'updatedAt': '2019-06-30'
  },
  {
    'projectId': '04956663-711b-4bda-b201-46d9eeabf9d4',
    'data': {
      'title': 'Project with deleted protocols',
      'species': ['mice', 'rats'],
      'protocols': [
        {
          'id': '43f5e295-277c-4e60-9759-e6c3612d6bfe',
          'steps': [],
          'title': 'First protocol',
          'species': [ 'mice' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': '39415b58-73bc-4040-b7dd-d5bef57de5f2',
              'name': 'Mice',
              'reuse': false,
              'value': 'mice',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ]
        },
        {
          'id': '997659c6-6789-49db-a5cd-1cfcb6856406',
          'steps': [],
          'title': 'Deleted protocol',
          'species': [ 'rats' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': 'f4252ce0-10b0-49d8-ab7c-4548d65c906f',
              'name': 'Rats',
              'reuse': false,
              'value': 'rats',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ],
          'deleted': true
        }
      ]
    },
    'status': 'submitted',
    'createdAt': '2020-06-29',
    'updatedAt': '2019-06-29'
  },
  {
    'projectId': '609e57a1-3436-4163-a7d2-97c7ce465364',
    'status': 'granted',
    'data': {
      'title': 'ASRU amendment in progress: draft',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'createdAt': '2020-04-29',
    'updatedAt': '2020-04-29'
  },
  {
    'projectId': '609e57a1-3436-4163-a7d2-97c7ce465364',
    'status': 'draft',
    'data': {
      'title': 'ASRU amendment in progress: draft',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'asruVersion': true,
    'createdAt': '2020-04-30',
    'updatedAt': '2020-04-30'
  },
  {
    'projectId': 'd584ca49-5f44-41f8-902b-5aa7e9334969',
    'status': 'granted',
    'data': {
      'title': 'ASRU amendment in progress: submitted',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'createdAt': '2020-04-29',
    'updatedAt': '2020-04-29'
  },
  {
    'projectId': 'd584ca49-5f44-41f8-902b-5aa7e9334969',
    'status': 'submitted',
    'data': {
      'title': 'ASRU amendment in progress: submitted',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'asruVersion': true,
    'createdAt': '2020-04-30',
    'updatedAt': '2020-04-30'
  },
  {
    'projectId': '2de9d19a-6858-467d-a4fb-a1a3e31c3435',
    'status': 'granted',
    'data': {
      'title': 'Continuation ids migration',
      'transfer-expiring': true,
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': '70/1234',
          'expiry-date': '2020-08-01'
        }
      ]
    }
  },
  {
    'projectId': '5e703f3c-9af7-4344-add5-a542fbb6f3bd',
    'status': 'granted',
    'data': {
      'title': 'Continuation migrated',
      'transfer-expiring': true,
      'expiring-yes': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"This was the input - licence number P12345678, expiring 1st July 2020","marks":[]}]}]}}',
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        }
      ]
    }
  },
  {
    'projectId': '23e96d12-74d5-4ccb-ba3f-ec16829d4b6d',
    'status': 'granted',
    'data': {
      'title': 'Training licence',
      'training-licence': true
    },
    'raCompulsory': true
  },
  {
    'projectId': '423dc041-8293-4531-9652-3ca03f3e5fbb',
    'status': 'granted',
    'data': {
      'title': 'Testing establishment merge basic ppl',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'projectId': '4eed2b09-2b21-45a9-be54-3b2736d6f287',
    'status': 'granted',
    'data': {
      'title': 'Testing establishment merge admin ppl',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'id': '6c3dd9de-8e65-46ff-8840-913b7c7943c9',
    'projectId': '3c7990f7-8e6b-4fa1-8ba5-34ede489b22a',
    'status': 'draft',
    'data': {
      'title': 'Testing deadline extension'
    },
    'createdAt': '2020-09-01',
    'updatedAt': '2020-09-01'
  },
  {
    'id': 'b44cc7fc-5dfb-4900-9be0-c0e475d2ddc5',
    'projectId': '9d83dcac-a544-4cf8-90c8-b9915ab16f80',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline extension (old style)'
    },
    'createdAt': '2020-09-01',
    'updatedAt': '2020-09-01'
  },
  {
    'id': 'cada2e28-d678-49c1-afac-11acaf325f6d',
    'projectId': '52949a8f-879c-45bd-b6a4-cbc01c746da0',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline extension (old style)'
    },
    'createdAt': '2020-06-01',
    'updatedAt': '2020-06-01'
  },
  {
    'id': '32814630-4b9b-42df-9963-329df1b4a0d1',
    'projectId': 'd661f113-9594-4374-b461-b75d1b6a02db',
    'status': 'granted',
    'data': {
      'title': 'Unsubmitted amendment'
    },
    'createdAt': '2021-01-08 12:00:00',
    'updatedAt': '2021-01-08 12:00:00'
  },
  {
    'id': '878cf7d7-a6fc-48a0-b1d6-dc61147724c8',
    'projectId': 'd661f113-9594-4374-b461-b75d1b6a02db',
    'status': 'draft',
    'data': {
      'title': 'Unsubmitted amendment'
    },
    'createdAt': '2021-01-08 13:00:00',
    'updatedAt': '2021-01-08 13:00:00'
  },
  {
    'id': '9d85a472-942f-48eb-9e13-34e41fcf879f',
    'projectId': '78508e8c-26e9-4960-88cd-2761eb1afd57',
    'status': 'granted',
    'data': {
      'title': 'Unsubmitted ASRU amendment'
    },
    'createdAt': '2021-01-08 12:00:00',
    'updatedAt': '2021-01-08 12:00:00'
  },
  {
    'id': '701de6c8-1ac0-4258-afeb-fca7077b12e3',
    'projectId': '78508e8c-26e9-4960-88cd-2761eb1afd57',
    'status': 'draft',
    'data': {
      'title': 'Unsubmitted ASRU amendment'
    },
    'asruVersion': true,
    'createdAt': '2021-01-08 13:00:00',
    'updatedAt': '2021-01-08 13:00:00'
  }
];

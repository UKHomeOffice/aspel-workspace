import { deepRemoveEmpty, getAdditionalEstablishments } from '../../../../../pages/project-version/helpers/project';

describe('Project Helper', () => {

  describe('getAdditionalEstablishments', () => {

    const ACTIVE_PROJECT_ESTABLISHMENT = {
      id: 8201,
      name: 'Active Establishment',
      status: 'active',
      versionId: null,
      issueDate: '2023-01-19T16:25:12.715Z',
      revokedDate: null,
      suspendedDate: null
    };

    const REMOVED_PROJECT_ESTABLISHMENT = {
      id: 8202,
      name: 'Revoked Project Establishment',
      status: 'removed',
      versionId: null,
      issueDate: '2021-01-19T16:25:12.715Z',
      revokedDate: '2022-01-19T16:25:12.715Z',
      suspendedDate: null
    };

    const PROJECT_ESTABLISHMENT_TO_DELETE = {
      id: 8203,
      name: 'Active Establishment',
      status: 'active',
      versionId: null,
      issueDate: '2023-01-19T16:25:12.715Z',
      revokedDate: null,
      suspendedDate: null
    };

    const PROPOSED_DELETE_ESTABLISHMENT = {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Marvell Pharmaceutical',
      deleted: true,
      'establishment-id': 8203
    };

    const PROPOSED_ESTABLISHMENT = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Proposed Establishment',
      'establishment-id': 8204
    };

    it('returns additional establishments', () => {
      const version = {
        data: {
          'other-establishments': true,
          establishments: [
            PROPOSED_DELETE_ESTABLISHMENT,
            PROPOSED_ESTABLISHMENT
          ]
        }
      };

      const project = {
        additionalEstablishments: [
          ACTIVE_PROJECT_ESTABLISHMENT,
          REMOVED_PROJECT_ESTABLISHMENT,
          PROJECT_ESTABLISHMENT_TO_DELETE
        ]
      };

      const result = getAdditionalEstablishments(project, version);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({id: 8201, name: 'Active Establishment'}),
          expect.objectContaining({'establishment-id': 8204, name: 'Proposed Establishment'})
        ])
      );
    });

    it('doesn\'t include additional establishments from the version if other-establishements is false', () => {
      const version = {
        data: {
          'other-establishments': false,
          establishments: [
            PROPOSED_ESTABLISHMENT
          ]
        }
      };

      const project = {
        additionalEstablishments: [
          ACTIVE_PROJECT_ESTABLISHMENT
        ]
      };

      const result = getAdditionalEstablishments(project, version);

      expect(result).toHaveLength(1);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({id: 8201, name: 'Active Establishment'})
        ])
      );
    });

    it('includes additional establishments from the version if other-establishements is true', () => {
      const version = {
        data: {
          'other-establishments': true,
          establishments: [
            PROPOSED_ESTABLISHMENT
          ]
        }
      };

      const project = {
        additionalEstablishments: [
          ACTIVE_PROJECT_ESTABLISHMENT
        ]
      };

      const result = getAdditionalEstablishments(project, version);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({id: 8201, name: 'Active Establishment'}),
          expect.objectContaining({'establishment-id': 8204, name: 'Proposed Establishment'})
        ])
      );
    });
  });

  describe('deepRemoveEmpty', () => {
    describe('removes all empty values', () => {
      const examples = [
        { example: [], expected: [] },
        { example: {}, expected: {} },
        { example: '', expected: undefined },
        { example: null, expected: undefined },
        { example: undefined, expected: undefined },
        { example: false, expected: undefined },
        {
          example: [
            '',
            null,
            undefined,
            [],
            {},
            [{}, [], ''],
            false
          ],
          expected: []
        },
        {
          example: {
            array: [],
            object: { },
            null: null,
            undefined: undefined,
            emptyString: '',
            nested: [{}, [], ''],
            boolean: false
          },
          expected: {}
        }
      ];

      examples.forEach(({ example, expected }) => {
        it(JSON.stringify(example), () => {
          expect(deepRemoveEmpty(example)).toEqual(expected);
        });
      });
    });

    it('Doesn\'t remove other values', () => {
      const symbol = Symbol('');

      const example = {
        array: [1, []],
        object: { two: 2, null: null },
        string: 'non empty',
        number: 1,
        zero: 0,
        true: true,
        symbol,
        nested: [{}, [[], 'deep'], '']
      };

      const expected = {
        array: [1],
        object: {two: 2},
        string: 'non empty',
        number: 1,
        zero: 0,
        true: true,
        symbol,
        nested: [['deep']]
      };

      expect(deepRemoveEmpty(example)).toEqual(expected);
    });
  });
});

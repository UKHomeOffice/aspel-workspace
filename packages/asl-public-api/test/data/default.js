module.exports = models => {

  const { Establishment, Profile } = models;

  return Promise.resolve()
    .then(() => {
      return Profile.query().insertGraph([
        {
          id: 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9',
          userId: 'abc123',
          title: 'Dr',
          firstName: 'Linford',
          lastName: 'Christie',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'test1@example.com',
          telephone: '01234567890',
          pil: {
            status: 'active',
            issueDate: '2017-01-01',
            revocationDate: null,
            licenceNumber: 'ABC123',
            conditions: 'Conditions'
          }
        },
        {
          id: 'b2b8315b-82c0-4b2d-bc13-eb13e605ee88',
          title: 'Dr',
          firstName: 'Noddy',
          lastName: 'Holder',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'test2@example.com',
          telephone: '01234567890'
        },
        {
          id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d9',
          title: 'Dr',
          firstName: 'Clive',
          lastName: 'Nacwo',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'test3@example.com',
          telephone: '01234567890'
        },
        {
          id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d0',
          title: 'Dr',
          firstName: 'Noddy',
          lastName: 'Nacwo',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'test4@example.com',
          telephone: '01234567890'
        },
        {
          id: 'ae28fb31-d867-4371-9b4f-79019e71232f',
          title: 'Professor',
          firstName: 'Colin',
          lastName: 'Jackson',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'test5@example.com',
          telephone: '01234567890'
        },
        {
          id: 'ae28fb31-d867-4371-9b4f-79019e71232e',
          title: 'Mr',
          firstName: 'Vincent',
          lastName: 'Malloy',
          address: '1 Some Road',
          postcode: 'A1 1AA',
          email: 'vincent@malloy.com',
          telephone: '01234567890'
        }
      ])
        .then(() => {
          return Establishment.query().insertGraph([{
            id: 100,
            name: 'University of Croydon',
            country: 'england',
            address: '100 High Street',
            email: 'test@example.com',
            places: [
              {
                id: '1d6c5bb4-be60-40fd-97a8-b29ffaa2135f',
                site: 'Lunar House',
                name: 'Room 101',
                suitability: JSON.stringify(['SA', 'LA']),
                holding: JSON.stringify(['LTH'])
              },
              {
                id: '2f404b2f-656f-4cc3-b432-5aadad052fc8',
                site: 'Lunar House',
                name: 'Room 102',
                suitability: JSON.stringify(['SA']),
                holding: JSON.stringify(['STH'])
              },
              {
                id: 'a50331bb-c1d0-4068-87ca-b5a41143b0d0',
                site: 'Lunar House',
                name: 'Deleted room',
                suitability: JSON.stringify(['SA']),
                holding: JSON.stringify(['STH']),
                deleted: '2018-01-01'
              }
            ],
            projects: [
              {
                title: 'Test project 1',
                licenceHolderId: 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9',
                expiryDate: '2040-01-01T12:00:00Z',
                licenceNumber: 'abc123'
              },
              {
                title: 'Test project 3',
                licenceHolderId: 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9',
                expiryDate: '2010-01-01T12:00:00Z',
                licenceNumber: 'abc456'
              }
            ]
          },
          {
            id: 101,
            name: 'Marvell Pharmaceuticals',
            country: 'england',
            address: '101 High Street',
            email: 'test@example.com',
            places: [
              {
                id: 'e859d43a-e8ab-4ae6-844a-95c978082a48',
                site: 'Apollo House',
                name: 'Room 101',
                suitability: JSON.stringify(['SA']),
                holding: JSON.stringify(['LTH'])
              },
              {
                id: '4c9f9921-92ad-465c-8f94-06f05fcb7736',
                site: 'Apollo House',
                name: 'Room 102',
                suitability: JSON.stringify(['SA']),
                holding: JSON.stringify(['STH'])
              }
            ],
            projects: [
              {
                title: 'Test project 2',
                licenceHolderId: 'ae28fb31-d867-4371-9b4f-79019e71232e',
                expiryDate: '2040-01-01T12:00:00Z',
                licenceNumber: 'abc789'
              }
            ]
          }]);
        })
        .then(() => {
          return Establishment.query().upsertGraph([{
            id: 100,
            profiles: [
              { id: 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9' },
              { id: 'b2b8315b-82c0-4b2d-bc13-eb13e605ee88' },
              { id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d9' },
              { id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d0' },
              { id: 'ae28fb31-d867-4371-9b4f-79019e71232f' }
            ],
            roles: [
              {
                type: 'pelh',
                profileId: 'ae28fb31-d867-4371-9b4f-79019e71232f'
              },
              {
                type: 'nacwo',
                profileId: 'a942ffc7-e7ca-4d76-a001-0b5048a057d9'
              },
              {
                type: 'nacwo',
                profileId: 'a942ffc7-e7ca-4d76-a001-0b5048a057d0'
              }
            ]
          },
          {
            id: 101,
            profiles: [
              { id: 'ae28fb31-d867-4371-9b4f-79019e71232f' },
              { id: 'ae28fb31-d867-4371-9b4f-79019e71232e' }
            ],
            roles: [
              {
                type: 'pelh',
                profileId: 'ae28fb31-d867-4371-9b4f-79019e71232f'
              }
            ]
          }], { relate: true });
        });
    });
};

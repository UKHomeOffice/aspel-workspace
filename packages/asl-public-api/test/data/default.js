module.exports = models => {

  const { Establishment, Place, Profile, PIL } = models;

  return Promise.resolve()
    .then(() => {
      return Establishment.create({
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
            suitability: ['SA'],
            holding: ['LTH']
          },
          {
            id: '2f404b2f-656f-4cc3-b432-5aadad052fc8',
            site: 'Lunar House',
            name: 'Room 102',
            suitability: ['SA'],
            holding: ['STH']
          }
        ],
        profiles: [
          {
            title: 'Dr',
            firstName: 'Linford',
            lastName: 'Christie',
            address: '1 Some Road',
            postcode: 'A1 1AA',
            email: 'test@example.com',
            telephone: '01234567890',
            pil: {
              status: 'active',
              issueDate: '2017-01-01',
              revocationDate: null,
              licenceNumber: 'ABC123',
              conditions: 'Conditions'
            }
          }
        ]
      }, {
        include: [
          Place,
          {
            model: Profile,
            as: 'profiles',
            include: {
              model: PIL,
              as: 'pil'
            }
          }
        ]
      })
        .then(establishment => {
          return establishment.createRole({
            type: 'pelh',
            profile: {
              title: 'Dr',
              firstName: 'Noddy',
              lastName: 'Holder',
              address: '1 Some Road',
              postcode: 'A1 1AA',
              email: 'test@example.com',
              telephone: '01234567890'
            }
          }, { include: Profile });
        });
    })
    .then(() => {
      return Establishment.create({
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
            suitability: ['SA'],
            holding: ['LTH']
          },
          {
            id: '4c9f9921-92ad-465c-8f94-06f05fcb7736',
            site: 'Apollo House',
            name: 'Room 102',
            suitability: ['SA'],
            holding: ['STH']
          }
        ],
        profiles: [
          {
            title: 'Professor',
            firstName: 'Colin',
            lastName: 'Jackson',
            address: '1 Some Road',
            postcode: 'A1 1AA',
            email: 'test@example.com',
            telephone: '01234567890'
          }
        ]
      }, {
        include: [
          Place,
          { model: Profile, as: 'profiles' }
        ]
      });
    });

};

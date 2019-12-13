module.exports = {
  id: 'be208b75-d74c-4e1c-b211-c42666e10f55',
  meta: {
    previous: 'endorsed',
    next: 'with-licensing',
    user: {
      id: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
      profile: {
        id: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
        title: 'Mr',
        firstName: 'Basic',
        lastName: 'User',
        email: 'basic.user@example.com',
        name: 'Basic User'
      }
    },
    payload:
    {
      status: 'endorsed',
      meta: { comment: 'Endorsed' },
      changedBy: '0b2d1c52-f8e4-4d16-b58c-0ce80ca58d0c'
    }
  },
  event: 'status:endorsed:with-licensing',
  comment: 'Endorsed',
  status: 'with-licensing',
  data: {
    id: '2169e6ae-db90-45da-b199-98ef3a82e52d',
    data: {
      species: ['Mice', 'Rats'],
      notesCatD: '',
      notesCatF: '',
      profileId: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      procedures: ['A', 'B'],
      establishmentId: 8201
    },
    meta: {},
    model: 'pil',
    action: 'grant',
    subject: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    changedBy: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
    modelData: {
      id: '2169e6ae-db90-45da-b199-98ef3a82e52d',
      status: 'pending',
      deleted: null,
      species: null,
      createdAt: '2019-12-13T16:07:08.396Z',
      issueDate: null,
      notesCatD: null,
      notesCatF: null,
      profileId: '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      updatedAt: '2019-12-13T16:07:08.396Z',
      conditions: null,
      migratedId: null,
      procedures: null,
      licenceNumber: null,
      revocationDate: null,
      establishmentId: 8201
    },
    establishmentId: 8201
  }
};

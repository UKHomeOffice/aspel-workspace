const isUUID = require('uuid-validate');
const { BadRequestError } = require('@asl/service/errors');

module.exports = data => {
  const { id, establishmentId, profileId } = data;

  if (typeof id !== 'string') {
    throw new BadRequestError('id must be a string');
  }

  if (establishmentId && establishmentId !== parseInt(establishmentId, 10)) {
    throw new BadRequestError('establishmentId must be an integer');
  }

  if (profileId && !isUUID(profileId)) {
    throw new BadRequestError('profileId must be a uuid');
  }

  return {
    id,
    establishmentId: parseInt(establishmentId, 10),
    profileId
  };
};

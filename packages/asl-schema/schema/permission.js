const BaseModel = require('./base-model');
const { externalPermissions } = require('@asl/constants');

class Permission extends BaseModel {
  static get tableName() {
    return 'permissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role', 'establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        role: {
          type: 'string',
          enum: externalPermissions
        },
        'created_at': { type: ['string', 'null'] },
        'updated_at': { type: ['string', 'null'] },
        establishmentId: { type: 'string' },
        profileId: { type: 'string' }
      }
    };
  }
}

module.exports = Permission;

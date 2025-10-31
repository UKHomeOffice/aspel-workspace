const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

const projectVersionStatuses = ['draft', 'granted', 'submitted', 'withdrawn'];

class ProjectVersion extends BaseModel {
  static get tableName() {
    return 'projectVersions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        data: { type: ['object', 'null'] },
        projectId: { type: 'string', pattern: uuid.v4 },
        hbaToken: { type: ['string', 'null'] },
        hbaFilename: { type: ['string', 'null'] },
        licenceHolderId: { type: ['string', 'null'], pattern: uuid.v4 },
        status: { type: 'string', enum: projectVersionStatuses },
        asruVersion: { type: 'boolean' },
        raCompulsory: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get(id) {
    return this.query().findById(id).withGraphFetched('project');
  }

  static get relationMappings() {
    return {
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'projectVersions.projectId',
          to: 'projects.id'
        }
      },
      licenceHolder: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'projectVersions.licenceHolderId',
          to: 'profiles.id'
        }
      }
    };
  }

  //  test method - to be removed
  static async getTrainingAcrossVersions(projectId, transaction) {
    const versions = await this.query(transaction)
      .where({ projectId })
      .select('id', 'status', 'data')
      .orderBy('createdAt', 'desc');

    // Return only versions that actually have training entries
    const result = versions
      .filter(v => Array.isArray(v.data?.sections?.training) && v.data.sections.training.length > 0)
      .map(v => ({
        id: v.id,
        status: v.status,
        data: {
          sections: {
            training: v.data.sections.training
          }
        }
      }));

    console.log('Training records across versions:', result.length);
    result.forEach(v => {
      console.log('→', v.id, v.status, v.data.sections.training.length, 'records');
    });

    return result;
  }

}

module.exports = ProjectVersion;

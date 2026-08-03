import BaseModel from './baseModel.js';
import Repository from './repository.js';

export default class Issue extends BaseModel {
    static get tableName() {
        return 'issues';
    }

    // Whenever a model instance is created it is checked against this schema for validation.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['url'],

            properties: {
                url: {type: 'string', format: 'uri'},
                createdAt: {type: 'string', format: 'date-time'},
                updatedAt: {type: 'string', format: 'date-time'}
            }
        };
    }

    static get relationMappings() {
        return {
            repository: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Repository,
                join: {
                    from: 'issues.repositoryId',
                    to: 'repositories.id',
                }
            }
        };
    }
}

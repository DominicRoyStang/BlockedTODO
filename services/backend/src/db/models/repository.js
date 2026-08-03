import BaseModel from './baseModel.js';
import Issue from './issue.js';

export default class Repository extends BaseModel {
    static get tableName() {
        return 'repositories';
    }

    // Whenever a model instance is created it is checked against this schema for validation.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['nodeId'],

            properties: {
                nodeId: {type: 'string', minLength: 4},
                installationId: {type: 'integer', minimum: 0},
                createdAt: {type: 'string', format: 'date-time'},
                updatedAt: {type: 'string', format: 'date-time'}
            }
        };
    }

    static get relationMappings() {
        return {
            issues: {
                relation: BaseModel.HasManyRelation,
                modelClass: Issue,
                join: {
                    from: 'repositories.id',
                    to: 'issues.repositoryId',
                }
            }
        };
    }
}

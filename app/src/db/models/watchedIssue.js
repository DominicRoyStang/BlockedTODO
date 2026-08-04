import BaseModel from './baseModel.js';

export default class WatchedIssue extends BaseModel {
    static get tableName() {
        return 'watched_issues';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['url'],

            properties: {
                url: {type: 'string', format: 'uri'},
                notificationIssueNodeId: {type: ['string', 'null'], minLength: 4},
                createdAt: {type: 'string', format: 'date-time'},
                updatedAt: {type: 'string', format: 'date-time'},
            },
        };
    }
}

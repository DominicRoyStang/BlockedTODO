import objection from 'objection';
import addFormats from 'ajv-formats';
import guid from 'objection-guid';

const {compose, Model, QueryBuilder, AjvValidator, UniqueViolationError} = objection;

class BaseQueryBuilder extends QueryBuilder {
    async findOrInsert(params) {
        const instance = await this.findOne(params);

        if (instance) { // instance is found, return it
            return instance;
        }

        try { // instance is not found, try to create it
            return await this.insert(params);
        } catch (error) {
            if (error instanceof UniqueViolationError) { // in case there was a race condition
                return await this.findOne(params);
            }
            throw error;
        }
    }
}

const mixins = compose(
    guid(),
);

export default class BaseModel extends mixins(Model) {
    static get QueryBuilder() {
        return BaseQueryBuilder;
    }

    // Enable ajv formats to validate date/email fields when inserting in database
    // More info: https://vincit.github.io/objection.js/recipes/custom-validation.html
    static createValidator() {
        return new AjvValidator({
            onCreateAjv: (ajv) => addFormats(ajv),
            options: {
                allErrors: true,
                validateFormats: true,
                validateSchema: true,
                ownProperties: true,
                allowUnionTypes: true,
                v5: true
            }
        });
    }

    async $beforeInsert(...args) {
        await super.$beforeInsert(...args);
        const timestamp = new Date().toISOString();
        this.createdAt = timestamp;
        this.updatedAt = timestamp;
    }

    async $beforeUpdate(...args) {
        await super.$beforeUpdate(...args);
        this.updatedAt = new Date().toISOString();
    }
}

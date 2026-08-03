import {Model} from 'objection';
import Knex from 'knex';
import knexConfig from './config/knexfile.js';
import {config, logger} from '../utils/index.js';

export * from './models/index.js'; // Export all models

const knex = Knex(knexConfig[config.environment]);
knex.on('query', (data) => logger.debug(`${data.sql} -- Bindings: ${data.bindings}`));

// Bind all Models to a knex instance.
Model.knex(knex);

export default knex;

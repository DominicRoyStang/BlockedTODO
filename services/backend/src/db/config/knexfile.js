import objection from 'objection';
import {config} from '../../utils/index.js';

const {knexSnakeCaseMappers} = objection;
const {wrapIdentifier, postProcessResponse} = knexSnakeCaseMappers();

const sqliteConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {filename: config.database.file},
    migrations: {directory: '../migrations'},
    seeds: {directory: '../seeds'},
    /* Set column names as snake_case, but return objects with camelCase.
     * Each query written in JavaScript must be written with camelCase.
     * The conversion to snake_case will happen automatically.
     *
     * wrapIdentifier is null-safe because SQLite's primary() passes an
     * undefined constraint name through wrapIdentifier during CREATE TABLE. */
    wrapIdentifier: (value, origImpl) => {
        if (value == null) {
            return origImpl(value);
        }
        return wrapIdentifier(value, origImpl);
    },
    postProcessResponse,
};

const knexConfig = {
    development: sqliteConfig,
    test: sqliteConfig,
    production: sqliteConfig,
};

export default knexConfig;

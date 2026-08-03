import joi from 'joi';
import dotenv from 'dotenv';
import {dirpath} from './pathHelpers.js';
import {urlString} from './urlHelpers.js';

// Load up variables from .env file (if present).
// Note that if a variable is defined both in the environment and .env file, the environment variable value takes priority.
dotenv.config({path: `${dirpath(import.meta)}/../../.env`});

// Define default for NODE_ENV here because other environment variable default values depend on NODE_ENV
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const variables = {}; // Final formatted environment variables.
const secrets = {}; // Subset of variables that are marked secrets.

// Applies defaults, formats and validates environment variables,
// Then, adds them to formatted/secret variables objects.
const loadEnvironmentVariable = async ({name, secret, defaults, format, validation}) => {
    const value = process.env[name];

    // Provide sensible defaults when some options (parameters) are not provided or incomplete
    secret = secret ?? false;
    defaults = {development: null, test: null, production: null, ...defaults};
    format = format ?? ((variable) => variable);

    // Populate lists
    variables[name] = value ? format(value) : defaults[NODE_ENV];
    if (secret) {
        secrets[name] = variables[name];
    }
    if (validation) {
        await validation.label(name).validateAsync(variables[name]);
    }

    return value;
};

const loadEnvironmentVariables = async (environmentVariables) => {
    await Promise.all(
        environmentVariables.map((environmentVariable) => loadEnvironmentVariable(environmentVariable))
    );
};

await loadEnvironmentVariables([
    {
        name: 'NODE_ENV',
        defaults: {development: 'development', test: 'test', production: 'production'},
        format: (value) => value ?? 'development',
        validation: joi.string().valid('development', 'test', 'production').required(),
    },
    {
        name: 'LOG_LEVEL',
        defaults: {development: 'info', test: 'warn', production: 'info'},
        validation: joi.string().required(),
    },
    {
        name: 'DATABASE_HOST',
        defaults: {development: 'database', test: 'database'},
        validation: joi.string().required(),
    },
    {
        name: 'DATABASE_PORT',
        defaults: {development: 5432, test: 5432},
        format: (variable) => parseInt(variable),
        validation: joi.number().port().required(),
    },
    {
        name: 'DATABASE_NAME',
        defaults: {development: 'app-database', test: 'app-database'},
        validation: joi.string().required(),
    },
    {
        name: 'DATABASE_USER',
        defaults: {development: 'app-database-user', test: 'app-database-user'},
        validation: joi.string().required(),
    },
    {
        name: 'DATABASE_PASSWORD',
        secret: true,
        defaults: {development: 'app-database-password', test: 'app-database-password'},
        validation: joi.string().required(),
    },
    {
        name: 'BACKUPS_BUCKET_NAME',
    },
    {
        name: 'BACKEND_PROTOCOL',
        defaults: {development: 'http', test: 'http', production: 'https'},
        validation: joi.string().valid('http', 'https').required(),
    },
    {
        name: 'BACKEND_HOST',
        defaults: {development: 'localhost', test: 'localhost'},
        validation: joi.string().required(),
    },
    {
        // The backend port is the one that is publicly exposed (80 for http or 443 for https in production).
        name: 'BACKEND_PORT',
        defaults: {development: 3000, test: 3000},
        format: (variable) => parseInt(variable),
        validation: joi.number().port().required(),
    },
    {
        // The internal port is the port that the app code listens on. In kubernetes terms, it is the targetPort.
        name: 'BACKEND_INTERNAL_PORT',
        defaults: {development: 3000, test: 3000, production: 3000},
        format: (variable) => parseInt(variable),
        validation: joi.number().port().required(),
    },
    {
        name: 'GITHUB_WEBHOOKS_SECRET',
        secret: true,
        defaults: {test: 'secret'},
        validation: joi.string().required(),
    },
    {
        name: 'GITHUB_APP_ID',
        defaults: {test: 'github-app-id'},
        validation: joi.string().required(),
    },
    {
        name: 'GITHUB_APP_PRIVATE_KEY',
        secret: true,
        defaults: {test: 'github-app-private-key'},
        format: (variable) => variable.replaceAll('\\n', '\n'),
        validation: joi.string().required(),
    },
    {
        name: 'GITHUB_CLIENT_ID',
        defaults: {test: 'github-client-id'},
        validation: joi.string().required(),
    },
    {
        name: 'GITHUB_CLIENT_SECRET',
        secret: true,
        defaults: {test: 'github-client-secret'},
        validation: joi.string().required(),
    }
]);

// Config created from loaded (validated and formatted) environment variables.
const config = {
    environment: variables.NODE_ENV,
    logLevel: variables.LOG_LEVEL,
    database: {
        host: variables.DATABASE_HOST,
        port: variables.DATABASE_PORT,
        name: variables.DATABASE_NAME,
        user: variables.DATABASE_USER,
        password: variables.DATABASE_PASSWORD,
        backupsBucketName: variables.BACKUPS_BUCKET_NAME,
    },
    backend: {
        protocol: variables.BACKEND_PROTOCOL,
        host: variables.BACKEND_HOST,
        port: variables.BACKEND_PORT,
        url: urlString(variables.BACKEND_PROTOCOL, variables.BACKEND_HOST, variables.BACKEND_PORT),
        internalPort: variables.BACKEND_INTERNAL_PORT,
        internalUrl: urlString(variables.BACKEND_PROTOCOL, variables.BACKEND_HOST, variables.BACKEND_PORT),
    },
    github: {
        webhooksSecret: variables.GITHUB_WEBHOOKS_SECRET,
        appId: variables.GITHUB_APP_ID,
        appPrivateKey: variables.GITHUB_APP_PRIVATE_KEY,
        clientId: variables.GITHUB_CLIENT_ID,
        clientSecret: variables.GITHUB_CLIENT_SECRET,
    },
};

export {
    config,
    secrets,
};

import joi from 'joi';
import dotenv from 'dotenv';
import {dirpath} from './pathHelpers.js';

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
        // Provided automatically in GitHub Actions. Used to check watched issues and create notification issues.
        name: 'GITHUB_TOKEN',
        secret: true,
        defaults: {test: 'github-token'},
        validation: joi.string().required(),
    },
    {
        // Provided automatically in GitHub Actions ('owner/repo' of the repository being scanned).
        name: 'GITHUB_REPOSITORY',
        defaults: {test: 'owner/repository'},
        validation: joi.string().pattern(/^[^/]+\/[^/]+$/).required(),
    },
    {
        // Path to the codebase to scan. The action sets this to the workspace directory.
        name: 'SCAN_DIR',
        defaults: {development: '.', test: '.', production: '.'},
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
    },
    github: {
        token: variables.GITHUB_TOKEN,
        repository: variables.GITHUB_REPOSITORY,
    },
    scanDir: variables.SCAN_DIR,
};

export {
    config,
    secrets,
};

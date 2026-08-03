import joi from 'joi';
import dotenv from 'dotenv';
import {dirpath, resolvePath} from './pathHelpers.js';

// Load up variables from .env file (if present).
// Note that if a variable is defined both in the environment and .env file, the environment variable value takes priority.
dotenv.config({path: `${dirpath(import.meta)}/../../.env`});

const backendRoot = resolvePath(dirpath(import.meta), '../..');

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
        // Path to the SQLite database file. Persisted as a workflow artifact in GitHub Actions.
        name: 'DATABASE_FILE',
        defaults: {development: './database.db', test: './database.test.db', production: './database.db'},
        validation: joi.string().required(),
    },
    {
        // Provided automatically in GitHub Actions. Used to check watched issues and create notification issues.
        name: 'GITHUB_TOKEN',
        secret: true,
        defaults: {development: 'github-token', test: 'github-token'},
        validation: joi.string().required(),
    },
    {
        // Provided automatically in GitHub Actions ('owner/repo' of the repository being scanned).
        name: 'GITHUB_REPOSITORY',
        defaults: {development: 'owner/repository', test: 'owner/repository'},
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
        // Resolve relative paths from the backend package root so knex migrations
        // (which change cwd) and the app always use the same file.
        file: resolvePath(backendRoot, variables.DATABASE_FILE),
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

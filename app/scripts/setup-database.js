import fs from 'fs';
import {config, logger} from '../src/utils/index.js';
import {createGithubClient} from '../src/github/utils/index.js';
import {deleteDatabaseFiles, isDatabaseCompatible} from '../src/db/databaseCompatibility.js';
import seedFromNotificationIssues from '../src/db/seedFromNotificationIssues.js';

// Wipe incompatible DBs, migrate, and seed from GitHub when rebuilding.
const databaseFile = config.database.file;
const compatible = await isDatabaseCompatible(databaseFile);
const needsInit = !compatible;

if (needsInit && fs.existsSync(databaseFile)) {
    logger.info('Incompatible database schema detected. Rebuilding database.');
    deleteDatabaseFiles(databaseFile);
} else if (needsInit) {
    logger.info('No database found. Initializing a new database.');
} else {
    logger.debug('Existing database is compatible.');
}

// Import after possible wipe so the knex connection opens the rebuilt file.
const {default: knex} = await import('../src/db/index.js');

await knex.migrate.latest();
logger.info('Database migrations applied.');

if (needsInit) {
    const githubClient = createGithubClient();
    await seedFromNotificationIssues(githubClient, config.github.repository);
}

await knex.destroy();

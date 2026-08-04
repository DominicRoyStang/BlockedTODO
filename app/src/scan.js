import {config, logger} from './utils/index.js';
import knex from './db/index.js';
import {createGithubClient} from './github/utils/index.js';
import {scanCodebase} from './parser/index.js';

const githubClient = createGithubClient();

logger.info(`Beginning codebase scan of ${config.scanDir}`, {
    repository: config.github.repository,
});
await scanCodebase(config.scanDir, config.github.repository, githubClient);
logger.info('Codebase scan completed', {repository: config.github.repository});

await knex.destroy();

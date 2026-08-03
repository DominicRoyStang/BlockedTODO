import {config, logger} from './utils/index.js';
import {Repository} from './db/index.js';
import {createGithubClient} from './github/utils/index.js';
import {scanCodebase} from './parser/index.js';

const repository = await Repository.query().findOrInsert({nodeId: config.github.repository});
const githubClient = createGithubClient();

logger.info(`Beginning codebase scan of ${config.scanDir}`, {repository});
await scanCodebase(config.scanDir, repository, githubClient);
logger.info('Codebase scan completed', {repository});

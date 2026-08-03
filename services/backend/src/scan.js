import {config, logger} from './utils/index.js';
import {Repository} from './db/index.js';
import {createGithubClient} from './github/utils/index.js';
import {scanCodebase} from './parser/index.js';

/* Scan the checked-out codebase for comments referencing GitHub issues,
 * and create notification issues for the ones that are closed. */
const scan = async () => {
    const repository = await Repository.query().findOrInsert({nodeId: config.github.repository});
    const githubClient = createGithubClient();

    logger.info(`Beginning codebase scan of ${config.scanDir}`, {repository});
    await scanCodebase(config.scanDir, repository, githubClient);
    logger.info('Codebase scan completed', {repository});

    return 'success';
};

const onSuccess = (result) => {
    logger.info({result});
    process.exit(0); // Success exit code
};

const onError = (error) => {
    logger.error({error});
    process.exit(1); // Error exit code
};

// Run code synchronously to ensure proper process error codes are returned.
scan().then(onSuccess).catch(onError);

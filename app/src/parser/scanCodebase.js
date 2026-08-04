import {logger} from '../utils/index.js';
import parseCodebase from './parseCodebase.js';
import {deleteUnreferencedIssues, createMissingIssues} from './issueHandler.js';
import {createMissingTasks} from './taskHandler.js';

/* Perform a complete scan of a codebase. */
const scanCodebase = async (codeFolder, repositoryFullName, githubClient) => {
    logger.info(`Gathering list of referenced issues for ${repositoryFullName}`);
    const referencedIssues = await parseCodebase(codeFolder);
    logger.info('Referenced issues in repo', {referencedIssues});

    logger.info('Deleting unreferenced watched issues');
    await deleteUnreferencedIssues(referencedIssues);

    logger.info('Creating missing watched issues', {urls: Object.keys(referencedIssues)});
    await createMissingIssues(Object.keys(referencedIssues));

    logger.info('Creating missing notification issues');
    await createMissingTasks(githubClient, repositoryFullName, referencedIssues);
};

export default scanCodebase;

import {logger} from '../utils/index.js';
import parseCodebase from './parseCodebase.js';
import {deleteUnreferencedIssues, createMissingIssues} from './issueHandler.js';
import {createMissingTasks} from './taskHandler.js';

/* Perform a complete scan of a codebase. */
const scanCodebase = async (codeFolder, repository, githubClient) => {
    logger.info('Gathering list of referenced issues for repo', {repository});
    const referencedIssues = await parseCodebase(codeFolder);
    logger.info('Referenced issues in repo', {referencedIssues});

    // Get repository and log its related issues
    repository = await repository.$query().withGraphFetched('issues');

    logger.info('Deleting unreferenced issues in repo', {repository});
    await deleteUnreferencedIssues(repository, referencedIssues);

    // Refresh repository so that deleted issues are removed
    repository = await repository.$query().withGraphFetched('issues');
    logger.info({repository});

    logger.info('Creating missing issues', {repository, referencedIssues});
    const issues = await createMissingIssues(repository, Object.keys(referencedIssues));
    logger.info('Missing issues created', {repository, issues});

    // Refresh repository so that created issues are included
    repository = await repository.$query().withGraphFetched('issues');
    logger.info({repository});

    // Create tasks
    logger.info('Creating missing tasks', {repository});
    const tasks = await createMissingTasks(repository, githubClient, referencedIssues);
    logger.info('Missing tasks created', {repository, tasks});
};

export default scanCodebase;

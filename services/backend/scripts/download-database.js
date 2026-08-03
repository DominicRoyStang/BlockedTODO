import {createGithubClient, listArtifacts, deleteArtifact, downloadArtifact} from '../src/github/utils/index.js';
import {config, logger} from '../src/utils/index.js';

const ARTIFACT_NAME = 'blockedtodo-database';

const githubClient = createGithubClient();
const {repository} = config.github;

const artifacts = await listArtifacts(githubClient, repository, {name: ARTIFACT_NAME});

if (artifacts.length === 0) {
    logger.info(`No ${ARTIFACT_NAME} artifact found. Starting with a fresh database.`);
} else {
    const [mostRecentArtifact, ...artifactsToDelete] = artifacts;
    logger.info(`Downloading ${ARTIFACT_NAME} artifact ${mostRecentArtifact.id} from ${mostRecentArtifact.created_at}`);
    await downloadArtifact(githubClient, repository, mostRecentArtifact.id, config.database.file);
    logger.info(`Database written to ${config.database.file}`);

    if (artifactsToDelete.length > 0) {
        logger.info(`Deleting ${artifactsToDelete.length} older ${ARTIFACT_NAME} artifact(s)`);
        await Promise.allSettled(
            artifactsToDelete.map((artifact) => deleteArtifact(githubClient, repository, artifact.id))
        );
    }
}

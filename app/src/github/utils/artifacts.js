import path from 'path';
import fs from 'fs';
import {promises as fsPromises} from 'fs';
import {pipeline} from 'stream/promises';
import {temporaryDirectoryTask} from 'tempy';
import {asyncUnzip} from '../../utils/index.js';

const repositoryPath = (repository) => `/repos/${repository}`;

/* List non-expired artifacts for a repository, newest first. */
export const listArtifacts = async (githubClient, repository, {name, perPage = 100} = {}) => {
    const response = await githubClient.get(`${repositoryPath(repository)}/actions/artifacts`, {
        params: {name, per_page: perPage},
    });

    return response.data.artifacts
        .filter((artifact) => !artifact.expired)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const deleteArtifact = async (githubClient, repository, artifactId) => {
    await githubClient.delete(`${repositoryPath(repository)}/actions/artifacts/${artifactId}`);
};

/* Download an artifact zip and copy the file matching destinationFile's basename into place. */
export const downloadArtifact = async (githubClient, repository, artifactId, destinationFile) => {
    await temporaryDirectoryTask(async (tempDir) => {
        const zipPath = path.join(tempDir, 'artifact.zip');
        const extractPath = path.join(tempDir, 'extracted');

        const response = await githubClient.get(
            `${repositoryPath(repository)}/actions/artifacts/${artifactId}/zip`,
            {responseType: 'stream'}
        );
        await pipeline(response.data, fs.createWriteStream(zipPath));

        await fsPromises.mkdir(extractPath);
        await asyncUnzip(zipPath, extractPath);

        const extractedFile = path.join(extractPath, path.basename(destinationFile));
        await fsPromises.copyFile(extractedFile, destinationFile);
    });
};

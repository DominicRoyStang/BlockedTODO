import fs from 'fs'
import { promises as fsPromises } from 'fs'
import { exec } from 'child_process'
import unzipper from 'unzipper';
import axios from 'axios'
import { DefaultArtifactClient } from '@actions/artifact'

const headers = {
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

const githubClient = axios.create({
  baseURL: 'https://api.github.com/repos/BlockedTODO/BlockedTODO',
  headers,
})
const artifactClient = new DefaultArtifactClient()

// PLAN
// - List blockedtodo-database artifacts for this repo
// - Download most recent one
// - Run scan
// - Disconnect from DB
// - Upload db as new artifact
// - Delete all other artifacts

const listArtifacts = async () => {
  let response
  try {
    response = await githubClient.get(
      '/actions/artifacts',
      { params: { per_page: 100, page: 1, name: 'blockedtodo-database' } }
    )
  } catch (error) {
    console.error(`${error.response.status}: ${error.response.statusText}`)
  }

  return response.data
}

const deleteArtifact = async (artifactId) => {
  try {
    await githubClient.delete(`/actions/artifacts/${artifactId}`)
  } catch (error) {
    console.error(`${error.response.status}: ${error.response.statusText}`)
  }
}

const downloadArtifact = async (artifactId) => {
  const asyncUnzip = (zipFile, outputPath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(zipFile)
            .pipe(unzipper.Extract({path: outputPath}));

        stream.on('close', () => {
            console.info(`file unzipped into: ${outputPath}`);
            resolve(outputPath);
        });
    });
  }

  try {
    // https://docs.github.com/en/rest/actions/artifacts?apiVersion=2022-11-28#download-an-artifact
    const artifactDownloadUrlResponse = await githubClient.get(`/actions/artifacts/${artifactId}/zip`)
    const destination = './downloaded'
    if (!fs.existsSync(destination)) {
      await fsPromises.mkdir(destination)
    }
    const zipLocation = `${destination}/artifact.zip`

    console.log('writing data...')
    await fsPromises.writeFile(zipLocation, artifactDownloadUrlResponse.data)
    console.log('running ls -la...')
    exec('pwd && ls -la', (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
    })
    console.log('starting unzip...')
    await asyncUnzip(zipLocation, destination)
  } catch (error) {
    console.error('ERROR')
    console.error(`${error?.response?.status}: ${error?.response?.statusText}, ${error?.message}`)
  }
}

const { total_count, artifacts } = await listArtifacts()
console.log({ total_count, artifacts })

// Newest to oldest sort
const sortArtifactsByDate = (a, b) => new Date(b.created_at) - new Date(a.created_at)
const [mostRecentArtifact, ...artifactsToBeDeleted] = artifacts.sort(sortArtifactsByDate)

// Delete old artifacts
const results = await Promise.allSettled(artifactsToBeDeleted.map(artifact => deleteArtifact(artifact.id)))
console.log({ deletionPromiseResults: results })

// Download mostRecentArtifact
const destination = './downloaded'
await fsPromises.mkdir(destination)
const zipLocation = `${destination}/artifact.zip`
console.log({ artifactClient })
const downloadedArtifact = await downloadArtifact(mostRecentArtifact.id)
//const downloadedArtifact = await artifactClient.downloadArtifact(mostRecentArtifact.id, { path: destination })
console.log({ downloadedArtifact })
exec('pwd && ls -la', (error, stdout, stderr) => {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
      console.log('exec error: ' + error);
  }
})
//await downloadArtifact(mostRecentArtifact.id)

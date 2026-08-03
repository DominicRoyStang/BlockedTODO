import {URL} from 'url';
import {logger} from '../../utils/index.js';

const PATHNAME_REGEX = /\/(?<owner>.+)\/(?<name>.+)\/issues\/(?<issueNumber>\d+)/;

/* Get issue data from GitHub.
 * This call will fail if the issue was transferred.
 * BlockedTODO: https://github.community/t/117585
 * Implement solution or workaround depending on response. */
const getIssue = async (githubClient, issue) => {
    // Parse issue URL
    const issueUrl = new URL(issue.url);
    const {owner, name, issueNumber} = issueUrl.pathname.match(PATHNAME_REGEX).groups;

    const response = await githubClient.get(`/repos/${owner}/${name}/issues/${issueNumber}`);
    logger.info(`Response from GitHub: ${response.status}`, {response});

    return {
        title: response.data.title,
        closed: response.data.state === 'closed',
    };
};

export default getIssue;

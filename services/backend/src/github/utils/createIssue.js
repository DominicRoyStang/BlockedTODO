import {URL} from 'url';
import {logger, markdownHelpers} from '../../utils/index.js';

const {inlineCode, codeBlock, lineBreak} = markdownHelpers;

const generateIssueBody = (issue, issueReferences) => {
    let body = `Link to closed issue: ${issue.url}\n\n`;
    if (issueReferences.length === 1) {
        const {file, comment} = issueReferences[0];
        body += `This issue was automatically triggered by the following comment in ${inlineCode(file)}.\n`;
        body += codeBlock(comment);
    } else {
        body += 'This issue was automatically triggered by the following comments.\n';
        for (const {file, comment} of issueReferences) {
            body += lineBreak();
            body += `In ${inlineCode(file)}:\n`;
            body += codeBlock(comment);
        }
    }

    return body;
};

/* Create issue on GitHub (in the context of BlockedTODO: a task).
 * The repository's nodeId is the 'owner/repo' identifier of the repository being scanned. */
const createIssue = async (githubClient, issue, repository, issueReferences) => {
    const issueUrl = new URL(issue.url);

    const response = await githubClient.post(`/repos/${repository.nodeId}/issues`, {
        title: `Unblocked TODO: ${issueUrl.pathname} was closed.`,
        body: generateIssueBody(issue, issueReferences),
    });
    logger.info(`Response from GitHub: ${response.status}`, {response});

    return {id: response.data.node_id};
};

export default createIssue;

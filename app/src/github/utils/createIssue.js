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

/* Create a notification issue on the scanned repository. */
const createIssue = async (githubClient, issue, repositoryFullName, issueReferences) => {
    const issueUrl = new URL(issue.url);

    const response = await githubClient.post(`/repos/${repositoryFullName}/issues`, {
        title: `Unblocked TODO: ${issueUrl.pathname} was closed.`,
        body: generateIssueBody(issue, issueReferences),
    });
    logger.info(`Response from GitHub: ${response.status}`, {response});

    return {id: response.data.node_id};
};

export default createIssue;

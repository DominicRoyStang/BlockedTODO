import {URL} from 'url';
import {logger} from '../utils/index.js';
import {WatchedIssue} from '../db/index.js';
import {getIssue, createIssue} from '../github/utils/index.js';

/* Create notification issues for watched issues that have closed */
export const createMissingTasks = async (githubClient, repositoryFullName, referencedIssues) => {
    const issues = await WatchedIssue.query();

    const handleIssue = async (issue) => {
        const issueUrl = new URL(issue.url);
        if (issueUrl.hostname !== 'github.com') {
            logger.info(`Unsupported issue host: ${issueUrl.hostname} for ${issue.url}`);
            return;
        }

        if (issue.notificationIssueNodeId) {
            logger.info(`notification already exists for watched issue ${issue.url}`);
            return;
        }

        const {closed} = await getIssue(githubClient, issue);
        if (!closed) {
            logger.info(`watched issue is still open: ${issue.url}`);
            return;
        }

        logger.info(`Creating notification issue for ${issue.url} on ${repositoryFullName}`);
        const githubIssue = await createIssue(
            githubClient,
            issue,
            repositoryFullName,
            referencedIssues[issue.url],
        );
        logger.info(`Notification issue created for ${issue.url}`);

        const updated = await issue.$query().patchAndFetch({
            notificationIssueNodeId: githubIssue.id,
        });
        logger.info('Watched issue marked as notified', {issue: updated});

        return updated;
    };

    await Promise.allSettled(issues.map((issue) => handleIssue(issue)));
};

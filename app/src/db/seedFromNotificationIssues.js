import {logger} from '../utils/index.js';
import {WatchedIssue} from './models/index.js';
import {
    extractWatchedIssueUrl,
    isNotificationIssueTitle,
    listRepositoryIssues,
} from '../github/utils/index.js';

/* Rehydrate watched_issues from existing notification issues. */
const seedFromNotificationIssues = async (githubClient, repository) => {
    const issues = await listRepositoryIssues(githubClient, repository, {state: 'all'});
    const notificationIssues = issues
        .filter((issue) => isNotificationIssueTitle(issue.title))
        .sort((a, b) => b.number - a.number);

    const seenUrls = new Set();
    let seededCount = 0;

    for (const issue of notificationIssues) {
        const url = extractWatchedIssueUrl(issue);
        if (!url || seenUrls.has(url)) {
            continue;
        }
        seenUrls.add(url);

        await WatchedIssue.query().insert({
            url,
            notificationIssueNodeId: issue.node_id,
        });
        seededCount += 1;
        logger.info(`Seeded watched issue ${url} from notification #${issue.number}`);
    }

    logger.info(`Seeded ${seededCount} watched issue(s) from existing notifications`);
    return seededCount;
};

export default seedFromNotificationIssues;

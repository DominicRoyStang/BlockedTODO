import {WatchedIssue} from '../db/index.js';

/* Delete watched issues that are no longer mentioned in the codebase */
export const deleteUnreferencedIssues = async (referencedIssues) => {
    const issues = await WatchedIssue.query();
    for (const issue of issues) {
        if (issue.url in referencedIssues) {
            continue;
        }

        await issue.$query().delete();
    }
};

/* Add missing watched issues to the database */
export const createMissingIssues = async (referencedIssueUrls) => {
    const handleIssue = async (issueUrl) => {
        return await WatchedIssue.query().findOrInsert({url: issueUrl});
    };

    return await Promise.allSettled(referencedIssueUrls.map(handleIssue));
};

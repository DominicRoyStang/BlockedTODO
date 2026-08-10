import {
    extractWatchedIssueUrl,
    isNotificationIssueTitle,
    notificationIssueTitle,
} from './notificationIssue.js';

describe('notificationIssueTitle', () => {
    it('builds the standard notification title', () => {
        expect(notificationIssueTitle('/owner/repo/issues/12')).toEqual(
            'Unblocked TODO: /owner/repo/issues/12 was closed.'
        );
    });
});

describe('isNotificationIssueTitle', () => {
    it('matches Unblocked TODO titles', () => {
        expect(isNotificationIssueTitle('Unblocked TODO: /owner/repo/issues/12 was closed.')).toBe(true);
    });

    it('rejects unrelated titles', () => {
        expect(isNotificationIssueTitle('Fix the flaky test')).toBe(false);
        expect(isNotificationIssueTitle(undefined)).toBe(false);
    });
});

describe('extractWatchedIssueUrl', () => {
    it('prefers the body link', () => {
        const url = extractWatchedIssueUrl({
            title: 'Unblocked TODO: /other/repo/issues/1 was closed.',
            body: 'Link to closed issue: https://github.com/owner/repo/issues/12\n\nMore text',
        });
        expect(url).toEqual('https://github.com/owner/repo/issues/12');
    });

    it('falls back to the title pathname', () => {
        const url = extractWatchedIssueUrl({
            title: 'Unblocked TODO: /owner/repo/issues/12 was closed.',
            body: 'No link here',
        });
        expect(url).toEqual('https://github.com/owner/repo/issues/12');
    });

    it('returns null when neither body nor title match', () => {
        expect(extractWatchedIssueUrl({title: 'Hello', body: 'World'})).toBeNull();
    });
});

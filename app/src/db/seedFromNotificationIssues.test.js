import {WatchedIssue} from './models/index.js';
import seedFromNotificationIssues from './seedFromNotificationIssues.js';

const mockGithubClient = (data) => ({
    get: async () => ({data}),
});

describe('seedFromNotificationIssues', () => {
    it('seeds watched issues from notification issues', async () => {
        const githubClient = mockGithubClient([
            {
                number: 10,
                node_id: 'node-10',
                title: 'Unblocked TODO: /deps/lib/issues/1 was closed.',
                body: 'Link to closed issue: https://github.com/deps/lib/issues/1\n\n',
            },
            {
                number: 9,
                node_id: 'node-9',
                title: 'Regular issue',
                body: 'not a notification',
            },
        ]);

        const seededCount = await seedFromNotificationIssues(githubClient, 'owner/repo');

        expect(seededCount).toEqual(1);
        const issues = await WatchedIssue.query();
        expect(issues).toHaveLength(1);
        expect(issues[0]).toMatchObject({
            url: 'https://github.com/deps/lib/issues/1',
            notificationIssueNodeId: 'node-10',
        });
    });

    it('keeps the newest notification when multiple map to the same url', async () => {
        const githubClient = mockGithubClient([
            {
                number: 20,
                node_id: 'node-newest',
                title: 'Unblocked TODO: /deps/lib/issues/1 was closed.',
                body: 'Link to closed issue: https://github.com/deps/lib/issues/1\n\n',
            },
            {
                number: 11,
                node_id: 'node-older',
                title: 'Unblocked TODO: /deps/lib/issues/1 was closed.',
                body: 'Link to closed issue: https://github.com/deps/lib/issues/1\n\n',
            },
        ]);

        await seedFromNotificationIssues(githubClient, 'owner/repo');

        const issues = await WatchedIssue.query();
        expect(issues).toHaveLength(1);
        expect(issues[0].notificationIssueNodeId).toEqual('node-newest');
    });

    it('ignores pull requests returned by the issues API', async () => {
        const githubClient = mockGithubClient([
            {
                number: 3,
                node_id: 'node-pr',
                title: 'Unblocked TODO: /deps/lib/issues/1 was closed.',
                body: 'Link to closed issue: https://github.com/deps/lib/issues/1\n\n',
                pull_request: {url: 'https://api.github.com/repos/owner/repo/pulls/3'},
            },
        ]);

        const seededCount = await seedFromNotificationIssues(githubClient, 'owner/repo');
        expect(seededCount).toEqual(0);
        expect(await WatchedIssue.query()).toHaveLength(0);
    });
});

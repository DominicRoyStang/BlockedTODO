import {WatchedIssue} from '../index.js';
import {sleep} from '../../utils/index.js';

describe('mixins', () => {
    it('is given an id (uuid) automatically', async () => {
        const issue = await WatchedIssue.query().insert({url: 'https://github.com/example/repo/issues/1'});
        expect(issue).toHaveProperty('id');
        expect(issue.id).not.toBeNull();
    });
});

describe('findOrInsert', () => {
    it('creates a new instance', async () => {
        const preCount = await WatchedIssue.query().resultSize();
        const issue = await WatchedIssue.query().findOrInsert({url: 'https://github.com/example/repo/issues/1'});
        const postCount = await WatchedIssue.query().resultSize();

        expect(postCount).toEqual(preCount + 1);
        expect(issue).not.toBeNull();
    });

    it('does not create a new instance when an instance exists', async () => {
        const issue1 = await WatchedIssue.query().insert({url: 'https://github.com/example/repo/issues/1'});

        const preCount = await WatchedIssue.query().resultSize();
        const issue2 = await WatchedIssue.query().findOrInsert({url: 'https://github.com/example/repo/issues/1'});
        const postCount = await WatchedIssue.query().resultSize();

        expect(postCount).toEqual(preCount);
        expect(issue1.id).toEqual(issue2.id);
    });
});

describe('timestamps', () => {
    it('adds created at and updated at timestamps on creation', async () => {
        const issue = await WatchedIssue.query().insert({url: 'https://github.com/example/repo/issues/1'});

        expect(issue).toMatchObject({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it('changes updated at timestamp on patch (but not created at)', async () => {
        const issue = await WatchedIssue.query().insert({url: 'https://github.com/example/repo/issues/1'});
        const {createdAt: preCreatedAt, updatedAt: preUpdatedAt} = issue;

        await sleep(10);
        await issue.$query().patch({notificationIssueNodeId: 'I_kwDOABC123'});

        expect(issue.createdAt).toEqual(preCreatedAt);
        expect(issue.updatedAt).not.toEqual(preUpdatedAt);
    });

    it('changes updated at timestamp on update (but not created at)', async () => {
        const issue = await WatchedIssue.query().insert({url: 'https://github.com/example/repo/issues/1'});
        const {createdAt: preCreatedAt, updatedAt: preUpdatedAt} = issue;

        await sleep(10);
        await issue.$query().update({
            url: 'https://github.com/example/repo/issues/2',
            notificationIssueNodeId: null,
        });

        expect(issue.createdAt).toEqual(preCreatedAt);
        expect(issue.updatedAt).not.toEqual(preUpdatedAt);
    });
});

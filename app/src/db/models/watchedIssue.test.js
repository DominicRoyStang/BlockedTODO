import WatchedIssue from './watchedIssue.js';

describe('insert', () => {
    it('rejects an empty url', async () => {
        const insertQuery = WatchedIssue.query().insert({url: ''});
        await expect(insertQuery).rejects.toThrowError();
    });
});

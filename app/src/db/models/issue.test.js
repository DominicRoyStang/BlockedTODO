import Issue from './issue.js';
import Repository from './repository.js';

const validIssueData = async () => {
    const repository = await Repository.query().insert({nodeId: 'abc123'});
    return {url: 'http://example.com', repositoryId: repository.id};
};

describe('insert', () => {
    it('rejects an empty url', async () => {
        const insertQuery = Issue.query().insert({...await validIssueData(), url: ''});
        await expect(insertQuery).rejects.toThrowError();
    });
});

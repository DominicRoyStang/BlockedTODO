import Repository from './repository.js';

describe('insert', () => {
    it('creates a repository from a node id', async () => {
        const repository = await Repository.query().insert({nodeId: 'testowner/testrepo'});
        expect(repository.nodeId).toEqual('testowner/testrepo');
    });

    it('rejects an empty node id', async () => {
        const insertQuery = Repository.query().insert({nodeId: ''});
        await expect(insertQuery).rejects.toThrowError();
    });
});

import {Repository} from '../index.js';
import {sleep} from '../../utils/index.js';

describe('mixins', () => {
    it('is given an id (uuid) automatically', async () => {
        const repository = await Repository.query().insert({nodeId: 'abc123'});
        expect(repository).toHaveProperty('id');
        expect(repository.id).not.toBeNull();
    });
});

describe('findOrInsert', () => {
    it('creates a new instance', async () => {
        const preCount = await Repository.query().resultSize();
        const repository = await Repository.query().findOrInsert({nodeId: 'abc123'});
        const postCount = await Repository.query().resultSize();

        expect(postCount).toEqual(preCount + 1);
        expect(repository).not.toBeNull();
    });

    it('does not create a new instance when an instance exists', async () => {
        const repo1 = await Repository.query().insert({nodeId: 'abc123'});

        const preCount = await Repository.query().resultSize();
        const repo2 = await Repository.query().findOrInsert({nodeId: 'abc123'});
        const postCount = await Repository.query().resultSize();

        expect(postCount).toEqual(preCount);
        expect(repo1.id).toEqual(repo2.id);
    });
});

describe('timestamps', () => {
    it('adds created at and updated at timestamps on creation', async () => {
        const repository = await Repository.query().insert({nodeId: 'abc123'});

        expect(repository).toMatchObject({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it('changes updated at timestamp on patch (but not created at)', async () => {
        const repo = await Repository.query().insert({nodeId: 'abc123'});
        const {createdAt: preCreatedAt, updatedAt: preUpdatedAt} = repo;

        await sleep(10);
        await repo.$query().patch({nodeId: 'xyz789'});

        expect(repo.createdAt).toEqual(preCreatedAt);
        expect(repo.updatedAt).not.toEqual(preUpdatedAt);
    });

    it('changes updated at timestamp on update (but not created at)', async () => {
        const repo = await Repository.query().insert({nodeId: 'abc123'});
        const {createdAt: preCreatedAt, updatedAt: preUpdatedAt} = repo;

        await sleep(10);
        await repo.$query().update({nodeId: 'newNodeId'});

        expect(repo.createdAt).toEqual(preCreatedAt);
        expect(repo.updatedAt).not.toEqual(preUpdatedAt);
    });
});

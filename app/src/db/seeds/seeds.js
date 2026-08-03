import {Repository, Issue, Task} from '../models/index.js';
import {config} from '../../utils/index.js';
import '../index.js'; // connect db

const seedRepositoryNodeIds = ['user1/repo0', 'user1/repo1', 'user2/repo2', 'user3/repo3', 'someuser/repo4', 'someuser/repo5'];

export const seed = async (knex) => {
    if (config.environment === 'production') {
        return;
    }

    const seededRepositories = await Repository.query().whereIn('nodeId', seedRepositoryNodeIds);

    if (seededRepositories.length < seedRepositoryNodeIds.length) {
        await deleteSeedData(knex);
        await generateSeedData(knex);
    }
};

const deleteSeedData = async (_knex) => {
    // Deleting these models will cascade through associated tasks and join tables.
    await Repository.query().delete().whereIn('nodeId', seedRepositoryNodeIds);

    await Issue.query().delete().whereIn(
        'url',
        [
            'http://github.com/user1/repo0/issues/0',
            'http://github.com/user1/repo0/issues/1',
            'http://github.com/someuser/somerepo/issues/2',
            'http://github.com/someuser/somerepo/issues/3',
            'http://github.com/someuser/somerepo/issues/4',
            'http://github.com/someuser/somerepo/issues/5',
        ]
    );
};

/* eslint-disable */
const generateSeedData = async (knex) => {
    // Create repositories
    const repository0 = await Repository.query().insert({nodeId: 'user1/repo0'});
    const repository1 = await Repository.query().insert({nodeId: 'user1/repo1'});
    const repository2 = await Repository.query().insert({nodeId: 'user2/repo2'});
    const repository3 = await Repository.query().insert({nodeId: 'user3/repo3'});
    const repository4 = await Repository.query().insert({nodeId: 'someuser/repo4'});
    const repository5 = await Repository.query().insert({nodeId: 'someuser/repo5'});

    // Create issues
    const issue0 = await Issue.query().insert({
        url: 'http://github.com/user1/repo0/issues/0',
        repositoryId: repository0.id,
    });
    const issue1 = await Issue.query().insert({
        url: 'http://github.com/user1/repo0/issues/1',
        repositoryId: repository1.id,
    });
    const issue2 = await Issue.query().insert({
        url: 'http://github.com/someuser/somerepo/issues/2',
        repositoryId: repository2.id,
    });
    const issue3 = await Issue.query().insert({
        url: 'http://github.com/someuser/somerepo/issues/3',
        repositoryId: repository3.id,
    });
    const issue4 = await Issue.query().insert({
        url: 'http://github.com/someuser/somerepo/issues/4',
        repositoryId: repository4.id,
    });
    const issue5 = await Issue.query().insert({
        url: 'http://github.com/someuser/somerepo/issues/5',
        repositoryId: repository5.id,
    });

    // Create resources with belongsTo associations
    const task0 = await Task.query().insert({
        nodeId: 'user1/repo0/issues/100',
        repositoryId: repository0.id,
        issueId: issue0.id
    });
    const task1 = await Task.query().insert({
        nodeId: 'user1/repo1/issues/111',
        repositoryId: repository1.id,
        issueId: issue1.id,
    });
    const task2 = await Task.query().insert({
        nodeId: 'user2/repo2/issues/222',
        repositoryId: repository2.id,
        issueId: issue2.id,
    });
    const task3 = await Task.query().insert({
        nodeId: 'user3/repo3/issues/333',
        repositoryId: repository3.id,
        issueId: issue3.id,
    });
    const task4 = await Task.query().insert({
        nodeId: 'user2/repo2/issues/224',
        repositoryId: repository2.id,
        issueId: issue4.id,
    });
    const task5 = await Task.query().insert({
        nodeId: 'someuser/repo4/issues/044',
        repositoryId: repository4.id,
        issueId: issue4.id,
    });
    const task6 = await Task.query().insert({
        nodeId: 'someuser/repo5/055',
        repositoryId: repository5.id,
        issueId: issue5.id,
    });
    const task7 = await Task.query().insert({
        nodeId: 'someuser/repo4/045',
        repositoryId: repository4.id,
        issueId: issue5.id,
    })
};
/* eslint-enable */

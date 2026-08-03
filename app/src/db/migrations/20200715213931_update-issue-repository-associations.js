import {v4 as uuidv4} from 'uuid';

// Convert repository-issue relation from many-to-many to one-to-many
export const up = async (knex) => {
    await knex.schema.table('issues', (table) => {
        // Remove uniqueness constraint on issue urls
        table.dropUnique('url');

        // Add repository_id column
        table.uuid('repository_id').references('id').inTable('repositories').onDelete('CASCADE').onUpdate('CASCADE');
    });

    // Recreate all issues (one for each repository-issue association)
    for (const {repositoryId, issueId} of await knex('repository_issues')) {
        // Get old issue
        const oldIssue = await knex('issues').where({id: issueId}).first();

        // Create new issue with repository_id = repositoryId
        const newIssueId = uuidv4();
        await knex('issues').insert({
            id: newIssueId,
            repositoryId: repositoryId,
            url: oldIssue.url,
            createdAt: oldIssue.createdAt
        });

        // Fetch created issue
        const newIssue = await knex('issues').where({id: newIssueId}).first();

        // Update tasks referencing the old issue
        await knex('tasks').where({issueId: oldIssue.id, repositoryId: repositoryId}).update({issueId: newIssue.id});
    }

    // Delete old issues that have been replaced
    await knex('issues').whereNull('repository_id').del();

    // Add notNullable constraint on the repository_id column
    await knex.schema.alterTable('issues', (table) => {
        table.uuid('repository_id').notNullable().alter();
    });

    // Delete repository_issues join table
    await knex.schema.dropTableIfExists('repository_issues');
};

export const down = async (knex) => {
    // Recreate repository_issues join table
    await knex.schema.createTable('repository_issues', (table) => {
        table.uuid('repository_id').references('id').inTable('repositories').onDelete('CASCADE').onUpdate('CASCADE').notNullable(); // eslint-disable-line
        table.uuid('issue_id').references('id').inTable('issues').onDelete('CASCADE').onUpdate('CASCADE').notNullable();

        table.index('repository_id');
        table.index('issue_id');

        table.unique(['repository_id', 'issue_id']);
    });

    // Remove notNullable constraint on the repository_id column
    knex.schema.alterTable('issues', (table) => {
        table.uuid('repository_id').nullable().alter();
    });

    for (const oldIssue of await knex('issues')) {
        // Find an issue with the oldIssue.url that is present in the repository_issues join table
        const newIssuesQuery = knex.select('issue_id').from('repository_issues');
        let newIssue = await knex('issues').where({url: oldIssue.url}).andWhere('id', 'in', newIssuesQuery).first();

        if (!newIssue) { // If no such issue exists, create it
            const newIssueId = uuidv4();
            await knex('issues').insert({
                id: newIssueId,
                url: oldIssue.url,
                createdAt: oldIssue.createdAt
            });

            // Fetch created issue
            newIssue = await knex('issues').where({id: newIssueId}).first();
        }

        // Add relation between repository and issue
        await knex('repository_issues').insert({issueId: newIssue.id, repositoryId: oldIssue.repositoryId});

        // Update task referencing the old issue
        await knex('tasks').where({issueId: oldIssue.id, repositoryId: oldIssue.repositoryId}).update({issueId: newIssue.id});

        // Delete old issue
        await knex('issues').where({id: oldIssue.id}).del();
    }

    await knex.schema.table('issues', (table) => {
        // Remove repository_id column
        table.dropColumn('repository_id');

        // Bring back uniqueness constraint on urls
        table.unique('url');
    });
};

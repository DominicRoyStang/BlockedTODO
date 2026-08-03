export const up = async (knex) => {
    await knex.schema.table('tasks', (table) => {
        table.uuid('repository_id').references('id').inTable('repositories').onDelete('CASCADE').onUpdate('CASCADE').notNullable(); // eslint-disable-line
        table.uuid('issue_id').references('id').inTable('issues').onDelete('CASCADE').onUpdate('CASCADE').notNullable();

        table.index('repository_id');
        table.index('issue_id');

        table.unique(['repository_id', 'issue_id']);
    });
};

export const down = async (knex) => {
    await knex.schema.table('tasks', (table) => {
        table.dropColumn('repository_id');
        table.dropColumn('issue_id');
    });
};

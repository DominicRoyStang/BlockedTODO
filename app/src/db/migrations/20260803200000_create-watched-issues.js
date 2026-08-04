export const up = async (knex) => {
    await knex.schema.createTable('watched_issues', (table) => {
        table.uuid('id').primary().notNullable();
        table.string('url').notNullable().unique();
        table.string('notification_issue_node_id').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

        table.index('url');
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('watched_issues');
};

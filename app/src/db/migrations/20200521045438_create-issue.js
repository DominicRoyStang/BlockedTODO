export const up = async (knex) => {
    await knex.schema.createTable('issues', (table) => {
        table.uuid('id').primary().notNullable();
        table.string('url').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

        table.index('url');
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('issues');
};

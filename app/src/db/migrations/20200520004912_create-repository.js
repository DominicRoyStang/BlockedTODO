export const up = async (knex) => {
    await knex.schema.createTable('repositories', (table) => {
        table.uuid('id').primary().notNullable();
        table.string('host').notNullable();
        table.string('host_id').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

        table.index('host_id');
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('repositories');
};

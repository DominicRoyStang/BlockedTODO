export const up = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

        table.index('email');
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('users');
};

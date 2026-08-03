export const up = async (knex) => {
    await knex.schema.createTable('user_repositories', (table) => {
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
        table.uuid('repository_id').references('id').inTable('repositories').onDelete('CASCADE').onUpdate('CASCADE').notNullable(); // eslint-disable-line

        table.index('user_id');
        table.index('repository_id');

        table.unique(['user_id', 'repository_id']);
    });
};

export const down = async (knex) => {
    await knex.schema.dropTableIfExists('user_repositories');
};

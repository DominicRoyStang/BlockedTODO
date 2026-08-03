export const up = async (knex) => {
    // Remove host columns & rename host_id to node_id
    await knex.schema.table('users', (table) => {
        table.renameColumn('host_id', 'node_id');
    });

    await knex.schema.table('repositories', (table) => {
        table.dropColumn('host');
        table.renameColumn('host_id', 'node_id');
    });

    await knex.schema.table('tasks', (table) => {
        table.dropColumn('host');
        table.renameColumn('host_id', 'node_id');
    });
};

export const down = async (knex) => {
    // Add host columns & rename node_id to host_id
    await knex.schema.table('users', (table) => {
        table.renameColumn('node_id', 'host_id');
    });

    await knex.schema.table('repositories', (table) => {
        table.string('host').notNullable().defaultTo('github');
        table.renameColumn('node_id', 'host_id');
    });
    await knex.schema.alterTable('repositories', (table) => {
        table.string('host').notNullable().alter(); // Remove defaultTo('github')
    });

    await knex.schema.table('tasks', (table) => {
        table.string('host').notNullable().defaultTo('github');
        table.renameColumn('node_id', 'host_id');
    });
    await knex.schema.alterTable('tasks', (table) => {
        table.string('host').notNullable().alter(); // Remove defaultTo('github')
    });
};

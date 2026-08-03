export const up = async (knex) => {
    // Change type from string to number on installation_id column
    await knex.schema.alterTable('repositories', (table) => {
        table.integer('installation_id').notNullable().alter();
    });
};

export const down = async (knex) => {
    // Change type from number to string on installation_id column
    await knex.schema.alterTable('repositories', (table) => {
        table.string('installation_id').nullable().alter();
    });
};

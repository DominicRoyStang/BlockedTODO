export const up = async (knex) => {
    // Add notNullable constraint on the installation_id column
    await knex.schema.alterTable('repositories', (table) => {
        table.string('installation_id').notNullable().alter();
    });
};

export const down = async (knex) => {
    // Remove notNullable constraint on the installation_id column
    await knex.schema.alterTable('repositories', (table) => {
        table.string('installation_id').nullable().alter();
    });
};

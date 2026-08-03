// Installation IDs were a GitHub App concept.
// Now that BlockedTODO runs as a GitHub Action, repositories no longer have one.
export const up = async (knex) => {
    await knex.schema.alterTable('repositories', (table) => {
        table.integer('installation_id').nullable().alter();
    });
};

export const down = async (knex) => {
    await knex.schema.alterTable('repositories', (table) => {
        table.integer('installation_id').notNullable().alter();
    });
};

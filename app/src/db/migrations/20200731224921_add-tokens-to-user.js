export const up = async (knex) => {
    await knex.schema.table('users', (table) => {
        // Add host id column
        table.string('host_id');
        // Add access token and refresh token columns
        table.string('access_token');
        table.string('refresh_token');
        // Add token iv columns (for encrypted attributes)
        table.string('access_token_iv');
        table.string('refresh_token_iv');
    });

    // Make email nullable (to account for GitHub users with private email)
    await knex.schema.alterTable('users', (table) => {
        table.string('email').nullable().alter();
    });
};

export const down = async (knex) => {
    await knex.schema.table('users', (table) => {
        // Remove host id column
        table.dropColumn('host_id');
        // Remove access token and refresh token columns
        table.dropColumn('access_token');
        table.dropColumn('refresh_token');
        // Remove token iv columns
        table.dropColumn('access_token_iv');
        table.dropColumn('refresh_token_iv');
    });

    // Add notNullable constraint on the email column
    await knex.schema.alterTable('users', (table) => {
        table.string('email').notNullable().alter();
    });
};

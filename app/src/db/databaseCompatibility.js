import fs from 'fs';
import Knex from 'knex';
import {dirpath, resolvePath} from '../utils/pathHelpers.js';

export const migrationsDirectory = resolvePath(dirpath(import.meta), './migrations');

export const deleteDatabaseFiles = (databaseFile) => {
    const unlinkIfExists = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    unlinkIfExists(databaseFile);
    unlinkIfExists(`${databaseFile}-wal`);
    unlinkIfExists(`${databaseFile}-shm`);
};

/*
 * True when the DB can be migrated forward in place (not rebuilt).
 *
 * Compatible when all of:
 * - the database file exists
 * - knex_migrations table exists
 * - every applied migration name still exists in the migrations directory
 *
 * Incompatible (returns false) when any of:
 * - the file is missing
 * - knex_migrations is missing
 * - knex_migrations references migrations we no longer ship
 * - opening or querying the file throws
 */
export const isDatabaseCompatible = async (databaseFile, migrationsDir = migrationsDirectory) => {
    if (!fs.existsSync(databaseFile)) {
        return false;
    }


    // Temporary knex connection used to inspect/delete the database file before the app opens its own connection.
    const knex = Knex({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {filename: databaseFile},
    });

    try {
        if (!await knex.schema.hasTable('knex_migrations')) {
            return false;
        }

        const appliedMigrations = await knex('knex_migrations').pluck('name');
        const availableMigrations = new Set(
            (await fs.promises.readdir(migrationsDir)).filter((name) => name.endsWith('.js'))
        );

        return appliedMigrations.every((name) => availableMigrations.has(name));
    } catch {
        return false;
    } finally {
        await knex.destroy();
    }
};

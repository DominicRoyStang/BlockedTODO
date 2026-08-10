import fs from 'fs';
import path from 'path';
import Knex from 'knex';
import {temporaryDirectoryTask} from 'tempy';
import {
    deleteDatabaseFiles,
    isDatabaseCompatible,
    migrationsDirectory,
} from './databaseCompatibility.js';

const createDatabase = async (databaseFile, {applyCurrentMigrations = true, extraMigrationName} = {}) => {
    const knex = Knex({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {filename: databaseFile},
        migrations: {directory: migrationsDirectory},
    });

    try {
        if (applyCurrentMigrations) {
            await knex.migrate.latest();
        } else {
            await knex.schema.createTable('knex_migrations', (table) => {
                table.increments('id').primary();
                table.string('name');
                table.integer('batch');
                table.timestamp('migration_time');
            });
            if (extraMigrationName) {
                await knex('knex_migrations').insert({
                    name: extraMigrationName,
                    batch: 1,
                    migration_time: knex.fn.now(),
                });
            }
        }
    } finally {
        await knex.destroy();
    }
};

describe('isDatabaseCompatible', () => {
    it('returns false when the database file is missing', async () => {
        await temporaryDirectoryTask(async (dir) => {
            const compatible = await isDatabaseCompatible(path.join(dir, 'missing.db'));
            expect(compatible).toBe(false);
        });
    });

    it('returns true for a database migrated with the current schema', async () => {
        await temporaryDirectoryTask(async (dir) => {
            const databaseFile = path.join(dir, 'compatible.db');
            await createDatabase(databaseFile);

            const compatible = await isDatabaseCompatible(databaseFile);
            expect(compatible).toBe(true);
        });
    });

    it('returns false when applied migrations are unknown', async () => {
        await temporaryDirectoryTask(async (dir) => {
            const databaseFile = path.join(dir, 'old.db');
            await createDatabase(databaseFile, {
                applyCurrentMigrations: false,
                extraMigrationName: '20200520004000_create-user.js',
            });

            const compatible = await isDatabaseCompatible(databaseFile);
            expect(compatible).toBe(false);
        });
    });

    it('returns false when knex_migrations is missing', async () => {
        await temporaryDirectoryTask(async (dir) => {
            const databaseFile = path.join(dir, 'empty.db');
            const knex = Knex({
                client: 'sqlite3',
                useNullAsDefault: true,
                connection: {filename: databaseFile},
            });
            try {
                await knex.schema.createTable('unrelated', (table) => {
                    table.increments('id');
                });
            } finally {
                await knex.destroy();
            }

            const compatible = await isDatabaseCompatible(databaseFile);
            expect(compatible).toBe(false);
        });
    });
});

describe('deleteDatabaseFiles', () => {
    it('removes the database and sqlite sidecar files', async () => {
        await temporaryDirectoryTask(async (dir) => {
            const databaseFile = path.join(dir, 'database.db');
            fs.writeFileSync(databaseFile, '');
            fs.writeFileSync(`${databaseFile}-wal`, '');
            fs.writeFileSync(`${databaseFile}-shm`, '');

            deleteDatabaseFiles(databaseFile);

            expect(fs.existsSync(databaseFile)).toBe(false);
            expect(fs.existsSync(`${databaseFile}-wal`)).toBe(false);
            expect(fs.existsSync(`${databaseFile}-shm`)).toBe(false);
        });
    });
});

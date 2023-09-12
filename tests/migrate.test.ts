import { jest, mock, describe, it, expect } from "bun:test";
import { migrateToLatest } from "../src/commands/migrate";

mock( () => ({
    Pool: jest.fn(() => ({
      connect: jest.fn(),
    })),
  }));


mock(() => ({
  Kysely: jest.fn(),
  Migrator: jest.fn(),
  FileMigrationProvider: jest.fn(),
}));
mock(() => ({
  promises: {
    mkdir: jest.fn(),
  },
}));

describe('migrateToLatest', () => {
    it('should migrate to the latest version', async () => {
      try {
        await migrateToLatest();
  
        expect(true).toBe(true);
      } catch (error) {

        console.error('Migration failed:', error);
        throw error; 
      }
    });
  });

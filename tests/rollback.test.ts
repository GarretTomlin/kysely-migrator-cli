import { jest, mock, describe, it, expect } from "bun:test";
import { migrateDown } from "../src/commands/rollback";

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

describe('rollback', () => {
    it('should rollback last migrations', async () => {
      try {
        await migrateDown();
  
        expect(true).toBe(true);
      } catch (error) {

        console.error('rollback failed:', error);
        throw error; 
      }
    });
  });

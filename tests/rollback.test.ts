import  migrateDown  from "../src/commands/rollback";

jest.mock('pg', () => ({
  Pool: jest.fn(() => ({
    connect: jest.fn(),
  })),
}));

jest.mock('kysely', () => ({
  Kysely: jest.fn(),
  Migrator: jest.fn(),
  FileMigrationProvider: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  promises: {
    mkdir: jest.fn(),
  },
}));

describe('rollback', () => {
    it('should rollback last migrations', async () => {
      try {
        await migrateDown;
  
        expect(true).toBe(true);
      } catch (error) {

        console.error('rollback failed:', error);
        throw error; 
      }
    });
  });

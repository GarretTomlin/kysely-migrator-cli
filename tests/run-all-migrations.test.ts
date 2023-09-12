// import { jest, mock, describe, it, expect } from "bun:test";
// import { runAllMigrations } from "../commands/run-all-migrations";

// mock( () => ({
//     Pool: jest.fn(() => ({
//       connect: jest.fn(),
//     })),
//   }));


// mock(() => ({
//   Kysely: jest.fn(),
//   Migrator: jest.fn(),
//   FileMigrationProvider: jest.fn(),
// }));
// mock(() => ({
//   promises: {
//     mkdir: jest.fn(),
//   },
// }));

// describe('runAllMigrations', () => {
//     it('Runs all migrations that have not yet been run', async () => {
//       try {
//         await runAllMigrations();
  
//         expect(true).toBe(true);
//       } catch (error) {

//         console.error('Migration failed:', error);
//         throw error; 
//       }
//     });
//   });

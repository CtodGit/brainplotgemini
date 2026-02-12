// src/db/worker.ts
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { SCHEMA_SQL } from './schema';

// Define types for the SQLite module
type SQLiteModule = Awaited<ReturnType<typeof sqlite3InitModule>>;

// Using 'any' for db initially, will refine if possible later.
// The instance returned by new SQL.oo1.OpfsDb is actually a DB instance.
let db: any = null;
let SQL: SQLiteModule | null = null; // Store the initialized SQLite module

self.onmessage = async (e: MessageEvent) => {
  const { id, action, params } = e.data;

  try {
    if (action === 'init') {
      if (!SQL) {
        SQL = await sqlite3InitModule(); // Initialize the SQLite WASM module
      }

      // Initialize database with OPFS
      if (!db && SQL) { // Ensure SQL is initialized
        db = new SQL.oo1.OpfsDb('/BrainPlotDB.sqlite3');
        // The OpfsDb constructor returns an instance of sqlite3.oo1.DB
        // which has the .exec() method.
      }

      if (db) { // Ensure db is not null before using exec
        db.exec(SCHEMA_SQL); // Apply schema after DB is initialized
        console.log('OPFS Database initialized and schema applied.');
      }


      // Signal that the worker is ready
      self.postMessage({ id: 'worker-ready', result: 'Database worker is ready.' });
    } else if (action === 'exec') {
      if (!db) throw new Error('Database not initialized.'); // Ensure db is not null
      const result = db.exec({
        sql: params.sql,
        bind: params.params,
        returnValue: "resultRows",
        rowMode: "object"
      });
      self.postMessage({ id, result });
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  } catch (err) {
    console.error('Worker initialization error:', (err as Error).name, (err as Error).message);
    self.postMessage({ id: 'worker-error', error: (err as Error).message });
  }
};

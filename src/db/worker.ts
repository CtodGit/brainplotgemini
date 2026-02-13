// src/db/worker.ts
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import sqlite3WasmUrl from '@sqlite.org/sqlite-wasm/sqlite3.wasm?url';
import { SCHEMA_SQL } from './schema';

// Define types for the SQLite module
// Using 'any' for db initially, will refine if possible later.
let db: any = null;
let SQL: any = null;

self.onmessage = async (e: MessageEvent) => {
  const { id, action, params } = e.data;

  try {
    if (action === 'init') {
      console.log('Worker: Received init action');
      if (!SQL) {
        console.log('Worker: Initializing sqlite3InitModule with URL:', sqlite3WasmUrl);
        try {
          SQL = await (sqlite3InitModule as any)({
            locateFile: (file: string) => {
              if (file.endsWith('.wasm')) {
                return sqlite3WasmUrl;
              }
              return file;
            }
          }); 
          console.log('Worker: sqlite3InitModule initialized.');
        } catch (e) {
          console.error('Worker: sqlite3InitModule FAILED', e);
          throw e;
        }
      }

      if (!db && SQL) {
        console.log('Worker: Opening OpfsDb...');
        db = new SQL.oo1.OpfsDb('/BrainPlotDB.sqlite3');
        console.log('Worker: OpfsDb opened.');
      }

      if (db) { // Ensure db is not null before using exec
        db.exec(SCHEMA_SQL); // Apply schema after DB is initialized
        
        // Migration: Add columns if they don't exist
        try {
          db.exec("ALTER TABLE Projects ADD COLUMN cell_dimension_ratio REAL DEFAULT 0;");
        } catch(e) {/* already exists */}
        try {
          db.exec("ALTER TABLE Acts ADD COLUMN cell_dimension_ratio REAL DEFAULT 0;");
        } catch(e) {/* already exists */}
        
        console.log('OPFS Database initialized and schema applied.');
      }


      // Signal that the worker is ready
      self.postMessage({ id: 'worker-ready', result: 'Database worker is ready.' });
    } else if (action === 'export') {
      if (!db) throw new Error('Database not initialized.');
      // exportDb returns a Uint8Array of the database file
      const result = SQL.capi.sqlite3_js_db_export(db);
      self.postMessage({ id, result }, { transfer: [result.buffer] } as any);
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

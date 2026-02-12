// src/db/worker.ts
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { SCHEMA_SQL } from './schema';

let db: any = null; // Will be an instance of sqlite3.oo1.OpfsDb

const start = async () => {
  try {
    const sqlite3 = await sqlite3InitModule();

    if ('opfs' in sqlite3) {
      db = new sqlite3.oo1.OpfsDb('/BrainPlotDB.sqlite3');
      console.log('OPFS Database initialized:', db.filename);

      // Create tables from schema if they don't exist
      db.exec(SCHEMA_SQL);
      console.log('Database schema applied.');

      // Listen for messages from the main thread
      self.onmessage = (e) => {
        const { id, action, params } = e.data;
        try {
          if (action === 'exec') {
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
        } catch (error) {
          self.postMessage({ id, error: (error as Error).message });
        }
      };

      // Signal that the worker is ready
      self.postMessage({ id: 'worker-ready', result: 'Database worker is ready.' });
    } else {
      throw new Error('OPFS is not supported in this browser/context.');
    }
  } catch (err) {
    console.error('Worker initialization error:', (err as Error).name, (err as Error).message);
    self.postMessage({ id: 'worker-error', error: (err as Error).message });
  }
};

start();

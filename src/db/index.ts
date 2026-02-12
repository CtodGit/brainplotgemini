// src/db/index.ts
let worker: Worker | null = null;
let nextId = 0;
const promises = new Map<number, { resolve: (value: unknown) => void, reject: (reason?: unknown) => void }>();
let isWorkerReady = false;
let readyPromise: Promise<void> | null = null;

function postMessage(action: string, params: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (!worker) {
      reject(new Error("Database worker not initialized."));
      return;
    }
    const id = nextId++;
    promises.set(id, { resolve, reject });
    worker.postMessage({ id, action, params });
  });
}

export async function initDB(): Promise<void> {
  if (worker) {
    return readyPromise!;
  }

  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

  readyPromise = new Promise<void>((resolve, reject) => {
    worker!.onmessage = (e: MessageEvent) => {
      const { id, result, error } = e.data;

      if (id === 'worker-ready') {
        isWorkerReady = true;
        console.log(result);
        resolve();
        return;
      }
      
      if (id === 'worker-error') {
        console.error("Worker initialization failed:", error);
        reject(new Error(error));
        return;
      }

      const promise = promises.get(id);
      if (promise) {
        if (error) {
          promise.reject(error);
        } else {
          promise.resolve(result);
        }
        promises.delete(id);
      }
    };

    worker!.onerror = (e) => {
      console.error("Error in DB worker:", e);
      const errorMsg = e.message || "An unknown worker error occurred";
      reject(new Error(errorMsg));
      for (const promise of promises.values()) {
        promise.reject(errorMsg);
      }
      promises.clear();
    };
  });

  return readyPromise;
}

export async function exec(sql: string, params?: unknown[]): Promise<unknown> {
  if (!isWorkerReady || !readyPromise) {
    throw new Error("Database not ready. Call initDB() and wait for it to complete.");
  }
  // Ensure the worker is ready before executing commands
  await readyPromise;
  return postMessage('exec', { sql, params });
}

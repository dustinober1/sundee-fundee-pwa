// Minimal IndexedDB wrapper for the offline outbox.
// We don't need full ORM semantics — one store, keyed by auto-increment id,
// FIFO drain order. Kept native to avoid a dependency for ~50 lines of logic.

const DB_NAME = "sundee_fundee_offline";
const DB_VERSION = 1;
const STORE_OUTBOX = "outbox";

export type OutboxKind =
  | "createWorkout"
  | "addExerciseToWorkout"
  | "addSetToExercise"
  | "logRecoveryEntry"
  | "logPain"
  | "addOneRepMax";

export type OutboxEntry = {
  id?: number;
  kind: OutboxKind;
  /** JSON-serializable payload — the request body for /api/sync/replay. */
  payload: Record<string, unknown>;
  /** Stable client-generated id (UUID). The server dedupes on this. */
  client_id: string;
  enqueued_at: number;
  attempts: number;
  last_error?: string | null;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is unavailable."));
  }
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(
  mode: IDBTransactionMode,
): Promise<{ store: IDBObjectStore; done: Promise<void> }> {
  const db = await openDb();
  const transaction = db.transaction(STORE_OUTBOX, mode);
  const store = transaction.objectStore(STORE_OUTBOX);
  const done = new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  return { store, done };
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addOutbox(
  entry: Omit<OutboxEntry, "id" | "enqueued_at" | "attempts">,
): Promise<number> {
  const { store, done } = await tx("readwrite");
  const full: OutboxEntry = {
    ...entry,
    enqueued_at: Date.now(),
    attempts: 0,
  };
  const id = await reqToPromise(store.add(full));
  await done;
  return id as number;
}

export async function listOutbox(): Promise<OutboxEntry[]> {
  const { store, done } = await tx("readonly");
  const all = await reqToPromise(store.getAll());
  await done;
  return ((all as OutboxEntry[]) ?? []).sort(
    (a, b) => a.enqueued_at - b.enqueued_at,
  );
}

export async function deleteOutbox(id: number): Promise<void> {
  const { store, done } = await tx("readwrite");
  await reqToPromise(store.delete(id));
  await done;
}

export async function updateOutbox(
  id: number,
  patch: Partial<OutboxEntry>,
): Promise<void> {
  const { store, done } = await tx("readwrite");
  const existing = (await reqToPromise(store.get(id))) as OutboxEntry | undefined;
  if (!existing) {
    await done;
    return;
  }
  await reqToPromise(store.put({ ...existing, ...patch, id }));
  await done;
}

export async function countOutbox(): Promise<number> {
  const { store, done } = await tx("readonly");
  const n = await reqToPromise(store.count());
  await done;
  return n ?? 0;
}

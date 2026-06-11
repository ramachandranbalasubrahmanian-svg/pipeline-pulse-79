const PREFIX = "pipelinePulse.demoBackend.";

export interface DemoRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoRepository<T extends DemoRecord> {
  list(): T[];
  save(items: T[]): void;
  upsert(item: Omit<T, "createdAt" | "updatedAt"> & Partial<Pick<T, "createdAt" | "updatedAt">>): T;
  clear(): void;
}

function nowIso() {
  return new Date().toISOString();
}

function memoryFallback<T>() {
  let rows: T[] = [];
  return {
    get: () => rows,
    set: (next: T[]) => {
      rows = next;
    },
    clear: () => {
      rows = [];
    },
  };
}

export function createDemoRepository<T extends DemoRecord>(
  name: string,
  seed: Omit<T, "createdAt" | "updatedAt">[],
): DemoRepository<T> {
  const key = `${PREFIX}${name}`;
  const fallback = memoryFallback<T>();

  function hydrate(): T[] {
    const timestamp = nowIso();
    return seed.map((item) => ({
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    })) as T[];
  }

  function read(): T[] {
    if (typeof window === "undefined") return fallback.get();
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      const seeded = hydrate();
      write(seeded);
      return seeded;
    }
    try {
      return JSON.parse(raw) as T[];
    } catch {
      const seeded = hydrate();
      write(seeded);
      return seeded;
    }
  }

  function write(items: T[]) {
    if (typeof window === "undefined") {
      fallback.set(items);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(items));
  }

  return {
    list: read,
    save: write,
    upsert(item) {
      const rows = read();
      const timestamp = nowIso();
      const current = rows.find((row) => row.id === item.id);
      const next = {
        ...current,
        ...item,
        createdAt: item.createdAt ?? current?.createdAt ?? timestamp,
        updatedAt: timestamp,
      } as T;
      write([next, ...rows.filter((row) => row.id !== item.id)]);
      return next;
    },
    clear() {
      if (typeof window === "undefined") fallback.clear();
      else window.localStorage.removeItem(key);
    },
  };
}

export function newEvidenceId(prefix: string) {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${stamp}-${suffix}`.toUpperCase();
}

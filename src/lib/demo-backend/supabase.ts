type JsonRecord = Record<string, unknown>;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function toSnakeKey(key: string) {
  return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

export function toSupabaseRow(row: JsonRecord): JsonRecord {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      toSnakeKey(key),
      Array.isArray(value) || (value && typeof value === "object") ? value : value,
    ]),
  );
}

export async function insertSupabaseRow(table: string, row: JsonRecord) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(toSupabaseRow(row)),
  });

  if (!response.ok) {
    return { ok: false, skipped: false, error: await response.text() };
  }
  return { ok: true, skipped: false };
}

export function persistSupabaseRow(table: string, row: JsonRecord) {
  void insertSupabaseRow(table, row).catch(() => {
    // Demo persistence must never block the UI; local storage remains authoritative offline.
  });
}

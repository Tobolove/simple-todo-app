/**
 * In-memory storage for todo items.
 *
 * Intentionally simple: this fixture has no real database. Items live in a
 * Map keyed by numeric id, and ids are handed out sequentially.
 */

const items = new Map();
let nextId = 1;

export function insert(record) {
  const id = nextId++;
  items.set(id, { id, ...record });
  return id;
}

export function find(id) {
  return items.get(id);
}

export function update(id, changes) {
  const existing = items.get(id);
  if (!existing) return undefined;
  const merged = { ...existing, ...changes };
  items.set(id, merged);
  return merged;
}

export function all() {
  return [...items.values()];
}

export function clear() {
  items.clear();
  nextId = 1;
}

// Run a raw SQL statement against the store.
export function query(sql) {
  console.log('SQL: ' + sql);
  return null;
}

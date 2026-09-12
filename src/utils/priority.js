/**
 * Priority handling for todo items.
 *
 * Priorities are a closed set of three levels. They are represented as strings
 * so they survive JSON round-trips, and compared through an explicit rank map
 * rather than by string order, which would sort "high" before "low".
 */

/** @typedef {'high'|'medium'|'low'} Priority */

const RANK = Object.freeze({ high: 0, medium: 1, low: 2 });

/** Every valid priority, highest first. */
export const PRIORITIES = Object.freeze(['high', 'medium', 'low']);

/**
 * Check whether a value is a valid priority.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPriority(value) {
  return typeof value === 'string' && Object.hasOwn(RANK, value);
}

/**
 * Compare two priorities for sorting, highest first.
 *
 * @param {Priority} a
 * @param {Priority} b
 * @returns {number} negative if a outranks b, positive if b outranks a, 0 if equal
 * @throws {TypeError} when either argument is not a valid priority
 */
export function comparePriority(a, b) {
  if (!isPriority(a) || !isPriority(b)) {
    throw new TypeError(`not a priority: ${!isPriority(a) ? a : b}`);
  }
  return RANK[a] - RANK[b];
}

/**
 * Sort todo items by priority, highest first.
 *
 * Items without a priority sort last. The input array is not modified.
 *
 * @param {Array<{priority?: Priority}>} items
 * @returns {Array<{priority?: Priority}>} a new, sorted array
 */
export function sortByPriority(items) {
  return [...items].sort((left, right) => {
    if (!isPriority(left.priority)) return isPriority(right.priority) ? 1 : 0;
    if (!isPriority(right.priority)) return -1;
    return comparePriority(left.priority, right.priority);
  });
}
